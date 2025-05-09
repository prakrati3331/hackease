import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Box, 
  LayoutDashboard, 
  CalendarIcon, 
  Users, 
  FileCode, 
  Award, 
  Briefcase,
  Settings,
  Menu,
  X,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotificationsHub from "@/components/NotificationsHub";
import RecruiterRewards from "@/components/RecruiterRewards";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  eventId?: number;
  activeTab?: string;
  role?: "organizer" | "participant" | "judge" | "recruiter";
}

interface SidebarLink {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: (path: string, activeTab?: string) => boolean;
  roles?: Array<"organizer" | "participant" | "judge" | "recruiter">;
}

export default function DashboardLayout({ 
  children, 
  title, 
  description, 
  eventId,
  activeTab,
  role = "participant"
}: DashboardLayoutProps) {
  const [location] = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Use the activeTab or determine from location
  const currentTab = activeTab || location;
  
  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  // Define common links for all roles
  const commonLinks: SidebarLink[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: (path, tab) => path === "/dashboard" || tab === "dashboard",
      roles: ["participant"]
    },
    {
      href: "/organizer-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: (path, tab) => path === "/organizer-dashboard" || (role === "organizer" && tab === "dashboard"),
      roles: ["organizer"]
    },
    {
      href: "/judge-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: (path, tab) => path === "/judge-dashboard" || (role === "judge" && tab === "dashboard"),
      roles: ["judge"]
    },
    {
      href: "/recruiter-dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: (path, tab) => path === "/recruiter-dashboard" || (role === "recruiter" && tab === "dashboard"),
      roles: ["recruiter"]
    },
    {
      href: "/events",
      label: "Events",
      icon: <CalendarIcon className="h-5 w-5" />,
      isActive: (path, tab) => path === "/events" || path.startsWith("/events/") || tab === "events",
      roles: ["organizer", "participant", "judge"]
    }
  ];
  
  // Role-specific links
  const organizerLinks: SidebarLink[] = [
    {
      href: "/create-event",
      label: "Create Event",
      icon: <CalendarIcon className="h-5 w-5" />,
      isActive: (path, tab) => path === "/create-event" || tab === "create-event",
      roles: ["organizer"]
    },
  ];
  
  const judgeLinks: SidebarLink[] = [
    {
      href: "/judging-criteria",
      label: "Judging Criteria",
      icon: <Award className="h-5 w-5" />,
      isActive: (path, tab) => path === "/judging-criteria" || tab === "judging-criteria",
      roles: ["judge"]
    },
  ];
  
  const recruiterLinks: SidebarLink[] = [
    {
      href: "/talent-pool",
      label: "Talent Pool",
      icon: <Users className="h-5 w-5" />,
      isActive: (path, tab) => path === "/talent-pool" || tab === "talent-pool",
      roles: ["recruiter"]
    },
    {
      href: "/resume-analysis",
      label: "Resume Analysis",
      icon: <FileText className="h-5 w-5" />,
      isActive: (path, tab) => path === "/resume-analysis" || tab === "resume-analysis",
      roles: ["recruiter"]
    },
    {
      href: "/messages",
      label: "Messages",
      icon: <FileCode className="h-5 w-5" />,
      isActive: (path, tab) => path === "/messages" || tab === "messages",
      roles: ["recruiter"]
    },
  ];
  
  // Start with common links
  let links: SidebarLink[] = [...commonLinks];
  
  // Add role-specific links
  if (role === "organizer") {
    links = [...links, ...organizerLinks];
  } else if (role === "judge") {
    links = [...links, ...judgeLinks];
  } else if (role === "recruiter") {
    links = [...links, ...recruiterLinks];
  }
  
  // Add event-specific links if applicable
  if (eventId) {
    links.push(
      {
        href: `/events/${eventId}/teams`,
        label: "Teams",
        icon: <Users className="h-5 w-5" />,
        isActive: (path, tab) => path === `/events/${eventId}/teams` || tab === "teams",
        roles: ["organizer", "participant", "judge"]
      },
      {
        href: `/events/${eventId}/submit`,
        label: "Projects",
        icon: <FileCode className="h-5 w-5" />,
        isActive: (path, tab) => path === `/events/${eventId}/submit` || tab === "projects",
        roles: ["organizer", "participant", "judge"]
      }
    );
    
    if (role === "organizer" || role === "judge") {
      links.push({
        href: `/events/${eventId}/judging`,
        label: "Judging",
        icon: <Award className="h-5 w-5" />,
        isActive: (path, tab) => path === `/events/${eventId}/judging` || tab === "judging",
        roles: ["organizer", "judge"]
      });
    }
  }
  
  // Add recruitment link for participants and settings for all
  links.push(
    {
      href: "/recruitment",
      label: "Recruitment",
      icon: <Briefcase className="h-5 w-5" />,
      isActive: (path, tab) => path === "/recruitment" || tab === "recruitment",
      roles: ["participant", "recruiter"]
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: (path, tab) => path === "/settings" || tab === "settings",
      roles: ["organizer", "participant", "judge", "recruiter"]
    }
  );

  // Filter links by role
  const filteredLinks = links.filter(
    link => !link.roles || link.roles.includes(role)
  );

  const renderSidebarLinks = () => {
    return (
      <div className="space-y-1">
        {filteredLinks.map((link, index) => (
          <Link key={index} href={link.href}>
            <Button 
              variant="ghost"
              className={cn(
                "w-full justify-start",
                link.isActive(location, currentTab)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
              onClick={closeSheet}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Button>
          </Link>
        ))}
      </div>
    );
  };

  // Generate title based on role if not provided
  const pageTitle = title || (
    role === "organizer" ? "Organizer Dashboard" :
    role === "judge" ? "Judge Dashboard" :
    role === "recruiter" ? "Recruiter Dashboard" :
    "Participant Dashboard"
  );

  // Generate buttons based on role
  const renderActionButtons = () => {
    if (role === "organizer") {
      return (
        <>
          <Button variant="outline" asChild>
            <Link href="/dashboard">My Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/create-event">Create Event</Link>
          </Button>
        </>
      );
    }
    
    if (role === "participant") {
      return (
        <>
          <Button variant="outline" asChild>
            <Link href="/events">Browse Events</Link>
          </Button>
          <Button asChild>
            <Link href="/recruitment">Recruitment Portal</Link>
          </Button>
        </>
      );
    }
    
    if (role === "judge") {
      return (
        <Button variant="outline" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      );
    }
    
    if (role === "recruiter") {
      return (
        <Button variant="outline" asChild>
          <Link href="/talent-pool">Talent Pool</Link>
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-background border-r border-border">
        <div className="h-full flex flex-col">
          <div className="p-4">
            <Link href="/" className="flex items-center space-x-2">
              <Box className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">HackEase</span>
            </Link>
          </div>
          <Separator />
          <ScrollArea className="flex-1 p-3">
            {renderSidebarLinks()}
            {role === "recruiter" && (
              <div className="mt-6">
                <RecruiterRewards userId={1} />
              </div>
            )}
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild className="md:hidden absolute top-4 left-4 z-50">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] p-0">
          <div className="h-full flex flex-col">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Box className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">HackEase</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSheetOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Separator />
            <ScrollArea className="flex-1 p-3">
              {renderSidebarLinks()}
              {role === "recruiter" && (
                <div className="mt-6">
                  <RecruiterRewards userId={1} />
                </div>
              )}
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="border-b border-border p-4">
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div className="flex md:ml-10">
              <div className="md:block hidden">
                <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setIsSheetOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationsHub userId={1} />
              <ThemeToggle />
              {renderActionButtons()}
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
