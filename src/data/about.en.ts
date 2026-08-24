// src/data/about.en.ts

import type { AboutData } from "./about.types";

export const about: AboutData = {
  introHeading: "I'm a Product designer.",
  introBody:
    "I focus on user research and business performance, turning user insights into genuine interactions that stimulate growth, answer needs and keep people coming back. I am committed to projects that have a social and environmental impact",
  introCta: "Let's connect",

  experienceHeading: "Experience",
  professionalExperience: [
    {
      title: "UX Product Designer",
      company: "900.care - D2C Startup",
      duration: "Sept. 2024 - Sept. 2025 (Paris)",
      highlights: [
        "End-to-End role in an Agile team to maximize conversion, retention, and product discovery.",
      ],
      trackingSlug: "900-care",
      cvLink: "/documents/Resume_UXPRODUCTDESIGNER_EL_IDRISSI_YASSINE.pdf",
      cvLinkLabel: "Download my resume to see more",
    },
    {
      title: "Web Designer",
      company: "Freelance",
      duration: "2023 - 2024 (Remote)",
      highlights: [
        "Consulting services in digital strategy, Search Engine Optimization (SEO), WordPress and WebFlow.",
      ],
      trackingSlug: "freelance-web",
    },
    {
      title: "Art Director",
      company: "Freelance",
      duration: "June. 2022 - Jan. 2023 (Paris)",
      highlights: [
        "Supported clients, including Maison Le Roux, on visual identity conception and brand strategy.",
      ],
      trackingSlug: "freelance-da",
    },
    {
      title: "Art Director",
      company: "Maison Le Roux - Food Industry",
      duration: "March 2021 - July 2022 (Paris)",
      highlights: [
        "Led brand strategy across digital and retail channels, ensuring consistency across all customer touchpoints.",
      ],
      trackingSlug: "maison-le-roux",
    },
  ],

  toolkitHeading: "My toolkit for impact",
  skillSections: [
    {
      title: "Core Design & Tools",
      skills: [
        {
          title: "End-to-end design",
          description:
            "From research (qualitative/quantitative) to final design delivery.",
        },
        {
          title: "Figma / Loveable / Framer",
          description:
            "High-fidelity prototyping, advanced Design System management.",
        },
        {
          title: "Adobe Suite / Affinity",
          description: "Photoshop expert, vector design and more.",
        },
        {
          title: "Web coding",
          description:
            "Solid knowledge of HTML/CSS, GitHub, web frameworks, communication with developers.",
        },
      ],
    },
    {
      title: "Methodology & Business",
      skills: [
        {
          title: "Data & UX analytics",
          description:
            "Tracking and analysis of behavioral data (Metabase, Clarity, Datadog, Hotjar).",
        },
        {
          title: "Data-driven design",
          description: "Justifying design choices by metrics (UX testing, ROI).",
        },
        {
          title: "Agile & autonomy",
          description:
            "Mastery of Scrum rituals and capacity to autonomously lead design processes.",
        },
        {
          title: "Communication & collaboration",
          description:
            "Aligning design with technical constraints and business objectives (OKR, KPI).",
        },
      ],
    },
    {
      title: "Tech Imperatives",
      skills: [
        {
          title: "Accessibility",
          description:
            "Proficiency in digital accessibility standards (RGAA, WCAG).",
        },
        {
          title: "AI & automation",
          description:
            "LLM assistance (Gemini, ChatGPT, Claude) and automation (N8N, Make).",
        },
        {
          title: "Sustainable & responsible design",
          description: "Linking modern tools to environmental and societal issues.",
        },
        {
          title: "Care-design & health-tech",
          description:
            "Interest in accessibility, food-tech, health-focused problematics.",
        },
      ],
    },
  ],

  significantWorkHeading: "Significant Work",
  significantWork: [
    {
      title: "An accessible solution for collaborative cooking",
      description:
        "Co-developed the MVP of a digital service that enhances social connection and food autonomy for students.",
      href: "/work/batchcooking",
    },
    {
      title: "An agile tool to design with ethics",
      description:
        "Created a project management tool to develop products that integrate ethics, sustainability, and inclusive principles. Team of 3 designers.",
      href: "/work/depostetconsignations",
    },
    {
      title: "Animal Health - Digital Support Service",
      description:
        "Designed and prototyped an app in sync with connected devices to help users care for animals with special needs.",
    },
  ],

  educationHeading: "Education",
  educationExperience: [
    {
      year: "2024-2025",
      title: "Master in Project Management and UX Design",
      school:
        "ISCOD, France (Intensive 12-month program under an apprenticeship contract)",
    },
    {
      year: "2020-2022",
      title: "Master in Digital Design",
      school: "École de Design Nantes Atlantique, France",
    },
    {
      year: "2016-2019",
      title: "Bachelor in Graphic Design",
      school: "Quasar Institute for Advanced Design, Rome, Italy",
    },
  ],

  languagesHeading: "Languages",
  languages: [
    { name: "French", level: "Native" },
    { name: "English", level: "C1" },
    { name: "Italian", level: "C1" },
    { name: "Spanish", level: "A2" },
    { name: "Arabic", level: "A1" },
  ],
};
