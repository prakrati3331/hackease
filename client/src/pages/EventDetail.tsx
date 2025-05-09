import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamCard } from "@/components/teams/TeamCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, getEventStatusBadgeColor, getEventTypeColor, getInitials, calculateTimeLeft } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  FileCode, 
  Award, 
  Info, 
  AlertTriangle,
  AlertCircle
} from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const eventId = parseInt(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft>>(null);
  
  // Mock current user id (in a real app, this would come from auth context)
  const currentUserId = 3;

  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: [`/api/events/${eventId}`]
  });

  // Fetch registrations
  const { data: registrations, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: [`/api/events/${eventId}/registrations`]
  });

  // Fetch teams
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: [`/api/events/${eventId}/teams`]
  });

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: [`/api/events/${eventId}/projects`]
  });

  // Check if current user is registered
  const userRegistration = registrations?.find(
    (reg: any) => reg.userId === currentUserId
  );
  
  // Get user teams
  const userTeams = teams?.filter((team: any) => {
    // Check if user is a team leader
    if (team.leaderId === currentUserId) return true;
    
    // Check if user is a team member
    const teamMembers = team.members || [];
    return teamMembers.some((member: any) => member.userId === currentUserId);
  });

  // Calculate time left
  useEffect(() => {
    if (event) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(event.startDate));
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [event]);

  // Loading state
  if (isLoadingEvent) {
    return (
      <>
        <Header />
        <main className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-64 w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
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
        <main className="py-20 bg-background">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
            <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const eventTypeLabel = event.isVirtual ? "Virtual" : "In-Person";
  const eventTypeColorClass = getEventTypeColor(event.isVirtual);
  const isEventPast = new Date(event.endDate) < new Date();
  const isRegistrationClosed = new Date(event.registrationDeadline) < new Date();

  return (
    <>
      <Helmet>
        <title>{event.title} | HackEase</title>
        <meta name="description" content={event.description.substring(0, 160)} />
      </Helmet>
      
      <Header />
      
      <main className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Event Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={eventTypeColorClass}>{eventTypeLabel}</Badge>
                <Badge className={getEventStatusBadgeColor(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(event.startDate)} - {formatDate(event.endDate)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {!userRegistration && !isRegistrationClosed && !isEventPast && (
                <Button asChild>
                  <Link href={`/events/${eventId}/register`}>Register Now</Link>
                </Button>
              )}
              
              {userRegistration && !isEventPast && (
                <>
                  {userTeams?.length === 0 && (
                    <Button asChild>
                      <Link href={`/events/${eventId}/teams`}>Find a Team</Link>
                    </Button>
                  )}
                  
                  {!projects?.some((project: any) => 
                    userTeams?.some((team: any) => team.id === project.teamId)
                  ) && (
                    <Button asChild variant="outline">
                      <Link href={`/events/${eventId}/submit`}>Submit Project</Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Registration Status Alert */}
          {userRegistration && (
            <Alert className="mb-6 bg-success/10 border-success/20">
              <Info className="h-4 w-4 text-success" />
              <AlertTitle>You're Registered!</AlertTitle>
              <AlertDescription>
                Your registration status: <Badge>{userRegistration.status}</Badge>
              </AlertDescription>
            </Alert>
          )}
          
          {!userRegistration && isRegistrationClosed && !isEventPast && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Registration Closed</AlertTitle>
              <AlertDescription>
                The registration deadline for this event has passed.
              </AlertDescription>
            </Alert>
          )}
          
          {isEventPast && (
            <Alert className="mb-6 bg-gray-100 border-gray-200">
              <Info className="h-4 w-4 text-gray-600" />
              <AlertTitle>Event Completed</AlertTitle>
              <AlertDescription>
                This hackathon has already taken place.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Event Countdown */}
          {!isEventPast && timeLeft && (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  {new Date(event.startDate) > new Date() ? "Event Starts In" : "Event Ends In"}
                </h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-3xl font-bold text-primary">{timeLeft.days}</span>
                    <p className="text-sm text-gray-600">Days</p>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-primary">{timeLeft.hours}</span>
                    <p className="text-sm text-gray-600">Hours</p>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-primary">{timeLeft.minutes}</span>
                    <p className="text-sm text-gray-600">Minutes</p>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-primary">{timeLeft.seconds}</span>
                    <p className="text-sm text-gray-600">Seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Event Tabs */}
          <Tabs 
            defaultValue="overview" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Location
                    </h3>
                    <p className="text-gray-600">{event.location}</p>
                    {event.isVirtual && (
                      <p className="text-sm text-gray-500 mt-2">
                        Joining details will be emailed to registered participants.
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      Participants
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {registrations?.length || 0}
                      </span>
                      <span className="text-gray-500">
                        / {event.maxParticipants || "Unlimited"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Registration deadline: {formatDate(event.registrationDeadline)}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Teams & Projects
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {teams?.length || 0}
                        </span>
                        <p className="text-sm text-gray-500">Teams</p>
                      </div>
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          {projects?.length || 0}
                        </span>
                        <p className="text-sm text-gray-500">Projects</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About This Hackathon</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Teams Tab */}
            <TabsContent value="teams">
              {isLoadingTeams ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : teams?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team: any) => (
                    <TeamCard 
                      key={team.id} 
                      team={team} 
                      members={team.members || []} 
                      currentUserId={currentUserId}
                      isUserRegistered={!!userRegistration}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Be the first to create a team for this hackathon!
                    </p>
                    {userRegistration && (
                      <Button asChild>
                        <Link href={`/events/${eventId}/teams`}>Create a Team</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Projects Tab */}
            <TabsContent value="projects">
              {isLoadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-64 w-full" />
                  ))}
                </div>
              ) : projects?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project: any) => (
                    <Card key={project.id} className="card-hover">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-3 mt-4">
                          {project.repoUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                <FileCode className="h-4 w-4 mr-2" />
                                View Code
                              </a>
                            </Button>
                          )}
                          
                          {project.demoUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4 mr-2" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">No Projects Submitted Yet</h3>
                    <p className="text-gray-600">
                      Check back later to see the amazing projects from this hackathon!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-md mr-4">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Opening Ceremony</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.startDate, { 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Kickoff and introduction to the hackathon theme and rules.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-md mr-4">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Team Formation</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(new Date(event.startDate).getTime() + 3600000), { 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Find teammates and form your hackathon team.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-md mr-4">
                        <FileCode className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Hacking Begins</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(new Date(event.startDate).getTime() + 7200000), { 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Start building your projects!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-md mr-4">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Project Submission Deadline</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(new Date(event.endDate).getTime() - 7200000), { 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Submit your projects for judging.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-md mr-4">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Closing Ceremony & Awards</h4>
                        <p className="text-sm text-gray-600">
                          {formatDate(event.endDate, { 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                        <p className="text-gray-600 mt-1">
                          Project showcase, judging results, and prizes!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
