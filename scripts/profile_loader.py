# -*- coding: utf-8 -*-
"""
Lit data/profile.js et renvoie les données sous forme de dictionnaire Python.

Le fichier profile.js contient :   window.PROFILE = { ...JSON... };
On enlève les commentaires du début, la partie "window.PROFILE =" et le ";" final,
puis on lit le reste comme du JSON. Ainsi, le site et les scripts Python
utilisent exactement les mêmes informations (une seule source de vérité).
"""

import json
from pathlib import Path

# Dossier racine du projet (le dossier parent de scripts/)
RACINE = Path(__file__).resolve().parent.parent
FICHIER_PROFIL = RACINE / "data" / "profile.js"


def charger_profil() -> dict:
    texte = FICHIER_PROFIL.read_text(encoding="utf-8")
    debut = texte.index("window.PROFILE")
    debut = texte.index("{", debut)          # premier "{" après window.PROFILE
    fin = texte.rindex("}") + 1               # dernier "}" du fichier
    return json.loads(texte[debut:fin])


if __name__ == "__main__":
    profil = charger_profil()
    print("Profil chargé :", profil["identity"]["firstName"], profil["identity"]["lastName"])
