import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchIcon, FileTextIcon, MessageSquareIcon } from "lucide-react";

const recruitmentFeatures = [
  {
    icon: <SearchIcon className="text-primary mr-2" />,
    title: "Advanced Talent Search",
    description: "Filter candidates by skills, experience, projects, and more to find the perfect match for your team."
  },
  {
    icon: <FileTextIcon className="text-primary mr-2" />,
    title: "Resume Database",
    description: "Access a comprehensive database of participant resumes and portfolios with parsed skill data."
  },
  {
    icon: <MessageSquareIcon className="text-primary mr-2" />,
    title: "Direct Messaging",
    description: "Communicate with potential candidates directly through our integrated messaging system."
  }
];

export default function RecruitmentSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recruitment Made Easy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with top talent and streamline your hiring process with our recruitment portal.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Recruiter reviewing candidate profiles" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-4">Find Your Next Hire</h3>
            <p className="text-gray-600 mb-6">
              Our platform makes it easy for recruiters and sponsors to discover talented developers and engage with them during and after hackathons.
            </p>
            
            <div className="space-y-4">
              {recruitmentFeatures.map((feature, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      {feature.icon}
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8">
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/recruitment">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
