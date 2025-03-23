import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import BlurContainer from '@/components/ui/BlurContainer';
import { User, Mail, Phone, Building, MapPin, CalendarClock, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { user, userType, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = React.useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = React.useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }

    const fetchProfileData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile data:', error);
          } else {
            setProfileData(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    fetchProfileData();
  }, [user, isLoading, navigate]);

  // Function to get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData?.full_name) {
      return profileData.full_name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-[70vh]">
            <div className="animate-pulse text-center">
              <p>Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your account information
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BlurContainer className="md:col-span-1 p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="" alt={profileData?.full_name || user?.email} />
                <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-1">{profileData?.full_name || 'User'}</h2>
              <p className="text-muted-foreground mb-4">{user?.email}</p>
              
              <div className="flex items-center justify-center bg-secondary/40 rounded-full px-3 py-1 text-sm mb-4">
                <Shield className="h-4 w-4 mr-1" />
                <span className="capitalize">{userType || 'User'}</span>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/settings')}
              >
                Edit Profile
              </Button>
            </BlurContainer>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Full Name</div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profileData?.full_name || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profileData?.phone || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Account Type</div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="capitalize">{userType || 'User'}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>India</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Account Created</div>
                  <div className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{new Date(user?.created_at || Date.now()).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
