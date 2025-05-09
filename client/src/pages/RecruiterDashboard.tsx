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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/shared/DashboardLayout";
import RecruiterRewards from "@/components/RecruiterRewards";
import {
  Bookmark,
  Briefcase,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
  MessageCircle,
  Search,
  Star,
  User,
  Users,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";

export default function RecruiterDashboard() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [currentUserId] = useState(1); // Mock current user ID
  
  // Mock data for talent profiles
  const mockProfiles = [
    {
      id: 1,
      userId: 101,
      name: "Alex Johnson",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript", "GraphQL", "MongoDB"],
      experienceLevel: "Mid-level",
      jobPreferences: ["Full-time", "Remote"],
      locationPreferences: ["San Francisco", "Remote"],
      workTypePreference: "Remote",
      bio: "Full stack developer with 4 years of experience building web applications with modern JavaScript frameworks.",
      achievements: [
        "1st place - Tech Innovation Hackathon 2024",
        "2nd place - Global Virtual Hackathon"
      ],
      contact: {
        email: "alex@example.com",
        linkedIn: "linkedin.com/in/alexjohnson",
        github: "github.com/alexjohnson",
      },
      avatar: "https://source.unsplash.com/random/200x200/?portrait,professional,man",
      isBookmarked: true
    },
    {
      id: 2,
      userId: 102,
      name: "Jamie Smith",
      title: "Frontend Developer",
      skills: ["React", "Vue.js", "CSS", "Tailwind", "JavaScript"],
      experienceLevel: "Junior",
      jobPreferences: ["Full-time", "Part-time"],
      locationPreferences: ["New York", "Boston", "Remote"],
      workTypePreference: "Hybrid",
      bio: "Frontend developer specializing in creating beautiful and responsive user interfaces.",
      achievements: [
        "3rd place - Healthcare Solutions Hackathon"
      ],
      contact: {
        email: "jamie@example.com",
        linkedIn: "linkedin.com/in/jamiesmith",
        github: "github.com/jamiesmith",
      },
      avatar: "https://source.unsplash.com/random/200x200/?portrait,professional,woman",
      isBookmarked: false
    },
    {
      id: 3,
      userId: 103,
      name: "Taylor Williams",
      title: "Backend Engineer",
      skills: ["Java", "Spring", "AWS", "Docker", "Kubernetes"],
      experienceLevel: "Senior",
      jobPreferences: ["Full-time"],
      locationPreferences: ["Seattle", "Remote"],
      workTypePreference: "On-site",
      bio: "Experienced backend engineer with a strong focus on scalable, cloud-native applications.",
      achievements: [
        "1st place - Global Virtual Hackathon",
        "Best Use of AWS - Cloud Innovation Challenge"
      ],
      contact: {
        email: "taylor@example.com",
        linkedIn: "linkedin.com/in/taylorwilliams",
        github: "github.com/taylorwilliams",
      },
      avatar: "https://source.unsplash.com/random/200x200/?portrait,professional,developer",
      isBookmarked: true
    },
    {
      id: 4,
      userId: 104,
      name: "Jordan Lee",
      title: "Machine Learning Engineer",
      skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "NLP"],
      experienceLevel: "Mid-level",
      jobPreferences: ["Full-time", "Contract"],
      locationPreferences: ["Bay Area", "Remote"],
      workTypePreference: "Remote",
      bio: "Machine learning engineer focused on NLP and computer vision applications.",
      achievements: [
        "2nd place - AI Innovation Hackathon",
        "Best ML Project - University Tech Fair"
      ],
      contact: {
        email: "jordan@example.com",
        linkedIn: "linkedin.com/in/jordanlee",
        github: "github.com/jordanlee",
      },
      avatar: "https://source.unsplash.com/random/200x200/?portrait,professional,data,scientist",
      isBookmarked: false
    }
  ];

  // Mock data for all available skill options (for filters)
  const allSkills = [
    "React", "Node.js", "TypeScript", "GraphQL", "MongoDB",
    "Vue.js", "CSS", "Tailwind", "JavaScript",
    "Java", "Spring", "AWS", "Docker", "Kubernetes",
    "Python", "TensorFlow", "PyTorch", "Data Science", "NLP"
  ];

  // Mock data for message history
  const mockMessages = [
    {
      id: 1,
      profileId: 1,
      messages: [
        { sender: "recruiter", content: "Hi Alex, I was impressed by your hackathon project. Would you be interested in discussing opportunities at our company?", timestamp: "2025-06-20T14:30:00Z" },
        { sender: "talent", content: "Hello! Thanks for reaching out. I'd definitely be interested in learning more about the opportunities you have.", timestamp: "2025-06-20T15:45:00Z" },
        { sender: "recruiter", content: "Great! We have an opening for a senior full stack developer. Can we schedule a quick call next week?", timestamp: "2025-06-20T16:10:00Z" },
      ]
    },
    {
      id: 2,
      profileId: 3,
      messages: [
        { sender: "recruiter", content: "Hello Taylor, your backend skills and AWS experience would be a great fit for our cloud infrastructure team. Would you be open to a conversation?", timestamp: "2025-06-19T10:15:00Z" },
        { sender: "talent", content: "Hi there! I'd be interested in learning more. I'm currently looking for new opportunities in the cloud space.", timestamp: "2025-06-19T13:20:00Z" },
      ]
    }
  ];

  // Filter profiles based on search and filters
  const filteredProfiles = mockProfiles.filter(profile => {
    // Search filter
    const searchMatches = searchQuery === "" || 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Skills filter
    const skillsMatch = selectedSkills.length === 0 || 
      selectedSkills.every(skill => profile.skills.includes(skill));
    
    // Experience level filter
    const experienceMatch = selectedExperience === "all" || 
      profile.experienceLevel === selectedExperience;
    
    return searchMatches && skillsMatch && experienceMatch;
  });
  
  // Bookmark a talent profile
  const handleToggleBookmark = (profileId: number) => {
    toast({
      title: "Bookmark updated",
      description: "Your talent bookmarks have been updated.",
    });
  };
  
  // Start a conversation
  const handleContactTalent = (profileId: number) => {
    toast({
      title: "Message sent",
      description: "Your message has been sent to the talent.",
    });
  };

  return (
    <>
      <Helmet>
        <title>Recruiter Dashboard | HackEase</title>
      </Helmet>
      
      <DashboardLayout activeTab="dashboard" role="recruiter">
        <div className="flex flex-col space-y-6">
          {/* Dashboard header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
              <p className="text-muted-foreground mt-1">
                Discover talented developers from recent hackathons
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/recruiter-dashboard")}>
                <User className="mr-2 h-4 w-4" />
                Talent Pool
              </Button>
              <Button onClick={() => navigate("/resume-analysis")}>
                <FileText className="mr-2 h-4 w-4" />
                Resume Analysis
              </Button>
            </div>
          </div>
          
          {/* Talent Analytics Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
                    <h3 className="text-2xl font-bold mt-1">{mockProfiles.length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center text-emerald-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+12% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bookmarked</p>
                    <h3 className="text-2xl font-bold mt-1">{mockProfiles.filter(p => p.isBookmarked).length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Bookmark className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center text-emerald-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+5% this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
                    <h3 className="text-2xl font-bold mt-1">{mockMessages.length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center text-emerald-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+8% this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Recruiter Points</p>
                    <h3 className="text-2xl font-bold mt-1">450</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <span>Next level: 600 points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or keywords..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {selectedExperience || "Experience Level"}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Mid-level">Mid-level</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="whitespace-nowrap">
                <Filter className="mr-2 h-4 w-4" />
                {selectedSkills.length > 0 ? `${selectedSkills.length} Skills` : "Skills"}
              </Button>
            </div>
          </div>
          
          {/* Skills filter (simplified for demo) */}
          <div className="flex flex-wrap gap-2">
            {allSkills.slice(0, 10).map(skill => (
              <Badge 
                key={skill} 
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className={`cursor-pointer ${!selectedSkills.includes(skill) ? 'hover:bg-muted/50 dark:hover:bg-muted/30 purple:hover:bg-muted/30 blue:hover:bg-muted/30 green:hover:bg-muted/30 orange:hover:bg-muted/30' : ''}`}
                onClick={() => {
                  if (selectedSkills.includes(skill)) {
                    setSelectedSkills(selectedSkills.filter(s => s !== skill));
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
              >
                {skill}
              </Badge>
            ))}
            <Badge variant="outline" className="cursor-pointer">+ More</Badge>
          </div>
          
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList>
              <TabsTrigger value="profiles">All Profiles ({filteredProfiles.length})</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked ({filteredProfiles.filter(p => p.isBookmarked).length})</TabsTrigger>
              <TabsTrigger value="messages">Messages ({mockMessages.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profiles" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No profiles match your search criteria
                  </div>
                ) : (
                  filteredProfiles.map(profile => (
                    <Card key={profile.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2">
                              <AvatarImage src={profile.avatar || ""} />
                              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{profile.name}</CardTitle>
                              <CardDescription>{profile.title}</CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleBookmark(profile.id)}
                            className={profile.isBookmarked ? "text-yellow-500" : ""}
                          >
                            <Bookmark className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profile.experienceLevel}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{profile.locationPreferences.join(", ")}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 my-2">
                            {profile.skills.slice(0, 4).map((skill, i) => (
                              <Badge key={i} variant="outline" className="bg-indigo-50 dark:bg-indigo-950/30 purple:bg-purple-50 purple:dark:bg-purple-950/30 blue:bg-blue-50 blue:dark:bg-blue-950/30 green:bg-green-50 green:dark:bg-green-950/30 orange:bg-orange-50 orange:dark:bg-orange-950/30">
                                {skill}
                              </Badge>
                            ))}
                            {profile.skills.length > 4 && (
                              <Badge variant="outline">+{profile.skills.length - 4}</Badge>
                            )}
                          </div>
                          <div className="text-sm">
                            <p className="line-clamp-2">{profile.bio}</p>
                          </div>
                          {profile.achievements.length > 0 && (
                            <div className="text-sm">
                              <div className="flex items-center mb-1">
                                <Star className="mr-2 h-3 w-3 text-yellow-500" />
                                <span className="font-medium">Achievements</span>
                              </div>
                              <ul className="ml-5 list-disc text-xs text-muted-foreground">
                                {profile.achievements.slice(0, 2).map((achievement, i) => (
                                  <li key={i}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <div className="flex w-full gap-2">
                          <Button className="flex-1">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Contact
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="bookmarked" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.filter(p => p.isBookmarked).length === 0 ? (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    You haven't bookmarked any profiles yet
                  </div>
                ) : (
                  filteredProfiles
                    .filter(p => p.isBookmarked)
                    .map(profile => (
                      <Card key={profile.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-2">
                                <AvatarImage src={profile.avatar || ""} />
                                <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{profile.name}</CardTitle>
                                <CardDescription>{profile.title}</CardDescription>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleBookmark(profile.id)}
                              className="text-yellow-500"
                            >
                              <Bookmark className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{profile.experienceLevel}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{profile.locationPreferences.join(", ")}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 my-2">
                              {profile.skills.slice(0, 4).map((skill, i) => (
                                <Badge key={i} variant="outline" className="bg-indigo-50 dark:bg-indigo-950/30 purple:bg-purple-50 purple:dark:bg-purple-950/30 blue:bg-blue-50 blue:dark:bg-blue-950/30 green:bg-green-50 green:dark:bg-green-950/30 orange:bg-orange-50 orange:dark:bg-orange-950/30">
                                  {skill}
                                </Badge>
                              ))}
                              {profile.skills.length > 4 && (
                                <Badge variant="outline">+{profile.skills.length - 4}</Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <div className="flex w-full gap-2">
                            <Button className="flex-1">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Contact
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <User className="mr-2 h-4 w-4" />
                              Profile
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="messages" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 border rounded-md">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Conversations</h3>
                  </div>
                  <div className="divide-y">
                    {mockMessages.map((thread, i) => {
                      const profile = mockProfiles.find(p => p.id === thread.profileId);
                      const lastMessage = thread.messages[thread.messages.length - 1];
                      
                      if (!profile) return null;
                      
                      return (
                        <div 
                          key={thread.id} 
                          className={`p-3 hover:bg-muted/50 dark:hover:bg-muted/30 purple:hover:bg-muted/30 blue:hover:bg-muted/30 green:hover:bg-muted/30 orange:hover:bg-muted/30 cursor-pointer ${
                            i === 0 
                              ? 'bg-muted/50 dark:bg-muted/30 purple:bg-muted/30 blue:bg-muted/30 green:bg-muted/30 orange:bg-muted/30' 
                              : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-2">
                              <AvatarImage src={profile.avatar || ""} />
                              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{profile.name}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {lastMessage.content}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(lastMessage.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="lg:col-span-2 border rounded-md flex flex-col">
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={mockProfiles[0].avatar || ""} />
                        <AvatarFallback>{mockProfiles[0].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{mockProfiles[0].name}</div>
                        <div className="text-xs text-muted-foreground">{mockProfiles[0].title}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-sm gap-1">
                      <ExternalLink className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                  
                  <div className="flex-grow p-4 space-y-4 max-h-96 overflow-y-auto">
                    {mockMessages[0].messages.map((message, i) => (
                      <div 
                        key={i} 
                        className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-md p-3 rounded-lg ${
                            message.sender === 'recruiter' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted/80 dark:bg-muted/70 purple:bg-muted/60 blue:bg-muted/60 green:bg-muted/60 orange:bg-muted/60'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}