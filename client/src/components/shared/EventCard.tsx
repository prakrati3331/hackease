import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Globe } from "lucide-react";
import { formatDate, getEventTypeColor } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isVirtual: boolean;
    imageUrl: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const eventTypeLabel = event.isVirtual ? "Virtual" : "In-Person";
  const eventTypeColorClass = getEventTypeColor(event.isVirtual);
  const locationIcon = event.isVirtual ? 
    <Globe className="text-gray-400 h-4 w-4 mr-2 flex-shrink-0" /> : 
    <MapPin className="text-gray-400 h-4 w-4 mr-2 flex-shrink-0" />;
  
  return (
    <Card className="overflow-hidden flex flex-col h-full card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
        />
      </div>
      <div className="p-4 flex-grow">
        <Badge className={`${eventTypeColorClass} mb-3`}>
          {eventTypeLabel}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-3">{event.description}</p>
        <div className="flex items-center mb-4">
          <Calendar className="text-gray-400 h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-600">
            {formatDate(event.startDate, { month: 'short', day: 'numeric' })} - {formatDate(event.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center">
          {locationIcon}
          <span className="text-sm text-gray-600">{event.location}</span>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>Register Now</Link>
        </Button>
      </div>
    </Card>
  );
}
