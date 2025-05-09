import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/shared/DashboardLayout";
import ProjectSubmissionForm from "@/components/project/ProjectSubmissionForm";
import JudgingForm from "@/components/project/JudgingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, CheckCircle2, FileCode, Award } from "lucide-react";

export default function ProjectSubmission() {
  const { id } = useParams();
  const eventId = parseInt(id);
  const [activeTab, setActiveTab] = useState("submit");
  
  // Mock current user id (in a real app, this would come from auth context)
  const currentUserId = 3;
  // Mock judge id (in a real app, this would be determined by user role)
  const judgeId = 1;
  // Mock if user is a judge
  const isUserJudge = true;

  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: [`/api/events/${eventId}`]
  });

  // Fetch teams for this event
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: [`/api/events/${eventId}/teams`]
  });

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: [`/api/events/${eventId}/projects`]
  });

  // Fetch judging criteria
  const { data: judgingCriteria, isLoading: isLoadingCriteria } = useQuery({
    queryKey: [`/api/events/${eventId}/criteria`]
  });

  // Get user teams for this event
  const userTeams = teams?.filter((team: any) => {
    // Check if user is a team leader
    if (team.leaderId === currentUserId) return true;
    
    // Check if user is a team member
    const teamMembers = team.members || [];
    return teamMembers.some((member: any) => member.userId === currentUserId);
  });

  // Get user team ids
  const userTeamIds = userTeams?.map((team: any) => team.id) || [];

  // Check if user has already submitted a project
  const userProjects = projects?.filter(
    (project: any) => userTeamIds.includes(project.teamId)
  );

  // Get the user's project if it exists
  const userProject = userProjects && userProjects.length > 0 
    ? userProjects[0] 
    : null;

  // Check if user can submit a project
  const canSubmitProject = userTeams && userTeams.length > 0;

  // Mock judging criteria if not available from API
  const defaultCriteria = [
    {
      id: 1,
      name: "Technical Difficulty",
      description: "Evaluate the technical complexity and sophistication of the solution.",
      weight: 3
    },
    {
      id: 2,
      name: "Innovation & Creativity",
      description: "Assess the originality and creativity of the idea and implementation.",
      weight: 3
    },
    {
      id: 3,
      name: "Design & Usability",
      description: "Judge the user interface, experience, and overall usability of the project.",
      weight: 2
    },
    {
      id: 4,
      name: "Practicality & Impact",
      description: "Evaluate the real-world utility and potential impact of the solution.",
      weight: 2
    }
  ];

  // Loading state
  if (isLoadingEvent || isLoadingTeams || isLoadingProjects) {
    return (
      <DashboardLayout title="Project Submission" eventId={eventId}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-[400px] w-full max-w-3xl rounded-lg" />
        </div>
      </DashboardLayout>
    );
  }

  // Event not found
  if (!event) {
    return (
      <DashboardLayout title="Project Submission">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Event Not Found</AlertTitle>
          <AlertDescription>
            The event you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  // Check if event has ended
  const isEventEnded = new Date(event.endDate) < new Date();

  return (
    <>
      <Helmet>
        <title>Project Submission | {event.title} | HackEase</title>
        <meta name="description" content={`Submit your project for ${event.title} hackathon`} />
      </Helmet>
      
      <DashboardLayout 
        title="Project Management" 
        description="Submit and manage your project for this hackathon"
        eventId={eventId}
      >
        <Tabs 
          defaultValue="submit" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="submit" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Submit Project
            </TabsTrigger>
            {isUserJudge && (
              <TabsTrigger value="judge" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Judging
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="submit">
            {userProject ? (
              <Alert className="mb-6 bg-success/10 border-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertTitle>Project Submitted</AlertTitle>
                <AlertDescription>
                  You've already submitted your project: <strong>{userProject.name}</strong>
                </AlertDescription>
              </Alert>
            ) : isEventEnded ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Submissions Closed</AlertTitle>
                <AlertDescription>
                  The submission deadline for this event has passed.
                </AlertDescription>
              </Alert>
            ) : !canSubmitProject ? (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Team Required</AlertTitle>
                <AlertDescription>
                  You need to be part of a team to submit a project.
                </AlertDescription>
                <Button asChild className="mt-2">
                  <a href={`/events/${eventId}/teams`}>Find or Create a Team</a>
                </Button>
              </Alert>
            ) : null}
            
            {canSubmitProject && !isEventEnded && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  {userProject ? "Edit Your Submission" : "Submit Your Project"}
                </h2>
                <p className="text-gray-600 mb-6">
                  Share your hackathon project with the community and judges.
                </p>
                
                <ProjectSubmissionForm 
                  eventId={eventId}
                  teamId={userTeams[0].id}
                  defaultValues={userProject || undefined}
                  isEdit={!!userProject}
                  projectId={userProject?.id}
                />
              </div>
            )}
            
            {userProject && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Project Details</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{userProject.name}</h3>
                        <p className="text-gray-600 mt-2">{userProject.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {userProject.repoUrl && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Repository</h4>
                            <a 
                              href={userProject.repoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline mt-1 block break-all"
                            >
                              {userProject.repoUrl}
                            </a>
                          </div>
                        )}
                        
                        {userProject.demoUrl && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Demo</h4>
                            <a 
                              href={userProject.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline mt-1 block break-all"
                            >
                              {userProject.demoUrl}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {userProject.presentationUrl && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Presentation</h4>
                          <a 
                            href={userProject.presentationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline mt-1 block break-all"
                          >
                            {userProject.presentationUrl}
                          </a>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium text-gray-500">Submission Status</h4>
                        <p className="mt-1 capitalize">{userProject.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="judge">
            {isUserJudge ? (
              <div>
                <h2 className="text-xl font-semibold mb-2">Judge Projects</h2>
                <p className="text-gray-600 mb-6">
                  Evaluate submitted projects using the established criteria.
                </p>
                
                {isLoadingProjects ? (
                  <Skeleton className="h-64 w-full max-w-2xl" />
                ) : projects?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-4">Projects to Evaluate</h3>
                        
                        <div className="space-y-4">
                          {projects.map((project: any) => (
                            <div 
                              key={project.id} 
                              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => {
                                // In a real app, this would navigate to a project evaluation page
                                // or open a modal for judging
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{project.name}</h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {project.description.substring(0, 120)}...
                                  </p>
                                </div>
                                <Button size="sm">Evaluate</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Show a sample judging form for demonstration */}
                    <JudgingForm 
                      projectId={projects[0].id}
                      judgeId={judgeId}
                      criteria={judgingCriteria || defaultCriteria}
                      onScoreSubmitted={() => {
                        // Handle score submission
                      }}
                    />
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-lg font-medium mb-2">No Projects Submitted Yet</h3>
                      <p className="text-gray-600">
                        There are no projects available for judging at this time.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Access Restricted</AlertTitle>
                <AlertDescription>
                  Only assigned judges can access the judging interface.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </>
  );
}
