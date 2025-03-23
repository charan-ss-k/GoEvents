import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  user_type: 'admin' | 'organizer' | 'worker';
  created_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  userType: string | null;
  signUp: (email: string, password: string, userData: { user_type: string; full_name: string; }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        logActivity('Auth state changed', event);
        
        setSession(currentSession);
        
        // Get complete user profile if user exists
        if (currentSession?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          } else if (profile) {
            setUser(profile);
            setUserType(profile.user_type);
          }
          
          if (event === 'SIGNED_IN') {
            logActivity('User signed in', currentSession.user.email || '');
          } else if (event === 'SIGNED_OUT') {
            logActivity('User signed out');
          }
        } else {
          setUser(null);
          setUserType(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        } else if (profile) {
          setUser(profile);
          setUserType(profile.user_type);
        }
        
        logActivity('Session restored', currentSession.user.email || '');
      }
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        // Insert user profile into the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: userData.full_name,
            user_type: userData.user_type,
          });

        if (profileError) {
          throw profileError;
        }

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
    try {
      // First clear all states
      setUser(null);
      setSession(null);
      setUserType(null);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      // Log activity and show success message
      logActivity('User logged out');
      toast.success('Logged out successfully');

      // Finally navigate
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
