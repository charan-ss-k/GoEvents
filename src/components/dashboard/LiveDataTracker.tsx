
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Clock, RefreshCw, Users } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface LiveDataTrackerProps {
  eventId?: string;
  refreshInterval?: number; // in seconds
}

const LiveDataTracker: React.FC<LiveDataTrackerProps> = ({ 
  eventId,
  refreshInterval = 30 
}) => {
  const [checkInData, setCheckInData] = useState({
    total: 0,
    checkedIn: 0,
    pending: 0,
    checkInRate: 0
  });
  
  const [recentCheckIns, setRecentCheckIns] = useState<Array<{
    id: string;
    name: string;
    time: string;
    ticketType: string;
  }>>([]);
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Fetch data on component mount and at regular intervals
  useEffect(() => {
    fetchLiveData();
    
    const timer = setInterval(() => {
      fetchLiveData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(timer);
  }, [eventId, refreshInterval]);
  
  const fetchLiveData = async () => {
    setIsLoading(true);
    
    try {
      // Simulating API call to fetch check-in data
      // In a real implementation, this would be a call to your API or Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random check-in data for demo purposes
      const total = 100;
      const checkedIn = Math.floor(Math.random() * 60) + 20; // 20-80
      const pending = total - checkedIn;
      const checkInRate = (checkedIn / total) * 100;
      
      setCheckInData({
        total,
        checkedIn,
        pending,
        checkInRate
      });
      
      // Generate some fake recent check-ins
      const names = [
        'Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Deepika Kumar', 
        'Rajesh Khanna', 'Neha Gupta', 'Vikram Mehta', 'Sunita Reddy'
      ];
      
      const ticketTypes = ['VIP', 'Standard', 'Economy'];
      
      const newCheckIns = Array.from({ length: 5 }, (_, i) => {
        const randomTime = new Date();
        randomTime.setMinutes(randomTime.getMinutes() - Math.floor(Math.random() * 30));
        
        return {
          id: `checkin-${Date.now()}-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          time: randomTime.toLocaleTimeString('en-IN'),
          ticketType: ticketTypes[Math.floor(Math.random() * ticketTypes.length)]
        };
      });
      
      setRecentCheckIns(newCheckIns);
      setLastUpdated(new Date());
      
      // Log this action for recent activity
      console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Live data updated: ${checkedIn}/${total} checked in`);
      
    } catch (error) {
      console.error('Error fetching live data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const manualRefresh = () => {
    fetchLiveData();
  };
  
  // Data for pie chart
  const pieData = [
    { name: 'Checked In', value: checkInData.checkedIn, color: '#16a34a' },
    { name: 'Pending', value: checkInData.pending, color: '#f59e0b' }
  ];
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Live Check-in Data</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={manualRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Check-in Progress</span>
              <span className="text-sm font-medium">{Math.round(checkInData.checkInRate)}%</span>
            </div>
            <Progress value={checkInData.checkInRate} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Checked In</span>
              </div>
              <p className="text-2xl font-bold mt-2">{checkInData.checkedIn}</p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold mt-2">{checkInData.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start p-4 border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Recent Check-ins</h4>
        <div className="w-full space-y-2">
          {recentCheckIns.map(checkin => (
            <div key={checkin.id} className="flex justify-between items-center text-sm py-1 border-b border-border/30 last:border-0">
              <div>
                <span className="font-medium">{checkin.name}</span>
                <span className="ml-2 text-xs px-2 py-0.5 bg-secondary rounded-full">
                  {checkin.ticketType}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{checkin.time}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LiveDataTracker;
