const LOGO_BY_TAG: Record<string, string> = {
  angular: "/logos/angular.svg",
  "angular material": "/logos/angular-material.svg",
  vue: "/logos/vue.svg",
  typescript: "/logos/typescript.svg",
  scss: "/logos/scss.svg",
  javascript: "/logos/javascript.svg",
  html: "/logos/html.svg",
  css: "/logos/css.svg",
  react: "/logos/react.svg",
  vite: "/logos/vite.svg",
  bootstrap: "/logos/bootstrap.svg",
  velneo: "/logos/velneo.svg",
  git: "/logos/git.svg",
  "azure devops": "/logos/azure.svg",
  azure: "/logos/azure.svg",
  figma: "/logos/figma.svg",
  postman: "/logos/postman.svg",
  playwright: "/logos/playwright.svg",
  cursor: "/logos/cursor.svg",
  claude: "/logos/claude.svg",
  "nest.js": "/logos/nestjs.svg",
  nestjs: "/logos/nestjs.svg",
  mysql: "/logos/mysql.svg",
};

function normalizeProjectTag(tag: string): string {
  return tag.trim().toLowerCase();
}

/** Logo en /public/logos para tags de proyecto; undefined → mostrar chip de texto. */
export function projectTagLogo(tag: string): string | undefined {
  const key = normalizeProjectTag(tag);
  if (LOGO_BY_TAG[key]) {
    return LOGO_BY_TAG[key];
  }
  if (key.startsWith("velneo")) {
    return LOGO_BY_TAG.velneo;
  }
  return undefined;
}
