
import React from 'react';

const Header = () => {
  return (
    <header className="w-full py-6 border-b border-border/50 backdrop-blur-sm bg-background/70 animate-fade-in">
      <div className="container flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-foreground tracking-tight">
          Running PR Tracker
        </h1>
        <div className="flex items-center gap-2">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
            About
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
