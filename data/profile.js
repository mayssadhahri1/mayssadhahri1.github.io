/*
 * =============================================================
 *  DONNÉES DU PORTFOLIO : la seule source de vérité
 * =============================================================
 *  Pour mettre à jour ton portfolio, modifie UNIQUEMENT ce fichier.
 *  Le site (js/), le badge et le QR code (scripts/*.py)
 *  lisent tous ces mêmes informations.
 *
 *  ⚠️ Règle : garder un JSON valide après "window.PROFILE = "
 *     (guillemets doubles, pas de virgule après le dernier élément).
 *     Les scripts Python lisent ce fichier comme du JSON.
 * =============================================================
 */
window.PROFILE = {
  "identity": {
    "firstName": "Mayssa",
    "lastName": "Dhahri",
    "title": "Élève-ingénieure en génie logiciel",
    "tagline": "Full-Stack · Mobile · Agents IA",
    "school": "École Polytechnique de Sousse",
    "location": "Kairouan / Sousse, Tunisie",
    "availability": "PFE à partir de février 2027",
    "photo": "assets/img/photo.webp",
    "orbit": [
      "Spring Boot",
      "Angular",
      "Flutter",
      "React",
      "Docker",
      "Kafka",
      "Agents IA",
      "Node.js"
    ],
    "roles": [
      "Développeuse Full-Stack",
      "Développeuse Mobile",
      "Architecte microservices",
      "Passionnée d'agents IA"
    ],
    "pitch": "Élève-ingénieure en dernière année de génie logiciel. Je construis des applications web et mobiles complètes, de l'API sécurisée jusqu'à l'interface, et je m'intéresse beaucoup aux agents IA.",
    "facts": [
      {
        "icon": "pin",
        "text": "Kairouan / Sousse · mobile"
      },
      {
        "icon": "cap",
        "text": "Polytechnique Sousse"
      },
      {
        "icon": "brief",
        "text": "Stage PFE · ouverte au CDI"
      }
    ]
  },
  "site": {
    "url": "https://mayssadhahri1.github.io/"
  },
  "contact": {
    "email": "maissa.dhahri_1@polytechnicien.tn",
    "phone": "+216 55 954 339",
    "whatsapp": "21655954339",
    "whatsappMessage": "Bonjour Mayssa, nous avons vu votre portfolio pour un PFE 2027.",
    "linkedin": "https://www.linkedin.com/in/mayssa-dhahri/",
    "github": "https://github.com/mayssadhahri1",
    "cv": "assets/docs/CV_Mayssa_Dhahri.pdf",
    "cvAts": "assets/docs/CV_Mayssa_Dhahri_ATS.pdf"
  },
  "github": {
    "user": "mayssadhahri1",
    "featured": [],
    "featuredTopic": "portfolio",
    "exclude": [
      "mayssadhahri1"
    ],
    "showForks": false,
    "_aide": "featured : noms exacts des dépôts à mettre « À la une ». Ou bien ajoute le topic 'portfolio' au dépôt sur GitHub. exclude : dépôts à cacher."
  },
  "stats": [
    {
      "prefix": "",
      "value": 5,
      "label": "stages"
    },
    {
      "prefix": "+",
      "value": 20,
      "label": "projets"
    },
    {
      "prefix": "",
      "value": 5,
      "label": "langues"
    }
  ],
  "whyMe": [
    {
      "icon": "layers",
      "title": "Du back au front, de bout en bout",
      "text": "API REST sécurisées (Spring Boot, JWT), interfaces Angular / React et apps mobiles Flutter / React Native : je livre une fonctionnalité complète."
    },
    {
      "icon": "server",
      "title": "Architecture & DevOps",
      "text": "Microservices avec API Gateway, gRPC, Kafka et GraphQL. Conteneurs Docker / Podman et pipelines CI/CD Jenkins."
    },
    {
      "icon": "spark",
      "title": "IA appliquée et agents LLM",
      "text": "Prompt Engineering, agents LLM et machine learning appliqué (diagnostic médical, imagerie). Prête pour un PFE qui intègre l'IA."
    }
  ],
  "softSkills": [
    "Communication claire",
    "Rigueur",
    "Adaptabilité",
    "Autonomie",
    "Travail en équipe",
    "Résolution de problèmes"
  ],
  "experience": [
    {
      "year": "2026",
      "role": "Stagiaire Développeuse Mobile · Stage PFA",
      "company": "Cyber Kairouan",
      "project": "Application mobile de streaming de films",
      "points": [
        "App Flutter multiplateforme connectée à une API REST Spring Boot sécurisée par JWT.",
        "Lecture vidéo en streaming progressif (HTTP Range Requests, code 206)."
      ],
      "stack": [
        "Flutter",
        "Dart",
        "Spring Boot",
        "JWT",
        "GitHub"
      ]
    },
    {
      "year": "2025",
      "role": "Stagiaire Développeuse Full-Stack · Stage d'été",
      "company": "Cyber Kairouan",
      "project": "Plateforme d'administration de streaming de films",
      "points": [
        "Tableau de bord d'administration Angular pour gérer les films, les genres et les acteurs.",
        "Endpoints REST avec Spring Boot et persistance des données sous SQLite."
      ],
      "stack": [
        "Angular",
        "Spring Boot",
        "SQLite",
        "TMDB API"
      ]
    },
    {
      "year": "2025",
      "role": "Stagiaire Développeuse Mobile & Web",
      "company": "Educanet, Sousse",
      "project": "InMy Pharma : plateforme de pharmacie en ligne",
      "points": [
        "Application React Native pour 3 profils (client, pharmacien, livreur) avec notifications et suivi des commandes.",
        "Suivi de livraison en direct sur carte et messagerie entre client, pharmacien et livreur."
      ],
      "stack": [
        "React Native",
        "React.js",
        "Temps réel",
        "Cartes"
      ]
    },
    {
      "year": "2023",
      "role": "Stagiaire Développeuse Web Full-Stack",
      "company": "ETC, Kairouan",
      "project": "Site e-commerce",
      "points": [
        "Site e-commerce complet en Laravel / PHP : catalogue, panier et commandes.",
        "Espace d'administration pour gérer les produits et les opérations."
      ],
      "stack": [
        "Laravel",
        "PHP",
        "MySQL"
      ]
    },
    {
      "year": "2022",
      "role": "Stage d'initiation · Télécommunications & Réseaux",
      "company": "Tunisie Telecom, Kairouan",
      "project": "",
      "points": [
        "Découverte de l'infrastructure d'un opérateur national : protocoles réseau, routage et commutation (Cisco)."
      ],
      "stack": [
        "Réseaux",
        "Cisco"
      ]
    }
  ],
  "projects": [
    {
      "icon": "layers",
      "year": "2026",
      "kind": "Microservices",
      "title": "TrackFlow : système de livraison",
      "text": "Projet d'équipe : 3 technologies de communication (gRPC, Kafka, GraphQL / Apollo) derrière une API Gateway, 2 services (commandes, authentification JWT) et un tableau de bord React.",
      "stack": [
        "gRPC",
        "Kafka",
        "GraphQL",
        "React"
      ]
    },
    {
      "icon": "shield",
      "year": "2026",
      "kind": "Microservices",
      "title": "Système bancaire sécurisé",
      "text": "3 microservices (comptes, transactions, notifications), sécurité Spring Security (JWT), interface Angular et pipeline CI/CD Jenkins.",
      "stack": [
        "Spring Boot",
        "Angular",
        "Docker",
        "Jenkins"
      ]
    },
    {
      "icon": "layers",
      "year": "2026",
      "kind": "Temps réel",
      "title": "Gestion de projets collaborative",
      "text": "Tableaux Kanban avec notifications et synchronisation en temps réel via WebSocket.",
      "stack": [
        "Node.js",
        "React",
        "WebSocket",
        "Docker"
      ]
    },
    {
      "icon": "monitor",
      "year": "2025",
      "kind": "Web",
      "title": "Portail d'emploi et de recrutement",
      "text": "Offres d'emploi, candidatures et tableau de bord recruteur, avec une API REST Spring Boot sécurisée.",
      "stack": [
        "Spring Boot",
        "JWT",
        "Angular",
        "MySQL"
      ]
    },
    {
      "icon": "mobile",
      "year": "2026",
      "kind": "Mobile · IoT",
      "title": "Suivi de santé en temps réel",
      "text": "Application React Native connectée à des capteurs IoT (fréquence cardiaque, température) via Bluetooth, avec tableau de bord en direct et alertes.",
      "stack": [
        "React Native",
        "IoT",
        "Node.js",
        "MongoDB"
      ]
    },
    {
      "icon": "spark",
      "year": "2026",
      "kind": "Intelligence artificielle",
      "title": "Détection de maladies par imagerie médicale",
      "text": "Import de radiographies et d'IRM, avec un diagnostic automatique par un modèle d'IA.",
      "stack": [
        "Python",
        "FastAPI",
        "React.js"
      ]
    }
  ],
  "skills": [
    {
      "icon": "code",
      "title": "Langages",
      "items": [
        "Java",
        "JavaScript",
        "TypeScript",
        "Python",
        "Dart",
        "PHP",
        "SQL"
      ]
    },
    {
      "icon": "server",
      "title": "Backend",
      "items": [
        "Spring Boot",
        "Spring Security",
        "Spring Data JPA",
        "JEE",
        "Node.js",
        "Express.js",
        "FastAPI",
        "Laravel"
      ]
    },
    {
      "icon": "mobile",
      "title": "Frontend & Mobile",
      "items": [
        "Angular",
        "React.js",
        "React Native",
        "Flutter"
      ]
    },
    {
      "icon": "layers",
      "title": "Architecture & API",
      "items": [
        "Microservices",
        "API REST",
        "GraphQL",
        "gRPC",
        "Apache Kafka",
        "API Gateway",
        "WebSockets"
      ]
    },
    {
      "icon": "db",
      "title": "Données & DevOps",
      "items": [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "SQLite",
        "Docker",
        "Podman",
        "Jenkins",
        "CI/CD",
        "Git"
      ]
    },
    {
      "icon": "spark",
      "title": "IA & Sécurité",
      "items": [
        "Agents LLM",
        "IA agentique",
        "Prompt Engineering",
        "Machine Learning",
        "JWT",
        "Cisco CyberOps"
      ]
    }
  ],
  "education": [
    {
      "when": "2024 – 2027",
      "title": "Diplôme d'ingénieur en génie logiciel",
      "where": "École Polytechnique de Sousse"
    },
    {
      "when": "2021 – 2023",
      "title": "Licence en systèmes d'information",
      "where": "ISET Kairouan"
    }
  ],
  "certifications": [
    {
      "when": "2026",
      "title": "Red Hat OpenShift Development I : Containers with Podman (DO188)",
      "where": "Red Hat Academy"
    },
    {
      "when": "2024",
      "title": "Introduction to Cybersecurity",
      "where": "Cisco Networking Academy"
    },
    {
      "when": "Club",
      "title": "Membre actif, IEEE Robotics",
      "where": "École Polytechnique de Sousse"
    }
  ],
  "languages": [
    {
      "name": "Arabe",
      "level": "Maternelle",
      "percent": 100
    },
    {
      "name": "Français",
      "level": "C1",
      "percent": 85
    },
    {
      "name": "Anglais",
      "level": "B2",
      "percent": 70
    },
    {
      "name": "Italien",
      "level": "A2",
      "percent": 35
    },
    {
      "name": "Allemand",
      "level": "A2",
      "percent": 35
    }
  ]
};
