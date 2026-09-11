export type CoorgWorld = {
  id: string;
  title: string;
  line: string;
  image: string;
  imageAlt: string;
  conceptual: true;
  introduction: string;
  description: string;
  considerations: readonly string[];
};

// These are editorial categories, never individual property listings.
export const coorgWorlds: readonly CoorgWorld[] = [
  {
    id: "plantation-estates",
    title: "Plantation Estates",
    line: "Working land. Living landscape.",
    image: "/images/coorg/conceptual/plantation-estates.webp",
    imageAlt: "Conceptual view of a green plantation and winding estate road in misty hills",
    conceptual: true,
    introduction: "A different rhythm. Rooted in the land.",
    description:
      "Imagine mornings among the trees, following the seasons and learning the character of a living estate. Begin with what matters to you: the landscape, the crops, and the time you want to spend here.",
    considerations: ["Plantation character", "Water & seasonal access", "Care & stewardship"],
  },
  {
    id: "private-hill-retreats",
    title: "Private Hill Retreats",
    line: "Privacy shaped by the hills.",
    image: "/images/coorg/conceptual/private-hill-retreats.webp",
    imageAlt: "Conceptual forest retreat with warm windows and a pool overlooking misty hills",
    conceptual: true,
    introduction: "Some places bring you back to yourself.",
    description:
      "A slower morning. A sheltered verandah. A view that asks nothing of you. Explore the idea of a private retreat, shaped around your sense of home and the way you want to live in the hills.",
    considerations: ["Privacy & surroundings", "Everyday access", "Your way of living"],
  },
  {
    id: "curated-estate-plots",
    title: "Curated Estate Plots",
    line: "Space to build with intention.",
    image: "/images/coorg/conceptual/curated-estate-plots.webp",
    imageAlt: "Conceptual landscape illustration of estate plots and curving roads among green hills",
    conceptual: true,
    introduction: "Leave room for your own imagination.",
    description:
      "Start with the setting, then imagine what belongs there. From the slope of the ground to the trees you would keep, the right conversation begins long before a drawing becomes a home.",
    considerations: ["Terrain & orientation", "Infrastructure to confirm", "Design aspirations"],
  },
  {
    id: "forest-mountain-land",
    title: "Forest & Mountain Land",
    line: "Closer to the landscape.",
    image: "/images/coorg/conceptual/forest-mountain-land.webp",
    imageAlt: "Conceptual view of a forest-edge meadow and layered mountain ridges under low clouds",
    conceptual: true,
    introduction: "More horizon. A little less hurry.",
    description:
      "For those drawn to the shape of a ridge, a quiet tree line, or the changing light across a valley. Share the landscape you have in mind, so your search can begin with a sense of place.",
    considerations: ["Landscape & setting", "Access & boundaries", "Long-term stewardship"],
  },
  {
    id: "countryside-homes",
    title: "Countryside Homes",
    line: "A slower way to come home.",
    image: "/images/coorg/conceptual/countryside-homes.webp",
    imageAlt: "Conceptual Kodagu countryside home with a tiled roof and shaded veranda among coffee plants",
    conceptual: true,
    introduction: "A home with room for the everyday.",
    description:
      "A familiar path to the veranda. Coffee in the garden. A home shaped by ordinary moments in an extraordinary setting. Imagine the everyday life you would like to make in the countryside.",
    considerations: ["Character & surroundings", "Everyday comforts", "Space for your own rhythm"],
  },
];
