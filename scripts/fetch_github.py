# -*- coding: utf-8 -*-
"""
Crée une copie de secours de tes dépôts GitHub : data/github-snapshot.json

Le site charge d'abord tes projets en direct depuis l'API GitHub.
Si l'API ne répond pas (limite de 60 requêtes / heure atteinte, réseau…),
il utilise cette copie. GitHub Actions la régénère à chaque déploiement
et chaque jour automatiquement.

Utilisation :
    python scripts/fetch_github.py
    (facultatif) définir la variable GITHUB_TOKEN pour une limite plus haute
"""

import json
import os
import urllib.request
from datetime import datetime, timezone

from profile_loader import charger_profil, RACINE

API = "https://api.github.com"

# Champs gardés pour chaque dépôt (les mêmes noms que l'API, lus par js/github.js)
CHAMPS_DEPOT = [
    "name", "description", "language", "stargazers_count", "forks_count", "html_url",
    "homepage", "topics", "updated_at", "pushed_at", "created_at", "fork", "archived",
]
CHAMPS_UTILISATEUR = ["login", "name", "avatar_url", "html_url", "public_repos", "followers", "bio"]


def appeler_api(chemin: str):
    """Fait une requête GET sur l'API GitHub et renvoie le JSON."""
    requete = urllib.request.Request(API + chemin, headers={"Accept": "application/vnd.github+json", "User-Agent": "portfolio-snapshot"})
    jeton = os.environ.get("GITHUB_TOKEN")
    if jeton:
        requete.add_header("Authorization", f"Bearer {jeton}")
    with urllib.request.urlopen(requete, timeout=20) as reponse:
        return json.load(reponse)


def garder(objet: dict, champs: list) -> dict:
    """Ne garde que les champs utiles (fichier plus léger)."""
    return {c: objet.get(c) for c in champs}


def main() -> None:
    utilisateur = charger_profil()["github"]["user"]
    profil = appeler_api(f"/users/{utilisateur}")
    depots = appeler_api(f"/users/{utilisateur}/repos?per_page=100&sort=updated")

    copie = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "user": garder(profil, CHAMPS_UTILISATEUR),
        "repos": [garder(d, CHAMPS_DEPOT) for d in depots],
    }
    sortie = RACINE / "data" / "github-snapshot.json"
    sortie.write_text(json.dumps(copie, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✔ {len(depots)} dépôt(s) enregistrés dans {sortie.relative_to(RACINE)}")


if __name__ == "__main__":
    main()
