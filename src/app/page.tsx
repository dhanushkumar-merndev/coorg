import CoorgHero from "@/components/hero/CoorgHero";
import CoorgWorldsCarousel from "@/components/worlds/CoorgWorldsCarousel";
import { WhyCoorg } from "@/components/sections/WhyCoorg";
import { FeaturedOpportunities } from "@/components/sections/FeaturedOpportunities";
import { LandStory } from "@/components/sections/LandStory";
import { EnquiryCTA } from "@/components/sections/EnquiryCTA";

export default function Home() {
  return <><CoorgHero /><CoorgWorldsCarousel /><WhyCoorg /><FeaturedOpportunities /><LandStory /><EnquiryCTA /></>;
}
