import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Calendar, 
  QrCode, 
  BarChart4, 
  CheckCircle, 
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <img src="/uploads/14ba4f7e-de79-45df-91d1-e7e7642c505d.png" alt="GoEvents Logo" className="h-64 mx-auto mb-12" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button size="lg" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={() => navigate('/signup/manager')}>
                      Sign Up as Manager
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/signup/client')}>
                      Sign Up as Client
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Powerful Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Planning</h3>
                <p className="text-muted-foreground">
                  Create and manage events with customizable settings, schedules, and capacities.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Digital Tickets</h3>
                <p className="text-muted-foreground">
                  Issue QR coded tickets that can be scanned at entry points for seamless check-in.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Efficient Check-ins</h3>
                <p className="text-muted-foreground">
                  Speed up the entry process with fast ticket validation and attendance tracking.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-muted-foreground">
                  Track attendance, revenue, and engagement with comprehensive analytics.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Attendee Communication</h3>
                <p className="text-muted-foreground">
                  Send notifications and updates to attendees before, during, and after events.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Scheduling Tools</h3>
                <p className="text-muted-foreground">
                  Organize complex multi-day events with customizable schedules and session tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your events?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of event organizers who are streamlining their workflow and creating unforgettable experiences.
            </p>
            {user ? (
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/signup/manager')}>
                  Sign Up as Manager
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/signup/client')}>
                  Sign Up as Client
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-xl mb-4">GoEvents</h3>
              <p className="text-muted-foreground">
                Next-generation event management platform for modern organizers.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2025 GoEvents. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
