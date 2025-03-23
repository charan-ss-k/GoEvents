
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Settings,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userType, signOut } = useAuth();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D1625]/90 dark:bg-[#0D1625]/90 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/14ba4f7e-de79-45df-91d1-e7e7642c505d.png" alt="GoEvents Logo" className="h-8 mr-2" />
            <span className="text-xl font-semibold text-white">GoEvents</span>
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-1">
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={cn("nav-link text-white", location.pathname === '/dashboard' && "active")}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/events" 
                  className={cn("nav-link text-white", location.pathname === '/events' && "active")}
                >
                  Events
                </Link>
                <Link 
                  to="/tickets" 
                  className={cn("nav-link text-white", location.pathname === '/tickets' && "active")}
                >
                  Tickets
                </Link>
                <Link 
                  to="/check-in" 
                  className={cn("nav-link text-white", location.pathname === '/check-in' && "active")}
                >
                  Check-in
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex text-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-white"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-in bg-[#0D1625]">
          <nav className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/dashboard' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/events" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/events' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Events
                </Link>
                <Link 
                  to="/tickets" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/tickets' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tickets
                </Link>
                <Link 
                  to="/check-in" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/check-in' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Check-in
                </Link>
                <button
                  className="w-full text-left block py-2 px-3 rounded-md text-white hover:text-white hover:bg-secondary/50"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/login' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup/manager" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/signup/manager' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up as Manager
                </Link>
                <Link 
                  to="/signup/worker" 
                  className={cn(
                    "block py-2 px-3 rounded-md text-white", 
                    location.pathname === '/signup/worker' 
                      ? "bg-secondary text-white" 
                      : "text-white hover:text-white hover:bg-secondary/50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up as Worker
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
