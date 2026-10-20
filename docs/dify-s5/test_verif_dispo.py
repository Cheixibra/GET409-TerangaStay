"""Tests for the VERIF_DISPO code node, on the real knowledge-base files.

Run:  python3 -I docs/dify-s5/test_verif_dispo.py

Dify splits terangastay_chambres.csv into one segment per row and keeps the headers as
"Header: value ; Header: value" (see L4, P1). The segments below are rebuilt that way from
the CSV. If Dify's real segment format differs, these tests will not show it: re-check one
segment in the Dify knowledge base after any re-indexing.
"""
import csv
import importlib.util
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("verif_dispo", os.path.join(HERE, "verif_dispo.py"))
vd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vd)

with open(os.path.join(HERE, "terangastay_chambres.csv"), encoding="utf-8") as f:
    CHAMBRES = [{"content": " ; ".join(f"{k}: {v}" for k, v in row.items())} for row in csv.DictReader(f)]
with open(os.path.join(HERE, "terangastay_dispo_decembre.md"), encoding="utf-8") as f:
    DISPO = f.read()


def request(type_, arrival, departure, persons="2", profile="Sénégal", points="aucun"):
    return (f"Type de chambre : {type_}\nArrivée : {arrival}\nDépart : {departure}\n"
            f"Nombre de personnes : {persons}\nProfil de paiement : {profile}\nPOINTS À CONFIRMER : {points}")


def run(*args, **kw):
    out = vd.main(request(*args, **kw), DISPO, CHAMBRES)
    return out, json.loads(out["reservation"])


BANNED = ("confirmée", "réservée", "garanti", "total")
results = []


def check(name, cond):
    results.append((name, bool(cond)))


# T1 — double climatisée, 20 -> 22 décembre: C7 is free both nights.
out, r = run("Double climatisée", "20 décembre", "22 décembre")
check("T1 statut DISPONIBLE, chambre C7", r["statut"] == "DISPONIBLE" and r["chambre"] == "C7")
check("T1 nuits 20 et 21", r["nuits"] == ["2026-12-20", "2026-12-21"])
check("T1 première ligne DEMANDE REÇUE", out["fiche"].splitlines()[0] == vd.HEAD_AVAILABLE)
check("T1 prix 28 000 et acompte 8 400 recopiés du catalogue",
      "Prix par nuit : 28 000 FCFA" in out["fiche"] and "Acompte par nuit : 8 400 FCFA" in out["fiche"])
check("T1 date de mise à jour lue dans le calendrier", "30 septembre 2026" in out["fiche"])
check("T1 phrase de paiement Sénégal", out["paiement"] == vd.PAY_SENEGAL)

# T2 — case traditionnelle vue mer, 23 -> 25: C13 free on the 23rd, the 24th is Complet.
out, r = run("Case traditionnelle vue mer", "23 décembre", "25 décembre", profile="étranger")
check("T2 statut CONFLIT, aucune chambre", r["statut"] == "CONFLIT" and r["chambre"] is None)
check("T2 nuit du 24 lue comme Complet", "nuit du 24 décembre : aucune chambre libre (Complet)" in out["fiche"])
check("T2 première ligne CONFLIT", out["fiche"].splitlines()[0] == vd.HEAD_CONFLICT)
check("T2 aucune phrase de paiement en conflit", out["paiement"] == "")

# T6 — double climatisée, 21 -> 23: C7 free on the 21st, C8 on the 22nd, no room both nights.
out, r = run("Double climatisée", "21 décembre", "23 décembre")
check("T6 CONFLIT malgré une chambre libre chaque nuit", r["statut"] == "CONFLIT")
check("T6 détail C7 puis C8", "nuit du 21 décembre : C7" in out["fiche"] and "nuit du 22 décembre : C8" in out["fiche"])

# Payment: one sentence per profile, never two contradictory ones.
check("profil étranger -> une seule phrase", run("Double climatisée", "20 décembre", "22 décembre",
                                                  profile="étranger / diaspora")[0]["paiement"] == vd.PAY_ABROAD)
check("profil non précisé -> une seule phrase", run("Double climatisée", "20 décembre", "22 décembre",
                                                     profile="non précisé")[0]["paiement"] == vd.PAY_UNKNOWN)

# Guardrails.
out, r = run("Suite présidentielle", "20 décembre", "22 décembre")
check("type inconnu -> CONFLIT, la gérante vérifie", r["statut"] == "CONFLIT" and "non reconnu" in out["fiche"])
out, r = run("Double", "20 décembre", "22 décembre")
check("égalité entre types -> ne devine pas", r["statut"] == "CONFLIT" and r["type"] is None)
out, r = run("Double climatisée", "vendredi prochain", "dimanche")
check("dates illisibles -> CONFLIT", r["statut"] == "CONFLIT" and "illisibles" in out["fiche"])
out, r = run("Double climatisée", "26 décembre", "29 décembre")
check("nuit hors calendrier -> CONFLIT", r["statut"] == "CONFLIT" and "hors calendrier" in out["fiche"])
check("format 21/12 accepté", run("Double climatisée", "20/12", "22/12")[1]["chambre"] == "C7")

# A Complet night must never read as free, even if its text cites room numbers.
tricky = DISPO.replace("aucune chambre libre (Complet)", "chambres C6 C7 C8 toutes prises (Complet)", 1)
r = json.loads(vd.main(request("Double climatisée", "24 décembre", "25 décembre"), tricky, CHAMBRES)["reservation"])
check("nuit Complet citant des numéros -> pas libre", r["statut"] == "CONFLIT")

# Honesty: no banned word, no total, in any fiche produced above.
fiches = [vd.main(request(t, a, d), DISPO, CHAMBRES)["fiche"]
          for t, a, d in [("Double climatisée", "20 décembre", "22 décembre"),
                          ("Case traditionnelle vue mer", "23 décembre", "25 décembre")]]
check("aucun mot interdit ni total dans les fiches", not any(b in f.lower() for f in fiches for b in BANNED))

for name, ok in results:
    print(("OK    " if ok else "ÉCHEC ") + name)
failed = sum(not ok for _, ok in results)
print(f"\n{len(results) - failed}/{len(results)} réussis")
sys.exit(1 if failed else 0)
