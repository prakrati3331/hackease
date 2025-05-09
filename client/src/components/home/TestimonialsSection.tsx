import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";
import { getInitials } from "@/lib/utils";

const testimonials = [
  {
    quote: "HackEase transformed how we run our annual hackathon. Registration and team formation were seamless, and the recruitment portal helped our sponsors find amazing talent.",
    author: "Sarah Johnson",
    role: "Hackathon Director, TechCorp"
  },
  {
    quote: "As a participant, I love how easy it is to register, find teammates with complementary skills, and showcase my projects. I even got hired through the platform!",
    author: "Michael Chen",
    role: "Software Engineer, Former Participant"
  },
  {
    quote: "The recruitment features are outstanding. We found three perfect candidates for our engineering team at the last hackathon we sponsored.",
    author: "Jessica Williams",
    role: "Talent Acquisition, InnovateTech"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from the organizers and participants who've used our platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <QuoteIcon className="text-secondary h-6 w-6" />
                </div>
                <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4 bg-gray-200">
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {getInitials(testimonial.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
