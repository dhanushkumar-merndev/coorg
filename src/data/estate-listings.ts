import "server-only";

export type EstatePhoto = {
  src: string;
  alt: string;
  caption: string;
  association: "confirmed" | "probable";
};

// Public editorial profiles requested by the user. Only non-financial source
// facts are selected here; the original sale/revenue records stay server-only.
export type EstateListing = {
  id: string;
  name: string;
  areaLabel: string | null;
  areaNote: string | null;
  location: string | null;
  category: string;
  summary: string;
  description: string[];
  facts: { label: string; value: string }[];
  photos: EstatePhoto[];
  source: string;
  availability: null;
  legalStatus: null;
};

const slnPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/sln/${file}.webp`, alt, caption, association: "confirmed" });
const villaPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/villa/${file}.webp`, alt, caption, association: "probable" });
const source = "Client-supplied Coorg property notes";
const unknown = { availability: null, legalStatus: null };

export const estateListings: EstateListing[] = [
  {
    ...unknown, id: "madikeri-estate", name: "Madikeri Estate", areaLabel: "79.86 acres",
    areaNote: null,
    location: "Garwale, Madhapur, Coorg", category: "Plantation estate",
    summary: "A high-altitude plantation with a diverse growing landscape.",
    description: ["Set in the hills of Garwale, Madhapur, this 79.86-acre estate brings together avocado, litchi, robusta coffee and interplanted arecanut.", "Netafim irrigation and fertigation, worker accommodation, and developed roads and pathways support the growing landscape."],
    facts: [
      { label: "Altitude", value: "Over 3,900 ft" },
      { label: "Avocado", value: "50 acres · 3,800 trees" },
      { label: "Litchi", value: "10 acres" },
      { label: "Robusta coffee", value: "10 acres" },
      { label: "Arecanut", value: "15 acres, interplanted · included within the estate" },
      { label: "Irrigation", value: "Netafim irrigation and fertigation" },
      { label: "Accommodation", value: "RCC quarters for 20 workers" },
      { label: "Access within the estate", value: "Developed roads and pathways" },
    ],
    photos: [
      slnPhoto("plantation", "Green plantation on a sloping hillside with tall trees", "The growing landscape"),
      slnPhoto("lychee", "Lychee fruit grown on the estate", "Lychee from the farm"),
      slnPhoto("avocado-b", "Avocado fruit on the estate", "The avocado crop"),
    ],
    source: "SLN Plantations, Madapur — original client-supplied PDF",
  },
  {
    ...unknown, id: "villa-pool-cluster", name: "Coorg Villa & Pool", areaLabel: "26 cents", areaNote: "Acreage for this villa is to be confirmed.",
    location: "Kodagu, Karnataka", category: "Villa photo collection",
    summary: "A poolside setting surrounded by trees.",
    description: ["A gated compound, a swimming pool, balconies and paved outdoor paths among trees in Kodagu.", "The indicated 26-cent acreage has not yet been confirmed against this exact villa. Enquire for the property details."],
    facts: [{ label: "Visible in the photographs", value: "Swimming pool, balconies and wooded surroundings" }, { label: "Arrival", value: "Gate and paved driveway pictured" }, { label: "Property details", value: "Exact accommodation and property classification on enquiry" }],
    photos: [villaPhoto("pool-cluster", "Swimming pool beside a two-storey villa and trees", "By the pool"), villaPhoto("driveway", "Paved driveway beside the villa buildings", "The villa driveway"), villaPhoto("gate", "Entrance gate and trees beside the villa", "Arrival at the villa")], source,
  },
  {
    ...unknown, id: "12-acre-villa", name: "12-acre Villa Property", areaLabel: "12 acres", areaNote: null, location: null, category: "Villa property",
    summary: "A villa property with twelve acres to explore.",
    description: ["Explore a 12-acre villa property. Enquire to discuss its location, building specifications and site details."],
    facts: [{ label: "Property type", value: "Villa property" }], photos: [], source,
  },
  {
    ...unknown, id: "20-acre-basavanahalli", name: "Basavanahalli Land", areaLabel: "20 acres", areaNote: null, location: "Basavanahalli, Karnataka", category: "Land profile",
    summary: "Twenty acres in Basavanahalli, Karnataka.",
    description: ["A 20-acre property in Basavanahalli, Karnataka 571234. Enquire to discuss access, infrastructure and the site in more detail."],
    facts: [{ label: "Address", value: "CWWG+94Q, Basavanahalli, Karnataka 571234" }], photos: [], source,
  },
  {
    ...unknown, id: "23-50-acre-lead", name: "23.50-acre Land", areaLabel: "23.50 acres", areaNote: null, location: null, category: "Land profile",
    summary: "An acreage-led introduction to a 23.50-acre property.",
    description: ["A 23.50-acre property to explore in more detail. Contact us to discuss the exact location, land use and site particulars."], facts: [], photos: [], source,
  },
  {
    ...unknown, id: "23-acre-lead", name: "23-acre Land", areaLabel: "23 acres", areaNote: null, location: null, category: "Land profile",
    summary: "Twenty-three acres, with room to consider what comes next.",
    description: ["Explore a 23-acre land profile. Enquire to discuss the location, property type and infrastructure."], facts: [], photos: [], source,
  },
  {
    ...unknown, id: "6-acre-kisan-jv", name: "Kisan JV Land", areaLabel: "6 acres", areaNote: null, location: null, category: "Land profile",
    summary: "A six-acre property with possibilities to discuss.",
    description: ["Explore six acres at Kisan JV. The proposed arrangement, exact location and property specifications can be discussed individually."], facts: [{ label: "Property reference", value: "Kisan JV" }], photos: [], source,
  },
  {
    ...unknown, id: "abbelon-estates", name: "ABBELON Estates", areaLabel: null, areaNote: null, location: null, category: "Residential layout",
    summary: "A residential layout, ready for a closer conversation.",
    description: ["Discover ABBELON Estates, a premium residential layout. Enquire to discuss acreage, location and current availability.", "Site details and photographs can be discussed on enquiry."], facts: [{ label: "Project description", value: "Premium Residential Layout" }], photos: [], source: "Client-supplied ABBELON Estates branded material",
  },
];

export function getEstateListing(id: string) { return estateListings.find((estate) => estate.id === id); }
