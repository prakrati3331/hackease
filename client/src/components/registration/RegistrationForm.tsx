import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertRegistrationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Upload, FileText, CheckCircle } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ResumeParser from "@/components/recruitment/ResumeParser";

// Extend the insert schema with additional validation if needed
const formSchema = insertRegistrationSchema.extend({
  formData: z.object({
    experience: z.string().min(1, "Experience level is required"),
    interests: z.string().min(1, "Interests are required"),
    expectations: z.string().min(1, "Expectations are required"),
    dietaryRestrictions: z.string().optional(),
    tshirtSize: z.string().min(1, "T-shirt size is required"),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  eventId: number;
  userId: number;
  onSubmitSuccess?: () => void;
}

export default function RegistrationForm({ 
  eventId, 
  userId, 
  onSubmitSuccess 
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Set up the form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId,
      userId,
      status: "pending",
      formData: {
        experience: "",
        interests: "",
        expectations: "",
        dietaryRestrictions: "",
        tshirtSize: "M",
      },
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Submit the registration
      const response = await apiRequest("POST", "/api/registrations", data);
      const registrationData = await response.json();
      
      toast({
        title: "Registration Submitted",
        description: "Your registration has been submitted successfully.",
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate(`/events/${eventId}`);
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeParseSuccess = (data: any) => {
    setResumeData(data);
    setResumeUploaded(true);
    
    // Auto-fill form fields with parsed data if available
    if (data.skills && data.skills.length) {
      form.setValue("formData.interests", data.skills.join(", "));
    }
    
    // Could expand this to populate more fields based on resume data
    
    toast({
      title: "Resume Parsed Successfully",
      description: "Your resume data has been added to your registration.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {!resumeUploaded && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Quick Registration with Resume</h3>
            <p className="text-gray-600 mb-6">
              Upload your resume to automatically fill out parts of the registration form.
            </p>
            <ResumeParser onParseSuccess={handleResumeParseSuccess} />
          </CardContent>
        </Card>
      )}
      
      {resumeUploaded && (
        <Alert className="mb-8 bg-success/10 border-success/20">
          <CheckCircle className="h-5 w-5 text-success" />
          <AlertTitle>Resume Uploaded</AlertTitle>
          <AlertDescription>
            Your resume has been successfully parsed and information has been added to your registration.
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Registration Information</h3>
            
            <FormField
              control={form.control}
              name="formData.experience"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Experience Level</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="">Select experience level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Your current level of programming/development experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="formData.interests"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Skills & Interests</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g., React, Machine Learning, UI/UX Design" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    List your skills and areas of interest (comma separated).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="formData.expectations"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>What do you hope to get from this hackathon?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Your goals and expectations for participating..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="formData.dietaryRestrictions"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Dietary Restrictions (if any)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Vegetarian, Vegan, Gluten-free, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty if none.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="formData.tshirtSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>T-Shirt Size</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <input type="hidden" {...form.register("eventId")} />
          <input type="hidden" {...form.register("userId")} />
          <input type="hidden" {...form.register("status")} />
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Registration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
