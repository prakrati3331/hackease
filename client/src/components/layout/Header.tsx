import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Box, LogIn } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import ThemeSelector from "@/components/ThemeSelector";

export default function Header() {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (id: string) => {
    closeSheet();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Box className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold text-primary">HackEase</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('stakeholder-section')} 
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('stats-section')} 
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium"
              >
                Stats
              </button>
              <button 
                onClick={() => scrollToSection('testimonials-section')} 
                className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </button>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSelector />
          </div>
          <div className="flex items-center md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <Box className="h-6 w-6 text-primary mr-2" />
                    <span className="text-xl font-bold text-primary">HackEase</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => scrollToSection('stakeholder-section')} 
                    className="text-foreground px-3 py-2 text-base font-medium hover:bg-muted rounded text-left"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('stats-section')} 
                    className="text-foreground px-3 py-2 text-base font-medium hover:bg-muted rounded text-left"
                  >
                    Stats
                  </button>
                  <button 
                    onClick={() => scrollToSection('testimonials-section')} 
                    className="text-foreground px-3 py-2 text-base font-medium hover:bg-muted rounded text-left"
                  >
                    Testimonials
                  </button>
                  <div className="pt-4 flex justify-center">
                    <ThemeSelector />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
