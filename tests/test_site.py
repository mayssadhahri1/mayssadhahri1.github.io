# -*- coding: utf-8 -*-
"""
Tests automatiques du portfolio.

Lancer les tests (depuis le dossier du projet) :
    python -m unittest discover -s tests -v

Ils vérifient que :
  - les données de data/profile.js sont complètes et valides ;
  - tous les fichiers utilisés par le site existent (pas de lien cassé) ;
  - les liens WhatsApp, email, LinkedIn, GitHub sont au bon format ;
  - chaque icône utilisée existe ;
  - le QR code (pour le badge) est bien généré et lisible, et absent de la page ;
  - aucune étiquette de style « // commentaire » n'apparaît sur la page.
Ces mêmes tests sont lancés automatiquement par GitHub Actions avant chaque mise en ligne.
"""

import re
import sys
import unittest
from html.parser import HTMLParser
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RACINE / "scripts"))
from profile_loader import charger_profil  # noqa: E402

HTML = (RACINE / "index.html").read_text(encoding="utf-8")
JS = (RACINE / "js" / "main.js").read_text(encoding="utf-8")
GH_JS = (RACINE / "js" / "github.js").read_text(encoding="utf-8")


class CollecteurLiens(HTMLParser):
    """Récupère tous les attributs href et src de la page."""

    def __init__(self):
        super().__init__()
        self.liens = []

    def handle_starttag(self, tag, attrs):
        for nom, valeur in attrs:
            if nom in ("href", "src") and valeur:
                self.liens.append(valeur)


class TestProfil(unittest.TestCase):
    """Vérifie le contenu de data/profile.js."""

    @classmethod
    def setUpClass(cls):
        cls.p = charger_profil()

    def test_sections_obligatoires(self):
        for cle in ("identity", "site", "contact", "github", "stats", "whyMe", "experience", "projects", "skills", "languages"):
            self.assertIn(cle, self.p, f"Section manquante : {cle}")

    def test_whatsapp_format_international(self):
        numero = self.p["contact"]["whatsapp"]
        self.assertRegex(numero, r"^216\d{8}$", "Le numéro WhatsApp doit être 216 + 8 chiffres, sans + ni espace")

    def test_email_valide(self):
        self.assertRegex(self.p["contact"]["email"], r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$")

    def test_liens_externes_en_https(self):
        for cle in ("linkedin", "github"):
            self.assertTrue(self.p["contact"][cle].startswith("https://"), cle)
        self.assertTrue(self.p["site"]["url"].startswith("https://"))

    def test_fichiers_du_profil_existent(self):
        chemins = [self.p["identity"]["photo"]] + [self.p["contact"][k] for k in ("cv", "cvAts")]
        for chemin in chemins:
            self.assertTrue((RACINE / chemin).is_file(), f"Fichier introuvable : {chemin}")

    def test_configuration_github(self):
        gh = self.p["github"]
        self.assertRegex(gh["user"], r"^[A-Za-z0-9-]+$", "Nom d'utilisateur GitHub invalide")
        self.assertIn(gh["user"], self.p["contact"]["github"], "Le lien GitHub et l'utilisateur ne correspondent pas")
        self.assertIsInstance(gh["featured"], list)
        self.assertIsInstance(gh["exclude"], list)

    def test_niveaux_de_langue_entre_0_et_100(self):
        for langue in self.p["languages"]:
            self.assertTrue(0 <= langue["percent"] <= 100, langue["name"])

    def test_icones_existent(self):
        symboles = set(re.findall(r'<symbol id="i-([\w-]+)"', HTML))
        utilisees = set()
        for groupe in ("whyMe", "projects", "skills"):
            utilisees |= {x["icon"] for x in self.p[groupe]}
        self.assertFalse(utilisees - symboles, f"Icônes manquantes : {utilisees - symboles}")


class TestPage(unittest.TestCase):
    """Vérifie index.html et js/main.js."""

    def test_aucun_lien_local_casse(self):
        collecteur = CollecteurLiens()
        collecteur.feed(HTML)
        for lien in collecteur.liens:
            if lien.startswith(("http", "#", "mailto:", "tel:")):
                continue
            self.assertTrue((RACINE / lien.split("?")[0]).exists(), f"Lien cassé : {lien}")

    def test_chaque_data_link_est_defini_dans_le_js(self):
        utilises = set(re.findall(r'data-link="(\w+)"', HTML))
        bloc = JS[JS.index("const LINKS"):JS.index("};", JS.index("const LINKS"))]
        definis = set(re.findall(r"^\s*(\w+):", bloc, re.M))
        self.assertFalse(utilises - definis, f"data-link sans lien : {utilises - definis}")

    def test_ids_utilises_par_le_js_existent(self):
        for code in (JS, GH_JS):
            for ident in set(re.findall(r"\$\('#([\w-]+)'\)", code)):
                self.assertIn(f'id="{ident}"', HTML, f"id introuvable dans index.html : #{ident}")

    def test_ordre_des_scripts(self):
        # Les données doivent être chargées avant github.js et main.js
        i_data, i_gh, i_main = (HTML.index(f'src="{f}"') for f in ("data/profile.js", "js/github.js", "js/main.js"))
        self.assertLess(i_data, i_gh)
        self.assertLess(i_gh, i_main)

    def test_pas_de_commentaires_visibles(self):
        # Les « // vue recruteur », « // projets »… ne doivent plus apparaître
        texte_visible = re.sub(r"<!--.*?-->|<script.*?</script>|<style.*?</style>", "", HTML, flags=re.S)
        self.assertNotRegex(texte_visible, r">\s*//\s*\w", "Étiquette « // ... » trouvée dans la page")

    def test_whatsapp_ordinateur_et_telephone(self):
        self.assertIn("https://wa.me/", JS, "Lien WhatsApp téléphone manquant")
        self.assertIn("https://web.whatsapp.com/send?phone=", JS, "Lien WhatsApp Web manquant")

    def test_qr_code_pas_dans_le_site(self):
        # Le QR code sert au badge imprimé, pas à la page web
        self.assertNotIn("qr-code", HTML)

    def test_projets_phares_limites(self):
        self.assertLessEqual(len(charger_profil()["projects"]), 6, "Garder seulement les meilleurs projets (6 maximum)")

    def test_balises_seo(self):
        for balise in ('<html lang="fr"', 'name="description"', 'property="og:title"', 'name="viewport"'):
            self.assertIn(balise, HTML)


class TestFichiersGeneres(unittest.TestCase):
    """Vérifie le QR code et la copie GitHub."""

    def test_copie_github_valide_si_presente(self):
        import json
        chemin = RACINE / "data" / "github-snapshot.json"
        if not chemin.exists():
            self.skipTest("Pas de copie GitHub en local (elle est créée par GitHub Actions)")
        copie = json.loads(chemin.read_text(encoding="utf-8"))
        self.assertIn("repos", copie)
        for depot in copie["repos"]:
            self.assertIn("name", depot)
            self.assertIn("html_url", depot)

    def test_qr_code_existe(self):
        self.assertTrue((RACINE / "assets" / "qr-code.svg").is_file(), "Lancez : python scripts/generate_qr.py")
        self.assertTrue((RACINE / "assets" / "qr-code.png").is_file())

    def test_qr_code_lisible(self):
        try:
            import cv2  # facultatif : pip install opencv-python-headless
        except ImportError:
            self.skipTest("OpenCV non installé : test de lecture du QR ignoré")
        image = cv2.imread(str(RACINE / "assets" / "qr-code.png"))
        texte, _, _ = cv2.QRCodeDetector().detectAndDecode(image)
        self.assertEqual(texte, charger_profil()["site"]["url"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
