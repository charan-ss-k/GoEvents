import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import BlurContainer from "../ui/BlurContainer";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Edit,
  Download,
  Share2,
  QrCode,
  Trash2,
  ChevronDown,
  ChevronUp,
  Send,
  X
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import * as XLSX from 'xlsx';

export interface EventDetailsProps {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  attendees: number;
  ticketsAvailable: number;
  ticketsSold: number;
  price: number;
  status: "upcoming" | "ongoing" | "past";
  posterUrl: string;
  organizerId: string;
  seatsInfo: {
    vip: number;
    standard: number;
    economy: number;
  };
  attendeeList?: Array<{
    id: string;
    name: string;
    email: string;
    ticketType: string;
    checkedIn: boolean;
    checkInTime?: string;
  }>;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  id,
  title,
  description,
  date,
  startTime,
  endTime,
  location,
  venue,
  address,
  city,
  state,
  capacity,
  attendees,
  ticketsAvailable,
  ticketsSold,
  price,
  status,
  posterUrl,
  organizerId,
  seatsInfo,
  attendeeList = [],
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    tickets: true,
    seating: true,
    schedule: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleDelete = () => {
    toast.success(`Event "${title}" deleted successfully`);
    setShowDeleteDialog(false);
    onClose();
  };

  const handleExportAttendees = () => {
    if (attendeeList.length === 0) {
      toast.error("No attendees to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(attendeeList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");
    XLSX.writeFile(workbook, `${title}-Attendees.xlsx`);
    toast.success("Attendee list exported successfully");
  };

  const handleShareEvent = () => {
    navigator.clipboard.writeText(
      `Check out this event: ${title} on ${date} at ${venue}, ${city}. Get your tickets now!`
    );
    toast.success("Event details copied to clipboard");
  };

  const handleSendInvites = () => {
    toast.success("Invitation modal opened");
  };

  const generateQrCodes = () => {
    toast.success(`Generated QR codes for all ${attendeeList.length} attendees`);
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] QR codes generated for event: ${title}`);
  };

  const sendEmailTickets = () => {
    toast.success(`Sent tickets to all ${attendeeList.length} attendees via email`);
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Email tickets sent for event: ${title}`);
  };

  const sendInvitation = (email?: string) => {
    if (email) {
      toast.success(`Invitation sent to ${email}`);
    } else {
      toast.success(`Sending invitations to multiple recipients`);
    }
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Invitations sent for event: ${title}`);
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "past":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:bg-black/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusBadgeClass()}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <BlurContainer className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Event Details</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection("details")}
              >
                {expandedSections.details ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.details && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>{startTime} - {endTime}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{venue}, {address}, {city}, {state}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{attendees} / {capacity} attendees ({Math.round((attendees/capacity)*100)}% filled)</span>
                  </div>
                </div>
              </div>
            )}
          </BlurContainer>

          <BlurContainer className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Ticket Information</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection("tickets")}
              >
                {expandedSections.tickets ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.tickets && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tickets Available</p>
                    <p className="font-medium">{ticketsAvailable}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tickets Sold</p>
                    <p className="font-medium">{ticketsSold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    <p className="font-medium">₹{price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">₹{(price * ticketsSold).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex items-center" onClick={generateQrCodes}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Codes
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center" onClick={sendEmailTickets}>
                    <Send className="h-4 w-4 mr-2" />
                    Email Tickets
                  </Button>
                </div>
              </div>
            )}
          </BlurContainer>

          <BlurContainer className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Seating Information</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSection("seating")}
              >
                {expandedSections.seating ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
            {expandedSections.seating && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/10 p-3 rounded-md text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">VIP</h4>
                  <p className="font-medium">{seatsInfo.vip}</p>
                  <p className="text-xs text-muted-foreground">seats</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Standard</h4>
                  <p className="font-medium">{seatsInfo.standard}</p>
                  <p className="text-xs text-muted-foreground">seats</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/10 p-3 rounded-md text-center">
                  <h4 className="text-xs text-muted-foreground mb-1">Economy</h4>
                  <p className="font-medium">{seatsInfo.economy}</p>
                  <p className="text-xs text-muted-foreground">seats</p>
                </div>
              </div>
            )}
          </BlurContainer>

          <div className="flex space-x-2">
            <Button className="flex-1" asChild>
              <a href={`/check-in?event=${id}`}>
                <Ticket className="h-4 w-4 mr-2" />
                Check-in Attendees
              </a>
            </Button>
            <Button variant="outline" className="flex items-center" onClick={handleShareEvent}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="attendees" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Attendee List ({attendeeList.length})</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleExportAttendees}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={handleSendInvites}>
                <Send className="h-4 w-4 mr-2" />
                Send Invites
              </Button>
            </div>
          </div>

          {attendeeList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-2 text-left text-sm">Name</th>
                    <th className="p-2 text-left text-sm">Email</th>
                    <th className="p-2 text-left text-sm">Ticket Type</th>
                    <th className="p-2 text-left text-sm">Status</th>
                    <th className="p-2 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendeeList.map((attendee) => (
                    <tr key={attendee.id} className="border-b border-border">
                      <td className="p-2 text-sm">{attendee.name}</td>
                      <td className="p-2 text-sm">{attendee.email}</td>
                      <td className="p-2 text-sm">{attendee.ticketType}</td>
                      <td className="p-2 text-sm">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            attendee.checkedIn
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {attendee.checkedIn ? "Checked In" : "Not Checked In"}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => {
                              toast.success(`QR code generated for ${attendee.name}`);
                              console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] QR code generated for attendee: ${attendee.name}`);
                            }}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => sendInvitation(attendee.email)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <BlurContainer className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No attendees yet</h3>
              <p className="text-muted-foreground mb-4">
                People who register for your event will appear here
              </p>
              <Button size="sm" onClick={handleSendInvites}>
                <Send className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
            </BlurContainer>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <BlurContainer className="p-4">
            <h3 className="font-semibold mb-4">Event Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <a href={`/events/edit/${id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event Details
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <QrCode className="h-4 w-4 mr-2" />
                Manage Tickets & Pricing
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start" 
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </Button>
            </div>
          </BlurContainer>
        </TabsContent>
      </Tabs>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetails;
