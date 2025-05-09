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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/shared/DashboardLayout";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  Eye,
  Search,
  Star,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function JudgeDashboard() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [projectsFilter, setProjectsFilter] = useState("");
  const [eventsFilter, setEventsFilter] = useState("");
  
  // Mock data for events being judged
  const mockEvents = [
    {
      id: 1,
      name: "Tech Innovation Hackathon 2025",
      status: "active",
      startDate: "2025-06-15T09:00:00Z",
      endDate: "2025-06-17T17:00:00Z",
      location: "San Francisco, CA",
      organizer: "TechCorp",
      projectsCount: 22,
      projectsJudged: 14,
    },
    {
      id: 2,
      name: "Healthcare Solutions Hackathon",
      status: "upcoming",
      startDate: "2025-07-22T10:00:00Z",
      endDate: "2025-07-24T18:00:00Z",
      location: "Boston, MA",
      organizer: "MediTech Alliance",
      projectsCount: 0,
      projectsJudged: 0,
    },
    {
      id: 3,
      name: "Global Virtual Hackathon",
      status: "past",
      startDate: "2025-05-01T00:00:00Z",
      endDate: "2025-05-03T23:59:59Z",
      location: "Virtual",
      organizer: "Global Dev Foundation",
      projectsCount: 68,
      projectsJudged: 68,
    }
  ];

  // Mock data for criteria
  const mockCriteria = [
    { id: 1, name: "Innovation", maxScore: 10, description: "Originality of the idea and solution" },
    { id: 2, name: "Creativity", maxScore: 10, description: "Creative approach to solving the problem" },
    { id: 3, name: "Technology", maxScore: 10, description: "Appropriate use of tech stack and implementation quality" },
    { id: 4, name: "Presentation", maxScore: 10, description: "Quality of demo, slides, and overall presentation" },
    { id: 5, name: "Scalability", maxScore: 10, description: "Potential for growth and wider application" },
  ];

  // Mock data for projects
  const mockProjects = [
    {
      id: 1,
      eventId: 1,
      name: "EcoTrack",
      teamName: "Team Alpha",
      description: "An AI-powered solution for tracking and optimizing resource usage in manufacturing.",
      technologies: ["Python", "TensorFlow", "React", "AWS"],
      submissionTime: "2025-06-16T15:30:45Z",
      isJudged: true,
      scores: [
        { criterionId: 1, score: 9 },
        { criterionId: 2, score: 8 },
        { criterionId: 3, score: 9 },
        { criterionId: 4, score: 7 },
        { criterionId: 5, score: 8 },
      ],
      demoUrl: "https://ecotrack-demo.example.com",
      repoUrl: "https://github.com/team-alpha/ecotrack",
      slidesUrl: "https://slides.example.com/ecotrack",
    },
    {
      id: 2,
      eventId: 1,
      name: "SupplyChain+",
      teamName: "Innovators",
      description: "A blockchain-based solution for transparent and efficient supply chain management.",
      technologies: ["JavaScript", "Solidity", "React", "Ethereum", "Node.js"],
      submissionTime: "2025-06-16T16:15:22Z",
      isJudged: true,
      scores: [
        { criterionId: 1, score: 7 },
        { criterionId: 2, score: 9 },
        { criterionId: 3, score: 8 },
        { criterionId: 4, score: 8 },
        { criterionId: 5, score: 9 },
      ],
      demoUrl: "https://supplychain-plus.example.com",
      repoUrl: "https://github.com/innovators/supplychain-plus",
      slidesUrl: "https://slides.example.com/supplychain-plus",
    },
    {
      id: 3,
      eventId: 1,
      name: "MedConnect",
      teamName: "HealthTech Heroes",
      description: "A telehealth platform connecting patients with healthcare providers.",
      technologies: ["React Native", "Firebase", "Node.js", "Express"],
      submissionTime: "2025-06-16T17:05:11Z",
      isJudged: false,
      scores: [],
      demoUrl: "https://medconnect-demo.example.com",
      repoUrl: "https://github.com/healthtech-heroes/medconnect",
      slidesUrl: "https://slides.example.com/medconnect",
    },
    {
      id: 4,
      eventId: 1,
      name: "EduLearn",
      teamName: "EduTech Pioneers",
      description: "An adaptive learning platform personalizing education for K-12 students.",
      technologies: ["Python", "Django", "React", "PostgreSQL", "TensorFlow"],
      submissionTime: "2025-06-16T18:22:33Z",
      isJudged: false,
      scores: [],
      demoUrl: "https://edulearn-demo.example.com",
      repoUrl: "https://github.com/edutech-pioneers/edulearn",
      slidesUrl: "https://slides.example.com/edulearn",
    },
  ];

  // Filter event data
  const filteredEvents = mockEvents.filter(event => 
    event.name.toLowerCase().includes(eventsFilter.toLowerCase()) ||
    event.organizer.toLowerCase().includes(eventsFilter.toLowerCase())
  );

  // Filter projects data
  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(projectsFilter.toLowerCase()) ||
    project.teamName.toLowerCase().includes(projectsFilter.toLowerCase()) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(projectsFilter.toLowerCase())
    )
  );

  // Calculate completion percentage
  const completionPercentage = (judged: number, total: number) => {
    if (total === 0) return 0;
    return (judged / total) * 100;
  };

  // Calculate average score for a project
  const getAverageScore = (scores: { criterionId: number, score: number }[]) => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, score) => sum + score.score, 0);
    return total / scores.length;
  };

  // Submit score for a project
  const handleScoreSubmit = (projectId: number, scores: { criterionId: number, score: number }[]) => {
    toast({
      title: "Scores Submitted",
      description: "Your evaluation has been recorded.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Judge Dashboard | HackEase</title>
      </Helmet>
      
      <DashboardLayout activeTab="dashboard" role="judge">
        <div className="flex flex-col space-y-6">
          {/* Dashboard header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Judge Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Review and evaluate hackathon projects
            </p>
          </div>
          
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Events to Judge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockEvents.filter(e => e.status !== "past").length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockEvents.filter(e => e.status === "active").length} active, {" "}
                  {mockEvents.filter(e => e.status === "upcoming").length} upcoming
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Projects Pending Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockProjects.filter(p => !p.isJudged).length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockProjects.filter(p => p.isJudged).length} projects already reviewed
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Next Judging Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockEvents.filter(e => e.status === "active").length > 0 
                    ? new Date(mockEvents.find(e => e.status === "active")?.endDate || "").toLocaleDateString() 
                    : "No active events"}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {mockEvents.filter(e => e.status === "active").length > 0 
                      ? new Date(mockEvents.find(e => e.status === "active")?.endDate || "").toLocaleTimeString() 
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="projects" className="w-full">
            <TabsList>
              <TabsTrigger value="projects">Projects to Judge</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Projects Pending Review</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-8"
                    value={projectsFilter}
                    onChange={(e) => setProjectsFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.filter(p => !p.isJudged).length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-muted-foreground">
                    {projectsFilter ? "No projects match your search" : "All projects have been reviewed!"}
                  </div>
                ) : (
                  filteredProjects
                    .filter(p => !p.isJudged)
                    .map(project => (
                      <Card key={project.id} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.name}</CardTitle>
                              <CardDescription>by {project.teamName}</CardDescription>
                            </div>
                            <Badge>Not Judged</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} variant="outline" className="bg-indigo-50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Submitted: {new Date(project.submissionTime).toLocaleString()}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" size="sm" className="w-1/2 mr-2">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="w-1/2">
                                <Star className="mr-2 h-4 w-4" />
                                Judge Now
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Judge Project: {project.name}</DialogTitle>
                                <DialogDescription>
                                  Evaluate this project based on the five judging criteria. Each criteria can be scored from 1-10.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-6 py-4">
                                {mockCriteria.map((criterion) => (
                                  <div key={criterion.id} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <Label htmlFor={`criterion-${criterion.id}`} className="font-medium">
                                        {criterion.name}
                                      </Label>
                                      <Badge variant="outline" className="ml-2">
                                        Score: <span id={`score-${criterion.id}`}>5</span>/10
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{criterion.description}</p>
                                    <Slider
                                      id={`criterion-${criterion.id}`}
                                      defaultValue={[5]}
                                      max={10}
                                      min={1}
                                      step={1}
                                      onValueChange={(value) => {
                                        const scoreElement = document.getElementById(`score-${criterion.id}`);
                                        if (scoreElement) scoreElement.innerText = value[0].toString();
                                      }}
                                    />
                                  </div>
                                ))}
                                
                                <div className="space-y-2">
                                  <Label htmlFor="feedback" className="font-medium">Feedback for Improvement</Label>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Provide constructive feedback to help the team improve their project.
                                  </p>
                                  <Textarea 
                                    id="feedback"
                                    placeholder="What aspects of the project could be improved?"
                                    className="min-h-[100px]"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="remarks" className="font-medium">Selection Remarks</Label>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    If the project isn't selected, provide reasons why and what would make it competitive.
                                  </p>
                                  <Textarea 
                                    id="remarks"
                                    placeholder="Provide remarks about selection decision..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={() => handleScoreSubmit(project.id, [])}>Submit Evaluation</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>

              <h2 className="text-xl font-semibold mt-8">Recently Judged Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.filter(p => p.isJudged).length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-muted-foreground">
                    {projectsFilter ? "No judged projects match your search" : "You haven't judged any projects yet"}
                  </div>
                ) : (
                  filteredProjects
                    .filter(p => p.isJudged)
                    .map(project => (
                      <Card key={project.id} className="overflow-hidden">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.name}</CardTitle>
                              <CardDescription>by {project.teamName}</CardDescription>
                            </div>
                            <div className="flex items-center bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm">
                              <BarChart3 className="mr-1 h-4 w-4" />
                              <span>Score: {getAverageScore(project.scores).toFixed(1)}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm mb-4 line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.map((tech, i) => (
                              <Badge key={i} variant="outline" className="bg-indigo-50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Submitted: {new Date(project.submissionTime).toLocaleString()}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" size="sm" className="w-1/2 mr-2">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline" className="w-1/2">
                            <Star className="mr-2 h-4 w-4" />
                            Edit Scores
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assigned Events</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-8"
                    value={eventsFilter}
                    onChange={(e) => setEventsFilter(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No events match your search
                  </div>
                ) : (
                  filteredEvents.map(event => {
                    const isActive = event.status === "active";
                    const isPast = event.status === "past";
                    const progress = completionPercentage(event.projectsJudged, event.projectsCount);
                    
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{event.name}</CardTitle>
                              <CardDescription>Organized by {event.organizer}</CardDescription>
                            </div>
                            <Badge
                              className={
                                isActive
                                  ? "bg-green-100 text-green-800"
                                  : isPast
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {event.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm mb-2">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-sm mb-4">
                            <ClipboardList className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.projectsCount} projects ({event.projectsJudged} judged)
                            </span>
                          </div>
                          
                          {event.projectsCount > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Judging Progress</span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>
                              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${isPast ? "bg-gray-400" : "bg-primary"}`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          {isActive ? (
                            <Button className="w-full">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Continue Judging
                            </Button>
                          ) : isPast ? (
                            <Button variant="outline" className="w-full">
                              View Results
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full" disabled>
                              Not Started Yet
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}