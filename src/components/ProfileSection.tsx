
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ProfileForm from './profile/ProfileForm';
import { useProfile } from '../hooks/useProfile';

const ProfileSection = () => {
  const { 
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
  } = useProfile();

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
          <ProfileForm
            name={name}
            location={location}
            bio={bio}
            avatarUrl={avatarUrl}
            loading={loading}
            uploadingAvatar={uploadingAvatar}
            onNameChange={setName}
            onLocationChange={setLocation}
            onBioChange={setBio}
            onAvatarChange={handleAvatarChange}
            onSubmit={handleSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
