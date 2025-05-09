import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function PlatformDemoSection() {
  const [activeTab, setActiveTab] = useState("organizers");

  const organizerSteps = [
    {
      number: 1,
      title: "Create Your Event",
      description: "Customize your event page with branding, registration forms, and event details in minutes."
    },
    {
      number: 2,
      title: "Manage Registrations",
      description: "Review participant profiles, approve registrations, and access participant data all in one place."
    },
    {
      number: 3,
      title: "Facilitate Team Formation",
      description: "Help participants find teammates with our matching algorithm or let them form teams on their own."
    },
    {
      number: 4,
      title: "Run Your Event",
      description: "Collect submissions, manage judging, and announce winners all through a unified platform."
    }
  ];

  const participantSteps = [
    {
      number: 1,
      title: "Find Hackathons",
      description: "Discover exciting hackathon opportunities and filter them by location, technology, or date."
    },
    {
      number: 2,
      title: "One-Click Registration",
      description: "Register easily by uploading your resume or connecting your GitHub account."
    },
    {
      number: 3,
      title: "Form or Join a Team",
      description: "Find teammates with complementary skills using our AI-powered matching algorithm."
    },
    {
      number: 4,
      title: "Submit Your Project",
      description: "Showcase your project with code repositories, demos, and presentations all in one place."
    }
  ];

  const sponsorSteps = [
    {
      number: 1,
      title: "Set Up Recruitment Portal",
      description: "Configure your company profile and define the skills and roles you're looking for."
    },
    {
      number: 2,
      title: "Review Participants",
      description: "Browse through participant profiles, filter by skills, and view their project submissions."
    },
    {
      number: 3,
      title: "Connect with Talent",
      description: "Reach out to promising candidates directly through our integrated messaging system."
    },
    {
      number: 4,
      title: "Track Hiring Progress",
      description: "Manage your recruitment pipeline and track candidate engagement all in one place."
    }
  ];

  return (
    <section id="platform-demo" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the end-to-end hackathon management experience for organizers and participants.
          </p>
        </div>
        
        <Tabs 
          defaultValue="organizers" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex w-full justify-center mb-8 border-b">
            <TabsTrigger 
              value="organizers" 
              className={cn(
                "flex-1 max-w-[200px] px-6 py-3 font-medium border-b-2 transition-all data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700",
                activeTab === "organizers" ? "border-primary text-primary" : ""
              )}
            >
              For Organizers
            </TabsTrigger>
            <TabsTrigger 
              value="participants"
              className={cn(
                "flex-1 max-w-[200px] px-6 py-3 font-medium border-b-2 transition-all data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700",
                activeTab === "participants" ? "border-primary text-primary" : ""
              )}
            >
              For Participants
            </TabsTrigger>
            <TabsTrigger 
              value="sponsors"
              className={cn(
                "flex-1 max-w-[200px] px-6 py-3 font-medium border-b-2 transition-all data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700",
                activeTab === "sponsors" ? "border-primary text-primary" : ""
              )}
            >
              For Sponsors
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="organizers" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {organizerSteps.map((step, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 font-bold">
                        {step.number}
                      </div>
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-11">{step.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-1 rounded-lg shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Hackathon management dashboard" 
                  className="rounded-md w-full h-auto" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="participants" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {participantSteps.map((step, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center mr-3 font-bold">
                        {step.number}
                      </div>
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-11">{step.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-1 rounded-lg shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Participant dashboard" 
                  className="rounded-md w-full h-auto" 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sponsors" className="mt-0">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {sponsorSteps.map((step, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 font-bold">
                        {step.number}
                      </div>
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 ml-11">{step.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-1 rounded-lg shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Sponsor recruitment dashboard" 
                  className="rounded-md w-full h-auto" 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
