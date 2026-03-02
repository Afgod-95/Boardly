import { 
  Navbar, HeroSection, 
  FeaturesSection,
  HowItWorksSection,
  ExploreSection,
  BottomCTA,  
  FaqSection,
  Footer
} from "@/components/home";
// --- Main Page ---
export default function Home() {
  return (
    <main className="min-h-screen bg-background  selection:bg-violet-100 selection:text-violet-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection/>
      <HowItWorksSection />
      
      <ExploreSection />
      
      <BottomCTA />
      <FaqSection />
      <Footer />
    </main>
  );
}