
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, QrCode, Plus, Calendar, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TicketCard from '@/components/tickets/TicketCard';
import BlurContainer from '@/components/ui/BlurContainer';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';

interface TicketData {
  id: string;
  eventName: string;
  attendeeName: string;
  ticketType: string;
  ticketPrice: number;
  date: string;
  isNFT: boolean;
  ticketNumber: string;
  qrCodeUrl?: string;
  eventId: string;
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  
  // Sample data for development
  useEffect(() => {
    const sampleTickets: TicketData[] = [
      {
        id: 'TKT-1001',
        eventName: 'Tech Conference 2025',
        attendeeName: 'Raj Sharma',
        ticketType: 'VIP',
        ticketPrice: 2999,
        date: '01-06-2025',
        isNFT: true,
        ticketNumber: 'VIP-101',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-1001',
        eventId: '1'
      },
      {
        id: 'TKT-1002',
        eventName: 'Tech Conference 2025',
        attendeeName: 'Priya Patel',
        ticketType: 'Standard',
        ticketPrice: 1499,
        date: '01-06-2025',
        isNFT: false,
        ticketNumber: 'STD-202',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-1002',
        eventId: '1'
      },
      {
        id: 'TKT-1003',
        eventName: 'Music Festival',
        attendeeName: 'Amit Kumar',
        ticketType: 'VIP',
        ticketPrice: 1999,
        date: '15-07-2025',
        isNFT: true,
        ticketNumber: 'VIP-303',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-1003',
        eventId: '2'
      },
      {
        id: 'TKT-1004',
        eventName: 'Business Summit',
        attendeeName: 'Vikram Singh',
        ticketType: 'Economy',
        ticketPrice: 3999,
        date: '10-03-2025',
        isNFT: false,
        ticketNumber: 'ECO-404',
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TKT-1004',
        eventId: '3'
      }
    ];
    
    setTickets(sampleTickets);
  }, []);
  
  // Get unique event names for filter
  const eventNames = ['all', ...new Set(tickets.map(ticket => ticket.eventName))];
  
  // Get unique ticket types for filter
  const ticketTypes = ['all', ...new Set(tickets.map(ticket => ticket.ticketType))];
  
  // Filter tickets based on search and event filter
  const filteredTickets = tickets.filter(ticket => {
    // Search filter
    const matchesSearch = 
      ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Event filter
    const matchesEvent = eventFilter === 'all' || ticket.eventName === eventFilter;
    
    // Type filter
    const matchesType = typeFilter === 'all' || ticket.ticketType === typeFilter;
    
    return matchesSearch && matchesEvent && matchesType;
  });
  
  // Calculate stats
  const totalTickets = tickets.length;
  const nftTickets = tickets.filter(ticket => ticket.isNFT).length;
  const regularTickets = totalTickets - nftTickets;
  
  const handleDownloadAll = () => {
    if (tickets.length === 0) {
      toast.error('No tickets to download');
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(tickets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
    XLSX.writeFile(workbook, "All_Tickets.xlsx");
    
    toast.success('Downloaded all tickets');
  };
  
  const handleExportQR = () => {
    if (tickets.length === 0) {
      toast.error('No tickets to export');
      return;
    }
    toast.success('Exported QR codes for all tickets');
  };
  
  const handleViewQR = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsQRDialogOpen(true);
  };
  
  const handleEmailQR = (ticket: TicketData) => {
    setSelectedTicket(ticket);
    setIsEmailDialogOpen(true);
  };
  
  const handleSendEmail = () => {
    if (!emailRecipient) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    toast.success(`QR code sent to ${emailRecipient}`);
    setIsEmailDialogOpen(false);
    setEmailRecipient('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tickets</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track all event tickets
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <Button variant="outline" className="flex items-center" onClick={handleDownloadAll}>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
              
              <Button variant="outline" className="flex items-center" onClick={handleExportQR}>
                <QrCode className="mr-2 h-4 w-4" />
                Export QR Codes
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BlurContainer className="flex items-center justify-center flex-col p-6">
              <h3 className="text-3xl font-bold">{totalTickets}</h3>
              <p className="text-muted-foreground text-sm">Total Tickets</p>
            </BlurContainer>
            
            <BlurContainer className="flex items-center justify-center flex-col p-6">
              <h3 className="text-3xl font-bold">{nftTickets}</h3>
              <p className="text-muted-foreground text-sm">NFT Tickets</p>
            </BlurContainer>
            
            <BlurContainer className="flex items-center justify-center flex-col p-6">
              <h3 className="text-3xl font-bold">{regularTickets}</h3>
              <p className="text-muted-foreground text-sm">Standard Tickets</p>
            </BlurContainer>
          </div>
          
          <BlurContainer className="px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets by name, event, or ticket number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 flex-1"
                />
              </div>
              
              {tickets.length > 0 && (
                <div className="flex space-x-2">
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventNames.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event === 'all' ? 'All Events' : event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </BlurContainer>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Tickets</TabsTrigger>
              <TabsTrigger value="nft">
                NFT Tickets
                <Badge className="ml-2 bg-futurista-500">{nftTickets}</Badge>
              </TabsTrigger>
              <TabsTrigger value="standard">Standard Tickets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="animate-fade-in">
              {filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="relative group">
                      <TicketCard 
                        id={ticket.id}
                        eventName={ticket.eventName}
                        attendeeName={ticket.attendeeName}
                        ticketType={ticket.ticketType}
                        ticketPrice={ticket.ticketPrice}
                        date={ticket.date}
                        isNFT={ticket.isNFT}
                        ticketNumber={ticket.ticketNumber}
                        qrCodeUrl={ticket.qrCodeUrl}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <div className="flex space-x-2">
                          <Button onClick={() => handleViewQR(ticket)} size="sm">
                            <QrCode className="h-4 w-4 mr-1" />
                            View QR
                          </Button>
                          <Button onClick={() => handleEmailQR(ticket)} size="sm" variant="secondary">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No tickets available</h3>
                  <p className="text-muted-foreground">
                    Create an event and sell tickets to see them here.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/events">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
            
            <TabsContent value="nft" className="animate-fade-in">
              {filteredTickets.filter(ticket => ticket.isNFT).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets
                    .filter(ticket => ticket.isNFT)
                    .map((ticket) => (
                      <div key={ticket.id} className="relative group">
                        <TicketCard 
                          id={ticket.id}
                          eventName={ticket.eventName}
                          attendeeName={ticket.attendeeName}
                          ticketType={ticket.ticketType}
                          ticketPrice={ticket.ticketPrice}
                          date={ticket.date}
                          isNFT={ticket.isNFT}
                          ticketNumber={ticket.ticketNumber}
                          qrCodeUrl={ticket.qrCodeUrl}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewQR(ticket)} size="sm">
                              <QrCode className="h-4 w-4 mr-1" />
                              View QR
                            </Button>
                            <Button onClick={() => handleEmailQR(ticket)} size="sm" variant="secondary">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No NFT tickets available</h3>
                  <p className="text-muted-foreground">
                    Create an event with NFT tickets to see them here.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/events">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
            
            <TabsContent value="standard" className="animate-fade-in">
              {filteredTickets.filter(ticket => !ticket.isNFT).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTickets
                    .filter(ticket => !ticket.isNFT)
                    .map((ticket) => (
                      <div key={ticket.id} className="relative group">
                        <TicketCard 
                          id={ticket.id}
                          eventName={ticket.eventName}
                          attendeeName={ticket.attendeeName}
                          ticketType={ticket.ticketType}
                          ticketPrice={ticket.ticketPrice}
                          date={ticket.date}
                          isNFT={ticket.isNFT}
                          ticketNumber={ticket.ticketNumber}
                          qrCodeUrl={ticket.qrCodeUrl}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewQR(ticket)} size="sm">
                              <QrCode className="h-4 w-4 mr-1" />
                              View QR
                            </Button>
                            <Button onClick={() => handleEmailQR(ticket)} size="sm" variant="secondary">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No standard tickets available</h3>
                  <p className="text-muted-foreground">
                    Create an event with standard tickets to see them here.
                  </p>
                  <Button asChild className="mt-4">
                    <Link to="/events">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                </BlurContainer>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code at the event for entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="flex flex-col items-center p-4">
              <img 
                src={selectedTicket.qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48 mb-4"
              />
              
              <div className="text-center mb-4">
                <p className="font-semibold">{selectedTicket.attendeeName}</p>
                <p className="text-sm text-muted-foreground">{selectedTicket.eventName}</p>
                <p className="text-sm mt-2">{selectedTicket.ticketType} - {selectedTicket.ticketNumber}</p>
              </div>
              
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => setIsEmailDialogOpen(true)} className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email QR Code
                </Button>
                
                <Button variant="outline" onClick={() => setIsQRDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email QR Code</DialogTitle>
            <DialogDescription>
              Send the QR code to an email address
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;
