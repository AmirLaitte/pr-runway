
import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  name: string;
  location: string;
  bio: string;
  avatar_url: string | null;
}

const ProfileSection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    location: '',
    bio: '',
    avatar_url: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [bioCharCount, setBioCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('name, location, bio, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      if (data) {
        setProfileData({
          name: data.name || '',
          location: data.location || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url,
        });
        setBioCharCount(data.bio?.length || 0);
        setIsEditing(!data.name);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'bio') {
      if (value.length <= 150) {
        setBioCharCount(value.length);
        setProfileData({ ...profileData, [name]: value });
      }
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleImageChange = async (file: File | null) => {
    if (!user || !file) return;
    
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update profile with avatar URL
      setProfileData({
        ...profileData,
        avatar_url: data.publicUrl,
      });
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrorMessage('Error uploading image. Please try again.');
    }
  };

  const handleSave = async () => {
    try {
      setErrorMessage('');
      
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          location: profileData.location,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
        });
      
      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error saving profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto glass-card rounded-xl p-6 mb-8 animate-fade-up">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-xl p-6 mb-8 animate-fade-up">
      {errorMessage && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive text-destructive rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex flex-col items-center gap-2">
          <ImageUpload onImageChange={handleImageChange} />
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={profileData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="bio" className="block text-sm font-medium text-muted-foreground">
                    Bio
                  </label>
                  <span className={`text-xs ${bioCharCount > 130 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                    {bioCharCount}/150
                  </span>
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself as a runner (max 150 characters)"
                  className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none h-20 input-transition"
                  maxLength={150}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-semibold mb-1">{profileData.name || 'Runner Name'}</h2>
              {profileData.location && (
                <p className="text-muted-foreground mb-3">{profileData.location}</p>
              )}
              {profileData.bio && (
                <p className="text-sm text-foreground leading-relaxed">{profileData.bio}</p>
              )}
              {(!profileData.name && !profileData.location && !profileData.bio) && (
                <p className="text-muted-foreground italic">Complete your profile by clicking Edit Profile</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
