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
    ...unknown, id: "sln-plantations", name: "SLN Plantations", areaLabel: "79.86 acres",
    areaNote: "The source PDF describes the total as 80 (79.86) acres.",
    location: "Garwale, Madhapur, Coorg", category: "Plantation estate",
    summary: "A high-altitude plantation with a diverse growing landscape.",
    description: ["The supplied SLN Plantations brochure describes an estate in the hills of Garwale, Madhapur, with avocado, litchi, robusta coffee and interplanted arecanut.", "Its source-listed infrastructure includes Netafim irrigation and fertigation, worker accommodation, and developed roads and pathways. The photographs here come from the original SLN brochure."],
    facts: [
      { label: "Altitude", value: "Over 3,900 ft · source stated" },
      { label: "Avocado", value: "50 acres · 3,800 trees in the brochure" },
      { label: "Litchi", value: "10 acres" },
      { label: "Robusta coffee", value: "10 acres" },
      { label: "Arecanut", value: "15 acres, interplanted · included within the estate" },
      { label: "Irrigation", value: "Netafim irrigation and fertigation" },
      { label: "Accommodation", value: "RCC quarters described for 20 workers" },
      { label: "Access within the estate", value: "Developed roads and pathways · source description" },
    ],
    photos: [
      slnPhoto("plantation", "Green plantation on a sloping hillside with tall trees, from the SLN source PDF", "The SLN plantation · photograph from the supplied brochure"),
      slnPhoto("lychee", "Lychee fruit pictured in the SLN Plantations brochure", "Lychee from the farm · SLN brochure"),
      slnPhoto("avocado-a", "Avocados pictured in the SLN Plantations brochure", "Avocado from the farm · SLN brochure"),
      slnPhoto("avocado-b", "Avocado fruit in the second farm photograph from the SLN brochure", "The avocado crop · SLN brochure"),
    ],
    source: "SLN Plantations, Madapur — original client-supplied PDF",
  },
  {
    ...unknown, id: "villa-pool-cluster", name: "Coorg Villa & Pool", areaLabel: "26 cents", areaNote: "26 cents appears in the accompanying notes; its association with this photographed villa is yet to be confirmed.",
    location: "Kodagu, Karnataka · photo location stamp", category: "Villa photo collection",
    summary: "A poolside setting surrounded by trees.",
    description: ["The supplied photographs show a gated compound, a swimming pool, balconies and paved outdoor paths among trees in Kodagu.", "The accompanying notes describe a 26-cent property. That acreage has not yet been confirmed against this exact villa; enquire for the matched property details."],
    facts: [{ label: "Visible in the photographs", value: "Swimming pool, balconies and wooded surroundings" }, { label: "Arrival", value: "Gate and paved driveway pictured" }, { label: "Property details", value: "Exact accommodation and property classification on enquiry" }],
    photos: [villaPhoto("pool-cluster", "Swimming pool beside a two-storey villa and trees", "Supplied villa photograph · exact 26-cent property association unconfirmed"), villaPhoto("driveway", "Paved driveway beside buildings in the supplied villa photo collection", "The villa driveway · supplied photo collection"), villaPhoto("gate", "Entrance gate and trees in the supplied villa photo collection", "Arrival at the villa · supplied photo collection")], source,
  },
  {
    ...unknown, id: "12-acre-villa", name: "12-acre Villa Property", areaLabel: "12 acres", areaNote: null, location: null, category: "Villa property",
    summary: "Twelve acres, described as a villa property in the supplied notes.",
    description: ["The source identifies a 12-acre villa property. Its location, building specifications and associated photographs are not supplied. Enquire to explore the available property details."],
    facts: [{ label: "Property type", value: "Villa property · source wording" }], photos: [], source,
  },
  {
    ...unknown, id: "20-acre-basavanahalli", name: "Basavanahalli Land", areaLabel: "20 acres", areaNote: null, location: "Basavanahalli, Karnataka", category: "Land profile",
    summary: "Twenty acres in Basavanahalli, with a location supplied in the property notes.",
    description: ["The supplied notes identify a 20-acre property in Basavanahalli, Karnataka 571234. Property photographs, access and infrastructure details are available for discussion on enquiry."],
    facts: [{ label: "Source address", value: "CWWG+94Q, Basavanahalli, Karnataka 571234" }], photos: [], source,
  },
  {
    ...unknown, id: "23-50-acre-lead", name: "23.50-acre Land", areaLabel: "23.50 acres", areaNote: null, location: null, category: "Land profile",
    summary: "An acreage-led introduction to a 23.50-acre property.",
    description: ["The supplied notes record 23.50 acres. The exact location, land use and property photographs have not been established; enquire for further details."], facts: [], photos: [], source,
  },
  {
    ...unknown, id: "23-acre-lead", name: "23-acre Land", areaLabel: "23 acres", areaNote: null, location: null, category: "Land profile",
    summary: "Twenty-three acres recorded in the supplied property collection.",
    description: ["The source records a 23-acre property with a location reference. Its property type, infrastructure and matched photographs are not specified. Enquire to discuss the site details."], facts: [], photos: [], source,
  },
  {
    ...unknown, id: "6-acre-kisan-jv", name: "Kisan JV Land", areaLabel: "6 acres", areaNote: null, location: null, category: "Land profile",
    summary: "A six-acre property recorded under the name Kisan JV.",
    description: ["The notes identify six acres under the wording Kisan JV. The proposed arrangement, exact location and property specifications need to be discussed individually."], facts: [{ label: "Source reference", value: "Kisan JV" }], photos: [], source,
  },
  {
    ...unknown, id: "abbelon-estates", name: "ABBELON Estates", areaLabel: null, areaNote: null, location: null, category: "Residential layout",
    summary: "A residential layout introduced in the supplied project material.",
    description: ["The branded ABBELON Estates material describes a premium residential layout. Acreage, exact location and current availability are available on enquiry.", "The supplied visuals are illustrative layout renders. Site photographs have not been supplied for this profile."], facts: [{ label: "Project description", value: "Premium Residential Layout · marketing wording" }], photos: [], source: "Client-supplied ABBELON Estates branded material",
  },
];

export function getEstateListing(id: string) { return estateListings.find((estate) => estate.id === id); }
