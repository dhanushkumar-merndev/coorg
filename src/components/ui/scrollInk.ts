import gsap from "gsap";

type InkOptions = {
  start?: string;
  end?: string;
  fromColor?: string;
  toColor?: string;
};

/** Call inside a GSAP context so media changes and route exits restore the DOM. */
export function scrollInk(trigger: HTMLElement, targets: HTMLElement[], { start = "top 90%", end = "bottom 49%", fromColor, toColor }: InkOptions = {}) {
  if (!targets.length) return;

  // Resolve each target before applying styles: italic accents retain their
  // intended final color and light-on-image copy gets a readable light palette.
  const colors = targets.map((target) => {
    const final = toColor ?? getComputedStyle(target).color;
    const [red, green, blue] = gsap.utils.splitColor(final);
    const light = red * 0.2126 + green * 0.7152 + blue * 0.0722 > 155;
    const muted = light ? "#b9c5ae" : "#797562";
    return { final, initial: fromColor ?? muted };
  });

  return gsap.fromTo(targets, {
    color: (index: number) => colors[index].initial,
  }, {
    color: (index: number) => colors[index].final,
    duration: 0.35,
    stagger: 0.24,
    ease: "none",
    scrollTrigger: { trigger, start, end, scrub: 0.65 },
  });
}
