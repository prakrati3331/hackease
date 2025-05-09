import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Target, 
  Sparkles, 
  Bookmark, 
  MessageSquare, 
  FileText, 
  Users, 
  Briefcase,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConfettiGenerator from 'confetti-js';
import { useRef, useEffect } from 'react';

interface RecruiterRewardsProps {
  userId: number;
}

export default function RecruiterRewards({ userId }: RecruiterRewardsProps) {
  const { toast } = useToast();
  const [showCelebration, setShowCelebration] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mock reward data
  const mockRewardsData = {
    coins: 450,
    level: 3,
    levelProgress: 65,
    nextLevelAt: 600,
    badges: [
      { 
        id: 1, 
        name: "Resume Analyzer", 
        description: "Successfully analyzed 10 candidate resumes", 
        icon: <FileText className="h-8 w-8 text-emerald-500" />,
        progress: 100,
        earned: true,
        earnedAt: "2025-05-05" as string
      },
      { 
        id: 2, 
        name: "Top Talent Scout", 
        description: "Bookmarked 5 high-potential candidates", 
        icon: <Bookmark className="h-8 w-8 text-blue-500" />,
        progress: 100,
        earned: true,
        earnedAt: "2025-05-03" as string
      },
      { 
        id: 3, 
        name: "Networking Pro", 
        description: "Sent messages to 15 candidates", 
        icon: <MessageSquare className="h-8 w-8 text-indigo-500" />,
        progress: 53,
        earned: false,
        nextMilestone: "8/15"
      },
      { 
        id: 4, 
        name: "Team Builder", 
        description: "Successfully recruited 3 developers", 
        icon: <Users className="h-8 w-8 text-violet-500" />,
        progress: 67,
        earned: false,
        nextMilestone: "2/3"
      },
      { 
        id: 5, 
        name: "Skills Expert", 
        description: "Assessed candidates' skills 25 times", 
        icon: <Target className="h-8 w-8 text-amber-500" />,
        progress: 40,
        earned: false,
        nextMilestone: "10/25"
      }
    ],
    recentActivities: [
      { type: "resume_analysis", description: "Analyzed Jamie Smith's resume", points: 25, date: "2025-05-08" },
      { type: "bookmark", description: "Bookmarked Alex Johnson", points: 10, date: "2025-05-07" },
      { type: "message", description: "Contacted Taylor Williams", points: 15, date: "2025-05-06" },
      { type: "skill_assessment", description: "Evaluated 3 candidates' React skills", points: 30, date: "2025-05-05" },
    ]
  };
  
  // Display badge progress type
  const displayProgress = (badge: typeof mockRewardsData.badges[0]) => {
    if (badge.earned && badge.earnedAt) {
      return (
        <div className="text-xs text-muted-foreground">
          Earned on {new Date(badge.earnedAt).toLocaleDateString()}
        </div>
      );
    } else {
      return (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span className="font-medium">{badge.nextMilestone}</span>
          </div>
          <Progress value={badge.progress} className="h-1" />
        </div>
      );
    }
  };
  
  // Handle claiming a reward
  const handleClaimReward = () => {
    setShowCelebration(true);
    toast({
      title: "Daily Bonus Claimed!",
      description: "You've earned 50 recruiter coins for logging in today.",
    });
    
    // Reset celebration after animation
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };
  
  // Set up confetti effect
  useEffect(() => {
    if (showCelebration && canvasRef.current) {
      const confettiSettings = {
        target: canvasRef.current,
        max: 150,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: false
      };
      
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      
      return () => confetti.clear();
    }
  }, [showCelebration]);
  
  return (
    <>
      {/* Confetti canvas for celebration */}
      {showCelebration && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-50 pointer-events-none"
        />
      )}
    
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Recruiter Rewards
            </CardTitle>
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-lg font-bold">{mockRewardsData.coins}</span>
              <span className="text-xs text-muted-foreground ml-1">coins</span>
            </div>
          </div>
          <CardDescription>
            Level {mockRewardsData.level} Recruiter • {mockRewardsData.levelProgress}% to Level {mockRewardsData.level + 1}
          </CardDescription>
          <Progress value={mockRewardsData.levelProgress} className="h-2 mt-1" />
        </CardHeader>
        
        <CardContent className="pb-1">
          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="w-full mb-3">
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="badges" className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {mockRewardsData.badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`flex items-start p-3 rounded-lg border ${
                      badge.earned ? 'bg-muted/30' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {badge.icon}
                      {badge.earned && (
                        <div className="mt-1 flex justify-center">
                          <Badge variant="outline" className="text-[10px] px-1 bg-green-50 text-green-700">
                            EARNED
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      {displayProgress(badge)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="space-y-3">
              {mockRewardsData.recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start border-b pb-3 last:border-0">
                  <div className="flex-shrink-0 mr-3">
                    {activity.type === 'resume_analysis' && <FileText className="h-5 w-5 text-primary" />}
                    {activity.type === 'bookmark' && <Bookmark className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'message' && <MessageSquare className="h-5 w-5 text-indigo-500" />}
                    {activity.type === 'skill_assessment' && <Target className="h-5 w-5 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{activity.description}</p>
                      <div className="flex items-center">
                        <Sparkles className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">+{activity.points}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="pt-2">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleClaimReward}
          >
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            Claim Daily Bonus
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            Recruiting Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex">
            <TrendingUp className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Look for candidates with diverse project experience, not just technical skills.</p>
          </div>
          <div className="flex">
            <TrendingUp className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Review a candidate's hackathon projects to evaluate their ability to deliver under time constraints.</p>
          </div>
          <div className="flex">
            <TrendingUp className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Check candidate's collaboration record - team players often succeed in corporate environments.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}