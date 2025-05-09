import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CreateEvent from "@/pages/CreateEvent";
import EventDetail from "@/pages/EventDetail";
import Register from "@/pages/Register";
import TeamFormation from "@/pages/TeamFormation";
import ProjectSubmission from "@/pages/ProjectSubmission";
import RecruitmentPortal from "@/pages/RecruitmentPortal";
import JudgeDashboard from "@/pages/JudgeDashboard";
import OrganizerDashboard from "@/pages/OrganizerDashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import ResumeAnalysis from "@/pages/ResumeAnalysis";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create-event" component={CreateEvent} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/events/:id/register" component={Register} />
      <Route path="/events/:id/teams" component={TeamFormation} />
      <Route path="/events/:id/submit" component={ProjectSubmission} />
      <Route path="/recruitment" component={RecruitmentPortal} />
      <Route path="/judge-dashboard" component={JudgeDashboard} />
      <Route path="/organizer-dashboard" component={OrganizerDashboard} />
      <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
      <Route path="/resume-analysis" component={ResumeAnalysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class"
        defaultTheme="system" 
        enableSystem
        themes={["light", "dark", "purple", "blue", "green", "orange", "system"]}
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
