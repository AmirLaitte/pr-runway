
import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

interface ProfileData {
  name: string;
  location: string;
  bio: string;
  profilePicture: File | null;
}

interface ProfileSectionProps {
  initialData?: Partial<ProfileData>;
  onSave?: (data: ProfileData) => void;
}

const ProfileSection = ({ initialData = {}, onSave }: ProfileSectionProps) => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: initialData.name || '',
    location: initialData.location || '',
    bio: initialData.bio || '',
    profilePicture: null,
  });

  const [isEditing, setIsEditing] = useState(!initialData.name);
  const [bioCharCount, setBioCharCount] = useState(profileData.bio.length);

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

  const handleImageChange = (file: File | null) => {
    setProfileData({ ...profileData, profilePicture: file });
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(profileData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-xl p-6 mb-8 animate-fade-up">
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
