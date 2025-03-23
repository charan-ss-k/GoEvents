
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    userType: '',
    darkMode: false,
    notifications: true,
    emailUpdates: true,
    language: 'en-IN',
    timezone: 'Asia/Kolkata'
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          fullName: data.full_name || '',
          email: user.email || '',
          phone: data.phone || '',
          userType: data.user_type || ''
        }));
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Settings updated successfully');
      
      // Log this action for recent activity
      console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Settings updated`);
      
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 pb-16 px-4 md:px-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          
          {loading && !profile ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          name="fullName" 
                          value={formData.fullName} 
                          onChange={handleInputChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder="+91 XXXXXXXXXX" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userType">User Type</Label>
                        <Input 
                          id="userType" 
                          name="userType" 
                          value={formData.userType} 
                          disabled 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your application experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable dark mode for the application
                          </p>
                        </div>
                        <Switch 
                          id="darkMode"
                          checked={formData.darkMode}
                          onCheckedChange={(checked) => handleSwitchChange('darkMode', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="notifications" className="text-base">In-App Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications within the application
                          </p>
                        </div>
                        <Switch 
                          id="notifications"
                          checked={formData.notifications}
                          onCheckedChange={(checked) => handleSwitchChange('notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailUpdates" className="text-base">Email Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email updates about your events
                          </p>
                        </div>
                        <Switch 
                          id="emailUpdates"
                          checked={formData.emailUpdates}
                          onCheckedChange={(checked) => handleSwitchChange('emailUpdates', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => handleSelectChange('language', value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-IN">English (India)</SelectItem>
                            <SelectItem value="hi-IN">Hindi</SelectItem>
                            <SelectItem value="mr-IN">Marathi</SelectItem>
                            <SelectItem value="ta-IN">Tamil</SelectItem>
                            <SelectItem value="te-IN">Telugu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={formData.timezone}
                          onValueChange={(value) => handleSelectChange('timezone', value)}
                        >
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                            <SelectItem value="Asia/Dubai">Dubai (GMT+4:00)</SelectItem>
                            <SelectItem value="Asia/Singapore">Singapore (GMT+8:00)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT+0:00)</SelectItem>
                            <SelectItem value="America/New_York">New York (GMT-5:00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <CardFooter className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;
