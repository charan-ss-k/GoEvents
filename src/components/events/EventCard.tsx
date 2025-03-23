import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlurContainer from '../ui/BlurContainer';
import { cn } from '@/lib/utils';
import EventDetails from './EventDetails';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  ticketsAvailable: number;
  posterUrl: string;
  price?: number;
  capacity?: number;
  seatsInfo?: {
    vip: number;
    standard: number;
    economy: number;
  };
  startTime?: string;
  endTime?: string;
  className?: string;
  onClick?: () => void;
  description?: string;
  userType?: string; // Add userType prop
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  location,
  attendees,
  ticketsAvailable,
  posterUrl,
  price,
  capacity = 100,
  seatsInfo = { vip: 10, standard: 50, economy: 40 },
  startTime = "10:00 AM",
  endTime = "6:00 PM",
  className,
  onClick,
  description = "No description available",
  userType = "guest" // Default to guest
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleManage = () => {
    setIsDetailsOpen(true);
  };

  const handleViewDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleBookEvent = () => {
    // Logic to book the event
    toast.success("Event booked successfully");
  };

  const getEventStatus = () => {
    const [day, month, year] = date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (eventDate > today) {
      return "upcoming";
    } else if (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    ) {
      return "ongoing";
    } else {
      return "past";
    }
  };

  const sampleAttendeeList = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      ticketType: "VIP",
      checkedIn: true,
      checkInTime: "10:30 AM"
    },
    {
      id: "2",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      ticketType: "Standard",
      checkedIn: false
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit.patel@example.com",
      ticketType: "Economy",
      checkedIn: true,
      checkInTime: "11:45 AM"
    }
  ];

  return (
    <>
      <BlurContainer 
        className={cn(
          "group overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1", 
          className
        )}
      >
        <div className="relative w-full h-40 overflow-hidden rounded-lg mb-4">
          <img 
            src={posterUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
          
          {price !== undefined && (
            <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              ₹{price}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{title}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-futurista-500" />
            <span className="text-muted-foreground">{date}</span>
          </div>
          
          {(startTime && endTime) && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-futurista-500" />
              <span className="text-muted-foreground">{startTime} - {endTime}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-futurista-500" />
            <span className="text-muted-foreground">{location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-futurista-500" />
            <span className="text-muted-foreground">
              {attendees} attendees
              {capacity && ` (${Math.round((attendees/capacity)*100)}% filled)`}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <Ticket className="h-4 w-4 mr-2 text-futurista-500" />
            <span className="text-muted-foreground">{ticketsAvailable} tickets available</span>
          </div>
          
          {seatsInfo && (
            <div className="bg-secondary/30 rounded-md p-2 mt-2">
              <p className="text-xs font-medium mb-1">Seating Information:</p>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div>
                  <span className="text-muted-foreground">VIP:</span> {seatsInfo.vip}
                </div>
                <div>
                  <span className="text-muted-foreground">Standard:</span> {seatsInfo.standard}
                </div>
                <div>
                  <span className="text-muted-foreground">Economy:</span> {seatsInfo.economy}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-auto">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleManage}
          >
            Manage
          </Button>
          <Button 
            className="w-full" 
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          {userType === "client" && (
            <Button 
              className="w-full" 
              onClick={handleBookEvent}
            >
              Book
            </Button>
          )}
        </div>
      </BlurContainer>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="p-0 max-w-4xl">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
          <EventDetails
            id={id}
            title={title}
            description={description}
            date={date}
            startTime={startTime}
            endTime={endTime}
            location={location}
            venue="Main Auditorium"
            address="123 Event Street"
            city={location.split(',')[0]}
            state="Maharashtra"
            capacity={capacity}
            attendees={attendees}
            ticketsAvailable={ticketsAvailable}
            ticketsSold={capacity - ticketsAvailable}
            price={price || 0}
            status={getEventStatus()}
            posterUrl={posterUrl}
            organizerId="1"
            seatsInfo={seatsInfo}
            attendeeList={sampleAttendeeList}
            onClose={() => setIsDetailsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
