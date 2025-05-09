import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  frequency: string;
  capacity: string;
  popular?: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
  buttonText: string;
  buttonVariant: "default" | "outline";
}

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Perfect for small hackathons and first-time organizers",
    price: "$0",
    frequency: "/event",
    capacity: "Up to 100 participants",
    popular: false,
    features: [
      { name: "Basic event page", included: true },
      { name: "Registration management", included: true },
      { name: "Team formation", included: true },
      { name: "Basic project submissions", included: true },
      { name: "Resume parsing", included: false },
      { name: "Recruitment portal", included: false },
      { name: "Advanced analytics", included: false },
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Pro",
    description: "For established hackathons looking to grow",
    price: "$499",
    frequency: "/event",
    capacity: "Up to 500 participants",
    popular: true,
    features: [
      { name: "Customizable event page", included: true },
      { name: "Advanced registration", included: true },
      { name: "Team matching algorithm", included: true },
      { name: "Advanced project submission", included: true },
      { name: "Resume parsing", included: true },
      { name: "Basic recruitment portal", included: true },
      { name: "Advanced analytics", included: false },
    ],
    buttonText: "Get Started",
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    description: "For large-scale events with custom needs",
    price: "$1,999",
    frequency: "/event",
    capacity: "Unlimited participants",
    popular: false,
    features: [
      { name: "Fully customizable event page", included: true },
      { name: "Premium registration system", included: true },
      { name: "Advanced team matching", included: true },
      { name: "Premium project hub", included: true },
      { name: "Advanced resume parsing", included: true },
      { name: "Full recruitment portal", included: true },
      { name: "Advanced analytics & API", included: true },
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your hackathon needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={cn(
                "border relative flex flex-col",
                tier.popular ? "border-primary transform scale-105 z-10 shadow-xl" : "border-gray-200"
              )}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs py-1 px-3 rounded-bl-lg">
                  Popular
                </div>
              )}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-500 ml-2 mb-1">{tier.frequency}</span>
                </div>
                <p className="text-gray-600 text-sm">{tier.capacity}</p>
              </div>
              
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-start ${!feature.included ? 'opacity-50' : ''}`}>
                      {feature.included ? (
                        <Check className="h-5 w-5 text-success mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <span className="text-gray-600">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 mt-auto">
                <Button 
                  variant={tier.buttonVariant} 
                  className={cn("w-full", tier.popular ? "" : "")}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
