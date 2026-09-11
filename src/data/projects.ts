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

export type ProjectInvestment = {
  coffeeIncomeProjection: string;
  villaProposal: string;
  structure: ProjectFact[];
  roiProjection: string;
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
    summary: "Premium Coffee Estate Plots at Madikeri",
    description: [
      "Star Garden is a 10-acre premium coffee estate development comprising 30 exclusive plots, thoughtfully planned for peaceful living, nature-based investment, and long-term value appreciation.",
    ],
    status: "ongoing",
    availability: null,
    areaLabel: "10 acres",
    highlights: [
      { label: "Total area", value: "10 acres" },
      { label: "Total plots", value: "30 exclusive plots" },
      { label: "Premium stream-attached plots", value: "9 plots" },
      { label: "Plots sold", value: "12 plots" },
    ],
    facilities: [
      "All internal roads developed with CC roads",
      "Partition registration facility available",
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
      coffeeIncomeProjection: "The coffee estate is expected to generate approximately ₹50,000 per annum through coffee cultivation, subject to production and market conditions.",
      villaProposal: "Additional income potential can be created by constructing a 4BHK villa through a reputed construction partner. The proposed investment structure is:",
      structure: [
        { label: "Land investment", value: "₹1 crore" },
        { label: "Villa construction investment", value: "₹1 crore" },
      ],
      roiProjection: "Expected ROI timeline: Approximately 18 months, subject to occupancy, rental income, market conditions, and project performance.",
      disclaimer: "All income and ROI figures are projections and are not guaranteed. Final returns may vary based on market conditions, operating costs, approvals, construction expenses, and actual revenue.",
    },
    images: [
      {
        src: "/images/coorg/conceptual/star-garden.webp",
        alt: "AI-generated concept illustration of a green coffee estate with a stream and misty Coorg hills",
        sourceUrl: null,
        width: 1672,
        height: 941,
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
      "The generated image is conceptual artwork, not a site photograph or an approved layout.",
      "The 12 sold plots are a user-supplied snapshot; current availability is on enquiry.",
      "The ₹1 crore land and ₹1 crore villa figures belong to the proposed investment structure, not a confirmed per-plot price or price basis.",
      "The annual coffee-income figure has no supplied per-plot or net/gross basis. Do not infer one. All income and ROI projections remain conditional and are not guaranteed.",
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
  price: ProjectPrice;
  publicReady: false;
  sourceProject: string | null;
};

// This programme preview keeps the temporary user-supplied display rate separate
// from the Star Garden investment proposal and individual project sale terms.
export const managedFarmlandsPreview: ManagedFarmlandsPreview = {
  id: "managed-farmlands-preview",
  contentRole: "programme-preview",
  name: "Managed Farmlands",
  projectName: null,
  projectStatus: null,
  availability: null,
  location: null,
  areaLabel: null,
  price: { amount: 999, basis: "sq-ft", status: "user-placeholder" },
  publicReady: false,
  sourceProject: null,
};

export const estateProjects = completedProjects;
export const farmProjects = ongoingProjects;
export const managedFarmlandProjects = [...ongoingProjects, ...completedProjects];
