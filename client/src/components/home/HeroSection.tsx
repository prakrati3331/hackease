import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary to-accent text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              The Ultimate Hackathon Management Platform
            </h1>
            <p className="text-lg mb-8 opacity-90">
              Streamline your entire hackathon process from event creation to participant hiring with our all-in-one platform.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button asChild size="lg" variant="secondary" className="bg-white dark:bg-gray-800 text-primary hover:bg-gray-100 dark:hover:bg-gray-700">
                <a href="#stakeholder-section">
                  Choose Your Role <ChevronDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Developers collaborating at hackathon" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
