import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/shared/DashboardLayout";
import EventForm from "@/components/event/EventForm";

export default function CreateEvent() {
  return (
    <>
      <Helmet>
        <title>Create Event | HackEase</title>
        <meta name="description" content="Create a new hackathon event with customizable branding and registration options." />
      </Helmet>
      
      <DashboardLayout
        title="Create New Event"
        description="Set up your hackathon event and customize all aspects."
      >
        <EventForm />
      </DashboardLayout>
    </>
  );
}
