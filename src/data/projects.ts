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
  sourceUrl: string;
  width: number;
  height: number;
  association: "confirmed-source";
  mediaKind: "source-marketing";
  factualCaptureConfirmed: false;
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
  images: ProjectImage[];
  sourceUrl: string;
  price: ProjectPrice | null;
  publicReady: boolean;
  contentRole: "source-portfolio";
  verificationStatus: "confirmed-source";
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

// The user explicitly expanded the requested ongoing portfolio to the source's
// ongoing project. Preserve its Bengaluru location and residential classification:
// this is not a Coorg estate or a managed-farmlands development.
export const ongoingProjects: EstateProject[] = [
  {
    id: "arkha-sanctuary",
    name: "Arkha Sanctuary",
    location: "BHCS Layout, Banashankari VI Stage, Bengaluru",
    category: "2 & 3 BHK Residential Apartments",
    summary: "A new address, taking shape.",
    description: [
      "An ongoing residential development in Bengaluru with 2 and 3 BHK homes, planned vastu-compliant layouts without common walls, and leisure and landscaped spaces.",
      "Proposed amenities include swimming pools, a gym, gardens, a jogging track and security.",
    ],
    status: "ongoing",
    availability: null,
    areaLabel: null,
    features: [
      "2 & 3 BHK homes",
      "No common walls · planned",
      "Vastu-compliant layouts · planned",
      "Swimming and toddlers’ pools · proposed",
      "Indoor and outdoor gym · proposed",
      "Landscaped garden and jogging track · proposed",
      "Children’s play area and shuttle court · proposed",
      "Multipurpose hall · proposed",
      "Rainwater harvesting and STP · proposed",
      "Water supply and power backup · proposed",
      "Passenger lift and parking · proposed",
      "CCTV and 24-hour security · proposed",
    ],
    images: [
      {
        src: "/images/coorg/star-infra/arkha-sanctuary-exterior.webp",
        alt: "Arkha Sanctuary apartment-building rendering and project branding",
        sourceUrl: "https://www.stargroups.info/starinfradeveloper/1.webp",
        width: 3508,
        height: 2480,
        association: "confirmed-source",
        mediaKind: "source-marketing",
        factualCaptureConfirmed: false,
      },
      {
        src: "/images/coorg/star-infra/arkha-sanctuary-floor-plan.webp",
        alt: "Arkha Sanctuary illustrative typical floor plan showing apartment layouts and proposed outdoor spaces",
        sourceUrl: "https://www.stargroups.info/starinfradeveloper/2.webp",
        width: 3508,
        height: 2480,
        association: "confirmed-source",
        mediaKind: "source-marketing",
        factualCaptureConfirmed: false,
      },
      {
        src: "/images/coorg/star-infra/arkha-sanctuary-amenities.webp",
        alt: "Arkha Sanctuary proposed amenities, apartment cutaways and a pool courtyard",
        sourceUrl: "https://www.stargroups.info/starinfradeveloper/arkha-sanctuary-amenities.webp",
        width: 3508,
        height: 2480,
        association: "confirmed-source",
        mediaKind: "source-marketing",
        factualCaptureConfirmed: false,
      },
    ],
    sourceUrl: STAR_INFRA_SOURCE,
    price: null,
    publicReady: false,
    contentRole: "source-portfolio",
    verificationStatus: "confirmed-source",
    coordinates: null,
    legalStatus: null,
    publicContact: null,
    sourceNotes: [
      "The website calls the project BBMP-approved; the cover graphic also claims CC and OC. No authoritative approval documents are supplied, so legalStatus remains null.",
      "The source brochure describes itself as conceptual, not a legal offering. Marketing renders are not evidence of completed amenities or approved plans.",
      "The supplied website identifies one ongoing project. Group-wide counts are not a named ongoing inventory feed.",
      "The user requested the temporary starting price only in the hero; no rate is assigned to this project.",
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

// No ongoing Coorg project is named by the supplied website. Keep this as a
// programme preview rather than inventing an active project, inventory or location.
// The requested rate is a temporary user-supplied display value, not a source quote.
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
