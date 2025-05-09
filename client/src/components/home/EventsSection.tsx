import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/shared/EventCard";
import { CalendarIcon, MapPinIcon, GlobeIcon } from "lucide-react";

// Sample event data for demonstration
const events = [
  {
    id: 1,
    title: "TechFest Global Hackathon",
    description: "Join 500+ developers for a 48-hour coding challenge with $50,000 in prizes.",
    startDate: "2023-05-15T00:00:00Z",
    endDate: "2023-05-17T23:59:59Z",
    location: "San Francisco, CA",
    isVirtual: false,
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 2,
    title: "AI Innovation Challenge",
    description: "Build the next generation of AI-powered solutions with mentorship from industry experts.",
    startDate: "2023-06-05T00:00:00Z",
    endDate: "2023-06-07T23:59:59Z",
    location: "Remote (Worldwide)",
    isVirtual: true,
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 3,
    title: "University Tech Summit",
    description: "A hackathon specifically designed for university students with top companies recruiting.",
    startDate: "2023-07-10T00:00:00Z",
    endDate: "2023-07-12T23:59:59Z",
    location: "Boston, MA + Online",
    isVirtual: true,
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  }
];

export default function EventsSection() {
  return (
    <section id="events" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Hackathons</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exciting hackathon events powered by our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button variant="outline" asChild>
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
