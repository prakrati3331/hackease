import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const benefits = [
  "Custom branding and landing pages that reflect your event's identity",
  "Flexible registration forms with custom fields and resume parsing",
  "Automated team formation and project management tools",
  "Streamlined judging process with customizable criteria",
  "Comprehensive analytics and participant data reporting"
];

export default function OrganizersSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">For Hackathon Organizers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to run successful hackathons that participants and sponsors love.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-semibold mb-4">Create Seamless Experiences</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/20 text-success flex items-center justify-center mr-3">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-600">{benefit}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button asChild>
                <Link href="/create-event">Get Started Free</Link>
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Hackathon organizer planning an event" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
