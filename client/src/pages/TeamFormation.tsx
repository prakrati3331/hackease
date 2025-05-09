import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCard } from "@/components/teams/TeamCard";
import TeamMatchingSection from "@/components/teams/TeamMatchingSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertCircle, Loader2, Users, UserPlus, Sparkles } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form schema for team creation
const teamFormSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  maxMembers: z.number().min(2).max(10),
  skills: z.string().optional(),
  isOpen: z.boolean().default(true),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export default function TeamFormation() {
  const { id } = useParams();
  const eventId = parseInt(id);
  const [activeTab, setActiveTab] = useState("find");
  const { toast } = useToast();
  
  // Mock current user id (in a real app, this would come from auth context)
  const currentUserId = 3;

  // Fetch user details
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: [`/api/users/${currentUserId}`]
  });

  // Fetch event details
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: [`/api/events/${eventId}`]
  });

  // Fetch teams for this event
  const { data: teams, isLoading: isLoadingTeams } = useQuery({
    queryKey: [`/api/events/${eventId}/teams`]
  });

  // Fetch registrations to check if user is registered
  const { data: userRegistrations, isLoading: isLoadingRegistrations } = useQuery({
    queryKey: [`/api/users/${currentUserId}/registrations`]
  });

  // Check if user is registered for this event
  const isUserRegistered = userRegistrations?.some(
    (reg: any) => reg.eventId === eventId && reg.status === 'approved'
  );

  // Get user teams
  const userTeams = teams?.filter((team: any) => {
    // Check if user is a team leader
    if (team.leaderId === currentUserId) return true;
    
    // Check if user is a team member
    const teamMembers = team.members || [];
    return teamMembers.some((member: any) => member.userId === currentUserId);
  });

  // Form setup for creating a team
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
      maxMembers: 4,
      skills: "",
      isOpen: true,
    },
  });

  // Mutation for creating a team
  const createTeamMutation = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      const { skills, ...rest } = values;
      
      // Convert skills string to array
      const skillsArray = skills
        ? skills.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];
      
      const teamData = {
        ...rest,
        skills: skillsArray,
        eventId,
        leaderId: currentUserId,
      };
      
      const response = await apiRequest("POST", "/api/teams", teamData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Team Created",
        description: "Your team has been created successfully.",
      });
      
      // Reset form and switch to find tab
      form.reset();
      setActiveTab("find");
      
      // Invalidate teams cache
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/teams`] });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Team",
        description: "There was a problem creating your team. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating team:", error);
    }
  });

  const onSubmit = (values: TeamFormValues) => {
    createTeamMutation.mutate(values);
  };

  // Loading state
  if (isLoadingEvent || isLoadingTeams || isLoadingUser || isLoadingRegistrations) {
    return (
      <DashboardLayout title="Team Formation" eventId={eventId}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Event not found
  if (!event) {
    return (
      <DashboardLayout title="Team Formation">
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

  // Check if user is registered
  if (!isUserRegistered) {
    return (
      <DashboardLayout title="Team Formation" eventId={eventId}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Registration Required</AlertTitle>
          <AlertDescription>
            You need to register for this event before you can form or join a team.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild>
            <a href={`/events/${eventId}/register`}>Register Now</a>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Team Formation | {event.title} | HackEase</title>
        <meta name="description" content={`Form or join a team for ${event.title} hackathon`} />
      </Helmet>
      
      <DashboardLayout 
        title="Team Formation" 
        description={`Find teammates or create a team for ${event.title}`}
        eventId={eventId}
      >
        {userTeams && userTeams.length > 0 && (
          <Alert className="mb-6 bg-primary/10 border-primary/20">
            <Users className="h-4 w-4 text-primary" />
            <AlertTitle>You're in a Team</AlertTitle>
            <AlertDescription>
              You're already part of {userTeams.length > 1 ? `${userTeams.length} teams` : 'a team'} for this event.
              {userTeams.length === 1 && userTeams[0].leaderId === currentUserId && 
                " You're the leader of this team."}
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs 
          defaultValue="find" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="find" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Find Teams
            </TabsTrigger>
            <TabsTrigger value="match" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Team Matching
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Team
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="find">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Available Teams</h2>
                <p className="text-gray-600 mb-6">
                  Browse through available teams for this hackathon and join one that matches your interests.
                </p>
              </div>
              
              {teams?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team: any) => (
                    <TeamCard 
                      key={team.id} 
                      team={team} 
                      members={team.members || []} 
                      currentUserId={currentUserId}
                      isUserRegistered={isUserRegistered}
                      onJoinSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/teams`] });
                        queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/teams`] });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-medium mb-2">No Teams Yet</h3>
                    <p className="text-gray-600 mb-4">
                      There are no teams for this hackathon yet. Be the first to create one!
                    </p>
                    <Button onClick={() => setActiveTab("create")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create a Team
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="match">
            <TeamMatchingSection 
              eventId={eventId} 
              userSkills={currentUser?.skills || []}
            />
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Team</CardTitle>
                <CardDescription>
                  Set up your team and start collaborating with other participants.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Code Wizards, Tech Titans, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            Choose a memorable and unique team name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell potential teammates about your team, project idea, and what you're looking for..." 
                              {...field} 
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            A good description will attract like-minded teammates.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="maxMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Team Size</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={2} 
                                max={10} 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Including yourself (2-10 members)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desired Skills</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., React, Python, UI/UX Design, etc." 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Comma-separated skills you're looking for in teammates
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="isOpen"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Open for Members</FormLabel>
                            <FormDescription>
                              Allow other participants to join your team
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <CardFooter className="px-0 pb-0 pt-6">
                      <Button 
                        type="submit" 
                        className="ml-auto" 
                        disabled={createTeamMutation.isPending}
                      >
                        {createTeamMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Create Team
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </>
  );
}
