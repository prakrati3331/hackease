import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  CalendarIcon,
  Clock,
  Users,
  Trophy,
  Search,
  ExternalLink,
  Heart,
  Flag,
  Filter,
  ArrowRight,
  School,
  Briefcase,
  Code,
  Sparkles,
  Activity,
  Headphones,
  Plus as PlusIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import GamifiedSkillsSection from "@/components/GamifiedSkillsSection";

export default function Dashboard() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [eventFilter, setEventFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  
  // Mock data for upcoming events
  const mockUpcomingEvents = [
    {
      id: 1,
      title: "Global AI Innovation Hackathon",
      organizer: "TechCorp International",
      startDate: "2025-08-15T09:00:00Z",
      endDate: "2025-08-17T18:00:00Z",
      location: "San Francisco & Virtual",
      isVirtual: true,
      registrationDeadline: "2025-08-10T23:59:59Z",
      registeredParticipants: 287,
      maxParticipants: 500,
      prizes: ["$10,000 Grand Prize", "$5,000 Runner-up", "$2,000 Best UI/UX"],
      skills: ["AI/ML", "Full Stack", "Data Science", "UI/UX"],
      categories: ["Artificial Intelligence", "Healthcare", "Climate Tech"],
      image: "https://img.freepik.com/free-vector/gradient-network-connection-background_23-2148874123.jpg",
      isRegistered: false,
      isFavorite: true
    },
    {
      id: 2,
      title: "Healthcare Tech Solutions Hackathon",
      organizer: "MediTech Alliance",
      startDate: "2025-09-05T10:00:00Z",
      endDate: "2025-09-07T16:00:00Z",
      location: "Boston, MA",
      isVirtual: false,
      registrationDeadline: "2025-08-28T23:59:59Z",
      registeredParticipants: 156,
      maxParticipants: 300,
      prizes: ["$7,500 Grand Prize", "$3,000 Runner-up", "Mentorship Program"],
      skills: ["Healthcare IT", "Mobile Dev", "Data Science", "Backend"],
      categories: ["Healthcare", "Patient Care", "Medical Devices"],
      image: "https://img.freepik.com/free-photo/medical-healthcare-technology-concept-medical-doctor-ai-generated_201606-8204.jpg",
      isRegistered: true,
      isFavorite: false
    },
    {
      id: 3,
      title: "Sustainable Future Hackathon",
      organizer: "GreenTech Foundation",
      startDate: "2025-10-10T08:00:00Z",
      endDate: "2025-10-12T20:00:00Z",
      location: "Virtual",
      isVirtual: true,
      registrationDeadline: "2025-10-01T23:59:59Z",
      registeredParticipants: 218,
      maxParticipants: 400,
      prizes: ["$8,000 Grand Prize", "Startup Incubation", "Mentorship"],
      skills: ["IoT", "Full Stack", "Data Science", "Hardware"],
      categories: ["CleanTech", "Renewable Energy", "Sustainability"],
      image: "https://img.freepik.com/free-photo/generative-ai-concept-with-nature-sustainability_23-2150803353.jpg",
      isRegistered: false,
      isFavorite: true
    }
  ];

  // Mock data for registered events
  const mockRegisteredEvents = [
    {
      id: 2,
      title: "Healthcare Tech Solutions Hackathon",
      organizer: "MediTech Alliance",
      startDate: "2025-09-05T10:00:00Z",
      endDate: "2025-09-07T16:00:00Z",
      location: "Boston, MA",
      status: "Upcoming",
      teamStatus: "Looking for team",
      submissionStatus: "Not started",
      image: "https://img.freepik.com/free-photo/medical-healthcare-technology-concept-medical-doctor-ai-generated_201606-8204.jpg",
      team: null
    },
    {
      id: 4,
      title: "FinTech Innovation Challenge",
      organizer: "Global Finance Network",
      startDate: "2025-07-20T09:00:00Z",
      endDate: "2025-07-22T17:00:00Z",
      location: "Virtual",
      status: "Active",
      teamStatus: "Team formed",
      submissionStatus: "In progress",
      image: "https://img.freepik.com/free-vector/gradient-cryptocurrency-concept_23-2149212816.jpg",
      team: {
        id: 101,
        name: "FinTechStars",
        members: [
          { id: 1001, name: "Alex Chen", role: "Team Leader", avatar: "https://img.freepik.com/free-photo/young-japanese-man-wearing-suit_23-2148834726.jpg" },
          { id: 1002, name: "Sophia Martinez", role: "Frontend Developer", avatar: "https://img.freepik.com/free-photo/woman-portrait-with-blue-lights_23-2148854548.jpg" },
          { id: 1003, name: "Marcus Johnson", role: "Backend Developer", avatar: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg" }
        ],
        projectName: "CryptoTracker Pro",
        projectDescription: "A comprehensive dashboard for crypto portfolio management with AI insights."
      }
    },
    {
      id: 5,
      title: "Web3 Developer Hackathon",
      organizer: "Blockchain Alliance",
      startDate: "2025-06-03T08:00:00Z",
      endDate: "2025-06-05T20:00:00Z",
      location: "New York & Virtual",
      status: "Completed",
      teamStatus: "Team formed",
      submissionStatus: "Submitted",
      image: "https://img.freepik.com/free-photo/blockchain-technology-with-abstract-background_53876-104280.jpg",
      team: {
        id: 102,
        name: "BlockChainGang",
        members: [
          { id: 1001, name: "Alex Chen", role: "Team Leader", avatar: "https://img.freepik.com/free-photo/young-japanese-man-wearing-suit_23-2148834726.jpg" },
          { id: 1004, name: "Ethan Wright", role: "Blockchain Developer", avatar: "https://img.freepik.com/free-photo/cheerful-young-man-posing-studio_171337-15746.jpg" },
          { id: 1005, name: "Olivia Taylor", role: "UI/UX Designer", avatar: "https://img.freepik.com/free-photo/african-american-woman-with-curly-hair-laughing-smiling_176420-5068.jpg" }
        ],
        projectName: "DeFi Wallet Connect",
        projectDescription: "A secure wallet interface for multiple blockchain protocols with cross-chain swaps.",
        submissionTime: "2025-06-05T15:32:45Z",
        score: 87,
        rank: 3,
        feedback: "Excellent execution and design. Security implementation is impressive."
      }
    }
  ];

  // Mock data for skills and achievements
  const mockSkills = [
    { name: "JavaScript", level: 85, endorsements: 12 },
    { name: "React", level: 78, endorsements: 9 },
    { name: "Node.js", level: 72, endorsements: 7 },
    { name: "Python", level: 65, endorsements: 5 },
    { name: "UI/UX Design", level: 70, endorsements: 6 },
    { name: "Data Science", level: 60, endorsements: 4 }
  ];

  const mockAchievements = [
    { id: 1, name: "First Hackathon", icon: <Flag className="text-green-500" />, date: "2024-12-10" },
    { id: 2, name: "Team Leader", icon: <Users className="text-blue-500" />, date: "2025-02-15" },
    { id: 3, name: "3rd Place - Web3 Hackathon", icon: <Trophy className="text-yellow-500" />, date: "2025-06-05" },
    { id: 4, name: "10 Projects Submitted", icon: <Code className="text-purple-500" />, date: "2025-06-20" },
  ];

  // Filter events
  const filteredUpcomingEvents = mockUpcomingEvents.filter(event => 
    event.title.toLowerCase().includes(eventFilter.toLowerCase()) ||
    event.organizer.toLowerCase().includes(eventFilter.toLowerCase()) ||
    event.skills.some(skill => skill.toLowerCase().includes(eventFilter.toLowerCase())) ||
    event.categories.some(category => category.toLowerCase().includes(eventFilter.toLowerCase()))
  );

  // Filter skills
  const filteredSkills = mockSkills.filter(skill =>
    skill.name.toLowerCase().includes(skillsFilter.toLowerCase())
  );

  // Handle registration
  const handleRegister = (eventId: number) => {
    toast({
      title: "Successfully Registered",
      description: "You have been registered for this hackathon.",
    });
  };

  // Handle favorite
  const handleToggleFavorite = (eventId: number) => {
    toast({
      title: "Favorites Updated",
      description: "Your favorites list has been updated.",
    });
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <Helmet>
        <title>Participant Dashboard | HackEase</title>
      </Helmet>
      
      <DashboardLayout activeTab="dashboard" role="participant">
        <div className="flex flex-col space-y-6">
          {/* Dashboard header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Participant Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your hackathon progress, manage teams, and discover new events
            </p>
          </div>
          
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Hackathons Participated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockRegisteredEvents.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockRegisteredEvents.filter(e => e.status === "Completed").length} completed, {" "}
                  {mockRegisteredEvents.filter(e => e.status === "Active" || e.status === "Upcoming").length} upcoming/active
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Achievements Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockAchievements.length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Latest: {mockAchievements[mockAchievements.length - 1].name}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Next Hackathon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockRegisteredEvents.filter(e => e.status === "Upcoming").length > 0 
                    ? mockRegisteredEvents.find(e => e.status === "Upcoming")?.title.split(' ').slice(0, 2).join(' ') + "..." 
                    : "None scheduled"}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {mockRegisteredEvents.filter(e => e.status === "Upcoming").length > 0 
                      ? new Date(mockRegisteredEvents.find(e => e.status === "Upcoming")?.startDate || "").toLocaleDateString() 
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="events" className="w-full">
            <TabsList>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="registered">My Hackathons</TabsTrigger>
              <TabsTrigger value="profile">Skills & Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Discover Hackathons</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events, skills, categories..."
                    className="pl-8"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUpcomingEvents.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No events match your search criteria
                  </div>
                ) : (
                  filteredUpcomingEvents.map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                            <CardDescription>by {event.organizer}</CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleFavorite(event.id)}
                            className={event.isFavorite ? "text-red-500" : ""}
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{formatDateRange(event.startDate, event.endDate)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <School className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{event.isVirtual ? "Virtual" : event.location}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 my-2">
                            {event.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="outline" className="bg-indigo-50">
                                {skill}
                              </Badge>
                            ))}
                            {event.skills.length > 3 && (
                              <Badge variant="outline">+{event.skills.length - 3}</Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Registration</span>
                              <span>{event.registeredParticipants} / {event.maxParticipants}</span>
                            </div>
                            <Progress value={(event.registeredParticipants / event.maxParticipants) * 100} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {getDaysRemaining(event.registrationDeadline) > 0 
                                ? `${getDaysRemaining(event.registrationDeadline)} days remaining` 
                                : "Registration closed"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="w-full flex gap-2">
                          <Button 
                            className="flex-1"
                            disabled={event.isRegistered}
                            onClick={() => handleRegister(event.id)}
                          >
                            {event.isRegistered ? "Registered" : "Register Now"}
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <span className="mr-1">Details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="registered" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Hackathons</h2>
              </div>
              
              {mockRegisteredEvents.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  You haven't registered for any hackathons yet
                </div>
              ) : (
                <div className="space-y-4">
                  {mockRegisteredEvents.map(event => (
                    <Card key={event.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                <Badge 
                                  className={
                                    event.status === "Upcoming" ? "bg-blue-100 text-blue-800" : 
                                    event.status === "Active" ? "bg-green-100 text-green-800" : 
                                    "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {event.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{event.organizer}</p>
                              <div className="flex items-center mt-2 text-sm">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{formatDateRange(event.startDate, event.endDate)}</span>
                              </div>
                              <div className="flex items-center mt-1 text-sm">
                                <School className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 space-y-2">
                              <div className="flex justify-end">
                                <Badge variant="outline" className={event.teamStatus.includes("Looking") ? "bg-yellow-50 text-yellow-800" : "bg-green-50 text-green-800"}>
                                  {event.teamStatus}
                                </Badge>
                              </div>
                              <div className="flex justify-end">
                                <Badge variant="outline" 
                                  className={
                                    event.submissionStatus === "Submitted" ? "bg-green-50 text-green-800" : 
                                    event.submissionStatus === "In progress" ? "bg-blue-50 text-blue-800" : 
                                    "bg-gray-50 text-gray-800"
                                  }
                                >
                                  {event.submissionStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {event.team && (
                            <div className="mt-4 border-t pt-4">
                              <div className="flex justify-between">
                                <h4 className="font-semibold">Team: {event.team.name}</h4>
                                {event.team.projectName && (
                                  <Badge variant="outline" className="bg-indigo-50">
                                    Project: {event.team.projectName}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap mt-3 gap-2">
                                {event.team.members.map(member => (
                                  <div key={member.id} className="flex items-center gap-2 p-2 border rounded-md">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={member.avatar || ""} />
                                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-sm">{member.name}</div>
                                      <div className="text-xs text-muted-foreground">{member.role}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {event.team.projectDescription && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                  {event.team.projectDescription}
                                </p>
                              )}
                              
                              {event.team.score && (
                                <div className="mt-3 flex items-center gap-2">
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                  <span className="font-medium">Score: {event.team.score}/100</span>
                                  <span>•</span>
                                  <span className="text-sm">Rank: #{event.team.rank}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 flex justify-end gap-2">
                            {event.status === "Upcoming" || event.status === "Active" ? (
                              <>
                                {event.teamStatus === "Looking for team" && (
                                  <Button variant="outline">
                                    <Users className="mr-2 h-4 w-4" />
                                    Find Team
                                  </Button>
                                )}
                                {event.status === "Active" && (
                                  <Button>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    {event.submissionStatus === "Not started" ? "Start Project" : "Continue Project"}
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Results
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Team Matching Card */}
                <Card className="md:col-span-3 mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                      AI Team Matching
                    </CardTitle>
                    <CardDescription>
                      Our AI analyzes your skills, goals, and preferences to find the perfect teammates for your next hackathon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="font-medium mb-2 block">Technical Skills</Label>
                          <div className="flex flex-wrap gap-1.5 mb-1">
                            {["JavaScript", "React", "Python", "Node.js", "Data Science", "AI/ML", "UI/UX", "Mobile"].map((skill, i) => (
                              <Badge key={i} variant={i < 3 ? "default" : "outline"} className={i < 3 ? "" : "cursor-pointer hover:bg-primary/10"}>
                                {skill} {i < 3 ? null : <PlusIcon className="h-3 w-3 ml-1" />}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">Selected skills are highlighted. Click to add more.</p>
                        </div>
                        
                        <div>
                          <Label className="font-medium mb-2 block">Interests & Goals</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="justify-start">
                              <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                              Win Prizes
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                              <Code className="mr-2 h-4 w-4 text-indigo-500" />
                              Learn New Skills
                            </Button>
                            <Button variant="secondary" size="sm" className="justify-start">
                              <Briefcase className="mr-2 h-4 w-4 text-green-500" />
                              Career Growth
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                              <Users className="mr-2 h-4 w-4 text-blue-500" />
                              Networking
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="font-medium mb-2 block">Team Size Preference</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue placeholder="Select team size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (2-3 people)</SelectItem>
                              <SelectItem value="medium">Medium (3-4 people)</SelectItem>
                              <SelectItem value="large">Large (5+ people)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="font-medium mb-2 block">Work Style</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="secondary" size="sm" className="justify-start">
                              <Activity className="mr-2 h-4 w-4 text-blue-500" />
                              Collaborative
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start">
                              <Headphones className="mr-2 h-4 w-4 text-purple-500" />
                              Independent
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="font-medium mb-2 block">Availability</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="secondary" size="sm">Weekdays</Button>
                            <Button variant="secondary" size="sm">Evenings</Button>
                            <Button variant="outline" size="sm">Weekends</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border">
                          <h4 className="font-semibold mb-2">Matching Results</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">⭐⭐⭐⭐⭐</span>
                              <span className="text-sm font-medium">95% match with UX Designers</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">⭐⭐⭐⭐</span>
                              <span className="text-sm font-medium">87% match with Backend Devs</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-500 mr-2">⭐⭐⭐</span>
                              <span className="text-sm font-medium">74% match with ML Engineers</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Find My Perfect Team
                        </Button>
                        
                        <p className="text-xs text-center text-muted-foreground">
                          AI matching updates as you join events and complete your profile.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Gamified Skills Section */}
                <GamifiedSkillsSection initialSkills={mockSkills} />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAchievements.map(achievement => (
                        <div key={achievement.id} className="flex items-center p-3 border rounded-md">
                          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted mr-3">
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">Earned on {new Date(achievement.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-semibold mb-2">Recruitment Profile</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enhance your profile to get discovered by recruiters looking for talent at hackathons.
                      </p>
                      <Button className="w-full">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Complete Recruitment Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}