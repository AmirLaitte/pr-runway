import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/AuthContext';
import { PersonalRecord } from '../types/database';
import { useToast } from '../hooks/use-toast';

const PRList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state for adding/editing
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [raceLocation, setRaceLocation] = useState('');
  const [dateAchieved, setDateAchieved] = useState('');
  
  useEffect(() => {
    if (user) {
      fetchPersonalRecords();
    }
  }, [user]);
  
  const fetchPersonalRecords = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      // Use type assertion for the select operation
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date_achieved', { ascending: false });
        
      if (error) throw error;
      
      // Type assertion for the personal records data
      setPersonalRecords(data as unknown as PersonalRecord[]);
    } catch (error) {
      console.error('Error fetching personal records:', error);
      toast({
        title: 'Error fetching records',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) return;
      
      const newRecord = {
        user_id: user.id,
        distance,
        time,
        race_location: raceLocation,
        date_achieved: dateAchieved,
      };
      
      // Use type assertion for the insert operation
      const { error } = await supabase
        .from('personal_records')
        .insert([newRecord as any]);
        
      if (error) throw error;
      
      // Reset form
      setDistance('');
      setTime('');
      setRaceLocation('');
      setDateAchieved('');
      setShowAddForm(false);
      
      // Refresh records
      await fetchPersonalRecords();
      
      toast({
        title: 'Record added',
        description: 'Your personal record has been added successfully.',
      });
    } catch (error) {
      console.error('Error adding record:', error);
      toast({
        title: 'Error adding record',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };
  
  const handleUpdateRecord = async (id: string) => {
    try {
      if (!user) return;
      
      const updates = {
        time,
        race_location: raceLocation,
        date_achieved: dateAchieved,
      };
      
      // Use type assertion for the update operation
      const { error } = await supabase
        .from('personal_records')
        .update(updates as any)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Reset form
      setTime('');
      setRaceLocation('');
      setDateAchieved('');
      setEditingRecord(null);
      
      // Refresh records
      await fetchPersonalRecords();
      
      toast({
        title: 'Record updated',
        description: 'Your personal record has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating record:', error);
      toast({
        title: 'Error updating record',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteRecord = async (id: string) => {
    try {
      if (!user) return;
      
      // Use type assertion for the delete operation
      const { error } = await supabase
        .from('personal_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Refresh records
      await fetchPersonalRecords();
      
      toast({
        title: 'Record deleted',
        description: 'Your personal record has been deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting record:', error);
      toast({
        title: 'Error deleting record',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div>
      {/* UI for displaying and managing personal records */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Your Personal Records</h2>
          <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Record'}
          </button>
          {showAddForm && (
            <form onSubmit={handleAddRecord}>
              <input
                type="text"
                placeholder="Distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
              <input
                type="text"
                placeholder="Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <input
                type="text"
                placeholder="Race Location"
                value={raceLocation}
                onChange={(e) => setRaceLocation(e.target.value)}
              />
              <input
                type="date"
                value={dateAchieved}
                onChange={(e) => setDateAchieved(e.target.value)}
              />
              <button type="submit">Add Record</button>
            </form>
          )}
          <ul>
            {personalRecords.map((record) => (
              <li key={record.id}>
                <span>{record.distance} - {record.time} - {record.race_location} - {record.date_achieved}</span>
                <button onClick={() => handleUpdateRecord(record.id)}>Edit</button>
                <button onClick={() => handleDeleteRecord(record.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PRList;
