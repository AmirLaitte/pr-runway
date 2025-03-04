
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fromTable, insertIntoTable, upsertIntoTable, storage } from '../integrations/supabase/customClient';
import { Profile } from '../types/database';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';

const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Using our custom wrapper
      const { data, error } = await fromTable('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Type assertion for the profile data
        const profileData = data as unknown as Profile;
        setProfile(profileData);
        setName(profileData.name || '');
        setLocation(profileData.location || '');
        setBio(profileData.bio || '');
        setAvatarUrl(profileData.avatar_url || null);
      } else {
        // Create a new profile if one doesn't exist
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error fetching profile',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      if (!user) return;

      const newProfile: Profile = {
        id: user.id,
        name: '',
        location: '',
        bio: '',
        avatar_url: '',
      };

      // Use our custom wrapper
      const { error } = await insertIntoTable('profiles', newProfile);

      if (error) throw error;

      setProfile(newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error creating profile',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      // Create a preview URL
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'You must be logged in to update your profile.',
          variant: 'destructive',
        });
        return;
      }
      
      // Upload avatar if changed
      let avatar_url = profile?.avatar_url || '';
      
      if (avatar) {
        try {
          setUploadingAvatar(true);
          const { url } = await storage.uploadAvatar(avatar, user.id);
          avatar_url = url;
          setUploadingAvatar(false);
        } catch (error) {
          console.error('Avatar upload error:', error);
          toast({
            title: 'Avatar upload failed',
            description: (error as Error).message,
            variant: 'destructive',
          });
          setUploadingAvatar(false);
        }
      }
      
      // Update profile
      const updates: Profile = {
        id: user.id,
        name,
        location,
        bio,
        avatar_url,
      };
      
      // Use our custom wrapper
      const { error } = await upsertIntoTable('profiles', updates);
        
      if (error) throw error;
      
      setProfile(updates);
      setEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-3">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
                ) : (
                  <AvatarFallback>{name ? name[0]?.toUpperCase() : 'U'}</AvatarFallback>
                )}
              </Avatar>
              <div className="mt-2">
                <Label htmlFor="avatar" className="block mb-2">Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="cursor-pointer"
                  disabled={uploadingAvatar}
                />
                {uploadingAvatar && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            
            <CardFooter className="px-0 pt-3 justify-end">
              <Button type="submit" disabled={loading || uploadingAvatar}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
