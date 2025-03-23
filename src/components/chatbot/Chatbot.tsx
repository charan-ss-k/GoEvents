
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Loader2, User, Sparkles, Calendar, MapPin, TicketCheck, CreditCard } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  eventName?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
  className,
  eventName = 'this event',
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with personalized welcome message
  useEffect(() => {
    const userName = user?.user_metadata?.full_name || "there";
    const initialMessages: Message[] = [
      {
        id: '1',
        content: `Hello ${userName}! I'm your AI assistant for event management. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
      },
    ];
    setMessages(initialMessages);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const getResponseForQuery = (query: string): string => {
    const queryLower = query.toLowerCase();
    
    // Event venue related queries
    if (queryLower.includes('venue') || queryLower.includes('where') || queryLower.includes('location')) {
      return `The event venue is at Pragati Maidan, New Delhi. It's easily accessible via metro (Pragati Maidan station) and has ample parking space. If you need directions, you can use Google Maps or contact our support team at +91-9876543210.`;
    }
    
    // Schedule related queries
    if (queryLower.includes('schedule') || queryLower.includes('timing') || queryLower.includes('when') || queryLower.includes('time')) {
      return `The event will start at 9:00 AM and continue until 6:00 PM. Registration opens at 8:00 AM. There will be lunch break from 1:00 PM to 2:00 PM. The detailed schedule is available in the Events section.`;
    }
    
    // Ticket availability
    if (queryLower.includes('ticket') || queryLower.includes('booking') || queryLower.includes('available') || queryLower.includes('availability')) {
      return `Currently, we have Standard tickets (₹999) and VIP tickets (₹2999) available. Early bird offers end in 3 days. You can book tickets from the Tickets section. Group discounts are available for bookings of 5+ tickets.`;
    }
    
    // Payment related queries
    if (queryLower.includes('payment') || queryLower.includes('pay') || queryLower.includes('refund') || queryLower.includes('cost') || queryLower.includes('price')) {
      return `We accept payments via UPI, credit/debit cards, and net banking. For corporate bookings, we also provide invoice options. All transactions are secure and you'll receive a confirmation email with QR code. For refund queries, please contact our support team at support@eventapp.in.`;
    }
    
    // QR code related queries
    if (queryLower.includes('qr') || queryLower.includes('code') || queryLower.includes('scan')) {
      return `Your ticket includes a unique QR code that will be sent to your email and can also be accessed in the Tickets section. This QR code will be scanned at entry. Please ensure you have it ready either on your phone or as a printout.`;
    }
    
    // Default responses
    const defaultResponses = [
      `I'd be happy to help with that. Could you provide more details so I can give you specific information?`,
      `Currently no events are scheduled. Create your first event using the 'Create Event' button in the dashboard, and I'll be able to provide more information.`,
      `I'm here to assist with all your event management needs. You can ask about venue details, ticket availability, payment options, and more once you create an event.`,
      `Is there anything specific about event management you'd like to know? I can provide information on best practices for event organization, promotion strategies, and attendee management.`,
      `Feel free to explore the dashboard features. You can create events, manage tickets, and track attendance all in one place.`,
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Generate AI response
    setTimeout(() => {
      const responseContent = getResponseForQuery(userMessage.content);
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn("fixed bottom-4 right-4 z-50 w-full max-w-sm animate-slide-up", className)}>
      <BlurContainer className="flex flex-col h-96">
        <div className="flex justify-between items-center border-b border-border p-3">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-1 mr-2">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Event Assistant</h3>
              <p className="text-xs text-muted-foreground">AI-powered help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[80%] animate-slide-in",
                  message.sender === 'user' ? "ml-auto" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg p-3",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  )}
                >
                  <div className="flex items-start mb-1">
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 mr-1 mt-0.5 text-white/70" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-1 mt-0.5 text-futurista-500" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.sender === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex max-w-[80%] mr-auto animate-fade-in">
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-futurista-500" />
                    <span className="text-sm">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t border-border p-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-2 text-xs text-muted-foreground">
              <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Schedule</span>
              <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> Venue</span>
              <span className="flex items-center"><TicketCheck className="h-3 w-3 mr-1" /> Tickets</span>
              <span className="flex items-center"><CreditCard className="h-3 w-3 mr-1" /> Payment</span>
            </div>
          </div>
        </div>
      </BlurContainer>
    </div>
  );
};

export default Chatbot;
