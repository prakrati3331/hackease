import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProjectSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Github, Link as LinkIcon, Upload, FileText } from "lucide-react";

// Extend the insert schema with additional validation
const formSchema = insertProjectSchema.extend({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  repoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  presentationUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectSubmissionFormProps {
  eventId: number;
  teamId: number;
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
  projectId?: number;
  onSubmitSuccess?: (data: any) => void;
}

export default function ProjectSubmissionForm({ 
  eventId, 
  teamId, 
  defaultValues,
  isEdit = false,
  projectId,
  onSubmitSuccess 
}: ProjectSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Set up the form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      eventId,
      teamId,
      repoUrl: "",
      demoUrl: "",
      presentationUrl: "",
      status: "submitted",
      ...defaultValues
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      let response;
      
      if (isEdit && projectId) {
        // Update existing project
        response = await apiRequest("PATCH", `/api/projects/${projectId}`, data);
      } else {
        // Create new project
        response = await apiRequest("POST", "/api/projects", data);
      }
      
      const projectData = await response.json();
      
      toast({
        title: isEdit ? "Project Updated" : "Project Submitted",
        description: isEdit 
          ? "Your project has been updated successfully." 
          : "Your project has been submitted successfully.",
      });
      
      // Invalidate projects cache
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/projects`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      
      if (onSubmitSuccess) {
        onSubmitSuccess(projectData);
      } else {
        navigate(`/events/${eventId}`);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem saving your project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Project Submission" : "Submit Your Project"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., EcoTracker, SmartBudget, etc." 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a memorable name for your project.
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
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what your project does, what problem it solves, and how it works..." 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Include information about technology used, challenges, and future plans.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="repoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repository</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="https://github.com/username/repo" 
                          {...field} 
                          value={field.value || ""}
                        />
                        <Github className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to your code repository (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="https://yourdemo.com" 
                          {...field} 
                          value={field.value || ""}
                        />
                        <LinkIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Link to a live demo if available (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="presentationUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presentation Link</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="https://slides.com/yourpresentation" 
                        {...field} 
                        value={field.value || ""}
                      />
                      <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Link to your presentation slides (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="hidden" {...form.register("eventId")} />
            <input type="hidden" {...form.register("teamId")} />
            <input type="hidden" {...form.register("status")} />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Project" : "Submit Project"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
