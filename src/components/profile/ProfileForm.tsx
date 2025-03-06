
import React from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CardFooter } from '../ui/card';
import AvatarUpload from './AvatarUpload';

interface ProfileFormProps {
  name: string;
  location: string;
  bio: string;
  avatarUrl: string | null;
  loading: boolean;
  uploadingAvatar: boolean;
  onNameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProfileForm = ({
  name,
  location,
  bio,
  avatarUrl,
  loading,
  uploadingAvatar,
  onNameChange,
  onLocationChange,
  onBioChange,
  onAvatarChange,
  onSubmit
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AvatarUpload 
        avatarUrl={avatarUrl} 
        name={name} 
        onAvatarChange={onAvatarChange} 
        uploadingAvatar={uploadingAvatar} 
      />
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Your location"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
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
  );
};

export default ProfileForm;
