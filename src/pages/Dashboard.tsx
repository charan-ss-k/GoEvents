
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket as TicketIcon, Users, TrendingUp, Bell, ChevronRight, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BlurContainer from '@/components/ui/BlurContainer';
import Chatbot from '@/components/chatbot/Chatbot';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample event data for calculations
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
    organizerId: '1',
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
    organizerId: '1',
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
    organizerId: '1',
    description: 'Network with industry leaders and grow your business'
  }
];

// Calculate analytics data
const totalEvents = sampleEvents.length;
const totalAttendees = sampleEvents.reduce((sum, event) => sum + event.attendees, 0);
const totalTickets = sampleEvents.reduce((sum, event) => sum + event.ticketsAvailable + event.attendees, 0);
const totalRevenue = sampleEvents.reduce((sum, event) => sum + (event.attendees * event.price), 0);

// Create chart data for attendance by month
const attendanceChartData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 30 }, // Business Summit
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 45 }, // Tech Conference
  { name: 'Jul', value: 120 }, // Music Festival
];

// Create chart data for revenue by month
const revenueChartData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 179970 }, // Business Summit (30 * 5999)
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 134955 }, // Tech Conference (45 * 2999)
  { name: 'Jul', value: 239880 }, // Music Festival (120 * 1999)
];

// Helper function to get upcoming events (based on current date)
const getUpcomingEvents = () => {
  const currentDate = new Date();
  return sampleEvents.filter(event => {
    const [day, month, year] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate > currentDate;
  });
};

// Recent activity data
const recentActivities = [
  {
    id: '1',
    title: 'New ticket purchased',
    description: 'Rahul Singh purchased a VIP ticket for Tech Conference 2025',
    time: '2 hours ago'
  },
  {
    id: '2',
    title: 'Event check-in started',
    description: 'Check-in has begun for Business Summit',
    time: '1 day ago'
  },
  {
    id: '3',
    title: 'New event created',
    description: 'Music Festival was created and published',
    time: '3 days ago'
  }
];

const Dashboard: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { user } = useAuth();
  const [events, setEvents] = useState(sampleEvents);
  const [upcomingEvents, setUpcomingEvents] = useState(getUpcomingEvents());

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Manage your events and analyze performance.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={toggleChatbot} className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
              <Button asChild className="flex items-center">
                <Link to="/events">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Events"
              value={totalEvents.toString()}
              icon={Calendar}
              trend="up"
              trendValue="3 events created"
            />
            
            <StatCard
              title="Total Tickets"
              value={totalTickets.toString()}
              icon={TicketIcon}
              trend="up"
              trendValue="700 tickets available"
            />
            
            <StatCard
              title="Total Attendees"
              value={totalAttendees.toString()}
              icon={Users}
              trend="up"
              trendValue="195 checked in"
            />
            
            <StatCard
              title="Revenue"
              value={totalRevenue.toLocaleString('en-IN')}
              icon={TrendingUp}
              trend="up"
              trendValue="₹554,805 earned"
              showRupeeSymbol={true}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Attendance Analytics"
              description="Monthly attendance across all events"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceChartData}>
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0e9eeb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0e9eeb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0e9eeb"
                      fillOpacity={1}
                      fill="url(#attendanceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
            
            <DashboardCard
              title="Revenue Analytics"
              description="Monthly revenue from ticket sales"
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0e9eeb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0e9eeb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0e9eeb"
                      fillOpacity={1}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Upcoming Events"
              description="Your events happening soon"
              action={
                <Button variant="link" size="sm" className="flex items-center" asChild>
                  <Link to="/events">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              }
              className="lg:col-span-1"
            >
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <BlurContainer key={event.id} className="p-4 hover:shadow-md transition-all">
                      <h3 className="font-medium text-base">{event.title}</h3>
                      <div className="flex items-center text-sm mt-1 text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm mt-1 text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees}/{event.capacity} attendees</span>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" asChild className="w-full">
                          <Link to={`/events?id=${event.id}`}>
                            Manage Event
                          </Link>
                        </Button>
                      </div>
                    </BlurContainer>
                  ))}
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No upcoming events</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first event to see it here
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/events">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Event
                    </Link>
                  </Button>
                </BlurContainer>
              )}
            </DashboardCard>
            
            <DashboardCard
              title="Recent Activity"
              description="Latest actions and updates"
              className="lg:col-span-2"
            >
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map(activity => (
                    <BlurContainer key={activity.id} className="p-4">
                      <h3 className="font-medium text-base">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{activity.time}</p>
                    </BlurContainer>
                  ))}
                  <div className="text-center mt-4">
                    <Button variant="outline" size="sm">
                      View All Activity
                    </Button>
                  </div>
                </div>
              ) : (
                <BlurContainer className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No recent activity</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your activity will appear here once you start using the platform
                  </p>
                </BlurContainer>
              )}
            </DashboardCard>
          </div>
        </div>
      </main>
      
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
        eventName={user?.user_metadata?.event_name}
      />
    </div>
  );
};

export default Dashboard;
