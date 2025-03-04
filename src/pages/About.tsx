
import React from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Header />
      
      <main className="container py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">About Running PR Tracker</CardTitle>
            <CardDescription>Your personal companion for tracking running achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                Running PR Tracker was created to help runners of all levels track their personal records (PRs) 
                and achievements in one convenient place. Whether you're training for your first 5K or your 
                twentieth marathon, we're here to help you celebrate your progress and accomplishments.
              </p>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Personal Profile</span>: Customize your 
                  runner profile with your photo, location, and running bio.
                </li>
                <li>
                  <span className="font-medium text-foreground">PR Tracking</span>: Record and update 
                  your personal records for any distance, from sprints to ultramarathons.
                </li>
                <li>
                  <span className="font-medium text-foreground">Race History</span>: Keep a log of all 
                  your races including locations and dates.
                </li>
                <li>
                  <span className="font-medium text-foreground">Progress Visualization</span>: See how 
                  your times improve over weeks, months, and years.
                </li>
              </ul>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">How to Use</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">1. Create Your Profile</span>: Start by 
                  adding your name, location, and a short bio about your running journey.
                </p>
                <p>
                  <span className="font-medium text-foreground">2. Add Your PRs</span>: Record your 
                  best times for different distances.
                </p>
                <p>
                  <span className="font-medium text-foreground">3. Update Regularly</span>: As you set 
                  new personal records, update your profile to track your progress.
                </p>
                <p>
                  <span className="font-medium text-foreground">4. Share Your Achievements</span>: Celebrate 
                  your successes with the running community.
                </p>
              </div>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground">
                Have questions, suggestions, or feedback? We'd love to hear from you! Reach out to our team at 
                <a href="mailto:support@runningprtracker.com" className="text-primary ml-1 hover:underline">
                  support@runningprtracker.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-6 border-t border-border/50 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Running PR Tracker &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
