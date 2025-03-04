
import React from 'react';
import Header from '../components/Header';
import ProfileSection from '../components/ProfileSection';
import PRList from '../components/PRList';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container py-8 px-4">
        <ProfileSection />
        
        <div className="my-8 border-t border-border/50"></div>
        
        <PRList />
      </main>
      
      <footer className="py-6 border-t border-border/50 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Running PR Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
