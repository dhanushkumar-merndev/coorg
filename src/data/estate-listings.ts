import "server-only";

export type EstatePhoto = {
  src: string;
  alt: string;
  caption: string;
  association: "confirmed" | "probable" | "conceptual";
};

export type EstateAmenity = {
  title: string;
  description?: string;
  image: string;
  alt: string;
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
  highlights?: string[];
  features?: string[];
  amenitiesHeading?: string;
  amenities?: EstateAmenity[];
  description: string[];
  facts: { label: string; value: string }[];
  photos: EstatePhoto[];
  source: string;
  availability: null;
  legalStatus: null;
};

const slnPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/sln/${file}.webp`, alt, caption, association: "confirmed" });
const villaPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/villa/${file}.webp`, alt, caption, association: "probable" });
const estatePhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/estates/${file}.webp`, alt, caption, association: "conceptual" });
const genericPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/generic/${file}.webp`, alt, caption, association: "conceptual" });
const conceptualPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/conceptual/${file}.webp`, alt, caption, association: "conceptual" });
const abbelonPhoto = (file: string, alt: string, caption: string): EstatePhoto => ({ src: `/images/coorg/supplied/abbelon/${file}.webp`, alt, caption, association: "confirmed" });
const source = "Client-supplied Coorg property notes";
const unknown = { availability: null, legalStatus: null };

export const estateListings: EstateListing[] = [
  {
    ...unknown, id: "madikeri-estate", name: "Madikeri Estate", areaLabel: "79.86 acres",
    areaNote: null,
    location: "Garwale, Madhapur, Coorg", category: "Plantation estate",
    summary: "A high-altitude working plantation, four crops deep, above 3,900 feet.",
    highlights: ["79.86 Acres", "3,900+ ft Altitude", "Avocado & Lychee", "RCC Quarters", "Drip Irrigation", "Motorable Roads"],
    features: [
      "Fifty acres of avocado with 3,800 trees, alongside robusta coffee and litchi orchards.",
      "Netafim automated drip irrigation and fertigation system across all contours.",
      "RCC residential quarters providing comfortable on-site housing for twenty workers.",
      "Developed motorable internal roads and tractor pathways reaching every sector of the 79.86 acres.",
      "High-altitude setting above 3,900 ft with rich volcanic soil and natural spring reservoirs.",
    ],
    amenitiesHeading: "Estate Amenities & Infrastructure",
    amenities: [
      {
        title: "Avocado & Lychee Orchards",
        description: "Fifty acres of thriving avocado with 3,800 mature trees, plus ten acres of sweet litchi.",
        image: "/images/coorg/supplied/sln/avocado-a.webp",
        alt: "Avocado orchard at Madikeri Estate in Coorg",
      },
      {
        title: "Netafim Drip Irrigation",
        description: "Automated drip irrigation and fertigation system delivering uniform water across all contours.",
        image: "/images/coorg/amenities/estate-irrigation.webp",
        alt: "Automated drip irrigation reservoir and system in Coorg plantation",
      },
      {
        title: "Permanent RCC Quarters",
        description: "Substantial on-site residential quarters providing comfortable permanent housing for twenty staff.",
        image: "/images/coorg/amenities/estate-quarters.webp",
        alt: "Permanent residential staff quarters at Madikeri Estate",
      },
      {
        title: "Motorable Roadway Network",
        description: "Developed all-weather internal roads and tractor pathways connecting every sector of the parcel.",
        image: "/images/coorg/amenities/estate-roads.webp",
        alt: "Motorable internal estate road through Coorg plantation",
      },
    ],
    description: [
      "Above 3,900 feet at Garwale, Madhapur, this is a working agricultural estate rather than merely a view. The high-altitude microclimate brings heavy morning mist, cool temperatures, and steady rainfall, creating premier growing conditions for exotic horticulture and highland coffee.",
      "Fifty acres carry thriving avocado cultivation — some 3,800 mature trees — alongside ten acres of sweet litchi, ten acres of robusta coffee, and fifteen acres of interplanted arecanut. The multi-tiered canopy structure provides optimal shade, wind protection, and year-round agricultural yields.",
      "Comprehensive infrastructure supports the entire holding: an automated Netafim drip irrigation and fertigation system distributes water uniformly across all contours from dedicated natural reservoirs. Substantial RCC residential quarters comfortably house twenty permanent farm workers.",
      "Developed motorable roads and tractor pathways traverse the interior of the planting, ensuring every corner of the 79.86 acres is accessible, workable, and primed for ongoing commercial estate stewardship."
    ],
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
    location: "Kodagu, Karnataka", category: "Villa collection",
    summary: "A private poolside sanctuary set among established trees and greenery.",
    highlights: ["26 Cents", "Private Villa", "Swimming Pool", "Gated Grounds", "Paved Driveway", "Spring Water"],
    features: [
      "Two-storey luxury estate villa with private swimming pool and sun lounge terrace.",
      "Lush wooded surroundings with gated perimeter and mature silver oaks providing privacy.",
      "Paved private arrival driveway and stone pathways with ample vehicle parking.",
      "Natural spring water connections, dependable power access, and tranquil forest acoustics.",
    ],
    amenitiesHeading: "Villa Amenities & Features",
    amenities: [
      {
        title: "Private Swimming Pool & Terrace",
        description: "Generous tiled outdoor swimming pool with wide sun deck reflecting the surrounding forest canopy.",
        image: "/images/coorg/supplied/villa/pool-cluster.webp",
        alt: "Private swimming pool beside luxury estate villa in Coorg",
      },
      {
        title: "Two-Storey Estate Residence",
        description: "Contemporary residence with wide viewing balconies, shaded outdoor seating, and forest vistas.",
        image: "/images/coorg/supplied/villa/pool-overview.webp",
        alt: "Two-storey villa residence overlooking pool and grounds in Coorg",
      },
      {
        title: "Paved Arrival Driveway",
        description: "Stone-lined paved driveway guiding arrival through gated grounds with vehicle turnaround.",
        image: "/images/coorg/supplied/villa/driveway.webp",
        alt: "Paved private arrival driveway beside the villa",
      },
      {
        title: "Gated Perimeter & Wooded Canopy",
        description: "Private gated perimeter surrounded by mature tropical greenery and tall silver oaks.",
        image: "/images/coorg/supplied/villa/gate.webp",
        alt: "Entrance gate and trees beside the villa compound",
      },
    ],
    description: [
      "Nestled among mature tropical greenery and tall silver oaks in Kodagu, this property presents a private estate villa sanctuary centered around leisure, nature, and architectural elegance.",
      "The compound features a two-storey contemporary estate residence with wide viewing balconies, shaded outdoor seating, and an expansive tiled swimming pool reflecting the surrounding forest canopy.",
      "Paved private driveways and stone-lined pathways guide arrival through a secure gated perimeter, offering generous turnaround space and dedicated vehicle parking amidst flowering landscaped verges.",
      "Natural spring water connections, clean municipal power access, and serene environmental acoustics make this an exceptional private holiday getaway or high-end hospitality retreat."
    ],
    facts: [{ label: "Visible in the photographs", value: "Swimming pool, balconies and wooded surroundings" }, { label: "Arrival", value: "Gate and paved driveway pictured" }, { label: "Property details", value: "Exact accommodation and property classification on enquiry" }],
    photos: [villaPhoto("pool-cluster", "Swimming pool beside a two-storey villa and trees", "By the pool"), villaPhoto("driveway", "Paved driveway beside the villa buildings", "The villa driveway"), villaPhoto("gate", "Entrance gate and trees beside the villa", "Arrival at the villa")], source,
  },
  {
    ...unknown, id: "12-acre-villa", name: "Kodagu Villa Property", areaLabel: "12 acres", areaNote: null, location: "Madikeri, Kodagu", category: "Villa property",
    summary: "A private 12-acre coffee estate villa property with sweeping valley views.",
    highlights: ["12 Acres", "Private Estate Villa", "Arabica Coffee", "Private Road", "Perennial Springs", "Valley Vistas"],
    features: [
      "Heritage-styled estate villa with expansive verandah looking across misty slopes.",
      "Twelve acres of productive coffee plantation surrounded by silver oaks and pepper vines.",
    ],
    amenitiesHeading: "Property Features & Amenities",
    amenities: [
      {
        title: "Heritage Covered Verandah",
        description: "Covered stone verandah with terracotta-tiled roof capturing sweeping valley vistas and morning mist.",
        image: "/images/coorg/estates/12-acre-villa-verandah.webp",
        alt: "Covered stone verandah overlooking coffee slopes and mist",
      },
      {
        title: "Paved Private Scenic Driveway",
        description: "All-weather motorable driveway leading through gated entrance flanked by silver oaks.",
        image: "/images/coorg/estates/12-acre-villa-driveway.webp",
        alt: "Private paved driveway winding through coffee plantation",
      },
      {
        title: "Contiguous 12-Acre Coffee Holding",
        description: "Mature Arabica and Robusta bushes thriving under towering silver oaks and black pepper vines.",
        image: "/images/coorg/estates/12-acre-villa.webp",
        alt: "Heritage villa nestled in 12-acre coffee plantation in Coorg",
      },
    ],
    description: [
      "Twelve contiguous acres of fertile coffee plantation in Kodagu, crowned by an established estate villa oriented to capture sweeping panoramic valley views and morning mist rising from the foothills.",
      "The main residence combines traditional Western Ghats heritage architecture with modern comfort, featuring terracotta-tiled roofs, wide covered stone verandahs, hand-crafted timber woodwork, and expansive picture windows overlooking manicured lawns.",
      "The agricultural grounds comprise mature Arabica and Robusta coffee bushes cultivated under a multi-layered canopy of towering silver oaks, wild figs, and pepper creepers that thrive in the deep volcanic red loam.",
      "A paved private driveway leads from the main road through a gated stone entrance, providing all-weather motorable access. Natural perennial springs ensure dependable irrigation and domestic water security."
    ],
    facts: [
      { label: "Property Type", value: "Private Estate Villa & Coffee Plantation" },
      { label: "Total Land Area", value: "12 Acres (Contiguous Parcel)" },
      { label: "Elevation", value: "Approx. 3,650 ft above sea level" },
      { label: "Crops & Flora", value: "Arabica & Robusta coffee, black pepper vines, silver oak" },
      { label: "Water Resources", value: "Perennial natural spring source with storage" },
      { label: "Approach & Road", value: "Paved private driveway connecting to road network" },
      { label: "Boundary", value: "Stone boundary demarcations with gated private entry" },
    ],
    photos: [
      estatePhoto("12-acre-villa", "Heritage villa nestled in a 12-acre coffee plantation in Coorg", "The villa and plantation grounds"),
      estatePhoto("12-acre-villa-verandah", "Covered stone verandah overlooking coffee slopes and mist", "Verandah valley vista"),
      estatePhoto("12-acre-villa-driveway", "Private paved driveway flanked by silver oaks and pepper vines", "The approach driveway"),
    ],
    source,
  },
  {
    ...unknown, id: "20-acre-basavanahalli", name: "Basavanahalli Land", areaLabel: "20 acres", areaNote: null, location: "Basavanahalli, Kodagu", category: "Plantation land",
    summary: "Twenty acres of contiguous fertile plantation land in Basavanahalli, Karnataka.",
    highlights: ["20 Acres", "Coffee & Pepper", "Gentle Contours", "Road Access", "Red Loam Soil", "Spring Moisture"],
    features: [
      "Twenty contiguous acres of gentle undulating topography in Basavanahalli, Kodagu.",
      "High-yielding coffee plantation intercropped with flourishing pepper vines under silver oak shade.",
    ],
    amenitiesHeading: "Land Features & Infrastructure",
    amenities: [
      {
        title: "Commercial Crop Cultivation",
        description: "Systematically intercropped Arabica & Robusta coffee laden with berries and pepper creepers.",
        image: "/images/coorg/estates/20-acre-basavanahalli-crops.webp",
        alt: "Arabica coffee bushes laden with ripe red cherries and pepper vines",
      },
      {
        title: "Panoramic Mountain Ridge",
        description: "Elevated clearing at ~3,200 ft capturing sweeping vistas across Western Ghats valleys.",
        image: "/images/coorg/estates/20-acre-basavanahalli-ridge.webp",
        alt: "Elevated clearing overlooking green valleys and mountain horizons",
      },
      {
        title: "20 Contiguous Acres",
        description: "Accessible, fertile holding with gentle rolling slopes and nutrient-dense volcanic red loam.",
        image: "/images/coorg/estates/20-acre-basavanahalli.webp",
        alt: "Panoramic view of 20-acre agricultural land in Basavanahalli",
      },
    ],
    description: [
      "Twenty contiguous acres situated at Basavanahalli, Kodagu (571234, CWWG+94Q), offering an accessible, fertile, and well-maintained agricultural holding at approximately 3,200 feet elevation.",
      "The ground is characterized by gentle, rolling slopes that facilitate natural surface runoff while preserving the nutrient-dense volcanic red loam soil, renowned for its moisture retention and rich organic composition.",
      "The plantation is fully established with high-yielding Arabica and Robusta coffee bushes, systematically intercropped with robust black pepper creepers scaling mature silver oaks and indigenous shade timber.",
      "Excellent road connectivity with all-weather frontage connects the property to regional transport links, while interior tractor trails provide convenient access to every sector of the parcel.",
      "With clear perimeter demarcations, perennial spring moisture, and uninterrupted natural sunlight, this property represents an outstanding opportunity for long-term agroforestry stewardship or an expansive private country estate."
    ],
    facts: [
      { label: "Location", value: "CWWG+94Q, Basavanahalli, Kodagu 571234" },
      { label: "Total Acreage", value: "20 Acres (Contiguous Holding)" },
      { label: "Elevation", value: "Approx. 3,200 ft above sea level" },
      { label: "Crop Variety", value: "Coffee, black pepper vines, shade timber" },
      { label: "Topography", value: "Gentle rolling slopes with natural runoff" },
      { label: "Soil Condition", value: "Fertile red loam rich in organic matter" },
      { label: "Connectivity", value: "All-weather road frontage with internal tractor trails" },
    ],
    photos: [
      estatePhoto("20-acre-basavanahalli", "Scenic panoramic view of 20-acre agricultural land in Basavanahalli", "Rolling plantation contours"),
      estatePhoto("20-acre-basavanahalli-crops", "Arabica coffee bushes laden with ripe red cherries and pepper vines", "Coffee crops in season"),
      estatePhoto("20-acre-basavanahalli-ridge", "Elevated clearing overlooking tranquil green valleys and mountain horizons", "Highland vantage point"),
    ],
    source,
  },
  {
    ...unknown, id: "23-50-acre-lead", name: "Kodagu Highland Land", areaLabel: "23.50 acres", areaNote: null, location: "Suntikoppa, Kodagu", category: "Highland estate land",
    summary: "An expansive 23.50-acre plantation estate with mature shade canopy and spring water.",
    highlights: ["23.50 Acres", "Highland Ridge", "Mature Canopy", "Spring Water", "Robusta Coffee", "Cardamom & Pepper"],
    features: [
      "Twenty-three and a half acres situated on an elevated ridge with panoramic valley vistas.",
      "Dense evergreen shade canopy providing ideal conditions for premium coffee and cardamom.",
    ],
    description: [
      "An expansive 23.50-acre plantation estate situated along a high ridgeline near Suntikoppa at approximately 3,450 feet elevation, immersed in the celebrated coffee and spice heartland of Kodagu.",
      "The holding benefits from an elevated topographical position that catches gentle morning breezes and atmospheric mist, creating a cool microclimate with consistent seasonal moisture and heavy dew condensation.",
      "Dense evergreen shade canopy composed of native jungle trees, rosewood, and silver oaks shelters thriving Robusta coffee bushes, cardamom patches, and pepper vines that climb high into the forest canopy.",
      "Natural spring catchment areas and perennial water gullies traverse the property, offering gravitational irrigation potential and pristine freshwater sources throughout the dry season.",
      "Internal jeep pathways wind through the ridgelines, linking harvest zones, drying clearings, and elevated vantage points that command panoramic sunset views over surrounding mountain ranges."
    ],
    facts: [
      { label: "Property Type", value: "Highland Plantation & Estate Land" },
      { label: "Total Land Area", value: "23.50 Acres" },
      { label: "Altitude", value: "Approx. 3,450 ft" },
      { label: "Primary Crops", value: "Robusta coffee, cardamom, pepper vines" },
      { label: "Water Availability", value: "Natural spring catchment and perennial water sources" },
      { label: "Topography", value: "Stepped ridgeline with north-facing slopes" },
      { label: "Internal Mobility", value: "Existing jeep pathways traversing all sectors" },
    ],
    photos: [
      estatePhoto("23-50-acre-land", "Vast 23.50-acre coffee and pepper plantation estate amidst Coorg hills", "The estate landscape"),
      genericPhoto("forest-dense", "Dense forest shade trees and interplanted crop canopy", "Canopy and shade trees"),
      genericPhoto("forest-road", "Internal plantation access route winding through mature groves", "Internal farm road"),
    ],
    source,
  },
  {
    ...unknown, id: "23-acre-lead", name: "Kodagu Stream Land", areaLabel: "23 acres", areaNote: null, location: "Somwarpet, Kodagu", category: "Forest & mountain land",
    summary: "Twenty-three acres of pristine mountain slope land featuring a live freshwater stream.",
    highlights: ["23 Acres", "Perennial Stream", "Mountain Slopes", "Natural Forest", "Watercourse Pools", "Road Frontage"],
    features: [
      "Twenty-three acres set on a dramatic mountain slope bordered by native evergreen forest.",
      "Live natural freshwater stream cascading across the property, providing natural irrigation.",
    ],
    description: [
      "Twenty-three acres of dramatic mountain slope land situated in the scenic hills of Somwarpet, Kodagu (coordinates 12.5529731, 75.7950978), transitioning from 3,100 to 3,500 feet elevation.",
      "The centerpiece of the property is an active, perennial freshwater stream that cascades over natural granite rock shelves and pools, providing year-round natural irrigation, soothing water acoustics, and ecological vibrancy.",
      "Bordering native reserve forest, the parcel features indigenous flora including giant wild ferns, wild cinnamon, bamboo groves, and ancient hardwood trees that harbor diverse birdlife and native pollinators.",
      "Natural slope clearings offer extraordinary vantage points overlooking valley mist and distant horizons, perfectly positioned for an eco-retreat, sustainable agro-residence, or low-impact boutique hospitality sanctuary.",
      "The land combines all-weather road frontage at its crest with cleared internal walking paths leading down to the stream banks and private forest clearings."
    ],
    facts: [
      { label: "Land Classification", value: "Mountain Slope & Bio-Reserve Land" },
      { label: "Area", value: "23 Acres" },
      { label: "Water Feature", value: "Live perennial stream running through the parcel" },
      { label: "Elevation Gradient", value: "3,100 ft to 3,500 ft hillside transition" },
      { label: "Ecological Character", value: "Indigenous tree cover, bamboo clusters, wild ferns" },
      { label: "Suitability", value: "Eco-lodge, private retreat, or specialty shade planting" },
      { label: "Access", value: "Connecting road frontage with cleared internal trail" },
    ],
    photos: [
      estatePhoto("23-acre-land", "Pristine 23-acre mountain slope land with natural spring stream in Coorg", "Valley stream and forest canopy"),
      genericPhoto("waterfall", "Freshwater cascade along the natural rock watercourse", "Natural watercourse"),
      genericPhoto("forest-curve", "Natural mountain slope clearing with panoramic forest views", "Mountain slope approach"),
    ],
    source,
  },
  {
    ...unknown, id: "kishan-6-acres", name: "Kodagu Terrace Farmland", areaLabel: "6 acres", areaNote: null, location: "Virajpet, Kodagu", category: "Terraced farmland",
    summary: "Six acres of fertile stepped terrace land suited for organic crops and agroforestry.",
    highlights: ["6 Acres", "Terraced Plots", "Rich Red Loam", "Organic Farming", "Avocado & Fruit", "Fenced Perimeter"],
    features: [
      "Six acres of fertile stepped terrace land with optimal sun exposure and gentle slope.",
      "Nutrient-dense red loam soil well-suited for high-value horticulture, avocados, and spices.",
    ],
    description: [
      "Six acres of gently terraced agricultural land located in the tranquil, lush farming valleys of Virajpet, southern Kodagu, offering prime cultivation conditions and high natural fertility.",
      "The stepped terrace topography has been sculpted to capture maximum sunlight throughout the day while ensuring smooth gravitational water drainage that prevents soil erosion during the monsoon season.",
      "The soil consists of deep, friable volcanic red loam loaded with decomposed forest leaf mold, making it exceptionally fertile for intensive organic horticulture, avocado orchards, ginger, turmeric, and specialty coffee.",
      "Enclosed by clear perimeter fencing with designated farm gate access, the holding features cleared internal pathways suited for light agricultural machinery, tractors, and farm transport.",
      "An ideal acreage for an intimate sustainable family homestead, farm-to-table culinary project, or a self-sufficient organic retreat surrounded by peaceful green hill horizons."
    ],
    facts: [
      { label: "Holding Type", value: "Cultivated Terrace Farmland" },
      { label: "Acreage", value: "6 Acres" },
      { label: "Soil Variety", value: "Deep volcanic red loam with high humic content" },
      { label: "Slope Profile", value: "Stepped agricultural terraces with drainage ditches" },
      { label: "Agricultural Suitability", value: "Avocado orchard, exotic fruits, coffee & spices" },
      { label: "Fencing & Boundary", value: "Perimeter fence with cleared access pathways" },
      { label: "Water & Power", value: "Borewell / open well connectivity feasibility" },
    ],
    photos: [
      estatePhoto("6-acre-kisan-jv", "Picturesque 6-acre fertile farmland parcel with terraced fields in Coorg", "Cultivated farm terraces"),
      estatePhoto("kisan-avocado-orchard", "Organic avocado fruit growing in clusters on trees across farm terraces in Coorg", "Fruit orchard and avocado cultivation"),
      conceptualPhoto("curated-estate-plots", "Organized terrace parcels with clear boundaries and mountain backdrops", "Terraced parcel layout"),
    ],
    source,
  },
  {
    ...unknown, id: "abbelon-estates", name: "Abbelon Residential Estates", areaLabel: "Curated plots", areaNote: null, location: "Madikeri Hills, Kodagu", category: "Residential layout",
    summary: "A gated hillside residential layout with stone internal roads and panoramic horizon vistas.",
    highlights: ["Curated Layout", "Paved Internal Roads", "Valley Vistas", "Gated Setting", "Underground Conduits", "Panoramic Mist"],
    features: [
      "Master-planned residential layout set against the rolling hills and mist of Kodagu.",
      "Curved stone-paved internal roads, drainage infrastructure, and landscaped boundaries.",
    ],
    description: [
      "Abbelon Residential Estates is a master-planned hillside layout situated amidst the forested crests of Madikeri Hills, curated for discerning buyers seeking a private residential homesite in nature.",
      "The development is designed to integrate harmoniously with the sloping topography, preserving natural rock formations, mature shade trees, and undisturbed valley views from each plot.",
      "Wide, curved internal roadways paved with heavy stone cobbles traverse the estate, accompanied by engineered side-drainage channels and tastefully landscaped native plant borders.",
      "The layout features individual demarcated sites with clear boundary pillars, underground service conduit allowances for water and electrical lines, and a dedicated gated entrance checkpoint for privacy.",
      "Residents enjoy uninterrupted horizon views across the undulating Kodagu valleys, cool mountain breezes, and the freedom to build a bespoke hillside villa within a secure, cohesive community."
    ],
    facts: [
      { label: "Project Character", value: "Premium Hillside Residential Layout" },
      { label: "Configuration", value: "Demarcated residential villa plots" },
      { label: "Internal Infrastructure", value: "Curved stone-paved roads with side drainage" },
      { label: "Topographical Position", value: "Hillside crest with unobstructed mountain views" },
      { label: "Security & Access", value: "Gated entry checkpoint with security perimeter" },
      { label: "Utilities", value: "Underground electrical conduits and water lines planned" },
    ],
    photos: [
      estatePhoto("abbelon-estates", "Architectural landscape of luxury hillside residential layout in Coorg", "The residential layout"),
      abbelonPhoto("marketing-layout", "Master plan layout and demarcated residential plots", "Residential layout plan"),
      conceptualPhoto("countryside-homes", "Eco-residential homes integrated into hillside plantation landscape", "Hillside homestead vision"),
    ],
    source: "Client-supplied ABBELON Estates branded material",
  },
];

export function getEstateListing(id: string) { return estateListings.find((estate) => estate.id === id); }
