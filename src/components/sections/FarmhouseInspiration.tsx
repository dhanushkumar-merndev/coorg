import Image from "next/image";
import { WordHeading } from "../pages/PagePrimitives";
import TransitionLink from "../navigation/TransitionLink";
import styles from "./farmhouse.module.css";

const inspirations = [
  {
    name: "Bamboo retreats",
    mood: "LIGHT. OPEN. NATURAL.",
    description: "Imagine open verandahs, woven textures and a quiet corner in the green. A bamboo-inspired retreat brings natural materials into the story of your space.",
    image: "/images/inspiration/bamboo-retreat.webp",
    alt: "Conceptual illustration of thatched cottages beside a lush forest",
  },
  {
    name: "Earth cottages",
    mood: "SIMPLE. WARM. GROUNDED.",
    description: "Earthy finishes, gentle colours and the feeling of a slower day. An earth-inspired cottage offers a starting point for imagining a personal countryside escape.",
    image: "/images/inspiration/earth-cottage.webp",
    alt: "Reference image of a small white cottage with a thatched roof in a rural setting",
  },
  {
    name: "Treehouse living",
    mood: "A DIFFERENT PERSPECTIVE.",
    description: "Picture a reading nook near the canopy and a deck looking into the trees. A treehouse-inspired hideaway starts with the landscape and the way you want to enjoy it.",
    image: "/images/inspiration/treehouse-living.webp",
    alt: "Reference image of an elevated timber cabin among tall trees",
  },
];

export function FarmhouseInspiration() {
  return (
    <section className={styles.section} aria-labelledby="farmhouse-heading">
      <div className={styles.intro}>
        <p className="eyebrow">IMAGINE YOUR EVERYDAY ESCAPE</p>
        <WordHeading id="farmhouse-heading">A farmhouse that feels like you.</WordHeading>
        <p className={styles.description} data-chapter-rise>Morning light on the verandah. A table for long conversations. Space to simply be. Explore a few design inspirations for the life you imagine on your land.</p>
      </div>
      <div className={styles.grid}>
        {inspirations.map((item, index) => (
          <article key={item.name} className={styles.card} data-chapter-rise>
            <Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 31vw" className={styles.image} />
            <div className={styles.shade} aria-hidden="true" />
            <div className={styles.copy}><span className={styles.number}>0{index + 1} / DESIGN INSPIRATION</span><h3>{item.name}</h3><p>{item.description}</p></div>
            <div className={styles.bottom}><span>{item.mood}</span><small>Illustrative reference · Not a Star property</small></div>
          </article>
        ))}
      </div>
      <div className={styles.afterword}>
        <p>These are architectural inspirations, not confirmed building packages. Any design would depend on the specific land, permissions and a separate discussion of feasibility.</p>
        <TransitionLink href="/enquiry">Let’s talk about your ideas <span aria-hidden="true">↗</span></TransitionLink>
      </div>
    </section>
  );
}
