
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fromTable, insertIntoTable, upsertIntoTable, storage } from '../integrations/supabase/customClient';
import { Profile } from '../types/database';
import { useToast } from './use-toast';

export function useProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
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
        
        // Set avatar path
        setAvatarPath(profileData.avatar_url || null);
        
        // Get and set the public URL for the avatar
        if (profileData.avatar_url) {
          const publicUrl = storage.getAvatarUrl(profileData.avatar_url);
          setAvatarUrl(publicUrl);
        }
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

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setAvatar(file);
      // Create a preview URL
      const url = URL.createObjectURL(file);
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
      let avatar_url = avatarPath || '';
      
      if (avatar) {
        try {
          setUploadingAvatar(true);
          const result = await storage.uploadAvatar(avatar, user.id);
          avatar_url = result.path;
          // Update avatarUrl with the new public URL
          setAvatarUrl(result.url);
          setAvatarPath(result.path);
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

  return {
    profile,
    loading,
    name,
    setName,
    location,
    setLocation,
    bio,
    setBio,
    avatarUrl,
    uploadingAvatar,
    handleAvatarChange,
    handleSubmit
  };
}
