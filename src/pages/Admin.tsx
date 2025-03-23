import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Download, Users, Ticket, Calendar, PieChart } from 'lucide-react';
import BlurContainer from '@/components/ui/BlurContainer';
import { useToast } from '@/components/ui/use-toast';
import * as XLSX from 'xlsx';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  capacity: number;
  organizer_id: string;
}

interface Ticket {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type: string;
  price: number;
  is_nft: boolean;
  purchase_date: string;
  attendee_name: string;
}

interface CheckIn {
  id: string;
  ticket_id: string;
  check_in_time: string;
  checked_in_by: string;
}

const Admin: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    events: false,
    tickets: false,
    checkIns: false
  });

  // Check if user is admin/manager
  useEffect(() => {
    // In a real app, you would check user role from Supabase
    // For now, we'll just simulate data
    const fetchData = () => {
      // Simulate fetching users
      setUsers([
        { id: '1', email: 'admin@example.com', full_name: 'Admin User', user_type: 'manager' },
        { id: '2', email: 'user1@example.com', full_name: 'Test User 1', user_type: 'attendee' },
        { id: '3', email: 'user2@example.com', full_name: 'Test User 2', user_type: 'worker' }
      ]);

      // Simulate fetching events
      setEvents([
        { 
          id: '1', 
          title: 'Tech Conference 2025', 
          date: '01-06-2025', 
          location: 'Mumbai, India',
          attendees: 45,
          capacity: 100,
          organizer_id: '1'
        },
        { 
          id: '2', 
          title: 'Music Festival', 
          date: '15-07-2025', 
          location: 'Delhi, India',
          attendees: 120,
          capacity: 500,
          organizer_id: '1'
        }
      ]);

      // Simulate fetching tickets
      setTickets([
        {
          id: '1',
          event_id: '1',
          user_id: '2',
          ticket_type: 'VIP',
          price: 2999,
          is_nft: true,
          purchase_date: '01-05-2025',
          attendee_name: 'Test User 1'
        },
        {
          id: '2',
          event_id: '1',
          user_id: '3',
          ticket_type: 'Standard',
          price: 999,
          is_nft: false,
          purchase_date: '02-05-2025',
          attendee_name: 'Test User 2'
        }
      ]);

      // Simulate fetching check-ins
      setCheckIns([
        {
          id: '1',
          ticket_id: '1',
          check_in_time: '01-06-2025 10:15',
          checked_in_by: 'Admin User'
        }
      ]);
    };

    fetchData();
  }, []);

  const exportToExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded.`,
    });
  };

  const handleExportUsers = () => {
    setLoading(prev => ({ ...prev, users: true }));
    setTimeout(() => {
      exportToExcel(users, "Users_Data");
      setLoading(prev => ({ ...prev, users: false }));
    }, 1000);
  };

  const handleExportEvents = () => {
    setLoading(prev => ({ ...prev, events: true }));
    setTimeout(() => {
      exportToExcel(events, "Events_Data");
      setLoading(prev => ({ ...prev, events: false }));
    }, 1000);
  };

  const handleExportTickets = () => {
    setLoading(prev => ({ ...prev, tickets: true }));
    setTimeout(() => {
      exportToExcel(tickets, "Tickets_Data");
      setLoading(prev => ({ ...prev, tickets: false }));
    }, 1000);
  };

  const handleExportCheckIns = () => {
    setLoading(prev => ({ ...prev, checkIns: true }));
    setTimeout(() => {
      exportToExcel(checkIns, "CheckIns_Data");
      setLoading(prev => ({ ...prev, checkIns: false }));
    }, 1000);
  };

  const handleExportAll = () => {
    setLoading({
      users: true,
      events: true,
      tickets: true,
      checkIns: true
    });
    
    setTimeout(() => {
      // Create a workbook with multiple sheets
      const workbook = XLSX.utils.book_new();
      
      // Add each data set as a sheet
      const usersSheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(workbook, usersSheet, "Users");
      
      const eventsSheet = XLSX.utils.json_to_sheet(events);
      XLSX.utils.book_append_sheet(workbook, eventsSheet, "Events");
      
      const ticketsSheet = XLSX.utils.json_to_sheet(tickets);
      XLSX.utils.book_append_sheet(workbook, ticketsSheet, "Tickets");
      
      const checkInsSheet = XLSX.utils.json_to_sheet(checkIns);
      XLSX.utils.book_append_sheet(workbook, checkInsSheet, "Check-Ins");
      
      // Write the workbook and download
      XLSX.writeFile(workbook, "All_Event_Data.xlsx");
      
      toast({
        title: "Export Successful",
        description: "All data has been downloaded.",
      });
      
      setLoading({
        users: false,
        events: false,
        tickets: false,
        checkIns: false
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage events, participants, and check-ins
              </p>
            </div>
            
            <Button 
              className="flex items-center" 
              variant="default"
              onClick={handleExportAll}
              disabled={loading.users && loading.events && loading.tickets && loading.checkIns}
            >
              <Download className="mr-2 h-4 w-4" />
              {loading.users && loading.events && loading.tickets && loading.checkIns ? 
                "Exporting..." : "Export All Data"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BlurContainer className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Users</h3>
                  <p className="text-muted-foreground">{users.length} registered users</p>
                </div>
                <div className="bg-secondary/70 rounded-full p-3">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportUsers}
                disabled={loading.users}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading.users ? "Exporting..." : "Export Users"}
              </Button>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Events</h3>
                  <p className="text-muted-foreground">{events.length} total events</p>
                </div>
                <div className="bg-secondary/70 rounded-full p-3">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportEvents}
                disabled={loading.events}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading.events ? "Exporting..." : "Export Events"}
              </Button>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Tickets</h3>
                  <p className="text-muted-foreground">{tickets.length} issued tickets</p>
                </div>
                <div className="bg-secondary/70 rounded-full p-3">
                  <Ticket className="h-5 w-5" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportTickets}
                disabled={loading.tickets}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading.tickets ? "Exporting..." : "Export Tickets"}
              </Button>
            </BlurContainer>
            
            <BlurContainer className="p-6 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Check-ins</h3>
                  <p className="text-muted-foreground">{checkIns.length} checked-in attendees</p>
                </div>
                <div className="bg-secondary/70 rounded-full p-3">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportCheckIns}
                disabled={loading.checkIns}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading.checkIns ? "Exporting..." : "Export Check-ins"}
              </Button>
            </BlurContainer>
          </div>
          
          <BlurContainer className="p-6">
            <h3 className="text-xl font-semibold mb-4">Event Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">Capacity Utilization</h4>
                <div className="text-3xl font-bold mb-1">
                  {events.length > 0 ? 
                    Math.round((tickets.length / events.reduce((acc, event) => acc + event.capacity, 0)) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Of total seat capacity</p>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">NFT Tickets</h4>
                <div className="text-3xl font-bold mb-1">
                  {tickets.filter(ticket => ticket.is_nft).length}
                </div>
                <p className="text-sm text-muted-foreground">Total NFT tickets issued</p>
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-4">
                <h4 className="font-medium mb-2">Check-in Rate</h4>
                <div className="text-3xl font-bold mb-1">
                  {tickets.length > 0 ? 
                    Math.round((checkIns.length / tickets.length) * 100) : 0}%
                </div>
                <p className="text-sm text-muted-foreground">Of ticket holders checked in</p>
              </div>
            </div>
          </BlurContainer>
          
          <BlurContainer className="p-6">
            <h3 className="text-xl font-semibold mb-4">Event Details Management</h3>
            <p className="text-muted-foreground mb-4">
              View and manage detailed information about events, seating, venue details, and attendees.
            </p>
            
            {events.map((event) => (
              <div key={event.id} className="mb-6 border-b border-border pb-6 last:border-0 last:pb-0">
                <h4 className="text-lg font-semibold">{event.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{event.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p>{event.attendees} / {event.capacity} seats filled</p>
                  </div>
                </div>
                
                <h5 className="font-medium mt-4 mb-2">Attendee Information</h5>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium mb-2">
                    <div>Name</div>
                    <div>Ticket Type</div>
                    <div>Check-in Status</div>
                  </div>
                  
                  {tickets
                    .filter(ticket => ticket.event_id === event.id)
                    .map(ticket => {
                      const isCheckedIn = checkIns.some(checkin => checkin.ticket_id === ticket.id);
                      
                      return (
                        <div key={ticket.id} className="grid grid-cols-3 gap-2 text-sm border-t border-border py-2">
                          <div>{ticket.attendee_name}</div>
                          <div>{ticket.ticket_type} {ticket.is_nft && "(NFT)"}</div>
                          <div className={isCheckedIn ? "text-green-500" : "text-muted-foreground"}>
                            {isCheckedIn ? "Checked In" : "Not Checked In"}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </BlurContainer>
        </div>
      </main>
    </div>
  );
};

export default Admin;
