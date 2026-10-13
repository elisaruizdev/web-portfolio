import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "public", "cv", "elisa-ruiz-cv-ats.pdf");

const sections = [
  {
    heading: null,
    body: `Desarrolladora web front-end — Angular y Vue

Madrid, España | elisaruizortegadev@gmail.com
GitHub: github.com/elisaruizdev | LinkedIn: linkedin.com/in/elisaruizortega

RESUMEN
Desarrolladora front-end con más de 4 años de experiencia en Angular y Vue en sectores financiero y bancario. Especializada en aplicaciones web con área privada y backoffice, migraciones de framework, accesibilidad y pruebas automatizadas.`,
  },
  {
    heading: "EXPERIENCIA",
    body: `Zeeker Solutions — Desarrolladora front-end
Septiembre 2022 — Actualidad | Madrid, España | Jornada completa

• Cliente sector bancario: desarrollo frontend de neobanco (Angular 14 a 20, Angular Material, SCSS).
• Cliente sector financiero: web con área pública y privada (login multiperfil), migración Angular en producción.
• Mantenimiento y ampliación de backoffice usado por todos los departamentos.
• Migración frontend de Vue 2 + Bootstrap 4 a Vue 3 + Bootstrap 5.
• Mejora de accesibilidad y verificación con pruebas automatizadas (Playwright).
• Pruebas funcionales de app móvil, reporte de incidencias y soporte técnico a otras áreas.

BMIND — Analytics Engineer Trainee
Febrero 2022 — Junio 2022 | Madrid, España

• Etiquetado en migración de Google Analytics Universal a GA4 con GTM y JavaScript.
• Redacción de documentación técnica para entrega al cliente.

Instituto del Cine Madrid — Desarrollo web, diseño y comunicación
Septiembre 2015 — Septiembre 2020 | Madrid, España

• Gestión y mantenimiento del sitio web en WordPress.
• Contenido para redes sociales y campañas en Facebook Ads con analítica en Google Analytics.
• Diseño de materiales gráficos.`,
  },
  {
    heading: "FORMACIÓN",
    body: `Grado Superior en Desarrollo de Aplicaciones Web — Ilerna (2024 — enero 2026)
Bootcamp Full Stack Developer — Upgrade Hub (2021)`,
  },
  {
    heading: "PROYECTO DESTACADO",
    body: `Psoas Admin — github.com/elisaruizdev/psoas
Aplicación web para gestión de pacientes en clínica de fisioterapia: historial clínico, agenda, fichas de paciente y panel de administración. Frontend Angular 20 y backend NestJS con API REST propia.`,
  },
  {
    heading: "STACK TÉCNICO",
    body: `Frontend: Angular (14-20), Vue (2/3), TypeScript, JavaScript, HTML5, SCSS, Angular Material, Bootstrap
APIs y calidad: REST, Postman, Swagger, Karma, Jasmine, Playwright
Herramientas: Git, Azure DevOps, Jira, Figma, PostgreSQL, MySQL Workbench
Otros: NestJS, Google Tag Manager, GA4, desarrollo asistido por IA (Cursor, Claude)`,
  },
  {
    heading: "IDIOMAS",
    body: `Español — Nativo | Inglés — B1 | Catalán — B1`,
  },
];

fs.mkdirSync(path.dirname(outPath), { recursive: true });

await new Promise((resolve, reject) => {
  const doc = new PDFDocument({ margin: 48, size: "A4" });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  doc.font("Helvetica-Bold").fontSize(14).text("Elisa Ruiz");
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(10).fillColor("#333333");

  for (const section of sections) {
    if (section.heading) {
      doc.moveDown(0.6);
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#000000").text(section.heading);
      doc.moveDown(0.25);
      doc.font("Helvetica").fontSize(10).fillColor("#333333");
    }
    doc.text(section.body, { lineGap: 2 });
  }

  doc.end();
  stream.on("finish", resolve);
  stream.on("error", reject);
});

console.log(`Wrote ${outPath}`);
