# -*- coding: utf-8 -*-
"""
Génère le QR code du portfolio.

Utilisation (depuis le dossier du projet) :
    pip install -r requirements.txt
    python scripts/generate_qr.py

Résultat :
    assets/qr-code.svg  -> utilisé par le site et le badge (net à toute taille)
    assets/qr-code.png  -> pour Word, Canva, PowerPoint, impression

Le lien est lu dans data/profile.js (site.url). Pour changer le lien,
modifie profile.js puis relance ce script.
"""

import segno
from profile_loader import charger_profil, RACINE

# Couleur des modules (petits carrés) : le bleu nuit du portfolio
COULEUR = "#0a0e1a"


def main() -> None:
    profil = charger_profil()
    url = profil["site"]["url"]

    # error="h" : correction d'erreur élevée (jusqu'à 30 % du QR peut être abîmé)
    qr = segno.make(url, error="h")

    dossier = RACINE / "assets"
    qr.save(dossier / "qr-code.svg", scale=10, border=1, dark=COULEUR)
    qr.save(dossier / "qr-code.png", scale=24, border=2, dark=COULEUR)

    print("✔ QR code généré pour :", url)
    print("  Version :", qr.version, "| correction :", qr.error)
    print("  Fichiers : assets/qr-code.svg et assets/qr-code.png")


if __name__ == "__main__":
    main()
