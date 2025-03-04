import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Profile } from '../types/database';
import { useToast } from '../hooks/use-toast';

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

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Use type assertion here since we know the structure
      const { data, error } = await supabase
        .from('profiles')
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

      // Use type assertion for the insert operation
      const { error } = await supabase
        .from('profiles')
        .insert([newProfile as any]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Upload avatar if changed
      let avatar_url = profile?.avatar_url;
      
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar);
          
        if (uploadError) throw uploadError;
        
        avatar_url = `https://bfrixwwpujpzyzktnqng.supabase.co/storage/v1/object/public/avatars/${fileName}`;
      }
      
      // Update profile
      const updates: Profile = {
        id: user.id,
        name,
        location,
        bio,
        avatar_url: avatar_url || '',
      };
      
      // Use type assertion for the update operation
      const { error } = await supabase
        .from('profiles')
        .upsert(updates as any);
        
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
    <div className="profile-section">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div>
            <label>Avatar</label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setAvatar(e.target.files[0]);
                }
              }}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default ProfileSection;
