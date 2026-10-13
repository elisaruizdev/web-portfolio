import { serviceTags } from "../data/site";

const logoByTag: Record<(typeof serviceTags)[number], string> = {
  angular: "/logos/angular.svg",
  vue: "/logos/vue.svg",
  typescript: "/logos/typescript.svg",
  scss: "/logos/scss.svg",
  playwright: "/logos/playwright.svg",
  figma: "/logos/figma.svg",
  postman: "/logos/postman.svg",
  azure: "/logos/azure.svg",
  slack: "/logos/slack.svg",
  jira: "/logos/jira.svg",
  git: "/logos/git.svg",
  claude: "/logos/claude.svg",
  cursor: "/logos/cursor.svg",
  "angular-material": "/logos/angular-material.svg",
  bootstrap: "/logos/bootstrap.svg",
};

function formatTagLabel(tag: (typeof serviceTags)[number]): string {
  return tag.replace(/-/g, " ");
}

type TechItem = {
  tag: (typeof serviceTags)[number];
  logo: string;
};

const items: TechItem[] = serviceTags.map((tag) => ({
  tag,
  logo: logoByTag[tag],
}));

function TechStackItem({ tag, logo }: TechItem) {
  return (
    <li className="tech-carousel__item">
      <img src={logo} alt="" className="tech-carousel__logo" width={40} height={40} loading="lazy" />
      <span className="tech-carousel__label">{formatTagLabel(tag)}</span>
    </li>
  );
}

export function TechStackCarousel() {
  const loop = [...items, ...items];

  return (
    <div className="tech-carousel" aria-label="Stack tecnológico">
      <div className="tech-carousel__viewport">
        <ul className="tech-carousel__track">
          {loop.map((item, index) => (
            <TechStackItem key={`${item.tag}-${index}`} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
}
