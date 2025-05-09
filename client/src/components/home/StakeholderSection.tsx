import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  Briefcase, 
  GraduationCap,
  MousePointerClick,
  BarChart4,
  Bell,
  Store,
  Share2,
  Layers,
  FileSearch,
  Presentation,
  MessageSquare,
  Database,
  UserPlus
} from "lucide-react";

export default function StakeholderSection() {
  const stakeholders = [
    {
      title: "Organizers",
      description: "Create and manage hackathon events with powerful tools",
      icon: <Users className="h-10 w-10 text-primary" />,
      features: [
        { icon: <MousePointerClick className="h-4 w-4" />, text: "Event creation & management", working: true },
        { icon: <BarChart4 className="h-4 w-4" />, text: "Live dashboard & analytics", working: true },
        { icon: <Bell className="h-4 w-4" />, text: "One-click notifications", working: true },
        { icon: <Store className="h-4 w-4" />, text: "Sponsor management", working: true }
      ],
      role: "organizer"
    },
    {
      title: "Participants",
      description: "Join events, form teams, and showcase your projects",
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      features: [
        { icon: <Share2 className="h-4 w-4" />, text: "AI team-matchmaking", working: true },
        { icon: <MousePointerClick className="h-4 w-4" />, text: "Event discovery & registration", working: true },
        { icon: <Award className="h-4 w-4" />, text: "Gamified skill leveling", working: true },
        { icon: <Layers className="h-4 w-4" />, text: "Project submission", working: true },
        { icon: <Bell className="h-4 w-4" />, text: "In-app notifications", working: true }
      ],
      role: "participant"
    },
    {
      title: "Judges",
      description: "Evaluate projects with efficient review tools",
      icon: <Award className="h-10 w-10 text-primary" />,
      features: [
        { icon: <Presentation className="h-4 w-4" />, text: "5-point rating system", working: true },
        { icon: <BarChart4 className="h-4 w-4" />, text: "Judging criteria view", working: true },
        { icon: <MessageSquare className="h-4 w-4" />, text: "Feedback submission", working: true },
        { icon: <BarChart4 className="h-4 w-4" />, text: "Aggregated scores dashboard", working: true }
      ],
      role: "judge"
    },
    {
      title: "Recruiters",
      description: "Find top talent from hackathon participants",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      features: [
        { icon: <Database className="h-4 w-4" />, text: "Talent pool with filters", working: true },
        { icon: <UserPlus className="h-4 w-4" />, text: "Resume analysis", working: true },
        { icon: <MessageSquare className="h-4 w-4" />, text: "Messaging system", working: true },
        { icon: <BarChart4 className="h-4 w-4" />, text: "Talent analytics dashboard", working: true }
      ],
      role: "recruiter"
    }
  ];

  return (
    <section id="stakeholder-section" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Role</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            HackEase serves four primary stakeholders with tailored features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stakeholders.map((stakeholder, index) => (
            <Card key={index} className="border-2 hover:border-primary/70 transition-all duration-300 h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="mb-4 flex justify-center">
                  {stakeholder.icon}
                </div>
                <CardTitle className="text-center text-2xl">{stakeholder.title}</CardTitle>
                <CardDescription className="text-center">{stakeholder.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {stakeholder.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-0.5 text-green-500">{feature.icon}</span>
                      <span className="text-sm">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/login?role=${stakeholder.role}`}>
                    Log in as {stakeholder.title.slice(0, -1)}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}