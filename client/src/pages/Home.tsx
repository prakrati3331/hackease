import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import StakeholderSection from "@/components/home/StakeholderSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>HackEase - Hackathon Management Platform</title>
        <meta name="description" content="Streamline your entire hackathon process from event creation to participant hiring with our all-in-one platform." />
      </Helmet>
      
      <Header />
      
      <main>
        <HeroSection />
        <StakeholderSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </>
  );
}
