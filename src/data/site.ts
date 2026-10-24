/** Contenido del sitio — basado en CV (Elisa Ruiz, julio 2025). */

export const cvDownloads = {
  design: {
    label: "CV diseño",
    fileName: "Elisa-Ruiz-CV-2026.pdf",
    href: "/cv/elisa-ruiz-cv.pdf",
  },
  ats: {
    label: "CV ATS",
    fileName: "Elisa-Ruiz-CV-ATS.pdf",
    href: "/cv/elisa-ruiz-cv-ats.pdf",
  },
} as const;

export const site = {
  name: "Elisa Ruiz",
  shortName: "Elisa",
  /** Rol principal (h1, cabecera, title, JSON-LD) */
  role: "Desarrolladora web",
  /** Rol técnico para la vista de recruiters */
  techRole: "Front-End Developer",
  yearsExperience: 4,
  location: "Madrid",
  email: "elisaruizortegadev@gmail.com",
  linkedin: "https://www.linkedin.com/in/elisaruizortega",
  github: "https://github.com/elisaruizdev",
  availability: "Abierta a nuevas oportunidades",
} as const;

/** Lo que un recruiter suele buscar en los primeros segundos */
export const recruiterHighlights = {
  pitchIntro: "Más de 4 años de experiencia en sector Fintech",
  pitchTags: [
    "Angular & Vue",
    "TypeScript",
    "IA con supervisión de código",
  ] as const,
  employer: "Zeeker Solutions",
  employerSince: "2022",
  location: site.location,
  availability: site.availability,
  stack: ["Angular (v15+)", "Vue.js", "TypeScript", "SCSS", "Playwright"],
} as const;

export const credibilityStats = [
  {
    value: `${site.yearsExperience}+`,
    label: "Años como Front End Developer",
  },
  {
    value: "Desde 2022",
    label: "Trabajando en el sector Fintech",
  },
  {
    value: "2",
    label: "Frameworks: Angular desde v14 a 20 y Vue 2 y 3",
  },
  {
    value: "ES y EN",
    label: "Español nativo · Inglés B1 preparando B2",
  },
] as const;

export const serviceTags = [
  "angular",
  "vue",
  "typescript",
  "scss",
  "playwright",
  "figma",
  "postman",
  "azure",
  "slack",
  "jira",
  "git",
  "claude",
  "cursor",
  "angular-material",
  "bootstrap",
] as const;

export const hero = {
  titleLine1: "No es solo desarrollar",
  titleLine2: "es cuidar el detalle",
  titleLine3: "que aguanta en",
  titleLine4: "producción",
  headline: "No es solo desarrollar: es cuidar el detalle que aguanta en producción.",
  subheadline:
    "Software engineer con experiencia desde 2022 en proyectos bancarios y financieros. Angular, Vue, TypeScript y SCSS — con obsesión sana por los fallos que aparecen cuando nadie ha probado «el otro camino».",
} as const;

/** Elección del hero: cada opción es una vista con su propia URL */
export const audienceChoice = {
  intro: `En ${site.location}, con más de ${site.yearsExperience} años creando webs y aplicaciones.`,
  prompt: "¿Qué te trae por aquí?",
  client: {
    label: "Necesito una web",
    hint: "Webs para negocios, aplicaciones a medida o mejorar la que ya tienes.",
    href: "/servicios",
  },
  recruiter: {
    label: "Soy recruiter",
    hint: `Experiencia, proyectos y CV como ${site.techRole}.`,
    href: "/experiencia",
  },
} as const;

/** Encargos freelance: vista /servicios */
export const freelance = {
  title: "¿Necesitas una web? Hablemos",
  intro: `Soy ${site.name}, desarrolladora front-end en Madrid con más de ${site.yearsExperience} años creando webs y aplicaciones en producción para banca y fintech. Además de mi trabajo, acepto proyectos por encargo: cuéntame qué necesitas y vemos cómo hacerlo.`,
  examples: [
    {
      title: "Una web para tu negocio",
      description:
        "Web corporativa o landing: rápida, adaptada a móvil y preparada para que te encuentren en Google.",
    },
    {
      title: "Una aplicación a medida",
      description:
        "Áreas privadas con login, paneles de gestión o formularios con lógica propia.",
    },
    {
      title: "Mejorar la web que ya tienes",
      description:
        "Rediseño, rendimiento, accesibilidad y corrección de errores, sin empezar de cero.",
    },
  ],
  reasons: [
    "Experiencia en producción: webs y backoffices para una financiera y un neobanco.",
    "Accesibilidad de serie: la trabajo a diario y la verifico con pruebas automatizadas con Playwright.",
    "Detalle antes de entregar: reviso los casos raros, no solo el camino feliz.",
  ],
  area: "Con base en Madrid. Trabajo con negocios de toda la Comunidad de Madrid, en persona o en remoto, y en remoto con el resto de España.",
  mailSubject: "Proyecto web",
} as const;

export const about =
  "Desarrollo con Cursor, Claude Code y agentes de IA para iterar más rápido; reviso, pruebo y corrijo el código que generan antes de darlo por bueno. Sigo formándome y destaco por ser detallista y meticulosa, sobre todo al buscar posibles fallos y las distintas casuísticas de cada aplicación.";

export const strengths = [
  {
    title: "IA como acelerador, no autopiloto",
    description:
      "Trabajo con Cursor, Claude Code y agentes de IA para prototipar y escribir código — y luego lo reviso línea a línea: lógica, edge cases, estilo del repo y si encaja en producción.",
  },
  {
    title: "Casuísticas antes del merge",
    description:
      "Reviso flujos alternativos, datos inconsistentes y comportamiento responsive — no solo el camino feliz del diseño en Figma.",
  },
] as const;

export const skills = [
  "HTML5 & SCSS",
  "TypeScript & JavaScript",
  "Angular (v15+)",
  "Vue.js",
  "Bootstrap & Angular Material",
  "Git & CI/CD",
  "Azure DevOps & Jira",
  "Karma & Jasmine",
  "Postman",
  "Figma",
  "Cursor, Claude Code & agentes IA",
] as const;

export type ProjectCategory = "personal";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: ProjectCategory;
  href?: string;
  repo?: string;
  highlight?: string;
  /** Pantallazo en /public/projects/{id}.webp (o .png) */
  image?: string;
  /** Varias capturas: en desktop se apilan a la izquierda (50 %) y se revelan al hacer scroll */
  images?: string[];
  imageAlt?: string;
  /** Captura vertical: se muestra en un móvil superpuesto a la primera captura */
  mobileImage?: string;
  /** Dominio que se ve en la barra del navegador que enmarca las capturas */
  browserUrl?: string;
};

export const projects: Project[] = [
  {
    id: "psoas",
    category: "personal",
    images: [
      "/projects/psoas-login.webp",
      "/projects/psoas-dashboard.webp",
      "/projects/psoas-ficha-paciente.webp",
    ],
    imageAlt: "Psoas — pantallas de la plataforma",
    title: "Psoas",
    description:
      "Plataforma para clínicas de fisioterapia: login y registro, área privada con dashboard, pacientes, sesiones, historial clínico y gestión de fisios.",
    tags: ["Angular", "TypeScript", "Nest.js", "MySQL"],
    repo: "https://github.com/elisaruizdev/psoas",
    highlight:
      "Angular 20 con rutas lazy, guards de autenticación y métricas diarias (sesiones, pacientes activos).",
  },
  {
    id: "trivial-desarrolladores",
    category: "personal",
    images: [
      "/projects/trivial-desarrolladores-setup.webp",
      "/projects/trivial-desarrolladores-quiz.webp",
      "/projects/trivial-desarrolladores-own-questions.webp",
    ],
    mobileImage: "/projects/trivial-desarrolladores-mobile.webp",
    imageAlt: "Trivial para desarrolladores — pantallas de la app",
    title: "Trivial de desarrolladores",
    description:
      "Juego de preguntas sobre desarrollo y tecnología: practicar lógica, repasar conceptos y montar una experiencia jugable de principio a fin.",
    tags: ["React", "JavaScript", "HTML", "CSS"],
    repo: "https://github.com/elisaruizdev/trivial-dev",
    highlight: "Proyecto orientado a repaso técnico con enfoque en usabilidad y feedback al jugador.",
  },
];

export type ExperienceSector = "financiero" | "bancario" | "legal";

export type ExperienceTicket = {
  key: string;
  type: "story" | "task";
  status: "done" | "progress";
  summary: string;
};

export type ExperienceProject = {
  id: string;
  sector: ExperienceSector;
  sectorLabel: string;
  chip: string;
  title: string;
  description?: string;
  bullets?: string[];
  tickets?: ExperienceTicket[];
  tags: string[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  /** Etiqueta corta junto al nodo del timeline */
  yearLabel: string;
  /** Inicio ISO (YYYY-MM) para <time datetime> */
  startDate: string;
  /** Fin ISO; omitir si el puesto sigue activo */
  endDate?: string;
  duration: string;
  current?: boolean;
  summary?: string;
  bullets?: string[];
  projects?: ExperienceProject[];
};

const ZEEKER_PROJECTS: ExperienceProject[] = [
  {
    id: "web-clientes",
    sector: "financiero",
    sectorLabel: "Sector financiero",
    chip: "Financiero",
    title: "Proyecto web y backoffice",
    tickets: [
      {
        key: "FIN-14",
        type: "story",
        status: "done",
        summary:
          "Desarrollé desde cero la web de una financiera: área pública y área privada con login para dos perfiles (puntos de venta y prestatarios), que cubre todo el proceso de solicitud de financiación hasta su aprobación.",
      },
      {
        key: "FIN-86",
        type: "task",
        status: "done",
        summary:
          "Inicié el proyecto en Angular 14 y, ya en producción, lo actualicé progresivamente hasta Angular 20.",
      },
      {
        key: "FIN-112",
        type: "story",
        status: "progress",
        summary:
          "Mantengo y amplio el backoffice que usan todos los departamentos; migré su frontend de Vue 2 + Bootstrap 4 a Vue 3 + Bootstrap 5.",
      },
      {
        key: "FIN-203",
        type: "task",
        status: "progress",
        summary:
          "Actualmente mejoro la accesibilidad y la verifico con pruebas automatizadas con Playwright.",
      },
      {
        key: "FIN-221",
        type: "task",
        status: "progress",
        summary:
          "Realizo pruebas funcionales de la app móvil, reporto errores al equipo y doy soporte técnico a otras áreas gracias a mi conocimiento del negocio.",
      },
    ],
    tags: [
      "Angular 14 → 20",
      "TypeScript",
      "SCSS",
      "Angular Material",
      "REST API",
      "Vue 2 → 3",
      "Bootstrap",
      "JavaScript",
      "Migración",
    ],
  },
  {
    id: "plataforma-banco",
    sector: "bancario",
    sectorLabel: "Sector bancario",
    chip: "Bancario",
    title: "Proyecto web y backoffice",
    tickets: [
      {
        key: "BAN-7",
        type: "story",
        status: "done",
        summary:
          "Participé en el desarrollo del frontend de un neobanco, desde los primeros bocetos en Figma hasta la arquitectura web y la implementación de las áreas pública y privada.",
      },
      {
        key: "BAN-58",
        type: "task",
        status: "done",
        summary:
          "Trabajé con Angular (de la versión 14 a la 20), Angular Material para formularios y componentes, y SCSS para los estilos.",
      },
      {
        key: "BAN-131",
        type: "story",
        status: "done",
        summary: "Colaboré también en el backoffice del neobanco.",
      },
    ],
    tags: ["Angular 14 → 20", "TypeScript", "SCSS", "Angular Material", "Figma", "REST API"],
  },
  {
    id: "auditoria-legal",
    sector: "legal",
    sectorLabel: "Sector legal",
    chip: "Legal",
    title: "Auditoría técnica de proyecto web",
    description:
      "Análisis y auditoría de proyectos desarrollados con Django, Python y JavaScript. Revisión de arquitectura, detección de deuda técnica y generación de documentación.",
    tags: ["Django", "Python", "JavaScript"],
  },
];

export const experience: Experience[] = [
  {
    company: "Zeeker Solutions",
    role: "Front end web developer",
    period: "Septiembre 2022 — Actualidad",
    yearLabel: "Ahora",
    startDate: "2022-09",
    duration: "4 años",
    current: true,
    summary:
      "Front en producción para clientes de sector financiero y banca: web, backoffice y QA, más una plataforma bancaria desde Figma.",
    projects: ZEEKER_PROJECTS,
  },
  {
    company: "BMIND",
    role: "Analytics Engineer Trainee",
    period: "Febrero — Junio 2022",
    yearLabel: "2022",
    startDate: "2022-02",
    endDate: "2022-06",
    duration: "5 meses",
    summary:
      "Prácticas en analítica: migración de Google Analytics Universal a GA4 con GTM y JavaScript, y documentación de entrega a cliente.",
  },
  {
    company: "Instituto del Cine Madrid",
    role: "Desarrollo web, diseño y redes",
    period: "Septiembre 2015 — Septiembre 2020",
    yearLabel: "2015",
    startDate: "2015-09",
    endDate: "2020-09",
    duration: "5 años",
    summary:
      "Cinco años a cargo de la web, las redes, la publicidad y la analítica del centro: contenido, campañas, diseño gráfico y vídeo.",
    bullets: [
      "Creación de contenido para RRSS.",
      "Diseño y mantenimiento web.",
      "Realización de campañas de publicidad en Facebook Ads.",
      "Analítica web con Google Analytics.",
      "Diseño de banners, cartelería, merchandising y trípticos con Adobe Illustrator, InDesign y Photoshop.",
      "Grabación y montaje de vídeos para RRSS con Adobe Premiere y DaVinci.",
      "Maquetación de los planes de estudios del centro.",
      "Gestión de acuerdos publicitarios y negociación con empresas colaboradoras para potenciar la visibilidad y el posicionamiento del Instituto.",
    ],
  },
];

export type Education = {
  title: string;
  institution: string;
  period: string;
};

export const education: Education[] = [
  {
    title: "Grado Superior en Desarrollo de Aplicaciones Web",
    institution: "Ilerna",
    period: "Enero 2024 — Enero 2026",
  },
  {
    title: "Bootcamp Full Stack Developer",
    institution: "Upgrade Hub",
    period: "Septiembre 2021 — Enero 2022",
  },
];
