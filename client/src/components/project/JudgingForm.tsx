import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProjectScoreSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Loader2, Star } from "lucide-react";

// Schema for judging form
const formSchema = z.object({
  projectId: z.number(),
  judgeId: z.number(),
  criteriaId: z.number(),
  score: z.number().min(1).max(10),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JudgingCriterion {
  id: number;
  name: string;
  description: string;
  weight: number;
}

interface JudgingFormProps {
  projectId: number;
  judgeId: number;
  criteria: JudgingCriterion[];
  onScoreSubmitted?: () => void;
}

export default function JudgingForm({ 
  projectId, 
  judgeId, 
  criteria, 
  onScoreSubmitted 
}: JudgingFormProps) {
  const [currentCriterion, setCurrentCriterion] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const { toast } = useToast();

  // Current criterion being judged
  const criterion = criteria[currentCriterion];

  // Set up the form with default values and validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId,
      judgeId,
      criteriaId: criterion?.id,
      score: 5,
      comment: "",
    },
  });

  // Update form values when criterion changes
  useState(() => {
    if (criterion) {
      form.setValue("criteriaId", criterion.id);
      form.setValue("score", scores[criterion.id] || 5);
      form.setValue("comment", comments[criterion.id] || "");
    }
  });

  const onSubmit = async (data: FormValues) => {
    // Save score and comment for current criterion
    setScores({
      ...scores,
      [criterion.id]: data.score,
    });
    setComments({
      ...comments,
      [criterion.id]: data.comment || "",
    });

    if (currentCriterion < criteria.length - 1) {
      // Move to next criterion
      setCurrentCriterion(currentCriterion + 1);
      return;
    }

    // Submit all scores if on last criterion
    setIsSubmitting(true);
    try {
      // Submit scores for all criteria
      const submissionPromises = criteria.map(crit => {
        return apiRequest("POST", `/api/projects/${projectId}/scores`, {
          projectId,
          judgeId,
          criteriaId: crit.id,
          score: scores[crit.id] || data.score,
          comment: comments[crit.id] || data.comment,
        });
      });

      await Promise.all(submissionPromises);
      
      toast({
        title: "Scores Submitted",
        description: "Your evaluation has been submitted successfully.",
      });
      
      // Invalidate project scores cache
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/scores`] });
      
      if (onScoreSubmitted) {
        onScoreSubmitted();
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      toast({
        title: "Submission Failed",
        description: "There was a problem saving your evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToPreviousCriterion = () => {
    if (currentCriterion > 0) {
      // Save current scores before moving
      setScores({
        ...scores,
        [criterion.id]: form.getValues("score"),
      });
      setComments({
        ...comments,
        [criterion.id]: form.getValues("comment") || "",
      });
      
      setCurrentCriterion(currentCriterion - 1);
    }
  };

  if (!criterion) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>No judging criteria available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Evaluation</CardTitle>
          <Badge className="bg-primary/10 text-primary">
            {currentCriterion + 1} of {criteria.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{criterion.name}</h3>
          <p className="text-gray-600 mb-4">{criterion.description}</p>
          
          <div className="flex gap-2 items-center mb-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <Badge
                key={i}
                variant="outline"
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  scores[criterion.id] === i || (!scores[criterion.id] && i === 5)
                    ? 'bg-primary text-white'
                    : ''
                }`}
              >
                {i}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-6">
            <span>Needs Improvement</span>
            <span>Excellent</span>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...form.register("projectId")} />
            <input type="hidden" {...form.register("judgeId")} />
            <input type="hidden" {...form.register("criteriaId")} />
            
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    Score ({field.value}/10)
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide feedback on this aspect of the project..." 
                      rows={3}
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Your feedback will help the team improve their project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousCriterion}
                disabled={currentCriterion === 0}
              >
                Previous
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentCriterion < criteria.length - 1 ? "Next" : "Submit Evaluation"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
