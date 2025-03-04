
import React, { useState } from 'react';

export interface PersonalRecord {
  id: string;
  distance: string;
  hours: string;
  minutes: string;
  seconds: string;
  location: string;
  date: string;
}

interface PRCardProps {
  record: PersonalRecord;
  onUpdate: (id: string, updatedRecord: Partial<PersonalRecord>) => void;
  onDelete: (id: string) => void;
}

const PRCard: React.FC<PRCardProps> = ({ record, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hours: record.hours,
    minutes: record.minutes,
    seconds: record.seconds,
    location: record.location,
    date: record.date,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'hours' || name === 'minutes' || name === 'seconds') {
      // Ensure time inputs are numeric and within range
      const numValue = value.replace(/[^0-9]/g, '');
      
      if (name === 'hours') {
        setFormData({ ...formData, [name]: numValue });
      } else if (name === 'minutes' || name === 'seconds') {
        // Ensure minutes and seconds are between 0-59
        const numericValue = parseInt(numValue);
        if (!numValue || (numericValue >= 0 && numericValue <= 59)) {
          setFormData({ ...formData, [name]: numValue });
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    onUpdate(record.id, formData);
    setIsEditing(false);
  };

  const formatTimeDisplay = (hours: string, minutes: string, seconds: string) => {
    const h = hours ? hours.padStart(2, '0') : '00';
    const m = minutes ? minutes.padStart(2, '0') : '00';
    const s = seconds ? seconds.padStart(2, '0') : '00';
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="glass-card rounded-lg p-4 hover-lift">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-foreground">{record.distance}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {!isEditing && (
            <button 
              onClick={() => onDelete(record.id)}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3 animate-fade-in">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Time (HH:MM:SS)</label>
            <div className="flex items-center space-x-1">
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                placeholder="HH"
                maxLength={2}
                className="time-input"
              />
              <span className="text-muted-foreground">:</span>
              <input
                type="text"
                name="minutes"
                value={formData.minutes}
                onChange={handleInputChange}
                placeholder="MM"
                maxLength={2}
                className="time-input"
              />
              <span className="text-muted-foreground">:</span>
              <input
                type="text"
                name="seconds"
                value={formData.seconds}
                onChange={handleInputChange}
                placeholder="SS"
                maxLength={2}
                className="time-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Location/Race</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Race or location"
              className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">Date Achieved</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none input-transition"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Save Record
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="mb-3">
            <span className="text-2xl font-semibold text-foreground">
              {formatTimeDisplay(record.hours, record.minutes, record.seconds)}
            </span>
          </div>
          {record.location && (
            <div className="mb-1">
              <span className="text-sm text-muted-foreground">
                {record.location}
              </span>
            </div>
          )}
          {record.date && (
            <div>
              <span className="text-xs text-muted-foreground">
                {new Date(record.date).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PRCard;
