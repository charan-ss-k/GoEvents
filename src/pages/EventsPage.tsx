import React, { useEffect, useState } from "react";
import EventsList from "@/components/events/EventsList";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState([]);
  const userType = "client"; // This should be dynamically set based on the logged-in user

  useEffect(() => {
    // Fetch events from the API
    fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <EventsList events={events} userType={userType} />
    </div>
  );
};

export default EventsPage;
