import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const eventId = parseInt(id);
  
  // Mock current user id (in a real app, this would come from auth context)
  const currentUserId = 3;

  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: [`/api/events/${eventId}`]
  });

  // Fetch user's registration status
  const { data: userRegistrations, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: [`/api/users/${currentUserId}/registrations`]
  });

  const isAlreadyRegistered = userRegistrations?.some(
    (reg: any) => reg.eventId === eventId
  );

  const isRegistrationClosed = event && new Date(event.registrationDeadline) < new Date();
  const isEventStarted = event && new Date(event.startDate) < new Date();

  // Handle successful registration
  const handleRegistrationSuccess = () => {
    navigate(`/events/${eventId}`);
  };

  // Redirect if already registered or registration closed
  useEffect(() => {
    if (!isLoadingRegistrations && !isLoadingEvent) {
      if (isAlreadyRegistered) {
        setTimeout(() => {
          navigate(`/events/${eventId}`);
        }, 2000);
      }
    }
  }, [isLoadingRegistrations, isLoadingEvent, isAlreadyRegistered, eventId, navigate]);

  // Loading state
  if (isLoadingEvent || isLoadingRegistrations) {
    return (
      <>
        <Header />
        <main className="py-10 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Event not found
  if (!event) {
    return (
      <>
        <Header />
        <main className="py-10 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Event Not Found</AlertTitle>
              <AlertDescription>
                The event you're looking for doesn't exist or has been removed.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button asChild>
                <a href="/">Return to Home</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Register for {event.title} | HackEase</title>
        <meta name="description" content={`Register for ${event.title} - ${event.description.substring(0, 120)}`} />
      </Helmet>
      
      <Header />
      
      <main className="py-10 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Register for {event.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>
          
          {isAlreadyRegistered && (
            <Alert className="mb-8 bg-success/10 border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertTitle>Already Registered</AlertTitle>
              <AlertDescription>
                You have already registered for this event. Redirecting to event page...
              </AlertDescription>
            </Alert>
          )}
          
          {isRegistrationClosed && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Registration Closed</AlertTitle>
              <AlertDescription>
                The registration deadline for this event has passed. 
                Registration closed on {formatDate(event.registrationDeadline)}.
              </AlertDescription>
            </Alert>
          )}
          
          {isEventStarted && (
            <Alert variant="destructive" className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Event Already Started</AlertTitle>
              <AlertDescription>
                This event has already started and is no longer accepting registrations.
              </AlertDescription>
            </Alert>
          )}
          
          {!isAlreadyRegistered && !isRegistrationClosed && !isEventStarted && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>
                    Please review the event details before registering.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-line mb-4">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p className="mt-1">{event.location}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Registration Deadline</h3>
                        <p className="mt-1">{formatDate(event.registrationDeadline)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Event Type</h3>
                        <p className="mt-1">{event.isVirtual ? 'Virtual' : 'In-Person'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Maximum Participants</h3>
                        <p className="mt-1">{event.maxParticipants || 'Unlimited'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <RegistrationForm 
                eventId={eventId} 
                userId={currentUserId} 
                onSubmitSuccess={handleRegistrationSuccess} 
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
