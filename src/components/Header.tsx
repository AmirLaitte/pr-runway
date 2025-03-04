
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-6 border-b border-border/50 backdrop-blur-sm bg-background/70 animate-fade-in">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-2xl font-display font-semibold text-foreground tracking-tight">
          Running PR Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            About
          </Link>
          {user ? (
            <button 
              onClick={signOut}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
