
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EventCard from '@/components/events/EventCard';
import EventForm from '@/components/events/EventForm';
import { ScrollArea } from '@/components/ui/scroll-area';

// Array of random event images
const eventImages = [
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=800&q=80',
];

// Function to get a random image from the array
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * eventImages.length);
  return eventImages[randomIndex];
};

const Events = () => {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  
  // Sample events data - in a real app, this would come from an API
  const events = [
    {
      id: '1',
      title: 'Tech Conference 2025',
      date: '2025-05-15T09:00:00',
      location: 'Convention Center, Silicon Valley',
      description: 'Annual gathering of tech enthusiasts and professionals.',
      image: getRandomImage(),
      attendees: 1200,
      ticketsSold: 850,
    },
    {
      id: '2',
      title: 'Music Festival',
      date: '2025-06-20T16:00:00',
      location: 'Central Park, New York',
      description: 'A weekend of amazing performances from top artists.',
      image: getRandomImage(),
      attendees: 5000,
      ticketsSold: 4200,
    },
    {
      id: '3',
      title: 'Startup Pitch Competition',
      date: '2025-04-10T13:00:00',
      location: 'Innovation Hub, Boston',
      description: 'Entrepreneurs present their ideas to potential investors.',
      image: getRandomImage(),
      attendees: 300,
      ticketsSold: 280,
    },
    {
      id: '4',
      title: 'AI Summit 2025',
      date: '2025-07-05T10:00:00',
      location: 'Tech Center, San Francisco',
      description: 'Exploring the latest advancements in artificial intelligence.',
      image: getRandomImage(),
      attendees: 800,
      ticketsSold: 650,
    },
    {
      id: '5',
      title: 'Design Conference',
      date: '2025-08-15T09:30:00',
      location: 'Creative Hub, Los Angeles',
      description: 'Bringing together designers from around the world.',
      image: getRandomImage(),
      attendees: 600,
      ticketsSold: 450,
    },
    {
      id: '6',
      title: 'Blockchain Forum',
      date: '2025-09-22T11:00:00',
      location: 'Financial District, Chicago',
      description: 'Discussing the future of blockchain and cryptocurrency.',
      image: getRandomImage(),
      attendees: 400,
      ticketsSold: 320,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Manage and monitor your events</p>
          </div>
          <Button 
            onClick={() => setIsCreateEventOpen(true)}
            className="mt-4 md:mt-0"
          >
            Create New Event
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              attendees={event.attendees}
              ticketsAvailable={event.attendees - event.ticketsSold}
              posterUrl={event.image}
              description={event.description}
            />
          ))}
        </div>

        <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details to create your new event
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <EventForm onSubmit={() => setIsCreateEventOpen(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Events;
