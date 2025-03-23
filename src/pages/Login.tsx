
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import BlurContainer from '@/components/ui/BlurContainer';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      
      // Log this action for recent activity
      console.log(`User logged in: ${email}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <BlurContainer className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-center text-gradient mb-2">GoEvents</h1>
          <p className="text-center text-muted-foreground">
            Next-gen event management platform
          </p>
        </BlurContainer>

        <Card className="w-full backdrop-blur-md bg-card/80 border-purple-800/40">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary/50 border-purple-800/40"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary/50 border-purple-800/40"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center w-full">
              Don't have an account? Sign up as a:
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button 
                variant="outline" 
                className="w-full border-purple-800/40 hover:bg-purple-800/20" 
                onClick={() => navigate('/signup/manager')}
              >
                Manager
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-800/40 hover:bg-purple-800/20" 
                onClick={() => navigate('/signup/worker')}
              >
                Worker
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-purple-800/40 hover:bg-purple-800/20" 
                onClick={() => navigate('/signup/client')}
              >
                Client
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
