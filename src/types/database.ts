
// Custom types for our database tables
export interface Profile {
  id: string;
  name: string;
  location: string;
  bio: string;
  avatar_url: string;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  distance: string;
  time: string;
  race_location: string;
  date_achieved: string;
}
