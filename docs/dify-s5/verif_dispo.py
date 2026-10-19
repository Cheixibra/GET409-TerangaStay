import json
import re
import unicodedata
from datetime import date, timedelta

# Dify Code node VERIF_DISPO: deterministic room x night check, and the manager's fiche.
# The LLM only extracts the request; this code decides availability and copies every value
# (room, nights, price, deposit, update date) from the knowledge bases, so no model ever
# computes or retypes them.

MONTHS = {
    "janvier": 1, "fevrier": 2, "mars": 3, "avril": 4, "mai": 5, "juin": 6, "juillet": 7,
    "aout": 8, "septembre": 9, "octobre": 10, "novembre": 11, "decembre": 12,
}
MONTH_NAMES = {v: k.replace("decembre", "décembre").replace("fevrier", "février").replace("aout", "août")
               for k, v in MONTHS.items()}
YEAR = 2026

HEAD_AVAILABLE = "🟡 DEMANDE REÇUE — en attente de votre validation"
HEAD_CONFLICT = "⚠ CONFLIT DE CHAMBRE — ne pas confirmer sans vérifier le calendrier"

# One payment sentence per profile. Each is self-contained, so the message can never
# offer two contradictory payment instructions.
PAY_SENEGAL = "Vous pouvez régler l'acompte par Wave ou Orange Money : l'auberge vous envoie le numéro."
PAY_ABROAD = "Depuis l'étranger, l'auberge vous indiquera comment régler l'acompte."
PAY_UNKNOWN = ("Pour l'acompte, l'auberge vous indiquera comment le régler : par Wave ou Orange Money "
               "depuis le Sénégal, ou par une autre modalité depuis l'étranger.")


def _norm(text):
    text = unicodedata.normalize("NFD", text or "").encode("ascii", "ignore").decode().lower()
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text).split())


def _field(fiche, label):
    m = re.search(label + r"[^:\n]*:\s*([^\n]+)", fiche or "", re.IGNORECASE)
    return m.group(1).strip() if m else ""


def _parse_date(text):
    t = _norm(text)
    m = re.search(r"\b(\d{1,2})(?: er)? ([a-z]+)", t)
    if m and m.group(2) in MONTHS:
        return date(YEAR, MONTHS[m.group(2)], int(m.group(1)))
    m = re.search(r"\b(\d{1,2}) (\d{1,2})\b", t)  # 21/12 becomes "21 12" after _norm
    if m and 1 <= int(m.group(2)) <= 12:
        return date(YEAR, int(m.group(2)), int(m.group(1)))
    return None


def _value(content, label):
    m = re.search(label + r"[^:;\n]*:\s*([^;\n]+)", content)
    return m.group(1).strip() if m else ""


def _catalogue(chambres):
    types = {}
    for seg in chambres or []:
        content = seg.get("content", "") if isinstance(seg, dict) else str(seg)
        name = _value(content, r"Type de chambre")
        rooms = re.findall(r"C\d+", _value(content, r"Num\S*ros des chambres"))
        if name and rooms:
            types[name] = {
                "rooms": rooms,
                "capacity": _value(content, r"Capacit\S*"),
                "price": re.sub(r"\D", "", _value(content, r"Prix par nuit haute saison")),
                "deposit": re.sub(r"\D", "", _value(content, r"Acompte par nuit haute saison")),
            }
    return types


def _calendar(dispo):
    nights = {}
    for m in re.finditer(r"nuit du (\d{1,2}) (\S+) : (.*?)\((Disponible|Complet)\)", dispo or ""):
        month = MONTHS.get(_norm(m.group(2)))
        if month:
            free = re.findall(r"C\d+", m.group(3)) if m.group(4) == "Disponible" else []
            nights[date(YEAR, month, int(m.group(1)))] = free
    return nights


def _update_date(dispo):
    m = re.search(r"mises? à jour le (\d{1,2} \S+ \d{4})", dispo or "")
    return m.group(1) if m else "Non disponible"


def _match_type(requested, types):
    req = _norm(requested)
    if not req:
        return None
    for name in types:
        if _norm(name) == req:
            return name
    words = set(req.split()) - {"chambre", "de", "la", "le", "cote"}
    scored = sorted(((len(words & set(_norm(n).split())), n) for n in types), reverse=True)
    if not scored or scored[0][0] == 0:
        return None
    if len(scored) > 1 and scored[1][0] == scored[0][0]:
        return None  # tie: guessing a room type is the manager's call, not this code's
    return scored[0][1]


def _label(d):
    return f"nuit du {d.day} {MONTH_NAMES[d.month]}"


def _long_date(d):
    return f"{d.day} {MONTH_NAMES[d.month]} {d.year}" if d else "Non disponible"


def _fcfa(digits):
    return f"{int(digits):,} FCFA".replace(",", " ") if digits else "Non disponible"


def _payment(profile):
    p = _norm(profile)
    if "senegal" in p:
        return "Sénégal", PAY_SENEGAL
    if "etranger" in p or "diaspora" in p:
        return "étranger / diaspora", PAY_ABROAD
    return "non précisé", PAY_UNKNOWN


def _result(status, fiche_req, dispo, room_type, entry, arrival, departure, stay, details, why):
    persons = _field(fiche_req, "Nombre de personnes") or "Non disponible"
    profile, pay = _payment(_field(fiche_req, "Profil de paiement"))
    points = why if status == "CONFLIT" else (_field(fiche_req, "POINTS À CONFIRMER") or "aucun")
    room = entry_room = None
    if status == "DISPONIBLE":
        room = entry_room = details["room"]
    entry = entry or {}
    lines = [
        HEAD_AVAILABLE if status == "DISPONIBLE" else HEAD_CONFLICT,
        f"Chambre proposée : {entry_room or 'aucune'}",
        f"Type de chambre : {room_type or 'non reconnu'}",
        f"Arrivée : {_long_date(arrival)}",
        f"Départ : {_long_date(departure)}",
        f"Nombre de nuits : {len(stay) if stay else 'Non disponible'}",
        f"Nombre de personnes : {persons}",
        f"Capacité : {entry.get('capacity') or 'Non disponible'}",
        f"Prix par nuit : {_fcfa(entry.get('price'))}",
        f"Acompte par nuit : {_fcfa(entry.get('deposit'))}",
        f"Détail des nuits : {' ; '.join(details['lines']) if details['lines'] else 'Non disponible'}",
        f"Profil de paiement : {profile}",
        f"Disponibilités mises à jour le : {_update_date(dispo)}",
        f"Points à confirmer : {points}",
    ]
    reservation = {"statut": status, "chambre": room, "type": room_type, "nuits": [d.isoformat() for d in stay]}
    return {
        "fiche": "\n".join(lines),
        # No deposit is requested while the room is not free: no payment sentence then.
        "paiement": pay if status == "DISPONIBLE" else "",
        "reservation": json.dumps(reservation, ensure_ascii=False),
    }


def main(fiche: str, dispo: str, chambres: list) -> dict:
    types = _catalogue(chambres)
    calendar = _calendar(dispo)
    room_type = _match_type(_field(fiche, "Type de chambre") or _field(fiche, "Type"), types)
    arrival = _parse_date(_field(fiche, "Arriv"))
    departure = _parse_date(_field(fiche, "D[ée]part"))
    empty = {"room": None, "lines": []}

    if not room_type:
        return _result("CONFLIT", fiche, dispo, None, None, arrival, departure, [], empty,
                       "type de chambre non reconnu dans le catalogue, la gérante doit vérifier.")
    entry = types[room_type]
    if not arrival or not departure or departure <= arrival:
        return _result("CONFLIT", fiche, dispo, room_type, entry, arrival, departure, [], empty,
                       "dates d'arrivée et de départ illisibles, la gérante doit vérifier.")

    stay = [arrival + timedelta(days=i) for i in range((departure - arrival).days)]
    rooms = entry["rooms"]
    missing = [d for d in stay if d not in calendar]
    free_all = [] if missing else [r for r in rooms if all(r in calendar[d] for d in stay)]

    lines = []
    for d in stay:
        if d not in calendar:
            lines.append(f"{_label(d)} : hors calendrier")
            continue
        free = [r for r in rooms if r in calendar[d]]
        if free:
            lines.append(f"{_label(d)} : {', '.join(free)}")
        elif not calendar[d]:
            lines.append(f"{_label(d)} : aucune chambre libre (Complet)")
        else:
            lines.append(f"{_label(d)} : aucune chambre de ce type libre")

    if free_all:
        return _result("DISPONIBLE", fiche, dispo, room_type, entry, arrival, departure, stay,
                       {"room": free_all[0], "lines": lines}, "")
    why = ("une ou plusieurs nuits sont hors du calendrier, la gérante doit vérifier." if missing
           else "aucune chambre de ce type n'est libre toutes les nuits du séjour.")
    return _result("CONFLIT", fiche, dispo, room_type, entry, arrival, departure, stay,
                   {"room": None, "lines": lines}, why)
