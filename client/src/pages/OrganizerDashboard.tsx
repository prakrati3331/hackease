import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarIcon, 
  PlusIcon, 
  SearchIcon, 
  SettingsIcon, 
  CopyIcon, 
  BarChart3Icon,
  Bell,
  Clock,
  AlertTriangle,
  Megaphone,
  Send
} from "lucide-react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function OrganizerDashboard() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState("");
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [notificationType, setNotificationType] = useState<'deadline' | 'announcement' | 'alert'>('deadline');
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

  // Mock data for event tabs (in a real app this would come from the API)
  const mockEvents = [
    {
      id: 1,
      name: "Tech Innovation Hackathon 2025",
      description: "A 48-hour hackathon focusing on breakthrough technologies in AI and machine learning.",
      startDate: "2025-06-15T09:00:00Z",
      endDate: "2025-06-17T17:00:00Z",
      status: "upcoming",
      location: "San Francisco, CA",
      isVirtual: false,
      registrationCount: 124,
      maxParticipants: 200,
      teams: 28,
      projects: 22,
      createdAt: "2025-01-10T12:00:00Z",
      organizerId: 101,
      image: "https://img.freepik.com/free-vector/gradient-technology-background-with-connection_23-2148935603.jpg",
      categories: ["AI", "Machine Learning", "Cloud Computing"],
      prizes: ["$10,000 Grand Prize", "$5,000 Runner-up", "Startup Incubation"]
    },
    {
      id: 2,
      name: "Healthcare Solutions Hackathon",
      description: "Creating innovative solutions for modern healthcare challenges.",
      startDate: "2025-07-22T10:00:00Z",
      endDate: "2025-07-24T18:00:00Z",
      status: "upcoming",
      location: "Boston, MA",
      isVirtual: false,
      registrationCount: 86,
      maxParticipants: 150,
      teams: 19,
      projects: 16,
      createdAt: "2025-02-05T14:30:00Z",
      organizerId: 101,
      image: "https://img.freepik.com/free-photo/healthcare-workers-preventing-virus_23-2148847988.jpg",
      categories: ["Healthcare", "MedTech", "Patient Care"],
      prizes: ["$7,500 Grand Prize", "$3,000 Runner-up", "Mentorship Program"]
    },
    {
      id: 3,
      name: "Global Virtual Hackathon",
      description: "A worldwide virtual event for developers to collaborate on innovative projects.",
      startDate: "2025-05-01T00:00:00Z",
      endDate: "2025-05-03T23:59:59Z",
      status: "past",
      location: null,
      isVirtual: true,
      registrationCount: 312,
      maxParticipants: 500,
      teams: 72,
      projects: 68,
      createdAt: "2024-12-15T09:45:00Z",
      organizerId: 101,
      image: "https://img.freepik.com/free-vector/blue-futuristic-networking-technology_53876-100679.jpg",
      categories: ["Open Innovation", "Social Impact", "Sustainability"],
      prizes: ["$5,000 Grand Prize", "Cloud Credits", "Global Recognition"]
    }
  ];

  // Mock data for registrations
  const mockRegistrations = [
    {
      id: 1,
      userId: 201,
      eventId: 1,
      status: "confirmed",
      skills: ["Python", "React", "Data Science"],
      lookingForTeam: true,
      user: {
        id: 201,
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "https://img.freepik.com/free-photo/young-japanese-man-wearing-suit_23-2148834726.jpg"
      },
      createdAt: "2025-02-01T15:22:33Z"
    },
    {
      id: 2,
      userId: 202,
      eventId: 1,
      status: "confirmed",
      skills: ["JavaScript", "Vue", "Node.js"],
      lookingForTeam: false,
      user: {
        id: 202,
        name: "Jamie Smith",
        email: "jamie@example.com",
        avatar: "https://img.freepik.com/free-photo/woman-portrait-with-blue-lights_23-2148854548.jpg"
      },
      createdAt: "2025-02-02T10:12:43Z"
    },
    {
      id: 3,
      userId: 203,
      eventId: 1,
      status: "pending",
      skills: ["Java", "Spring", "AWS"],
      lookingForTeam: true,
      user: {
        id: 203,
        name: "Taylor Williams",
        email: "taylor@example.com",
        avatar: "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"
      },
      createdAt: "2025-02-03T09:33:21Z"
    }
  ];

  // Mock data for teams
  const mockTeams = [
    {
      id: 1,
      name: "Team Alpha",
      eventId: 1,
      description: "Building an AI-driven solution for resource optimization",
      lookingForMembers: true,
      maxMembers: 5,
      members: [
        {
          id: 1,
          userId: 201,
          teamId: 1,
          role: "leader",
          user: {
            id: 201,
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "https://img.freepik.com/free-photo/young-japanese-man-wearing-suit_23-2148834726.jpg"
          }
        },
        {
          id: 2,
          userId: 205,
          teamId: 1,
          role: "member",
          user: {
            id: 205,
            name: "Jordan Lee",
            email: "jordan@example.com",
            avatar: null
          }
        }
      ]
    },
    {
      id: 2,
      name: "Innovators",
      eventId: 1,
      description: "Working on a blockchain solution for supply chain management",
      lookingForMembers: false,
      maxMembers: 4,
      members: [
        {
          id: 3,
          userId: 202,
          teamId: 2,
          role: "leader",
          user: {
            id: 202,
            name: "Jamie Smith",
            email: "jamie@example.com",
            avatar: null
          }
        },
        {
          id: 4,
          userId: 206,
          teamId: 2,
          role: "member",
          user: {
            id: 206,
            name: "Casey Brown",
            email: "casey@example.com",
            avatar: null
          }
        },
        {
          id: 5,
          userId: 207,
          teamId: 2,
          role: "member",
          user: {
            id: 207,
            name: "Riley Davis",
            email: "riley@example.com",
            avatar: null
          }
        }
      ]
    }
  ];

  // Mock data for projects
  const mockProjects = [
    {
      id: 1,
      teamId: 1,
      eventId: 1,
      name: "EcoTrack",
      description: "An AI-powered solution for tracking and optimizing resource usage in manufacturing.",
      repoUrl: "https://github.com/team-alpha/ecotrack",
      demoUrl: "https://ecotrack-demo.example.com",
      slidesUrl: "https://slides.example.com/ecotrack",
      technologies: ["Python", "TensorFlow", "React", "AWS"],
      submissionDate: "2025-06-17T12:30:45Z",
      scores: [
        { criterionId: 1, judgeId: 301, score: 9 },
        { criterionId: 2, judgeId: 301, score: 8 },
        { criterionId: 3, judgeId: 301, score: 9 },
        { criterionId: 1, judgeId: 302, score: 8 },
        { criterionId: 2, judgeId: 302, score: 7 },
        { criterionId: 3, judgeId: 302, score: 8 }
      ]
    },
    {
      id: 2,
      teamId: 2,
      eventId: 1,
      name: "SupplyChain+",
      description: "A blockchain-based solution for transparent and efficient supply chain management.",
      repoUrl: "https://github.com/innovators/supplychain-plus",
      demoUrl: "https://supplychain-plus.example.com",
      slidesUrl: "https://slides.example.com/supplychain-plus",
      technologies: ["JavaScript", "Solidity", "React", "Ethereum", "Node.js"],
      submissionDate: "2025-06-17T14:15:22Z",
      scores: [
        { criterionId: 1, judgeId: 301, score: 7 },
        { criterionId: 2, judgeId: 301, score: 9 },
        { criterionId: 3, judgeId: 301, score: 8 },
        { criterionId: 1, judgeId: 302, score: 8 },
        { criterionId: 2, judgeId: 302, score: 8 },
        { criterionId: 3, judgeId: 302, score: 9 }
      ]
    }
  ];

  // Filter events based on search
  const filteredEvents = mockEvents.filter(event => 
    event.name.toLowerCase().includes(eventFilter.toLowerCase())
  );

  // Filter registrations based on search
  const filteredRegistrations = mockRegistrations.filter(registration => 
    registration.user.name.toLowerCase().includes(registrationFilter.toLowerCase()) ||
    registration.user.email.toLowerCase().includes(registrationFilter.toLowerCase())
  );

  // Handle create event button
  const handleCreateEvent = () => {
    toast({
      title: "Event Created",
      description: "Your new hackathon event has been created successfully.",
    });
  };
  
  // Handle notification send
  const handleSendNotification = () => {
    const currentEvent = selectedEvent ? mockEvents.find(e => e.id === selectedEvent) : null;
    
    if (!currentEvent) {
      toast({
        title: "Error",
        description: "Please select an event first.",
        variant: "destructive"
      });
      return;
    }
    
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a title and message for your notification.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send to the API
    // For now, just show a toast confirmation
    toast({
      title: "Notifications Sent",
      description: `${currentEvent.registrationCount} participants have been notified.`,
    });
    
    // Close the dialog
    setIsNotificationDialogOpen(false);
    
    // Reset the form
    setNotificationTitle("");
    setNotificationMessage("");
  };
  
  // Templates for quick notifications
  const notificationTemplates = {
    'registration': {
      title: "Registration Deadline Approaching",
      message: "Don't forget to complete your registration before the deadline. Only a few days left!",
      type: "deadline" as const
    },
    'submission': {
      title: "Project Submission Deadline",
      message: "The deadline for submitting your project is approaching. Make sure to finalize your work and submit on time!",
      type: "deadline" as const
    },
    'event_start': {
      title: "Event Starting Soon",
      message: "The hackathon begins in 24 hours. Get ready and make sure you have all the tools and resources you need!",
      type: "announcement" as const
    },
    'team_formation': {
      title: "Team Formation Deadline",
      message: "The deadline for forming teams is approaching. If you're still looking for teammates, visit the team formation page now!",
      type: "alert" as const
    }
  };
  
  // Apply a notification template
  const applyTemplate = (templateKey: keyof typeof notificationTemplates) => {
    const template = notificationTemplates[templateKey];
    setNotificationTitle(template.title);
    setNotificationMessage(template.message);
    setNotificationType(template.type);
  };

  return (
    <>
      <Helmet>
        <title>Organizer Dashboard | HackEase</title>
      </Helmet>
      
      {/* Notification Dialog */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Send Notification to Participants
            </DialogTitle>
            <DialogDescription>
              Notify participants about important deadlines, updates, or announcements.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notification-type">Notification Type</Label>
              <Select 
                value={notificationType} 
                onValueChange={(value) => setNotificationType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Deadline Reminder</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="announcement">
                    <div className="flex items-center">
                      <Megaphone className="mr-2 h-4 w-4 text-green-500" />
                      <span>Announcement</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="alert">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      <span>Alert</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templates">Quick Templates</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => applyTemplate('registration')}
                >
                  <Clock className="mr-2 h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="truncate">Registration Deadline</div>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => applyTemplate('submission')}
                >
                  <Clock className="mr-2 h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="truncate">Project Submission Deadline</div>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => applyTemplate('event_start')}
                >
                  <Megaphone className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="truncate">Event Starting Soon</div>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="justify-start text-left h-auto py-2"
                  onClick={() => applyTemplate('team_formation')}
                >
                  <AlertTriangle className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
                  <div className="truncate">Team Formation Deadline</div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input 
                id="title" 
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                placeholder="E.g., Project Submission Deadline Tomorrow" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your notification message here..." 
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} className="flex items-center">
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <DashboardLayout activeTab="dashboard" role="organizer">
        <div className="flex flex-col space-y-6">
          {/* Dashboard header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Hackathon Event</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to create a new hackathon event.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Event Name
                    </Label>
                    <Input id="name" placeholder="Tech Innovation Hackathon 2025" className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" placeholder="A 48-hour hackathon focusing on..." className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input id="startDate" type="datetime-local" className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      End Date
                    </Label>
                    <Input id="endDate" type="datetime-local" className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input id="location" placeholder="San Francisco, CA" className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxParticipants" className="text-right">
                      Max Participants
                    </Label>
                    <Input id="maxParticipants" type="number" placeholder="200" className="col-span-3" />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Deadline Reminder</Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Label htmlFor="reminder" className="flex items-center space-x-2 cursor-pointer">
                        <Input id="reminder" type="checkbox" className="h-4 w-4" />
                        <span>Send automatic deadline reminders to participants</span>
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Sponsors</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input placeholder="Sponsor name" className="flex-1" />
                        <Input placeholder="Logo URL" className="flex-1" />
                        <Button variant="outline" size="icon">+</Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="Sponsor name" className="flex-1" />
                        <Input placeholder="Logo URL" className="flex-1" />
                        <Button variant="outline" size="icon">-</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleCreateEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Event selector tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Events</h2>
              <div className="relative w-64">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8"
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs 
              defaultValue={mockEvents[0].id.toString()}
              onValueChange={(value) => setSelectedEvent(parseInt(value))}
              className="w-full"
            >
              <ScrollArea className="whitespace-nowrap rounded-md border">
                <TabsList className="w-full justify-start">
                  {filteredEvents.map(event => (
                    <TabsTrigger key={event.id} value={event.id.toString()} className="relative">
                      {event.name}
                      <Badge 
                        className={`ml-2 ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                          event.status === 'active' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
              
              {filteredEvents.map(event => (
                <TabsContent key={event.id} value={event.id.toString()} className="mt-6">
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{event.name}</h2>
                        <p className="text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsNotificationDialogOpen(true)}
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Send Notification
                        </Button>
                        <Button variant="outline" size="sm">
                          <SettingsIcon className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button variant="outline" size="sm">
                          <CopyIcon className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Registration Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{event.registrationCount} / {event.maxParticipants}</div>
                          <div className="mt-1 h-2 w-full bg-muted overflow-hidden rounded-full">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(event.registrationCount / event.maxParticipants) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {((event.registrationCount / event.maxParticipants) * 100).toFixed(1)}% capacity filled
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Teams Formed</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{event.teams}</div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Average {(event.registrationCount / (event.teams || 1)).toFixed(1)} participants per team
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Projects Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{event.projects}</div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {event.projects === 0 ? "No projects submitted yet" : 
                              `${((event.projects / event.teams) * 100).toFixed(1)}% of teams submitted projects`}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Event Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {event.status === "past" ? "Completed" : 
                              event.status === "active" ? "In Progress" : 
                              "Upcoming"}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Tabs defaultValue="participants" className="w-full">
                      <TabsList>
                        <TabsTrigger value="participants">Participants</TabsTrigger>
                        <TabsTrigger value="teams">Teams</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="judging">Judging</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="participants" className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Registered Participants</h3>
                          <div className="relative w-64">
                            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search participants..."
                              className="pl-8"
                              value={registrationFilter}
                              onChange={(e) => setRegistrationFilter(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Skills</TableHead>
                                <TableHead>Looking For Team</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Registration Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredRegistrations.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                    No participants match your search
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredRegistrations.map(registration => (
                                  <TableRow key={registration.id}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center">
                                        <Avatar className="h-8 w-8 mr-2">
                                          <AvatarImage src={registration.user.avatar || ""} />
                                          <AvatarFallback>
                                            {registration.user.name.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        {registration.user.name}
                                      </div>
                                    </TableCell>
                                    <TableCell>{registration.user.email}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-wrap gap-1">
                                        {registration.skills.map((skill, i) => (
                                          <Badge key={i} variant="outline" className="bg-blue-50">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {registration.lookingForTeam ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700">Yes</Badge>
                                      ) : (
                                        <Badge variant="outline" className="bg-gray-50 text-gray-700">No</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        className={
                                          registration.status === "confirmed" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-yellow-100 text-yellow-800"
                                        }
                                      >
                                        {registration.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {new Date(registration.createdAt).toLocaleDateString()}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="teams" className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Teams ({mockTeams.length})</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mockTeams.map(team => (
                            <Card key={team.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle>{team.name}</CardTitle>
                                  {team.lookingForMembers && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Recruiting
                                    </Badge>
                                  )}
                                </div>
                                <CardDescription>{team.description}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="text-sm mb-2">
                                  {team.members.length} / {team.maxMembers} members
                                </div>
                                <div className="flex -space-x-2">
                                  {team.members.map(member => (
                                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                      <AvatarImage src={member.user.avatar || ""} />
                                      <AvatarFallback>
                                        {member.user.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  ))}
                                  {team.lookingForMembers && team.members.length < team.maxMembers && (
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                                      <PlusIcon className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="projects" className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Submitted Projects ({mockProjects.length})</h3>
                        </div>
                        
                        {mockProjects.map(project => {
                          // Calculate average score across all judges for this project
                          const totalScores = project.scores.reduce((acc, score) => acc + score.score, 0);
                          const avgScore = totalScores / project.scores.length;
                          
                          return (
                            <Card key={project.id} className="mb-4">
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <CardTitle>{project.name}</CardTitle>
                                  <div className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm">
                                    <BarChart3Icon className="mr-1 h-4 w-4" />
                                    <span>Avg. Score: {avgScore.toFixed(1)}</span>
                                  </div>
                                </div>
                                <CardDescription>
                                  Submitted by {mockTeams.find(team => team.id === project.teamId)?.name} on {new Date(project.submissionDate).toLocaleDateString()}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {project.technologies.map((tech, i) => (
                                    <Badge key={i} variant="outline" className="bg-indigo-50">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {project.repoUrl && (
                                    <Button variant="outline" size="sm" className="w-full">
                                      View Repository
                                    </Button>
                                  )}
                                  {project.demoUrl && (
                                    <Button variant="outline" size="sm" className="w-full">
                                      Launch Demo
                                    </Button>
                                  )}
                                  {project.slidesUrl && (
                                    <Button variant="outline" size="sm" className="w-full">
                                      View Presentation
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </TabsContent>
                      
                      <TabsContent value="judging" className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Judging Setup</h3>
                          <Button>Invite Judges</Button>
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Scoring Criteria</CardTitle>
                            <CardDescription>Set up criteria for judging projects</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="p-3 border rounded flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Innovation</div>
                                  <div className="text-xs">How innovative and original is the solution?</div>
                                </div>
                                <Badge>Max: 10</Badge>
                              </div>
                              <div className="p-3 border rounded flex items-center justify-between">
                                <div>
                                  <div className="font-medium">Technical Complexity</div>
                                  <div className="text-xs">How technically challenging and well-implemented is the solution?</div>
                                </div>
                                <Badge>Max: 10</Badge>
                              </div>
                              <div className="p-3 border rounded flex items-center justify-between">
                                <div>
                                  <div className="font-medium">User Experience</div>
                                  <div className="text-xs">How intuitive and user-friendly is the solution?</div>
                                </div>
                                <Badge>Max: 10</Badge>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline">Add Criterion</Button>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}