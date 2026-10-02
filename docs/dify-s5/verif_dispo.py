import re
import unicodedata
from datetime import date, timedelta

# Dify Code node VERIF_DISPO: deterministic room x night check.
# The LLM extracts the request; this code decides availability, so no model ever "computes" it.

MONTHS = {
    "janvier": 1, "fevrier": 2, "mars": 3, "avril": 4, "mai": 5, "juin": 6, "juillet": 7,
    "aout": 8, "septembre": 9, "octobre": 10, "novembre": 11, "decembre": 12,
}
MONTH_NAMES = {v: k.replace("decembre", "décembre").replace("fevrier", "février").replace("aout", "août")
               for k, v in MONTHS.items()}
YEAR = 2026


def _norm(text):
    text = unicodedata.normalize("NFD", text or "").encode("ascii", "ignore").decode().lower()
    return " ".join(re.sub(r"[^a-z0-9]+", " ", text).split())


def _field(fiche, label):
    m = re.search(label + r"[^:\n]*:\s*([^\n]+)", fiche, re.IGNORECASE)
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


def _catalogue(chambres):
    types = {}
    for seg in chambres or []:
        content = seg.get("content", "") if isinstance(seg, dict) else str(seg)
        t = re.search(r"Type de chambre\s*:\s*([^;\n]+)", content)
        n = re.search(r"Num\S*ros des chambres\s*:\s*([^;\n]+)", content)
        if t and n:
            types[t.group(1).strip()] = re.findall(r"C\d+", n.group(1))
    return types


def _calendar(dispo):
    nights = {}
    for m in re.finditer(r"nuit du (\d{1,2}) (\S+) : (.*?)\((Disponible|Complet)\)", dispo or ""):
        month = MONTHS.get(_norm(m.group(2)))
        if month:
            nights[date(YEAR, month, int(m.group(1)))] = re.findall(r"C\d+", m.group(3))
    return nights


def _match_type(requested, types):
    req = _norm(requested)
    if not req:
        return None
    for name in types:
        if _norm(name) == req:
            return name
    words = set(req.split()) - {"chambre", "de", "la", "le", "cote"}
    scored = sorted(((len(words & set(_norm(n).split())), n) for n in types), reverse=True)
    return scored[0][1] if scored and scored[0][0] > 0 else None


def _label(d):
    return f"nuit du {d.day} {MONTH_NAMES[d.month]}"


def main(fiche: str, dispo: str, chambres: list) -> dict:
    head = "VÉRIFICATION AUTOMATIQUE DU CALENDRIER (calcul exact, prioritaire sur la fiche du Chercheur)"
    types = _catalogue(chambres)
    calendar = _calendar(dispo)
    room_type = _match_type(_field(fiche, "Type de chambre") or _field(fiche, "Type"), types)
    arrival = _parse_date(_field(fiche, "Arriv"))
    departure = _parse_date(_field(fiche, "D[ée]part"))

    if not room_type:
        return {"verification": f"{head}\nDisponibilité : CONFLIT\nChambre proposée : aucune\n"
                                "Explication : type de chambre non reconnu dans le catalogue, la gérante doit vérifier."}
    if not arrival or not departure or departure <= arrival:
        return {"verification": f"{head}\nDisponibilité : CONFLIT\nChambre proposée : aucune\n"
                                "Explication : dates d'arrivée et de départ illisibles, la gérante doit vérifier."}

    stay = [arrival + timedelta(days=i) for i in range((departure - arrival).days)]
    rooms = types[room_type]
    missing = [d for d in stay if d not in calendar]
    free_all = [r for r in rooms if not missing and all(r in calendar[d] for d in stay)]

    details = []
    for d in stay:
        if d not in calendar:
            details.append(f"{_label(d)} : hors calendrier")
            continue
        free = [r for r in rooms if r in calendar[d]]
        if free:
            details.append(f"{_label(d)} : {', '.join(free)}")
        elif not calendar[d]:
            details.append(f"{_label(d)} : aucune chambre libre (Complet)")
        else:
            details.append(f"{_label(d)} : aucune chambre de ce type libre")

    if free_all:
        status, room = "DISPONIBLE", free_all[0]
        why = f"{room} est libre chaque nuit du séjour."
    else:
        status, room = "CONFLIT", "aucune"
        why = ("une ou plusieurs nuits sont hors du calendrier, la gérante doit vérifier." if missing
               else "aucune chambre de ce type n'est libre toutes les nuits du séjour.")

    return {"verification": "\n".join([
        head,
        f"Disponibilité : {status}",
        f"Type de chambre : {room_type}",
        f"Chambre proposée : {room}",
        f"Nombre de nuits : {len(stay)}",
        f"Détail des nuits : {' ; '.join(details)}",
        f"Explication : {why}",
    ])}
