import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ListFilter, ListX, Search, Ticket as TicketIcon, User, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { QrScanner } from '@/components/check-in/QrScanner';
import BlurContainer from '@/components/ui/BlurContainer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import LiveDataTracker from '@/components/dashboard/LiveDataTracker';

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketId: string;
  ticketType: string;
  checkedIn: boolean;
  checkInTime?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  attendeeCount: number;
  checkedInCount: number;
}

const CheckIn: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  
  // Load events and check for URL params on component mount
  useEffect(() => {
    if (user.user_type === 'worker') {
      toast.error('Workers are not allowed to check in or see participants.');
      return;
    }
    const loadEvents = () => {
      // In a real app, fetch from API or database
      const mockEvents: Event[] = [
        { id: '1', name: 'Tech Conference 2025', date: '2025-06-01', attendeeCount: 100, checkedInCount: 45 },
        { id: '2', name: 'Music Festival', date: '2025-07-15', attendeeCount: 500, checkedInCount: 120 },
        { id: '3', name: 'Business Summit', date: '2025-03-10', attendeeCount: 100, checkedInCount: 30 }
      ];
      setEvents(mockEvents);
      
      // Check URL params for event ID
      const params = new URLSearchParams(window.location.search);
      const eventId = params.get('event');
      if (eventId) {
        setSelectedEvent(eventId);
        loadAttendeesForEvent(eventId);
      }
    };
    
    loadEvents();
  }, [user]);
  
  // Filter attendees when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAttendees(attendees);
      return;
    }
    
    const filtered = attendees.filter(
      attendee => 
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees]);
  
  const loadAttendeesForEvent = (eventId: string) => {
    // In a real app, fetch from API or database
    const mockAttendees: Attendee[] = Array.from({ length: 50 }, (_, i) => {
      const checkedIn = Math.random() > 0.5;
      return {
        id: `a-${i}`,
        name: `Attendee ${i + 1}`,
        email: `attendee${i + 1}@example.com`,
        ticketId: `TKT-${1000 + i}`,
        ticketType: ['VIP', 'Standard', 'Economy'][Math.floor(Math.random() * 3)],
        checkedIn,
        ...(checkedIn && { checkInTime: new Date().toISOString() })
      };
    });
    
    setAttendees(mockAttendees);
    setFilteredAttendees(mockAttendees);
    
    // Log this action for recent activity
    const selectedEventName = events.find(e => e.id === eventId)?.name || 'Unknown Event';
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Loaded attendees for event: ${selectedEventName}`);
  };
  
  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    loadAttendeesForEvent(eventId);
    setScanMode(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by useEffect
  };
  
  const handleQrSuccess = (ticketId: string) => {
    const attendee = attendees.find(a => a.ticketId === ticketId);
    
    if (!attendee) {
      toast.error(`Ticket not found: ${ticketId}`);
      return;
    }
    
    if (attendee.checkedIn) {
      toast.error(`Attendee ${attendee.name} already checked in`);
      return;
    }
    
    // Process check-in
    const updatedAttendees = attendees.map(a => 
      a.id === attendee.id 
        ? { ...a, checkedIn: true, checkInTime: new Date().toISOString() } 
        : a
    );
    
    setAttendees(updatedAttendees);
    setFilteredAttendees(updatedAttendees);
    
    toast.success(`Successfully checked in ${attendee.name}`);
    
    // Log this action for recent activity
    const selectedEventName = events.find(e => e.id === selectedEvent || '')?.name || 'Unknown Event';
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Checked in: ${attendee.name} (${ticketId}) for event: ${selectedEventName}`);
    
    // Reset scan mode
    setScanMode(false);
  };
  
  const toggleCheckinStatus = (attendeeId: string) => {
    const updatedAttendees = attendees.map(a => {
      if (a.id === attendeeId) {
        const newStatus = !a.checkedIn;
        return {
          ...a,
          checkedIn: newStatus,
          checkInTime: newStatus ? new Date().toISOString() : undefined
        };
      }
      return a;
    });
    
    setAttendees(updatedAttendees);
    setFilteredAttendees(updatedAttendees);
    
    const attendee = attendees.find(a => a.id === attendeeId);
    if (attendee) {
      if (!attendee.checkedIn) {
        toast.success(`Checked in ${attendee.name}`);
      } else {
        toast.info(`Removed check-in for ${attendee.name}`);
      }
      
      // Log this action for recent activity
      const selectedEventName = events.find(e => e.id === selectedEvent || '')?.name || 'Unknown Event';
      console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] ${!attendee.checkedIn ? 'Checked in' : 'Removed check-in for'}: ${attendee.name} for event: ${selectedEventName}`);
    }
  };
  
  // Gets the selected event data
  const getSelectedEventData = (): Event | undefined => {
    return events.find(e => e.id === selectedEvent);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Check-in</h1>
            <p className="text-muted-foreground mt-1">
              Scan tickets or search attendees for event check-in
            </p>
          </div>
          
          {!selectedEvent ? (
            <BlurContainer className="p-6">
              <h2 className="text-xl font-semibold mb-4">Select an Event</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map(event => (
                  <Card 
                    key={event.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleEventSelect(event.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString('en-IN')}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Attendees</p>
                          <p className="font-medium">{event.attendeeCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Checked In</p>
                          <p className="font-medium">{event.checkedInCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className="font-medium">{Math.round((event.checkedInCount / event.attendeeCount) * 100)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </BlurContainer>
          ) : (
            <>
              <BlurContainer className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {getSelectedEventData()?.name || 'Selected Event'}
                    </h2>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {getSelectedEventData()?.date 
                        ? new Date(getSelectedEventData()!.date).toLocaleDateString('en-IN')
                        : 'Event Date'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Change Event
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setScanMode(true);
                        setActiveTab('scan');
                      }}
                    >
                      <TicketIcon className="h-4 w-4 mr-2" />
                      Scan Ticket
                    </Button>
                  </div>
                </div>
              </BlurContainer>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="list">
                        <ListFilter className="h-4 w-4 mr-2" />
                        Attendee List
                      </TabsTrigger>
                      <TabsTrigger value="scan">
                        <TicketIcon className="h-4 w-4 mr-2" />
                        Scan Tickets
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                      <BlurContainer className="p-4">
                        <form onSubmit={handleSearch} className="mb-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder="Search by name, email or ticket ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </form>
                        
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Attendees ({filteredAttendees.length})</h3>
                          <div className="text-sm text-muted-foreground">
                            {attendees.filter(a => a.checkedIn).length} checked in
                          </div>
                        </div>
                        
                        {filteredAttendees.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-2 px-3 text-left font-medium text-sm">Name</th>
                                  <th className="py-2 px-3 text-left font-medium text-sm">Ticket</th>
                                  <th className="py-2 px-3 text-left font-medium text-sm">Type</th>
                                  <th className="py-2 px-3 text-left font-medium text-sm">Status</th>
                                  <th className="py-2 px-3 text-right font-medium text-sm">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAttendees.map(attendee => (
                                  <tr key={attendee.id} className="border-b last:border-0 hover:bg-secondary/10">
                                    <td className="py-2 px-3">
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <div>
                                          <div className="font-medium text-sm">{attendee.name}</div>
                                          <div className="text-xs text-muted-foreground">{attendee.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2 px-3 text-sm">{attendee.ticketId}</td>
                                    <td className="py-2 px-3">
                                      <span className="text-xs px-2 py-1 rounded-full bg-secondary">
                                        {attendee.ticketType}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3">
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        attendee.checkedIn 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                      }`}>
                                        {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-right">
                                      <Button
                                        size="sm"
                                        variant={attendee.checkedIn ? "outline" : "default"}
                                        onClick={() => toggleCheckinStatus(attendee.id)}
                                      >
                                        {attendee.checkedIn ? 'Undo' : 'Check In'}
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="py-8 flex flex-col items-center justify-center text-center">
                            <ListX className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No Results Found</h3>
                            <p className="text-muted-foreground mt-1">
                              Try adjusting your search or clear filters
                            </p>
                          </div>
                        )}
                      </BlurContainer>
                    </TabsContent>
                    
                    <TabsContent value="scan">
                      <BlurContainer className="p-4 flex flex-col items-center justify-center">
                        <h3 className="text-lg font-medium mb-4">Scan Ticket QR Code</h3>
                        
                        {scanMode ? (
                          <QrScanner onSuccess={handleQrSuccess} />
                        ) : (
                          <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                              Click the button below to start scanning tickets
                            </p>
                            <Button onClick={() => setScanMode(true)}>
                              <TicketIcon className="h-4 w-4 mr-2" />
                              Start Scanner
                            </Button>
                          </div>
                        )}
                        
                        <div className="mt-6 w-full">
                          <h4 className="font-medium mb-2">Manual Check-in</h4>
                          <div className="flex gap-2">
                            <Input placeholder="Enter ticket ID" />
                            <Button variant="outline">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Check In
                            </Button>
                          </div>
                        </div>
                      </BlurContainer>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div>
                  <LiveDataTracker eventId={selectedEvent} refreshInterval={60} />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CheckIn;
