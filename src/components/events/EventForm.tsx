
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus, X } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface EventFormProps {
  onSubmit?: (eventData: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

const EventForm: React.FC<EventFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined);
  const [capacity, setCapacity] = useState(initialData?.capacity || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [enableNFT, setEnableNFT] = useState(initialData?.enableNFT || false);
  const [enableCrypto, setEnableCrypto] = useState(initialData?.enableCrypto || false);
  const [enableAIChatbot, setEnableAIChatbot] = useState(initialData?.enableAIChatbot || true);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, 'dd-MM-yyyy');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !location || !date || !capacity || !price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const eventData = {
      name,
      description,
      location,
      date,
      capacity: parseInt(capacity),
      price: parseFloat(price),
      tags,
      enableNFT,
      enableCrypto,
      enableAIChatbot
    };
    
    if (onSubmit) {
      onSubmit(eventData);
    } else {
      toast.success('Event created successfully!');
      console.log('Event data:', eventData);
    }
  };

  return (
    <BlurContainer className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Event Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-name">Event Name*</Label>
              <Input 
                id="event-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tech Conference 2025"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-location">Location*</Label>
              <Input 
                id="event-location" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mumbai, India"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDateForDisplay(date) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-capacity">Capacity*</Label>
              <Input 
                id="event-capacity" 
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="100"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-price">Ticket Price (₹)*</Label>
              <Input 
                id="event-price" 
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="999"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-tags">Tags</Label>
              <div className="flex space-x-2">
                <Input 
                  id="event-tags" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tags"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-secondary rounded-full px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event-description">Description*</Label>
            <Textarea 
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event..."
              className="min-h-[120px]"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Advanced Features</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nft-tickets">NFT Tickets</Label>
                <p className="text-sm text-muted-foreground">
                  Enable blockchain-based NFT tickets for this event
                </p>
              </div>
              <Switch 
                id="nft-tickets"
                checked={enableNFT}
                onCheckedChange={setEnableNFT}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="crypto-payments">Crypto Payments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow attendees to pay with cryptocurrency
                </p>
              </div>
              <Switch 
                id="crypto-payments"
                checked={enableCrypto}
                onCheckedChange={setEnableCrypto}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ai-chatbot">AI Assistant</Label>
                <p className="text-sm text-muted-foreground">
                  Enable AI chatbot for attendee questions
                </p>
              </div>
              <Switch 
                id="ai-chatbot"
                checked={enableAIChatbot}
                onCheckedChange={setEnableAIChatbot}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initialData ? 'Update Event' : 'Create Event'}
          </Button>
        </div>
      </form>
    </BlurContainer>
  );
};

export default EventForm;
