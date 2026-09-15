export type ProjectLifecycle = "completed" | "ongoing";
export type ProjectAvailability = "available" | "sold-out" | null;

export type ProjectPrice = {
  amount: number;
  basis: "sq-ft";
  status: "user-placeholder" | "confirmed-source";
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  factualCaptureConfirmed: false;
} & ({
  sourceUrl: string;
  association: "confirmed-source";
  mediaKind: "source-marketing";
} | {
  sourceUrl: null;
  association: "conceptual";
  mediaKind: "ai-concept";
});

export type ProjectFact = { label: string; value: string };

// No monetary figures are modelled here. Rates, totals and returns are settled
// in writing on enquiry so nothing on the public site can be read as an offer.
export type ProjectInvestment = {
  primaryHeading: string;
  primary: string;
  delivered: ProjectFact[];
  optional: string;
  secondaryHeading: string;
  secondary: string[];
  disclaimer: string;
};

export type EstateProject = {
  id: string;
  name: string;
  location: string | null;
  category: string;
  summary: string;
  description: string[];
  status: ProjectLifecycle;
  availability: ProjectAvailability;
  availabilitySource?: "user-confirmed" | null;
  areaLabel: string | null;
  features: string[];
  featuresHeading?: string;
  highlights?: ProjectFact[];
  facilities?: string[];
  nearbyPlaces?: ProjectFact[];
  investment?: ProjectInvestment;
  images: ProjectImage[];
  sourceUrl: string | null;
  price: ProjectPrice | null;
  publicReady: boolean;
  contentRole: "source-portfolio" | "user-provided-project";
  verificationStatus: "confirmed-source" | "partial";
  coordinates: { lat: number; lng: number } | null;
  legalStatus: string | null;
  publicContact: string | null;
  sourceNotes?: string[];
};

export const STAR_INFRA_SOURCE =
  "https://www.stargroups.info/companies/star-infra-developers";

function sourceImage(name: string, alt: string): ProjectImage {
  return {
    src: `/images/coorg/star-infra/${name}.webp`,
    alt,
    sourceUrl: `https://www.stargroups.info/starinfradeveloper/completed/${name}.png`,
    width: 1448,
    height: 1086,
    association: "confirmed-source",
    mediaKind: "source-marketing",
    factualCaptureConfirmed: false,
  };
}

// The user authorized a portfolio adaptation of the linked developer website.
// Completed is a source lifecycle label. The user separately confirmed Sold out
// for all three completed Coorg estates on 2026-09-11.
// These portfolio records are not approved property sale listings. Missing price,
// title, survey and availability information remains null until it is supplied.
// Imported media is presented as source marketing imagery, not verified site photos.
export const completedProjects: EstateProject[] = [
  {
    id: "star-woods-estate",
    name: "Star Woods Estate",
    location: "Madikeri, Coorg",
    category: "Premium Farmland Development",
    summary: "Room to grow. A place to return to.",
    description: [
      "A farmland community in Coorg with agricultural parcels and internal access roads, offering a quiet setting for weekend living and long-term land ownership.",
    ],
    status: "completed",
    availability: "sold-out",
    availabilitySource: "user-confirmed",
    areaLabel: null,
    features: ["Agricultural parcels", "Internal access roads", "Nature-focused setting"],
    highlights: [
      { label: "Development", value: "Agricultural parcels" },
      { label: "Location", value: "Madikeri, Coorg" },
      { label: "Internal roads", value: "Paved motorable access" },
      { label: "Setting", value: "Misty hill slopes" },
      { label: "Environment", value: "Lush native trees" },
      { label: "Status", value: "Completed & handed over" },
    ],
    images: [
      sourceImage("star-woods-estate-3", "Small buildings beside a winding road on a misty green hillside"),
      sourceImage("star-woods-estate-2", "A stone cottage with a tiled roof and planted surroundings at sunset"),
      sourceImage("star-woods-estate-1", "A landscaped road lined with trees and contemporary houses"),
    ],
    sourceUrl: STAR_INFRA_SOURCE,
    price: null,
    publicReady: false,
    contentRole: "source-portfolio",
    verificationStatus: "confirmed-source",
    coordinates: null,
    legalStatus: null,
    publicContact: null,
  },
  {
    id: "star-coffee-county",
    name: "Star Coffee County",
    location: "Madikeri, Coorg",
    category: "Managed Farmland",
    summary: "A quieter life, rooted in the land.",
    description: [
      "Managed farmland in Madikeri with plantation surroundings, separate land parcels and internal paths, designed around private farm retreats.",
    ],
    status: "completed",
    availability: "sold-out",
    availabilitySource: "user-confirmed",
    areaLabel: null,
    features: ["Individual farmland parcels", "Plantation surroundings", "Internal pathways"],
    highlights: [
      { label: "Development", value: "Managed farmland" },
      { label: "Location", value: "Madikeri, Coorg" },
      { label: "Crops", value: "Working coffee plantation" },
      { label: "Internal paths", value: "Connecting trail network" },
      { label: "Terrain", value: "Undulating coffee slopes" },
      { label: "Status", value: "Completed & handed over" },
    ],
    images: [
      sourceImage("star-coffee-county-3", "Planted hillsides, winding tracks and scattered buildings"),
      sourceImage("star-coffee-county-1", "An aerial view of green parcels divided by a road network"),
      sourceImage("star-coffee-county-2", "A multistorey building with balconies and street trees"),
    ],
    sourceUrl: STAR_INFRA_SOURCE,
    price: null,
    publicReady: false,
    contentRole: "source-portfolio",
    verificationStatus: "confirmed-source",
    coordinates: null,
    legalStatus: null,
    publicContact: null,
  },
  {
    id: "star-misty-acres",
    name: "Star Misty Acres",
    location: "Madikeri, Coorg",
    category: "Farmland & Weekend Retreats",
    summary: "Where the weekend finds its own rhythm.",
    description: [
      "A farmland and weekend-retreat development in Madikeri, presented around Coorg’s greenery, mist and plantation landscape for people seeking private land and time in nature.",
    ],
    status: "completed",
    availability: "sold-out",
    availabilitySource: "user-confirmed",
    areaLabel: null,
    features: ["Farmland development", "Plantation landscape", "Weekend retreat setting"],
    highlights: [
      { label: "Development", value: "Farmland & retreats" },
      { label: "Location", value: "Madikeri, Coorg" },
      { label: "Water feature", value: "Natural stream & pond" },
      { label: "Architecture", value: "Stone & timber villas" },
      { label: "Setting", value: "Panoramic valley vistas" },
      { label: "Status", value: "Completed & handed over" },
    ],
    images: [
      sourceImage("star-misty-acres-1", "A stone and timber villa beside a landscaped stream and misty hills"),
      sourceImage("star-misty-acres-2", "A two-storey villa, lawn and stream with wooded hills behind"),
      sourceImage("star-misty-acres-3", "A lit villa overlooking a pond at dusk"),
    ],
    sourceUrl: STAR_INFRA_SOURCE,
    price: null,
    publicReady: false,
    contentRole: "source-portfolio",
    verificationStatus: "confirmed-source",
    coordinates: null,
    legalStatus: null,
    publicContact: null,
  },
];

// Star Garden replaces the former ongoing project at the user's request.
// Project details and projections were supplied by the user on 2026-09-11.
// The concept image is illustrative; title, map and exact sale terms remain TBC.
export const ongoingProjects: EstateProject[] = [
  {
    id: "star-garden",
    name: "Star Garden",
    location: "Madikeri, Coorg",
    category: "Premium Coffee Estate Plots",
    summary: "Thirty plots cut into ten acres of working coffee.",
    description: [
      "Ten acres of coffee at Madikeri, divided into thirty plots. Nine of them meet the stream that runs down through the property.",
      "The plantation stays. Plots are cut into a working estate rather than a cleared site, so the ground already carries shade trees, coffee and a season of its own before anything is built on it.",
    ],
    status: "ongoing",
    availability: null,
    areaLabel: "10 acres",
    highlights: [
      { label: "Total area", value: "10 acres" },
      { label: "Total plots", value: "30 exclusive plots" },
      { label: "Stream-attached plots", value: "9 premium plots" },
      { label: "Plots sold", value: "12 plots" },
      { label: "Internal roads", value: "Developed with CC roads" },
      { label: "Financing / LAP", value: "LAP loan facility available" },
    ],
    facilities: [
      "All internal roads developed with CC roads",
      "LAP loan facility available, subject to lender eligibility and approval",
    ],
    featuresHeading: "Premium Amenities",
    features: [
      "5,500 sq. ft. clubhouse",
      "Community kitchen",
      "Dining hall",
      "Swimming pool",
      "Dense plantation",
      "Natural coffee estate surroundings",
    ],
    nearbyPlaces: [
      { label: "NH 274", value: "700 metres" },
      { label: "Madikeri", value: "9 km" },
      { label: "Mysore", value: "110 km" },
      { label: "Bengaluru", value: "220 km" },
    ],
    investment: {
      primaryHeading: "Build a villa, and let it host",
      primary: "The principal income route at Star Garden is to build a 4BHK villa on your plot and place it on a vacation rental platform such as Airbnb. The estate setting, the clubhouse and the plantation around it are what a guest comes for.",
      delivered: [
        { label: "Design", value: "Architecture and layout for the villa, worked through with you." },
        { label: "Construction", value: "The build managed end to end, through to handover." },
        { label: "Documentation", value: "Paperwork handled alongside the build." },
      ],
      optional: "The villa is optional. A plot can be held as land alone, with coffee cultivation continuing on it.",
      secondaryHeading: "Alongside the villa",
      secondary: [
        "Coffee grown on the plot, following the estate’s own harvest cycle.",
        "A plot held for the long term inside a managed, maintained estate.",
      ],
      disclaimer: "Income and returns described here are possible outcomes, not guarantees. Actual results depend on market conditions, operating costs, approvals, construction expenses, occupancy and revenue. No rates or figures are published on this site; anything discussed individually is indicative and confirmed only in writing.",
    },
    images: [
      {
        src: "/images/coorg/conceptual/star-garden-vision.webp",
        alt: "Concept visualization of Star Garden coffee estate, a stream, clubhouse and misty Coorg hills",
        sourceUrl: null,
        width: 1536,
        height: 1024,
        association: "conceptual",
        mediaKind: "ai-concept",
        factualCaptureConfirmed: false,
      },
    ],
    sourceUrl: null,
    price: null,
    publicReady: false,
    contentRole: "user-provided-project",
    verificationStatus: "partial",
    coordinates: null,
    legalStatus: null,
    publicContact: null,
    sourceNotes: [
      "Project copy, counts, facilities, amenities and distances were supplied by the user; no independent site or approval documents are supplied.",
      "Project visual representation; not an approved layout.",
      "The 12 sold plots are a user-supplied snapshot; current availability is on enquiry.",
      "Monetary figures were deliberately removed from the public site so nothing published can be treated as a quotation or as legal proof. Land, villa-construction and coffee-income figures exist in the original client notes only.",
      "The villa is presented as an optional addition, not a condition of purchase. Income and ROI remain conditional and are not guaranteed.",
    ],
  },
];

export type ManagedFarmlandsPreview = {
  id: string;
  contentRole: "programme-preview";
  name: string;
  projectName: string | null;
  projectStatus: ProjectLifecycle | null;
  availability: ProjectAvailability;
  location: string | null;
  areaLabel: string | null;
  pricingNote: string;
  publicReady: false;
  sourceProject: string | null;
};

// The programme preview carries no rate. Pricing is deliberately absent from the
// public site so no published figure can be treated as a quotation.
export const managedFarmlandsPreview: ManagedFarmlandsPreview = {
  id: "managed-farmlands-preview",
  contentRole: "programme-preview",
  name: "Managed Farmlands",
  projectName: null,
  projectStatus: null,
  availability: null,
  location: null,
  areaLabel: null,
  pricingNote: "Plot rates are shared privately and confirmed in writing, project by project.",
  publicReady: false,
  sourceProject: null,
};

export const estateProjects = completedProjects;
export const farmProjects = ongoingProjects;
export const managedFarmlandProjects = ongoingProjects;
export const indexedManagedFarmlandProjects = ongoingProjects;
