import React from "react";
import EventCard from "./EventCard";

const EventsList: React.FC<{ events: any[], userType: string }> = ({ events, userType }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard key={event.id} {...event} userType={userType} />
      ))}
    </div>
  );
};

export default EventsList;
