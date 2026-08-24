// src/data/about.fr.ts
// Contenu reconstruit à partir du CV fourni par l'utilisateur. "Significant Work" n'était
// pas couvert par ce CV : les 3 items sont une traduction directe du contenu EN existant,
// à relire/ajuster par l'utilisateur.

import type { AboutData } from "./about.types";

export const about: AboutData = {
  introHeading: "Designer Ops et stratégie produit.",
  introBody:
    "Spécialisé en UX, je transforme les insights utilisateur en leviers concrets de performance business où l'inclusivité, l'accessibilité et l'éthique deviennent des critères de conception.",
  introCta: "Discutons",

  experienceHeading: "Expérience",
  professionalExperience: [
    {
      title: "Product designer R&D",
      company: "Freelance",
      duration: "11/2025 - Actuellement, à distance",
      highlights: [
        "Healthcare : conception d'un SaaS de suivi alimentaire ciblant le public vulnérable avec une UX non-anxiogène et modulaire.",
        "Déploiement d'une architecture RAG locale sans transfert externe.",
      ],
      trackingSlug: "product-rd-freelance",
      cvLink: "/documents/cv_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf",
      cvLinkLabel: "Télécharger mon CV pour en savoir plus",
    },
    {
      title: "UX Product designer",
      company: "900.care",
      duration: "09/2024 - 09/2025, Paris",
      highlights: [
        "Taux de conversion : augmentation de 5.4% à 5.9%.",
        "Rétention : stabilisée au-dessus de 70%.",
        "Panier moyen : +47% suite à la refonte du tunnel de vente.",
        "Protocoles de recherche : enquêtes quantitatives, entretiens qualitatifs.",
        "Maquettes hi-fi et développement d'un design système scalable.",
        "Nouvel espace client, optimisation du parcours de désabonnement, refonte de la page d'accueil et du catalogue produits.",
      ],
      trackingSlug: "900-care",
    },
    {
      title: "UX/UI, Interaction Designer (Freelance)",
      company: "OLA, MCB, OsteoDS",
      duration: "07/2023 - 07/2024, à distance",
      highlights: [
        "Prototypage e‑commerce pour valider la viabilité d'offres commerciales.",
        "Maintenance de systèmes low-code sur Webflow, WordPress et Wix-Studio.",
        "Audit et stratégies de référencement naturel SEO.",
        "Cours particuliers de PAO : InDesign, Photoshop, suivi d'examens.",
      ],
      trackingSlug: "freelance-uxui",
    },
    {
      title: "Art Director (Stage et freelance)",
      company: "Maison Le Roux",
      duration: "05/2022 - 06/2024, Paris",
      highlights: [
        "« Salon du Chocolat 2022 » : design de deux espaces de vente éphémères.",
        "Refonte du brand book, application sur l'ensemble des points de contact.",
        "Direction créative pour le packaging, l'édition, le retail et la photographie.",
      ],
      trackingSlug: "maison-le-roux",
    },
  ],

  toolkitHeading: "Compétences",
  skillSections: [
    {
      title: "Analyse et stratégie",
      skills: [
        {
          title: "KPI, OKR",
          description: "Alignement des choix de design avec les objectifs business.",
        },
        {
          title: "Qualitative, Quantitative",
          description: "Entretiens et enquêtes pour fonder les décisions de design.",
        },
        {
          title: "Metabase, Datadog",
          description: "Suivi et analyse de la donnée comportementale.",
        },
      ],
    },
    {
      title: "Outils de design",
      skills: [
        {
          title: "UI Design, Figma, Framer, Adobe",
          description: "Prototypage haute-fidélité et direction visuelle.",
        },
        {
          title: "Design Systems",
          description: "Conception et maintenance de design systems scalables.",
        },
        {
          title: "Scrum, Sprint Planning",
          description: "Maîtrise des rituels agiles et autonomie sur le processus de design.",
        },
      ],
    },
    {
      title: "IA et Web",
      skills: [
        {
          title: "Claude Code, MCP",
          description: "Assistance IA appliquée à la conception et au développement.",
        },
        {
          title: "HTML/CSS, GitHub, SEO",
          description: "Connaissances techniques web et communication avec les développeurs.",
        },
        {
          title: "Automatisation n8n",
          description: "Automatisation de workflows pour gagner en efficacité.",
        },
      ],
    },
  ],

  significantWorkHeading: "Projets marquants",
  significantWork: [
    {
      title: "Une solution accessible pour la cuisine collaborative",
      description:
        "Co-développement du MVP d'un service numérique qui renforce le lien social et l'autonomie alimentaire des étudiants.",
      href: "/fr/work/batchcooking",
    },
    {
      title: "Un outil agile pour designer avec éthique",
      description:
        "Création d'un outil de gestion de projet pour développer des produits intégrant l'éthique, la durabilité et les principes inclusifs. Équipe de 3 designers.",
      href: "/fr/work/depostetconsignations",
    },
    {
      title: "Santé animale - Service d'accompagnement digital",
      description:
        "Conception et prototypage d'une application synchronisée avec des objets connectés pour aider les utilisateurs à prendre soin d'animaux ayant des besoins spécifiques.",
    },
  ],

  educationHeading: "Formations",
  educationExperience: [
    {
      year: "2024-2025",
      title: "Mastère Management de Projets UX, RNCP 7",
      school: "ISCOD, apprentissage, France",
    },
    {
      year: "2020-2022",
      title: "Master en Design Digital",
      school: "EDNA, Nantes, France",
    },
    {
      year: "2016-2019",
      title: "Bachelor en Design Graphique",
      school: "Quasar Institute, Rome, Italy",
    },
  ],

  languagesHeading: "Langues",
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "C1" },
    { name: "Italien", level: "C1" },
    { name: "Espagnol", level: "A2" },
    { name: "Arabe", level: "A1" },
  ],
};
