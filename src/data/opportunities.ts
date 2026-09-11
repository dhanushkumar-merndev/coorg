import "server-only";

export type VerificationStatus = "confirmed-source" | "partial" | "tbc";

export type OpportunityMedia = {
  src: string;
  alt: string;
  association: "confirmed" | "probable" | "generic";
  conceptual: boolean;
  sourcePath: string;
};

export type Opportunity = {
  id: string;
  name: string;
  areaLabel: string | null;
  priceLabel: string | null;
  priceBasisConfirmed: boolean;
  locationLabel: string | null;
  coordinates: { lat: number; lng: number; approximate: boolean } | null;
  typeLabel: string | null;
  legalStatus: string | null;
  publicContact: string | null;
  verificationStatus: VerificationStatus;
  publicReady: boolean;
  media: OpportunityMedia[];
  sourceNotes: string[];
  cautions: string[];
};

// Internal source records, never a feed of approved public listings. Keep this
// module behind the server boundary; publication requires an explicit review.
export const opportunities: Opportunity[] = [
  {
    id: "villa-pool-cluster",
    name: "Villa / pool cluster",
    areaLabel: "26 cents (source note; association unconfirmed)",
    priceLabel: "₹4.5 crore (source wording; association unconfirmed)",
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: "Villa / pool media cluster",
    legalStatus: null,
    publicContact: null,
    verificationStatus: "partial",
    publicReady: false,
    media: [{
      src: "/images/coorg/supplied/villa/pool-cluster.webp",
      alt: "Swimming pool beside a two-storey building and trees, with a location stamp in the supplied image",
      association: "probable",
      conceptual: false,
      sourcePath: "doc/03_ASSETS/01_VILLA_26_CENT_PROBABLE/villa_02_pool_main.jpg",
    }],
    sourceNotes: [
      "Notes list 10 Queen beds, 1 King bed and 10 extra Single beds; room distribution totals 11 main beds.",
      "Media stamps include 12.445366, 75.877754 and 12.445074, 75.877756. Exact listing location is unconfirmed.",
    ],
    cautions: [
      "Probable media association only. Confirm that the area, price and bed notes describe this exact property.",
      "Guest capacity and exact classification are not established.",
      "Identity, map, legal wording and public contact require confirmation.",
    ],
  },
  {
    id: "raw-50-caree",
    name: "“50 caree” lead",
    areaLabel: "50 caree (verbatim; unit unresolved)",
    priceLabel: "₹55 lakh (basis unresolved)",
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: null,
    legalStatus: null,
    publicContact: null,
    verificationStatus: "tbc",
    publicReady: false,
    media: [],
    sourceNotes: ["Raw wording: 50 caree / ₹55 lakh."],
    cautions: ["Do not normalize the area unit or interpret the price as a per-acre rate.", "Identity, location, type, media, legal wording and public contact are not supplied."],
  },
  {
    id: "12-acre-villa",
    name: "12-acre villa property lead",
    areaLabel: "12 acres",
    priceLabel: null,
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: "Villa property (source wording)",
    legalStatus: null,
    publicContact: null,
    verificationStatus: "tbc",
    publicReady: false,
    media: [],
    sourceNotes: ["Only area and the wording villa property were supplied."],
    cautions: ["Price, map, media, specifications, legal wording and public contact are not supplied."],
  },
  {
    id: "6-acre-kisan-jv",
    name: "6-acre Kisan JV lead",
    areaLabel: "6 acres",
    priceLabel: "₹2,000/sq ft (meaning and basis unresolved)",
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: null,
    legalStatus: null,
    publicContact: null,
    verificationStatus: "tbc",
    publicReady: false,
    media: [],
    sourceNotes: ["Raw notes: Kisan JV; 6,000 sq ft; ₹2,000/sq ft."],
    cautions: ["The meaning of Kisan JV, 6,000 sq ft and the rate is unresolved. Do not calculate a total value.", "Identity, location, media, property type, legal wording and public contact require confirmation."],
  },
  {
    id: "23-50-acre-lead",
    name: "23.50-acre lead",
    areaLabel: "23.50 acres",
    priceLabel: "₹60 lakh (basis unresolved)",
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: null,
    legalStatus: null,
    publicContact: null,
    verificationStatus: "tbc",
    publicReady: false,
    media: [],
    sourceNotes: ["An Instagram reference was supplied, but the property association is unconfirmed."],
    cautions: ["Price basis is unresolved; do not treat it as per acre.", "Do not associate the supplied reel with this lead without confirmation.", "Identity, map, media, type, legal wording and public contact require confirmation."],
  },
  {
    id: "23-acre-lead",
    name: "23-acre lead",
    areaLabel: "23 acres",
    priceLabel: "₹45 lakh (basis unresolved)",
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: { lat: 12.5529731, lng: 75.7950978, approximate: false },
    typeLabel: null,
    legalStatus: null,
    publicContact: null,
    verificationStatus: "partial",
    publicReady: false,
    media: [],
    sourceNotes: ["Coordinates are supplied source values, not independently surveyed boundaries."],
    cautions: ["₹45 lakh basis is unresolved; do not assume a per-acre rate.", "Identity, media, property type, legal wording and public contact require confirmation."],
  },
  {
    id: "20-acre-basavanahalli",
    name: "20-acre Basavanahalli lead",
    areaLabel: "20 acres",
    priceLabel: null,
    priceBasisConfirmed: false,
    locationLabel: "CWWG+94Q, Basavanahalli, Karnataka 571234, India",
    coordinates: { lat: 12.445624652349654, lng: 75.92473067343235, approximate: true },
    typeLabel: null,
    legalStatus: null,
    publicContact: null,
    verificationStatus: "partial",
    publicReady: false,
    media: [],
    sourceNotes: ["The supplied contact belongs to this lead alone and is intentionally not used as the site's contact."],
    cautions: ["Coordinate is approximate.", "Price, price basis, media, type, legal wording and approved public contact are unconfirmed."],
  },
  {
    id: "sln-plantations",
    name: "SLN Plantations",
    areaLabel: "80 (79.86) acres, as stated in the source PDF",
    priceLabel: null,
    priceBasisConfirmed: false,
    locationLabel: "Garwale, Madhapur, Coorg, Karnataka (source wording)",
    coordinates: null,
    typeLabel: "Plantation estate",
    legalStatus: null,
    publicContact: null,
    verificationStatus: "confirmed-source",
    publicReady: false,
    media: [{
      src: "/images/coorg/supplied/sln/plantation.webp",
      alt: "Green plantation on a sloping hillside with tall trees, from the SLN source PDF",
      association: "confirmed",
      conceptual: false,
      sourcePath: "doc/03_ASSETS/02_SLN_PLANTATIONS_CONFIRMED/sln_02_estate_plantation.jpg",
    }],
    sourceNotes: [
      "Original source: doc/01_SOURCE_DOCUMENTS/COORG/SLN_Plantations_Madapur.pdf.",
      "Source states altitude over 3,900 ft and annual rainfall over 110 inches.",
      "Avocado: 50 acres, 3,800 trees, 3,000 yielding; source average 100 kg per plant.",
      "Litchi: 10 acres. Robusta coffee: 10 acres. Arecanut: 15 acres interplanted, over 15,000 trees. These crop areas must not be added into a new total area.",
      "Source describes Netafim irrigation/fertigation, RCC quarters for 20 workers and developed/tarred roads and pathways.",
      "The top point is marketed for a 5,000 sq ft estate bungalow; this is not a verified building permission.",
    ],
    cautions: [
      "Source association confirmed; property publication is pending price, price basis, map, legal wording and public contact.",
      "The PDF's revenue statements conflict. Current/projected revenue and ROI are withheld.",
    ],
  },
  {
    id: "abbelon-estates",
    name: "ABBELON Estates",
    areaLabel: null,
    priceLabel: null,
    priceBasisConfirmed: false,
    locationLabel: null,
    coordinates: null,
    typeLabel: "Premium Residential Layout (marketing wording)",
    legalStatus: null,
    publicContact: null,
    verificationStatus: "partial",
    publicReady: false,
    media: [{
      src: "/images/coorg/supplied/abbelon/marketing-layout.webp",
      alt: "Branded ABBELON Estates illustrative marketing layout showing plots, roads and landscaping",
      association: "confirmed",
      conceptual: true,
      sourcePath: "doc/03_ASSETS/03_ABBELON_ESTATES_CONFIRMED/abbelon_01_layout_day.jpg",
    }],
    sourceNotes: [
      "Branded graphics state 242 total sites: 17 and 156 in two size categories, 68 other sites, and 1 utility/other.",
      "Marketing graphics depict roads, landscaped/open areas, a water body, clubhouse, drainage, street lights and avenue plantation. These are not verified built amenities.",
    ],
    cautions: [
      "Illustrative marketing render only; this is not a sanctioned or authoritative legal plan.",
      "Graphic dimensions/units are inconsistent. Do not transcribe uncertain legal dimensions or approval numbers.",
      "Location, area, pricing, price basis, legal status and public contact are unconfirmed.",
    ],
  },
];

export const draftPreviewIds = ["sln-plantations", "abbelon-estates", "villa-pool-cluster"] as const;

export function getDraftPreviews(): Opportunity[] {
  if (process.env.NODE_ENV !== "development") return [];
  return draftPreviewIds.flatMap((id) => opportunities.filter((opportunity) => opportunity.id === id));
}
