import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials } from "@/lib/utils";
import { UsersIcon, SearchIcon, XIcon, BadgeCheck } from "lucide-react";

interface MatchingUser {
  id: number;
  name: string;
  skills: string[];
  compatibility: number; // 0-100 scale
}

interface TeamMatchingProps {
  eventId: number;
  userSkills: string[];
}

export default function TeamMatchingSection({ 
  eventId, 
  userSkills = [] 
}: TeamMatchingProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [compatibilityThreshold, setCompatibilityThreshold] = useState<number>(50);
  
  const { toast } = useToast();

  // Fetch event registrations
  const { data: registrations, isLoading } = useQuery({
    queryKey: [`/api/events/${eventId}/registrations`]
  });

  // This would normally come from the API, but we'll mock it for now
  // In a real app, we'd calculate compatibility scores on the server
  const matchedUsers: MatchingUser[] = [
    {
      id: 1,
      name: "Alex Johnson",
      skills: ["React", "Node.js", "UI/UX"],
      compatibility: 85
    },
    {
      id: 2,
      name: "Jamie Smith",
      skills: ["Python", "Machine Learning", "Data Science"],
      compatibility: 72
    },
    {
      id: 3,
      name: "Taylor Wilson",
      skills: ["React", "TypeScript", "CSS"],
      compatibility: 68
    },
    {
      id: 4,
      name: "Morgan Lee",
      skills: ["Java", "Spring", "Backend"],
      compatibility: 53
    },
    {
      id: 5,
      name: "Riley Brown",
      skills: ["Mobile", "React Native", "UI Design"],
      compatibility: 48
    }
  ];

  // Filter users based on compatibility threshold and selected skills
  const filteredUsers = matchedUsers
    .filter(user => user.compatibility >= compatibilityThreshold)
    .filter(user => 
      selectedSkills.length === 0 || 
      user.skills.some(skill => selectedSkills.includes(skill))
    );

  // All available skills for filtering from matched users
  const availableSkills = Array.from(
    new Set(matchedUsers.flatMap(user => user.skills))
  ).sort();

  // Handle adding a skill filter
  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Handle removing a skill filter
  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  // Handle sending team invitation
  const handleInvite = (userId: number) => {
    toast({
      title: "Invitation Sent",
      description: "Your team invitation has been sent.",
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            <UsersIcon className="inline mr-2 h-5 w-5 text-primary" />
            Team Matching
          </h3>
          <p className="text-gray-600">Find compatible teammates based on skills and interests.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={compatibilityThreshold.toString()}
            onValueChange={(value) => setCompatibilityThreshold(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Compatibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any compatibility</SelectItem>
              <SelectItem value="25">At least 25%</SelectItem>
              <SelectItem value="50">At least 50%</SelectItem>
              <SelectItem value="75">At least 75%</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={handleAddSkill}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              {availableSkills.map(skill => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSkills.map(skill => (
            <Badge
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 bg-primary/10 text-primary"
            >
              {skill}
              <button onClick={() => handleRemoveSkill(skill)}>
                <XIcon className="h-3 w-3 ml-1" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <SearchIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or compatibility threshold to see more potential teammates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.skills.map(skill => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className={`text-xs ${
                              selectedSkills.includes(skill) ? 'bg-primary/10 text-primary' : ''
                            }`}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`
                      ${user.compatibility >= 75 ? 'bg-success/10 text-success' : 
                        user.compatibility >= 50 ? 'bg-primary/10 text-primary' : 
                        'bg-gray-100 text-gray-700'}
                    `}
                  >
                    {user.compatibility}% Match
                  </Badge>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => handleInvite(user.id)}
                    className="gap-1.5"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Invite to Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
