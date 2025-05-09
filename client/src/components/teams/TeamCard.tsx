import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Users, UserPlus, CheckCircle2, Loader2 } from "lucide-react";

interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
  role: string;
  joinedAt: string;
  user?: {
    name: string;
    username: string;
    skills: string[];
  };
}

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    description: string;
    eventId: number;
    leaderId: number;
    maxMembers: number;
    isOpen: boolean;
    skills: string[];
  };
  members: TeamMember[];
  currentUserId: number;
  isUserRegistered: boolean;
  onJoinSuccess?: () => void;
}

export function TeamCard({ 
  team, 
  members, 
  currentUserId, 
  isUserRegistered,
  onJoinSuccess 
}: TeamCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const isUserInTeam = members.some(member => member.userId === currentUserId);
  const isTeamLeader = team.leaderId === currentUserId;
  const isTeamFull = members.length >= team.maxMembers;
  
  const handleJoinTeam = async () => {
    if (!isUserRegistered) {
      toast({
        title: "Registration Required",
        description: "You need to register for this event before joining a team.",
        variant: "destructive",
      });
      return;
    }
    
    if (isUserInTeam) {
      toast({
        title: "Already in Team",
        description: "You are already a member of this team.",
      });
      return;
    }
    
    if (isTeamFull) {
      toast({
        title: "Team is Full",
        description: "This team has reached its maximum number of members.",
        variant: "destructive",
      });
      return;
    }
    
    setIsJoining(true);
    try {
      await apiRequest("POST", `/api/teams/${team.id}/members`, {
        userId: currentUserId,
        role: "Member",
      });
      
      toast({
        title: "Team Joined",
        description: "You have successfully joined the team.",
      });
      
      // Invalidate teams cache
      queryClient.invalidateQueries({ queryKey: [`/api/events/${team.eventId}/teams`] });
      
      if (onJoinSuccess) {
        onJoinSuccess();
      }
    } catch (error) {
      console.error("Error joining team:", error);
      toast({
        title: "Error Joining Team",
        description: "There was a problem joining the team. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="card-hover overflow-hidden h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
            <p className="text-gray-600 mb-4">{team.description}</p>
          </div>
          <Badge className={team.isOpen ? "bg-success/10 text-success" : "bg-gray-100 text-gray-800"}>
            {team.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
        
        {team.skills?.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Looking for skills:</p>
            <div className="flex flex-wrap gap-2">
              {team.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <div className="flex items-center mb-2">
            <Users className="h-4 w-4 text-gray-500 mr-2" />
            <p className="text-sm font-medium text-gray-700">
              Team Members ({members.length}/{team.maxMembers})
            </p>
          </div>
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {member.user ? getInitials(member.user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.user?.name || `User ${member.userId}`}
                    {member.userId === team.leaderId && (
                      <Badge variant="outline" className="ml-2 text-xs">Leader</Badge>
                    )}
                  </p>
                  {member.user?.skills && (
                    <p className="text-xs text-gray-500">
                      {member.user.skills.slice(0, 3).join(", ")}
                      {member.user.skills.length > 3 && "..."}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 border-t mt-auto">
        {isUserInTeam ? (
          <Button className="w-full bg-success hover:bg-success/90" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            You're a Member
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleJoinTeam}
            disabled={isJoining || isTeamFull || !team.isOpen}
          >
            {isJoining ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            {isTeamFull ? "Team Full" : "Join Team"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
