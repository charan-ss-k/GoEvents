
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import EventCard from '@/components/events/EventCard';
import EventForm from '@/components/events/EventForm';
import PosterGenerator from '@/components/events/PosterGenerator';
import BlurContainer from '@/components/ui/BlurContainer';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface EventData {
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
  organizerId?: string;
  description?: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPosterDialogOpen, setIsPosterDialogOpen] = useState(false);
  
  // Sample event data for development
  useEffect(() => {
    const sampleEvents = [
      {
        id: '1',
        title: 'Tech Conference 2025',
        date: '01-06-2025',
        location: 'Mumbai, India',
        attendees: 45,
        ticketsAvailable: 55,
        capacity: 100,
        posterUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
        price: 2999,
        seatsInfo: {
          vip: 10,
          standard: 40,
          economy: 50
        },
        startTime: '10:00 AM',
        endTime: '6:00 PM',
        organizerId: '1',
        description: 'Join us for the biggest tech event in India'
      },
      {
        id: '2',
        title: 'Music Festival',
        date: '15-07-2025',
        location: 'Delhi, India',
        attendees: 120,
        ticketsAvailable: 380,
        capacity: 500,
        posterUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
        price: 1999,
        seatsInfo: {
          vip: 50,
          standard: 200,
          economy: 250
        },
        startTime: '4:00 PM',
        endTime: '11:00 PM',
        organizerId: '1',
        description: 'Experience the best music artists in one place'
      },
      {
        id: '3',
        title: 'Business Summit',
        date: '10-03-2025',
        location: 'Bangalore, India',
        attendees: 30,
        ticketsAvailable: 70,
        capacity: 100,
        posterUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop',
        price: 5999,
        seatsInfo: {
          vip: 20,
          standard: 50,
          economy: 30
        },
        startTime: '9:00 AM',
        endTime: '5:00 PM',
        organizerId: '1',
        description: 'Network with industry leaders and grow your business'
      }
    ];
    
    setEvents(sampleEvents);
  }, []);
  
  // Filter events based on search
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get current date for comparison
  const currentDate = new Date();
  
  // Separate events into upcoming and past
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = parseDate(event.date);
    return eventDate >= currentDate;
  });
  
  const pastEvents = filteredEvents.filter(event => {
    const eventDate = parseDate(event.date);
    return eventDate < currentDate;
  });
  
  // Helper function to parse date in DD-MM-YYYY format
  function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  const handleCreateEvent = (eventData: any) => {
    const newEvent: EventData = {
      id: Date.now().toString(),
      title: eventData.name,
      date: eventData.date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).replace(/\//g, '-'),
      location: eventData.location,
      attendees: 0,
      ticketsAvailable: eventData.capacity,
      capacity: eventData.capacity,
      posterUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
      price: parseFloat(eventData.price),
      seatsInfo: {
        vip: Math.floor(eventData.capacity * 0.2),
        standard: Math.floor(eventData.capacity * 0.5),
        economy: Math.floor(eventData.capacity * 0.3)
      },
      description: eventData.description
    };
    
    setEvents([newEvent, ...events]);
    setIsCreateDialogOpen(false);
    toast.success('Event created successfully!');
  };
  
  const exportEventData = () => {
    const worksheet = XLSX.utils.json_to_sheet(events);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    XLSX.writeFile(workbook, "Events_Data.xlsx");
    
    toast.success('Events data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Events</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your events
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new event.
                    </DialogDescription>
                  </DialogHeader>
                  <EventForm onSubmit={handleCreateEvent} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isPosterDialogOpen} onOpenChange={setIsPosterDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Generate Poster
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>AI Poster Generator</DialogTitle>
                    <DialogDescription>
                      Create professional event posters with AI
                    </DialogDescription>
                  </DialogHeader>
                  <PosterGenerator />
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={exportEventData}
                disabled={events.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          <BlurContainer className="px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 flex-1"
                />
              </div>
            </div>
          </BlurContainer>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Events ({filteredEvents.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="animate-fade-in">
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location}
                      attendees={event.attendees}
                      ticketsAvailable={event.ticketsAvailable}
                      posterUrl={event.posterUrl}
                      price={event.price}
                      capacity={event.capacity}
                      seatsInfo={event.seatsInfo}
                      startTime={event.startTime}
                      endTime={event.endTime}
                    />
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No events found</h3>
                  <p className="text-muted-foreground">
                    Create your first event to get started.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="animate-fade-in">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard 
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location}
                      attendees={event.attendees}
                      ticketsAvailable={event.ticketsAvailable}
                      posterUrl={event.posterUrl}
                      price={event.price}
                      capacity={event.capacity}
                      seatsInfo={event.seatsInfo}
                      startTime={event.startTime}
                      endTime={event.endTime}
                    />
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No upcoming events</h3>
                  <p className="text-muted-foreground">
                    Create an event with a future date to see it here.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="animate-fade-in">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event.id}
                      id={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location}
                      attendees={event.attendees}
                      ticketsAvailable={event.ticketsAvailable}
                      posterUrl={event.posterUrl}
                      price={event.price}
                      capacity={event.capacity}
                      seatsInfo={event.seatsInfo}
                      startTime={event.startTime}
                      endTime={event.endTime}
                    />
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No past events</h3>
                  <p className="text-muted-foreground">
                    Events with past dates will appear here.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Events;
