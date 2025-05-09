import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/lib/utils";
import { 
  Briefcase, 
  MapPin, 
  Globe, 
  GraduationCap, 
  Calendar, 
  Star, 
  Mail, 
  Download, 
  FileText,
  MessageSquare,
  Loader2
} from "lucide-react";

interface CandidateCardProps {
  candidate: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      skills: string[];
      githubUrl?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      resumeUrl?: string;
    };
    jobPreferences: string[];
    locationPreferences: string[];
    workTypePreference: string;
    experienceLevel: string;
    availableFrom?: string;
  };
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message to send to the candidate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setIsContactDialogOpen(false);
      setMessage("");
      
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${candidate.user.name}.`,
      });
    }, 1000);
  };

  const handleDownloadResume = () => {
    if (!candidate.user.resumeUrl) {
      toast({
        title: "Resume Not Available",
        description: "This candidate hasn't uploaded a resume yet.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would download the actual resume file
    toast({
      title: "Resume Downloaded",
      description: "The resume has been downloaded to your device.",
    });
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(candidate.user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{candidate.user.name}</h3>
              <p className="text-gray-600 text-sm">{candidate.experienceLevel} Developer</p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary">
            {candidate.workTypePreference}
          </Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
            <span>Interested in: {candidate.jobPreferences.join(", ")}</span>
          </div>
          
          {candidate.locationPreferences.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>Locations: {candidate.locationPreferences.join(", ")}</span>
            </div>
          )}
          
          {candidate.availableFrom && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>Available from: {new Date(candidate.availableFrom).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="skills">
            <AccordionTrigger className="text-sm font-medium">
              Skills & Expertise
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {candidate.user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between border-t mt-auto">
        <Button variant="outline" onClick={handleDownloadResume}>
          <FileText className="h-4 w-4 mr-2" />
          Resume
        </Button>
        
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contact {candidate.user.name}</DialogTitle>
              <DialogDescription>
                Send a message to introduce yourself and express interest.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 mb-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm impressed by your profile and would like to discuss a potential opportunity at our company..."
                rows={6}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={isSending}>
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>Send Message</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
