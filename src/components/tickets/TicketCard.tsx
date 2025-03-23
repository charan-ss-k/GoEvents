
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import BlurContainer from '../ui/BlurContainer';
import { QrCode, Download, Bitcoin, Shield, Send, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export interface TicketCardProps {
  id: string;
  eventName: string;
  attendeeName: string;
  ticketType: string;
  ticketPrice: number;
  date: string;
  isNFT?: boolean;
  ticketNumber: string;
  qrCodeUrl?: string;
  className?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  eventName,
  attendeeName,
  ticketType,
  ticketPrice,
  date,
  isNFT = false,
  ticketNumber,
  qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=",
  className,
}) => {
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  
  const fullQrCodeUrl = `${qrCodeUrl}${id}-${ticketNumber}`;
  
  const handleDownload = () => {
    // Create a link element
    const link = document.createElement('a');
    link.href = fullQrCodeUrl;
    link.download = `ticket-${eventName}-${ticketNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Ticket QR code downloaded successfully!');
    // Log this action for recent activity
    console.log(`QR code downloaded for ticket ${ticketNumber}`);
  };

  const handleTransfer = () => {
    setIsTransferDialogOpen(true);
  };

  const handleEmailTransfer = () => {
    if (!transferEmail) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    toast.success(`Ticket transfer initiated to ${transferEmail}`);
    setIsTransferDialogOpen(false);
    setTransferEmail('');
    // Log this action for recent activity
    console.log(`Ticket ${ticketNumber} transferred to ${transferEmail}`);
  };

  const handleViewQR = () => {
    setIsQRDialogOpen(true);
    // Log this action for recent activity
    console.log(`QR code viewed for ticket ${ticketNumber}`);
  };

  const handleCopyTicketId = () => {
    navigator.clipboard.writeText(ticketNumber);
    toast.success('Ticket number copied to clipboard');
    // Log this action for recent activity
    console.log(`Ticket number ${ticketNumber} copied to clipboard`);
  };

  const handleEmailQR = () => {
    // Send email logic would go here
    toast.success('QR code sent to your registered email');
    // Log this action for recent activity
    console.log(`QR code emailed for ticket ${ticketNumber}`);
  };

  return (
    <>
      <BlurContainer 
        className={cn(
          "relative overflow-hidden transition-all duration-300 group hover:-translate-y-1",
          isNFT ? "border-futurista-400/30" : "",
          className
        )}
      >
        {isNFT && (
          <div className="absolute top-2 right-2 bg-futurista-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <Bitcoin className="h-3 w-3 mr-1" />
            NFT
          </div>
        )}
        
        <div className="flex flex-col h-full">
          <div className="mb-4 pb-4 border-b border-border">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1">{eventName}</h3>
            <p className="text-sm text-muted-foreground mb-1">{date}</p>
            
            <div className="flex items-center mt-2">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-xs text-muted-foreground">Secured with blockchain verification</span>
            </div>
          </div>
          
          <div className="space-y-3 flex-grow">
            <div>
              <p className="text-sm text-muted-foreground">Attendee</p>
              <p className="font-medium">{attendeeName}</p>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Type</p>
                <p className="font-medium">{ticketType}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">₹{ticketPrice.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Ticket #</p>
                <p className="font-medium">{ticketNumber}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={handleCopyTicketId} 
                title="Copy ticket number"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border flex flex-col space-y-2">
            {/* QR Code and Download options now as separate buttons */}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleViewQR}
            >
              <QrCode className="h-4 w-4 mr-1" />
              View Ticket QR
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center justify-center"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Download QR
            </Button>
            
            {isNFT && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={handleTransfer}
              >
                <Send className="h-4 w-4 mr-1" />
                Transfer NFT
              </Button>
            )}
          </div>
        </div>
      </BlurContainer>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code at the event entrance for check-in
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-md mb-4">
              <img src={fullQrCodeUrl} alt="Ticket QR Code" className="w-48 h-48" />
            </div>
            <div className="text-center mb-4">
              <h3 className="font-bold">{eventName}</h3>
              <p className="text-sm text-muted-foreground">{date}</p>
              <p className="text-sm">Ticket #: {ticketNumber}</p>
              <p className="text-sm">Attendee: {attendeeName}</p>
              <p className="text-sm">Type: {ticketType}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleEmailQR}>
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
          <DialogClose className="absolute right-4 top-4" />
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer NFT Ticket</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to transfer this ticket to
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Recipient Email</label>
              <input 
                id="email" 
                type="email" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEmailTransfer}>Transfer</Button>
            </div>
          </div>
          <DialogClose className="absolute right-4 top-4" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TicketCard;
