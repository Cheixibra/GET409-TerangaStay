"""Static checks for the E03 pass-2 landing pages.

Usage:  python3 -I verifier.py v1-no-skill/index.html v2-skill/index.html

"brief" checks apply to both versions (same content brief).
"v2" checks come from v2-skill/CLAUDE.md: reported for v1 too, but only expected of v2.
What a static check cannot see is listed at the end: check it by hand.
"""
import re
import sys

VERBATIM = {
    "titre": "Des séjours réservés en direct, chez ceux qui vous accueillent.",
    "sous-titre": "C'est l'établissement qui vous répond, et la gérante qui confirme.",
    "phrase d'honnêteté du quiz": "Ceci n'est pas une disponibilité.",
    "avertissement du formulaire": "Ce formulaire n'envoie rien",
    "bandeau données de démo": "Données de démonstration à confirmer avant publication.",
    "question 1": "Où voulez-vous séjourner ?",
    "question 2": "Quel type d'hébergement ?",
    "question 3": "Quel budget par nuit ?",
    "étape 4 de « comment ça marche »": "La réservation n'existe qu'après la réponse de l'auberge.",
}
OPTIONS = ["Dakar et environs", "Petite Côte", "Casamance", "Sine-Saloum", "Nord",
           "Chambre double", "Chambre familiale", "Bungalow double", "Bungalow familial",
           "Chambre standard", "Jusqu'à 35 000 FCFA", "De 36 000 à 45 000 FCFA",
           "Plus de 45 000 FCFA"]
BANNED = [r"\bdisponibles?\b", r"\bconfirmées?\b", r"\bréservées?\b", r"\bgaranti(?:e|es|s)?\b"]
COLOUR = re.compile(r"oklch\(|#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(")


def norm(text):
    # Pages may use typographic apostrophes or non-breaking spaces; compare on a plain form.
    return (text.replace("’", "'").replace(" ", " ").replace(" ", " ")
                .replace("&#39;", "'").replace("&apos;", "'").replace("&nbsp;", " "))


def visible_text(html):
    html = re.sub(r"<style.*?</style>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<[^>]+>", " ", html)
    return html


def check(path):
    raw = open(path, encoding="utf-8").read()
    html = norm(raw)
    css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, flags=re.S | re.I))
    css_outside_root = re.sub(r":root[^{]*\{[^}]*\}", "", css)
    text_and_js = visible_text(html)
    rows = []

    def row(scope, label, ok, detail=""):
        rows.append((scope, label, "OK" if ok else "ÉCHEC", detail))

    for label, s in VERBATIM.items():
        row("brief", f"mot pour mot : {label}", s in html)
    missing = [o for o in OPTIONS if o not in html]
    row("brief", "13 options du quiz présentes", not missing, ", ".join(missing))

    hits = sorted({m.group(0) for p in BANNED for m in re.finditer(p, text_and_js, flags=re.I)})
    row("brief", "aucun mot de statut interdit", not hits, ", ".join(hits))
    row("brief", "ni e-mail ni téléphone demandés",
        not re.search(r"""type\s*=\s*["']?(email|tel)\b""", html, flags=re.I))
    ext = re.findall(r"""(?:src|href)\s*=\s*["']?(https?://[^"'\s>]+)|@import|url\(\s*["']?https?://""", html, flags=re.I)
    row("brief", "aucune ressource externe", not ext, " ".join(e for e in ext if e)[:80])

    stray = COLOUR.findall(css_outside_root)
    row("v2", "aucune couleur hors de :root", not stray, f"{len(stray)} occurrence(s)" if stray else "")
    root_oklch = len(re.findall(r"oklch\(", "".join(re.findall(r":root[^{]*\{[^}]*\}", css))))
    row("v2", "tokens oklch déclarés dans :root", root_oklch > 0, f"{root_oklch}")
    row("v2", "prefers-reduced-motion pris en compte",
        "prefers-reduced-motion" in html)

    size = len(raw.encode("utf-8"))
    return rows, f"{size / 1024:.1f} Ko, {raw.count(chr(10)) + 1} lignes"


def main(paths):
    for path in paths:
        try:
            rows, meta = check(path)
        except FileNotFoundError:
            print(f"\n## {path}\nfichier absent\n")
            continue
        print(f"\n## {path} — {meta}\n")
        print("| Portée | Contrôle | Résultat | Détail |")
        print("|--------|----------|----------|--------|")
        for scope, label, res, detail in rows:
            print(f"| {scope} | {label} | {res} | {detail} |")
    print("""
À vérifier à la main (hors de portée d'un contrôle statique) :
- la page s'ouvre par double-clic, hors ligne
- le quiz se parcourt de bout en bout, retour arrière compris, et la piste finale est juste
- aucun total, aucune somme de prix nulle part (y compris dans le message préparé)
- aucune barre de défilement horizontale à 360 px
- tout est utilisable au clavier, avec un focus visible""")


if __name__ == "__main__":
    main(sys.argv[1:] or ["v1-no-skill/index.html", "v2-skill/index.html"])
