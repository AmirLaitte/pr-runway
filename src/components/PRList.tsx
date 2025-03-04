
import React, { useState, useEffect } from 'react';
import PRCard, { PersonalRecord } from './PRCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Common running distances in kilometers and miles
const commonDistances = [
  '5K', '10K', 'Half Marathon', 'Marathon',
  '1 Mile', '5 Mile', '10 Mile',
  '400m', '800m', '1500m', '3000m'
];

const PRList: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newDistance, setNewDistance] = useState('');
  const [customDistance, setCustomDistance] = useState('');
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  const [newRecord, setNewRecord] = useState({
    hours: '',
    minutes: '',
    seconds: '',
    location: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform the data to match our PersonalRecord interface
        const formattedRecords: PersonalRecord[] = data.map((record: any) => {
          // Split the time into hours, minutes, seconds
          const [hours, minutes, seconds] = record.time.split(':');
          
          return {
            id: record.id,
            distance: record.distance,
            hours: hours || '',
            minutes: minutes || '',
            seconds: seconds || '',
            location: record.race_location || '',
            date: record.date_achieved || '',
          };
        });
        
        setRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setErrorMessage('Error loading records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    try {
      setErrorMessage('');
      const distance = isCustomDistance ? customDistance : newDistance;
      
      if (!distance) {
        console.error("Please select a distance");
        setErrorMessage("Please select a distance");
        return;
      }
      
      if (!user) return;
      
      // Format time as HH:MM:SS
      const formattedTime = `${newRecord.hours.padStart(2, '0')}:${newRecord.minutes.padStart(2, '0')}:${newRecord.seconds.padStart(2, '0')}`;
      
      // Save record to Supabase
      const { error } = await supabase
        .from('personal_records')
        .insert({
          user_id: user.id,
          distance: distance,
          time: formattedTime,
          race_location: newRecord.location,
          date_achieved: newRecord.date || null,
        });
      
      if (error) {
        throw error;
      }
      
      // Refresh records
      await fetchRecords();
      
      // Reset form
      setIsAddingRecord(false);
      setNewDistance('');
      setCustomDistance('');
      setIsCustomDistance(false);
      setNewRecord({
        hours: '',
        minutes: '',
        seconds: '',
        location: '',
        date: '',
      });
    } catch (error) {
      console.error('Error adding record:', error);
      setErrorMessage('Error adding record. Please try again.');
    }
  };

  const handleUpdateRecord = async (id: string, updatedFields: Partial<PersonalRecord>) => {
    try {
      setErrorMessage('');
      
      if (!user) return;
      
      // Format time for database
      const formattedTime = `${updatedFields.hours?.padStart(2, '0')}:${updatedFields.minutes?.padStart(2, '0')}:${updatedFields.seconds?.padStart(2, '0')}`;
      
      // Update record in Supabase
      const { error } = await supabase
        .from('personal_records')
        .update({
          time: formattedTime,
          race_location: updatedFields.location,
          date_achieved: updatedFields.date || null,
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRecords(records.map(record => 
        record.id === id ? { ...record, ...updatedFields } : record
      ));
    } catch (error) {
      console.error('Error updating record:', error);
      setErrorMessage('Error updating record. Please try again.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      setErrorMessage('');
      
      if (!user) return;
      
      // Delete record from Supabase
      const { error } = await supabase
        .from('personal_records')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRecords(records.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
      setErrorMessage('Error deleting record. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'hours' || name === 'minutes' || name === 'seconds') {
      // Ensure time inputs are numeric and within range
      const numValue = value.replace(/[^0-9]/g, '');
      
      if (name === 'hours') {
        setNewRecord({ ...newRecord, [name]: numValue });
      } else if (name === 'minutes' || name === 'seconds') {
        // Ensure minutes and seconds are between 0-59
        const numericValue = parseInt(numValue);
        if (!numValue || (numericValue >= 0 && numericValue <= 59)) {
          setNewRecord({ ...newRecord, [name]: numValue });
        }
      }
    } else if (name === 'distance') {
      if (value === 'custom') {
        setIsCustomDistance(true);
        setNewDistance('');
      } else {
        setIsCustomDistance(false);
        setNewDistance(value);
      }
    } else {
      setNewRecord({ ...newRecord, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Personal Records</h2>
        </div>
        <p className="text-center py-12">Loading records...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Records</h2>
        {!isAddingRecord && (
          <button
            onClick={() => setIsAddingRecord(true)}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Add Record
          </button>
        )}
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-destructive/20 border border-destructive text-destructive rounded-md">
          {errorMessage}
        </div>
      )}
      
      {isAddingRecord && (
        <div className="glass-card rounded-lg p-5 mb-6 animate-fade-up">
          <h3 className="text-lg font-semibold mb-4">Add New Record</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Distance</label>
              {isCustomDistance ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDistance}
                    onChange={(e) => setCustomDistance(e.target.value)}
                    placeholder="Custom distance (e.g., 3K, 15 Miles)"
                    className="flex-1 px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
                  />
                  <button
                    onClick={() => setIsCustomDistance(false)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
                  >
                    Back
                  </button>
                </div>
              ) : (
                <select
                  name="distance"
                  value={newDistance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
                >
                  <option value="">Select a distance</option>
                  {commonDistances.map(distance => (
                    <option key={distance} value={distance}>{distance}</option>
                  ))}
                  <option value="custom">Custom distance</option>
                </select>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Time (HH:MM:SS)</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  name="hours"
                  value={newRecord.hours}
                  onChange={handleInputChange}
                  placeholder="HH"
                  maxLength={2}
                  className="time-input"
                />
                <span className="text-muted-foreground">:</span>
                <input
                  type="text"
                  name="minutes"
                  value={newRecord.minutes}
                  onChange={handleInputChange}
                  placeholder="MM"
                  maxLength={2}
                  className="time-input"
                />
                <span className="text-muted-foreground">:</span>
                <input
                  type="text"
                  name="seconds"
                  value={newRecord.seconds}
                  onChange={handleInputChange}
                  placeholder="SS"
                  maxLength={2}
                  className="time-input"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Location/Race</label>
              <input
                type="text"
                name="location"
                value={newRecord.location}
                onChange={handleInputChange}
                placeholder="Race or location"
                className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
              />
            </div>
            
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Date Achieved</label>
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddRecord}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Save Record
              </button>
              <button
                onClick={() => setIsAddingRecord(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up">
          {records.map(record => (
            <PRCard
              key={record.id}
              record={record}
              onUpdate={handleUpdateRecord}
              onDelete={handleDeleteRecord}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-muted-foreground">
            No personal records yet. Click "Add Record" to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default PRList;
