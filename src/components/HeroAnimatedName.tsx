type HeroAnimatedNameProps = {
  name: string;
};

export function HeroAnimatedName({ name }: HeroAnimatedNameProps) {
  return <h1 className="hero-speech__name">{name}</h1>;
}
