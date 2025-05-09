import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Users, 
  Award, 
  Briefcase, 
  GraduationCap,
  ArrowLeft,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

// Define registration schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
  confirmPassword: z.string().min(4, { message: "Confirm password must be at least 4 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Role type definitions
type RoleType = "organizer" | "participant" | "judge" | "recruiter";

// Test credentials map
const TEST_CREDENTIALS: Record<RoleType, { email: string; password: string }> = {
  organizer: { email: "testcase@gmail.com", password: "organiser" },
  participant: { email: "testcase@gmail.com", password: "participant" },
  judge: { email: "testcase@gmail.com", password: "judge" },
  recruiter: { email: "testcase@gmail.com", password: "recruiter" }
};

// Role information type
interface RoleInfo {
  title: string;
  description: string;
  icon: JSX.Element;
  route: string;
  password: string;
}

export default function Login() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract role from URL query parameters
  const params = new URLSearchParams(window.location.search);
  const role = (params.get("role") as RoleType) || "participant";
  
  // Role information map
  const rolesInfo: Record<RoleType, RoleInfo> = {
    organizer: {
      title: "Organizer",
      description: "Create and manage hackathon events with powerful tools",
      icon: <Users className="h-12 w-12 text-primary" />,
      route: "/organizer-dashboard",
      password: "organiser"
    },
    participant: {
      title: "Participant",
      description: "Join events, form teams, and showcase your projects",
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      route: "/dashboard",
      password: "participant"
    },
    judge: {
      title: "Judge",
      description: "Evaluate projects with efficient review tools",
      icon: <Award className="h-12 w-12 text-primary" />,
      route: "/judge-dashboard",
      password: "judge"
    },
    recruiter: {
      title: "Recruiter",
      description: "Find top talent from hackathon participants",
      icon: <Briefcase className="h-12 w-12 text-primary" />,
      route: "/recruiter-dashboard",
      password: "recruiter"
    }
  };

  const roleInfo = rolesInfo[role];

  // Login form setup with test email pre-filled
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: TEST_CREDENTIALS[role].email,
      password: "",
    },
  });

  // Register form setup
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Mock login function
  const handleLogin = (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Check if credentials match test credentials
      if (data.email === TEST_CREDENTIALS[role].email && 
          data.password === TEST_CREDENTIALS[role].password) {
        toast({
          title: "Login successful",
          description: `Welcome back, Test ${roleInfo.title}!`,
        });
        navigate(roleInfo.route);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again with the test credentials.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  // Mock register function
  const handleRegister = (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      setActiveTab("login");
      loginForm.setValue("email", data.email);
    }, 1000);
  };

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormValues) => {
    handleLogin(data);
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    handleRegister(data);
  };

  // Fill in test credentials
  const fillTestCredentials = () => {
    loginForm.setValue("email", TEST_CREDENTIALS[role].email);
    loginForm.setValue("password", TEST_CREDENTIALS[role].password);
  };

  return (
    <>
      <Helmet>
        <title>{roleInfo.title} Login | HackEase</title>
        <meta name="description" content={`Log in or register as a ${roleInfo.title.toLowerCase()} on HackEase.`} />
      </Helmet>
      
      <Header />
      
      <main className="py-16 bg-muted/30 min-h-screen flex flex-col items-center justify-center">
        <div className="container px-4 max-w-md">
          <Button 
            variant="ghost" 
            className="mb-6 -ml-2 flex items-center gap-1"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                {roleInfo.icon}
              </div>
              <CardTitle className="text-2xl">
                {roleInfo.title} Portal
              </CardTitle>
              <CardDescription>
                {roleInfo.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-2">
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm">
                  Test credentials:<br />
                  Email: <span className="font-semibold">testcase@gmail.com</span><br />
                  Password: <span className="font-semibold">{roleInfo.password}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 mt-1" 
                    onClick={fillTestCredentials}
                  >
                    Auto-fill
                  </Button>
                </AlertDescription>
              </Alert>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Log In</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your Name" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="you@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="text-center text-sm text-muted-foreground flex justify-center pt-4">
              {activeTab === "login" ? (
                <div>Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>Register</Button></div>
              ) : (
                <div>Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>Log In</Button></div>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </>
  );
}