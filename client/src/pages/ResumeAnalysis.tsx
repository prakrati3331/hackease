import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Download,
  Star,
  User,
  MessageCircle,
  Plus,
  File,
  Briefcase
} from "lucide-react";

export default function ResumeAnalysis() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [textContent, setTextContent] = useState("");
  
  // Mock analysis results
  const [analysisResults, setAnalysisResults] = useState<{
    skills: { name: string; level: number; category: string }[];
    experience: { role: string; company: string; duration: string; description: string }[];
    education: { degree: string; institution: string; year: string }[];
    projects: { name: string; technologies: string[]; description: string }[];
    skillMatch: number;
    recommendations: string[];
  } | null>(null);
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // For demo purposes, we'll read the file if it's a text file
      if (selectedFile.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setTextContent(content);
        };
        reader.readAsText(selectedFile);
      }
    }
  };
  
  // Handle resume analysis
  const handleAnalyzeResume = () => {
    if (!file && !textContent) {
      toast({
        title: "No content to analyze",
        description: "Please upload a resume file or enter resume text.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Set mock analysis results
      setAnalysisResults({
        skills: [
          { name: "JavaScript", level: 90, category: "Programming Languages" },
          { name: "React", level: 85, category: "Frontend" },
          { name: "Node.js", level: 80, category: "Backend" },
          { name: "TypeScript", level: 75, category: "Programming Languages" },
          { name: "GraphQL", level: 70, category: "API" },
          { name: "AWS", level: 65, category: "Cloud" },
          { name: "Docker", level: 60, category: "DevOps" },
          { name: "MongoDB", level: 70, category: "Database" },
        ],
        experience: [
          { 
            role: "Senior Frontend Developer", 
            company: "Tech Innovations Inc.", 
            duration: "2022 - Present", 
            description: "Led development of a React-based SaaS platform with 50,000+ users. Improved performance by 40% through code optimization."
          },
          { 
            role: "Full Stack Developer", 
            company: "Digital Solutions LLC", 
            duration: "2019 - 2022", 
            description: "Developed and maintained multiple web applications using MERN stack. Implemented CI/CD pipelines that reduced deployment time by 60%."
          },
          { 
            role: "Junior Developer", 
            company: "WebStart Agency", 
            duration: "2017 - 2019", 
            description: "Worked on client websites using JavaScript, HTML/CSS, and WordPress. Participated in 10+ client projects."
          }
        ],
        education: [
          { degree: "M.S. Computer Science", institution: "Tech University", year: "2017" },
          { degree: "B.S. Software Engineering", institution: "State College", year: "2015" }
        ],
        projects: [
          { 
            name: "E-commerce Platform", 
            technologies: ["React", "Node.js", "MongoDB", "Stripe"], 
            description: "Built a full-featured e-commerce platform with real-time inventory management and payment processing."
          },
          { 
            name: "Health Tracking App", 
            technologies: ["React Native", "Firebase", "Node.js"], 
            description: "Developed a mobile app for tracking health metrics with data visualization and personalized recommendations."
          }
        ],
        skillMatch: 85,
        recommendations: [
          "Candidate has strong frontend skills, particularly in React ecosystem",
          "Relevant experience with cloud services and DevOps practices",
          "Good match for Senior Frontend or Full Stack positions",
          "Consider for roles requiring JavaScript expertise",
          "Demonstrated leadership in previous roles"
        ]
      });
      
      toast({
        title: "Analysis Complete",
        description: "Resume has been successfully analyzed.",
      });
    }, 2000);
  };
  
  // Handle saving to talent pool
  const handleSaveToTalentPool = () => {
    toast({
      title: "Saved to Talent Pool",
      description: "This candidate has been added to your talent pool.",
    });
    navigate("/recruiter-dashboard");
  };
  
  // Get skill level label
  const getSkillLevelLabel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 75) return "Advanced";
    if (level >= 50) return "Intermediate";
    return "Beginner";
  };
  
  // Group skills by category
  const groupedSkills = analysisResults?.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof analysisResults.skills>);
  
  return (
    <>
      <Helmet>
        <title>Resume Analysis | HackEase</title>
      </Helmet>
      
      <DashboardLayout activeTab="resume-analysis" role="recruiter">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Upload and analyze candidate resumes to identify top talent
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Resume Upload
                </CardTitle>
                <CardDescription>
                  Upload a resume file or paste resume content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Choose or drop a file</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PDF, DOC, DOCX, TXT (max 5MB)
                    </p>
                  </Label>
                </div>
                
                {file && (
                  <div className="flex items-center justify-between p-2 border rounded-md bg-muted/30">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <Badge variant="outline">{(file.size / 1024).toFixed(0)} KB</Badge>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="resume-text">Or paste resume text</Label>
                  <Textarea
                    id="resume-text"
                    placeholder="Paste the content of the resume here..."
                    rows={10}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing || (!file && !textContent)}
                >
                  {isAnalyzing ? (
                    "Analyzing Resume..."
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {analysisComplete ? (
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="mr-2 h-5 w-5" />
                  )}
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  {analysisComplete 
                    ? "Review the extracted information and insights" 
                    : "Upload a resume and start analysis to see results"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysisComplete ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
                    <p className="text-muted-foreground">
                      Upload a resume and click "Analyze Resume" to get started
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                      <TabsTrigger value="education">Education & Projects</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="mt-4 space-y-6">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1 p-4 border rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium">Skill Match Score</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {analysisResults?.skillMatch}%
                              </Badge>
                            </div>
                            <Progress value={analysisResults?.skillMatch} className="h-2" />
                            <p className="text-sm text-muted-foreground mt-2">
                              How well the candidate's skills match common hackathon requirements
                            </p>
                          </div>
                          
                          <div className="flex-1 p-4 border rounded-lg bg-muted/30">
                            <h3 className="font-medium mb-2">Top Skills</h3>
                            <div className="flex flex-wrap gap-1">
                              {analysisResults?.skills.slice(0, 5).map((skill, i) => (
                                <Badge key={i} className="bg-primary/10 text-primary">
                                  {skill.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <h3 className="font-medium mb-2">Recommendations</h3>
                          <ul className="space-y-2">
                            {analysisResults?.recommendations.map((rec, i) => (
                              <li key={i} className="flex">
                                <ChevronRight className="h-5 w-5 mr-1 text-primary flex-shrink-0" />
                                <span className="text-sm">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-4 space-y-6">
                      {groupedSkills && Object.entries(groupedSkills).map(([category, skills]) => (
                        <div key={category} className="space-y-3">
                          <h3 className="font-medium text-lg">{category}</h3>
                          <div className="space-y-4">
                            {skills.map((skill, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{skill.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {getSkillLevelLabel(skill.level)}
                                  </span>
                                </div>
                                <Progress value={skill.level} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="experience" className="mt-4 space-y-4">
                      {analysisResults?.experience.map((exp, i) => (
                        <Card key={i}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{exp.role}</CardTitle>
                                <CardDescription>{exp.company}</CardDescription>
                              </div>
                              <Badge variant="outline">{exp.duration}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{exp.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="education" className="mt-4 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Education</h3>
                        {analysisResults?.education.map((edu, i) => (
                          <div key={i} className="flex justify-between p-3 border rounded-md">
                            <div>
                              <div className="font-medium">{edu.degree}</div>
                              <div className="text-sm text-muted-foreground">{edu.institution}</div>
                            </div>
                            <Badge variant="outline">{edu.year}</Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-medium text-lg">Projects</h3>
                        {analysisResults?.projects.map((project, i) => (
                          <Card key={i}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {project.technologies.map((tech, i) => (
                                  <Badge key={i} variant="outline" className="bg-blue-50">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-sm">{project.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
              {analysisComplete && (
                <CardFooter className="flex justify-between border-t p-4">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Analysis
                  </Button>
                  <Button onClick={handleSaveToTalentPool}>
                    <User className="mr-2 h-4 w-4" />
                    Save to Talent Pool
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}