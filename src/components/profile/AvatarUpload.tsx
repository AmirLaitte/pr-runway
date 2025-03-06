
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { storage } from '../../integrations/supabase/customClient';

interface AvatarUploadProps {
  avatarUrl: string | null;
  name: string;
  onAvatarChange: (file: File | null) => void;
  uploadingAvatar: boolean;
}

const AvatarUpload = ({ 
  avatarUrl, 
  name, 
  onAvatarChange, 
  uploadingAvatar 
}: AvatarUploadProps) => {
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarChange(e.target.files[0]);
    }
  };

  return (
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
  );
};

export default AvatarUpload;
