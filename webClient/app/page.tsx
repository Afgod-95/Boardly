import { 
  Navbar, HeroSection, 
  FeaturesSection,
  HowItWorksSection,
  ExploreSection,
  BottomCTA  
} from "@/components/home";
// --- Main Page ---
export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans selection:bg-violet-100 selection:text-violet-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ExploreSection />
      <HowItWorksSection />
      <BottomCTA />
    </main>
  );
}