import { 
  CalendarIcon, 
  UserPlusIcon, 
  UsersIcon, 
  GitBranchIcon, 
  BriefcaseIcon, 
  BarChart3Icon,
  ArrowRightIcon
} from "lucide-react";

const features = [
  {
    icon: <CalendarIcon className="text-xl text-primary" />,
    title: "Event Creation",
    description: "Create beautiful landing pages with customizable registration forms and branding options.",
    iconBgColor: "bg-primary/10"
  },
  {
    icon: <UserPlusIcon className="text-xl text-secondary" />,
    title: "Smart Registration",
    description: "One-click registration with resume parsing and intelligent profile creation.",
    iconBgColor: "bg-secondary/10"
  },
  {
    icon: <UsersIcon className="text-xl text-accent" />,
    title: "Team Formation",
    description: "AI-powered team matching based on skills, experience, and participant preferences.",
    iconBgColor: "bg-accent/10"
  },
  {
    icon: <GitBranchIcon className="text-xl text-success" />,
    title: "Project Management",
    description: "Streamlined submission portal with built-in judging system and feedback mechanisms.",
    iconBgColor: "bg-success/10"
  },
  {
    icon: <BriefcaseIcon className="text-xl text-primary" />,
    title: "Recruitment Portal",
    description: "Searchable resume database and hiring interface for sponsors and recruiters.",
    iconBgColor: "bg-primary/10"
  },
  {
    icon: <BarChart3Icon className="text-xl text-secondary" />,
    title: "Analytics Dashboard",
    description: "Real-time insights into participation, engagement, and event performance.",
    iconBgColor: "bg-secondary/10"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Hackathon Management</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers end-to-end solutions for organizers, participants, judges, and recruiters.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full card-hover">
              <div className={`w-12 h-12 ${feature.iconBgColor} rounded-full flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{feature.description}</p>
              <a href="#" className="text-primary font-medium hover:text-primary-dark flex items-center">
                Learn more <ArrowRightIcon className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
