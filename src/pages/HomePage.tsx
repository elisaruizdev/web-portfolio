import { LandingScrollSurface } from "../components/LandingScrollSurface";
import { Seo } from "../components/Seo";
import { Hero } from "../components/sections/Hero";
import { Strengths } from "../components/sections/Strengths";
import { Projects } from "../components/sections/Projects";
import { Experience } from "../components/sections/Experience";
import { BlogTeaser } from "../components/sections/BlogTeaser";
import { Contact } from "../components/sections/Contact";
import { personAndWebsiteJsonLd } from "../seo/jsonLd";
import { site } from "../seo/config";

export function HomePage() {
  return (
    <>
      <Seo
        title={site.defaultTitle}
        description={site.defaultDescription}
        path="/"
        jsonLd={personAndWebsiteJsonLd()}
      />
      <LandingScrollSurface>
        <Hero />
        <Experience />
        <Projects />
        <Strengths />
        <BlogTeaser />
        <Contact />
      </LandingScrollSurface>
    </>
  );
}
