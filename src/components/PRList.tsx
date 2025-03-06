
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PersonalRecord } from '../types/database';
import { useToast } from '../hooks/use-toast';
import { 
  fromTable, 
  insertIntoTable, 
  updateTable, 
  deleteFromTable 
} from '../integrations/supabase/customClient';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from './ui/card';
import { 
  Input 
} from './ui/input';
import { 
  Button 
} from './ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { format } from 'date-fns';
import { Label } from './ui/label';

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

      // Using our custom wrapper
      const { data, error } = await fromTable('personal_records')
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
      
      // Using our custom wrapper
      const { error } = await insertIntoTable('personal_records', newRecord);
        
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
      
      // Using our custom wrapper
      const { error } = await updateTable('personal_records', updates)
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
      
      // Using our custom wrapper
      const { error } = await deleteFromTable('personal_records')
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Your Personal Records</CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                variant={showAddForm ? "outline" : "default"}
              >
                {showAddForm ? 'Cancel' : 'Add New Record'}
              </Button>
            </div>
            
            {showAddForm && (
              <Card className="mb-6 border border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Personal Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddRecord} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance</Label>
                      <Input
                        id="distance"
                        placeholder="e.g. 5K, 10K, Marathon"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        placeholder="e.g. 20:45, 3:45:30"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="race_location">Race Location</Label>
                      <Input
                        id="race_location"
                        placeholder="e.g. Boston, MA"
                        value={raceLocation}
                        onChange={(e) => setRaceLocation(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date_achieved">Date Achieved</Label>
                      <Input
                        id="date_achieved"
                        type="date"
                        value={dateAchieved}
                        onChange={(e) => setDateAchieved(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button type="submit">Add Record</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {personalRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Distance</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {personalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.distance}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>{record.race_location}</TableCell>
                      <TableCell>
                        {record.date_achieved ? 
                          format(new Date(record.date_achieved), 'MMM d, yyyy') : 
                          'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingRecord(record.id);
                              setTime(record.time);
                              setRaceLocation(record.race_location || '');
                              setDateAchieved(record.date_achieved || '');
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteRecord(record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No personal records yet. Add your first one!</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PRList;
