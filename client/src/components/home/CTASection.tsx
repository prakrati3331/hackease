import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary to-accent text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hackathon Experience?</h2>
        <p className="text-lg mb-8 opacity-90">
          Join thousands of organizers and participants who've elevated their hackathon experience with our platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
          >
            <Link href="/create-event">Get Started Free</Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10"
          >
            <Link href="#platform-demo">Request Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
