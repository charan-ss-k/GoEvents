
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userType: string | null;
  isLoading: boolean;
  signUp: (email: string, password: string, userData: { user_type: string; full_name: string; }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Log user activity
  const logActivity = (action: string, details: string = '') => {
    console.log(`[${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] ${action}: ${details}`);
    
    // In a real app, you would also store this in a database
    const recentActivity = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'system'
    };
    
    // You could store in localStorage for demo purposes
    const storedActivities = localStorage.getItem('recentActivities');
    const activities = storedActivities ? JSON.parse(storedActivities) : [];
    activities.unshift(recentActivity);
    localStorage.setItem('recentActivities', JSON.stringify(activities.slice(0, 20))); // Keep last 20
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        logActivity('Auth state changed', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Get user profile if user exists
        if (currentSession?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            setUserType(profile.user_type);
            console.log('User type:', profile.user_type);
          }
          
          // Log this action for recent activity
          if (event === 'SIGNED_IN') {
            logActivity('User signed in', currentSession.user.email || '');
          } else if (event === 'SIGNED_OUT') {
            logActivity('User signed out');
            navigate('/login');
          }
        } else {
          setUserType(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession ? 'Yes' : 'No');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Get user profile if user exists
      if (currentSession?.user) {
        supabase
          .from('profiles')
          .select('user_type')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
            } else if (profile) {
              setUserType(profile.user_type);
              console.log('User type from existing session:', profile.user_type);
            }
            setIsLoading(false);
          });
          
        logActivity('Session restored', currentSession.user.email || '');
      } else {
        setIsLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, userData: { user_type: string; full_name: string; }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Registration successful! Check your email to confirm your account.');
        // Log this action for recent activity
        logActivity('New user registered', `${email} as ${userData.user_type}`);
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign up');
      console.error('Sign up error:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Set locale to India (this is just for demo - in a real app would be more sophisticated)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success('Logged in successfully!');
        // Log this action for recent activity
        logActivity('User logged in', email);
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    console.log("Sign out called");
    try {
      // First, manually clear the state to ensure UI updates immediately
      setUser(null);
      setSession(null);
      setUserType(null);
      
      // Then perform the actual signout operation
      const { error } = await supabase.auth.signOut();
      console.log("Sign out response received");
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      toast.success('Logged out successfully');
      // Log this action for recent activity
      logActivity('User logged out');
      
      // Navigate to login page
      console.log("Navigating to login page");
      navigate('/login', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign out');
      console.error('Sign out error:', error);
    }
  };

  const value = {
    session,
    user,
    userType,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
