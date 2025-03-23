
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MapPin, Users, Ticket, Filter, Clock, Download, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurContainer from '@/components/ui/BlurContainer';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

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
  description?: string;
}

interface TicketType {
  name: string;
  price: number;
  available: number;
}

interface BookingData {
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketType: string;
  ticketPrice: number;
  bookingDate: string;
  ticketId: string;
}

const BookTickets: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  
  // Sample event data
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
        description: 'Network with industry leaders and grow your business'
      }
    ];
    
    setEvents(sampleEvents);
    
    // Load any existing bookings from localStorage
    const storedBookings = localStorage.getItem('clientBookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);
  
  // Filter events based on search
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleBookEvent = (event: EventData) => {
    setSelectedEvent(event);
    setSelectedTicketType('');
    setTicketQuantity(1);
    setIsBookingDialogOpen(true);
  };
  
  const getTicketTypes = (event: EventData): TicketType[] => {
    if (!event.seatsInfo) return [];
    
    return [
      { 
        name: 'VIP', 
        price: event.price ? event.price * 2 : 0, 
        available: event.seatsInfo.vip 
      },
      { 
        name: 'Standard', 
        price: event.price ? event.price : 0, 
        available: event.seatsInfo.standard 
      },
      { 
        name: 'Economy', 
        price: event.price ? event.price * 0.7 : 0, 
        available: event.seatsInfo.economy 
      }
    ];
  };
  
  const getSelectedTicketPrice = (): number => {
    if (!selectedEvent) return 0;
    
    const ticketTypes = getTicketTypes(selectedEvent);
    const selectedType = ticketTypes.find(type => type.name === selectedTicketType);
    
    return selectedType ? selectedType.price * ticketQuantity : 0;
  };
  
  const handleConfirmBooking = () => {
    if (!selectedEvent || !selectedTicketType || !user) {
      toast.error('Please select a ticket type');
      return;
    }
    
    // Generate a unique ticket ID
    const ticketId = `TKT-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-4)}`;
    
    // Create booking record
    const newBooking: BookingData = {
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      userId: user.id,
      userName: user.user_metadata?.full_name || 'Client',
      userEmail: user.email || '',
      ticketType: selectedTicketType,
      ticketPrice: getSelectedTicketPrice() / ticketQuantity,
      bookingDate: new Date().toISOString(),
      ticketId: ticketId
    };
    
    // Add to bookings
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    
    // Save to localStorage (in a real app, this would be saved to a database)
    localStorage.setItem('clientBookings', JSON.stringify(updatedBookings));
    
    // Update the Excel file for admin (in a real app, this would be done on the server)
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(updatedBookings);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "client_bookings.xlsx");
    
    // Log this action for recent activity
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Ticket booked: ${selectedEvent.title} (${selectedTicketType}) by ${user.email}`);
    
    // Success message and close dialog
    toast.success('Ticket booked successfully!');
    setIsBookingDialogOpen(false);
  };
  
  const handleShowQrCode = (booking: BookingData) => {
    setSelectedBooking(booking);
    setIsQrDialogOpen(true);
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] QR code viewed for ticket: ${booking.ticketId}`);
  };
  
  const handleDownloadTicket = (booking: BookingData) => {
    // In a real implementation, this would generate a PDF ticket
    // For now, we'll just create a text file with the ticket details
    const event = events.find(e => e.id === booking.eventId);
    
    const ticketData = `
      Ticket ID: ${booking.ticketId}
      Event: ${booking.eventTitle}
      Date: ${event?.date || 'N/A'}
      Time: ${event?.startTime || 'N/A'} - ${event?.endTime || 'N/A'}
      Location: ${event?.location || 'N/A'}
      Ticket Type: ${booking.ticketType}
      Price: ₹${booking.ticketPrice}
      Booked by: ${booking.userName} (${booking.userEmail})
      Booking Date: ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket-${booking.ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Ticket downloaded successfully');
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Ticket downloaded: ${booking.ticketId}`);
  };
  
  // Function to render client tickets
  const renderMyTickets = () => {
    const userBookings = bookings.filter(booking => 
      user && booking.userId === user.id
    );
    
    if (userBookings.length === 0) {
      return (
        <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
          <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tickets yet</h3>
          <p className="text-muted-foreground">
            Book tickets for events to see them here
          </p>
        </BlurContainer>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userBookings.map((booking) => (
          <TicketCard 
            key={booking.ticketId}
            booking={booking}
            event={events.find(e => e.id === booking.eventId)}
            onShowQr={() => handleShowQrCode(booking)}
            onDownload={() => handleDownloadTicket(booking)}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Book Tickets</h1>
              <p className="text-muted-foreground mt-1">
                Find and book tickets for amazing events
              </p>
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
                  aria-label="Search events"
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </BlurContainer>
          
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="events">Available Events</TabsTrigger>
              <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="animate-fade-in">
              {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id}
                      event={event}
                      onBookEvent={handleBookEvent}
                    />
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No events found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or check back later
                  </p>
                </BlurContainer>
              )}
            </TabsContent>
            
            <TabsContent value="my-tickets" className="animate-fade-in">
              {renderMyTickets()}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Booking Dialog */}
      {selectedEvent && (
        <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Book Tickets for {selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Select ticket type and quantity to proceed with booking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-2 bg-secondary/20 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">{selectedEvent.date} ({selectedEvent.startTime} - {selectedEvent.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{selectedEvent.location}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Select Ticket Type</h4>
                <div className="grid grid-cols-3 gap-2">
                  {getTicketTypes(selectedEvent).map((type) => (
                    <Button
                      key={type.name}
                      variant={selectedTicketType === type.name ? "default" : "outline"}
                      onClick={() => setSelectedTicketType(type.name)}
                      disabled={type.available <= 0}
                      className="w-full"
                    >
                      {type.name}
                      <div className="text-xs font-normal ml-1">
                        (₹{type.price.toFixed(0)})
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Quantity</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{ticketQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-secondary/20 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">₹{getSelectedTicketPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleConfirmBooking}
                disabled={!selectedTicketType || !user}
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* QR Code Dialog */}
      {selectedBooking && (
        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent className="max-w-xs">
            <DialogHeader>
              <DialogTitle>Ticket QR Code</DialogTitle>
              <DialogDescription>
                Show this QR code at the venue for check-in
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center">
              {/* Simulated QR code */}
              <div className="bg-white p-4 rounded-lg">
                <svg
                  viewBox="0 0 100 100"
                  className="w-48 h-48"
                  style={{ margin: 'auto' }}
                >
                  <path
                    d="M30,30 L30,50 L50,50 L50,30 Z M55,30 L55,35 L60,35 L60,30 Z M65,30 L65,35 L70,35 L70,30 Z M55,40 L55,45 L60,45 L60,40 Z M30,55 L30,70 L45,70 L45,55 Z M55,55 L55,60 L65,60 L65,55 Z M70,55 L70,70 L55,70 L55,75 L70,75 L70,65 L75,65 L75,55 Z M30,75 L30,80 L35,80 L35,75 Z M40,75 L40,80 L45,80 L45,75 Z M35,40 L35,45 L45,45 L45,35 L40,35 L40,40 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold">{selectedBooking.ticketId}</p>
                <p className="text-sm mt-1">{selectedBooking.eventTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedBooking.ticketType} Ticket
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleDownloadTicket(selectedBooking)} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Event Card Component for client booking interface
const EventCard: React.FC<{ 
  event: EventData; 
  onBookEvent: (event: EventData) => void;
}> = ({ event, onBookEvent }) => {
  return (
    <BlurContainer className="overflow-hidden group transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      <div className="relative w-full h-40 overflow-hidden rounded-lg mb-4">
        <img 
          src={event.posterUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        
        {event.price !== undefined && (
          <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            From ₹{event.price}
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 line-clamp-1">{event.title}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          <span className="text-muted-foreground">{event.date}</span>
        </div>
        
        {(event.startTime && event.endTime) && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span className="text-muted-foreground">{event.startTime} - {event.endTime}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          <span className="text-muted-foreground">{event.location}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Ticket className="h-4 w-4 mr-2 text-primary" />
          <span className="text-muted-foreground">{event.ticketsAvailable} tickets available</span>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        onClick={() => onBookEvent(event)}
      >
        Book Tickets
      </Button>
    </BlurContainer>
  );
};

// Ticket Card Component for "My Tickets" section
const TicketCard: React.FC<{ 
  booking: BookingData; 
  event?: EventData;
  onShowQr: () => void;
  onDownload: () => void;
}> = ({ booking, event, onShowQr, onDownload }) => {
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="text-lg">{booking.eventTitle}</CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
            {booking.ticketType}
          </span>
          <span className="ml-2">Ticket #{booking.ticketId}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {event && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <span>{event.date}</span>
            </div>
            {(event.startTime && event.endTime) && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{event.location}</span>
            </div>
          </div>
        )}
        <div className="bg-muted/30 p-2 rounded-md mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">₹{booking.ticketPrice}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking Date</p>
              <p className="font-medium">{new Date(booking.bookingDate).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={onShowQr}>
          <QrCode className="mr-2 h-4 w-4" />
          Show QR
        </Button>
        <Button size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookTickets;
