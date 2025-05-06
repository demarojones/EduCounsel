import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CalendarClock, Clock, Info, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { InteractionType, Interaction } from '../../types';

interface InteractionFormProps {
  isEditing?: boolean;
}

const InteractionForm: React.FC<InteractionFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { 
    students, 
    contacts, 
    interactionReasons, 
    addInteraction, 
    updateInteraction,
    calculateInteractionDuration,
    interactions
  } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const searchParams = new URLSearchParams(location.search);
  const fromCalendar = searchParams.get('from') === 'calendar';

  const [formData, setFormData] = useState({
    date: searchParams.get('date') || today,
    startTime: searchParams.get('startTime') || '08:00',
    endTime: searchParams.get('endTime') || '08:30',
    type: (searchParams.get('type') as InteractionType) || 'Student',
    personId: searchParams.get('personId') || '',
    reasonIds: [] as string[],
    notes: '',
    followUpNeeded: false,
    followUpDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duration, setDuration] = useState(30);

  // Load interaction data if editing
  useEffect(() => {
    if (isEditing && id) {
      const interaction = interactions.find(i => i.id === id);
      if (interaction) {
        setFormData({
          date: interaction.date,
          startTime: interaction.startTime,
          endTime: interaction.endTime,
          type: interaction.type,
          personId: interaction.personId,
          reasonIds: interaction.reasonIds,
          notes: interaction.notes,
          followUpNeeded: interaction.followUpNeeded,
          followUpDate: interaction.followUpDate || ''
        });
      }
    }
  }, [isEditing, id, interactions]);

  // Update duration when times change
  useEffect(() => {
    const calculatedDuration = calculateInteractionDuration(formData.startTime, formData.endTime);
    if (calculatedDuration >= 0) {
      setDuration(calculatedDuration);
    } else {
      setDuration(0);
    }
  }, [formData.startTime, formData.endTime, calculateInteractionDuration]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear validation error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setFormData({ ...formData, reasonIds: [...formData.reasonIds, value] });
    } else {
      setFormData({
        ...formData,
        reasonIds: formData.reasonIds.filter(id => id !== value)
      });
    }
    
    // Clear validation error when reasons are selected
    if (errors.reasonIds) {
      setErrors({ ...errors, reasonIds: '' });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (duration < 0) newErrors.endTime = 'End time must be after start time';
    if (!formData.personId) newErrors.personId = 'Please select a person';
    if (formData.reasonIds.length === 0) newErrors.reasonIds = 'At least one reason is required';
    if (formData.followUpNeeded && !formData.followUpDate) {
      newErrors.followUpDate = 'Follow-up date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Get person name based on type and ID
    let personName = '';
    if (formData.type === 'Student') {
      const student = students.find(s => s.id === formData.personId);
      personName = student ? `${student.firstName} ${student.lastName}` : '';
    } else {
      const contact = contacts.find(c => c.id === formData.personId);
      personName = contact ? `${contact.firstName} ${contact.lastName}` : '';
    }
    
    if (!personName) {
      setErrors({ personId: 'Invalid person selected' });
      return;
    }
    
    if (isEditing && id) {
      updateInteraction({
        id,
        ...formData,
        personName,
        duration
      });
    } else {
      addInteraction({
        ...formData,
        personName,
        duration
      });
    }
    
    // Navigate back to calendar if we came from there
    navigate(fromCalendar ? '/calendar' : '/interactions');
  };

  const handleCancel = () => {
    navigate(fromCalendar ? '/calendar' : '/interactions');
  };

  // Group reasons by category
  const reasonsByCategory: Record<string, typeof interactionReasons> = {};
  interactionReasons.forEach(reason => {
    if (!reasonsByCategory[reason.category]) {
      reasonsByCategory[reason.category] = [];
    }
    reasonsByCategory[reason.category].push(reason);
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <button 
          onClick={handleCancel}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {fromCalendar ? 'Calendar' : 'Interactions'}
        </button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Interaction' : 'Log New Interaction'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarClock size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={today}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
            
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.endTime ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
              {!errors.endTime && (
                <p className="mt-1 text-sm text-gray-500">Duration: {duration} minutes</p>
              )}
            </div>
          </div>
          
          {/* Person Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Interaction With
              </label>
            </div>
            
            <div className="flex space-x-4 mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Student"
                  checked={formData.type === 'Student'}
                  onChange={handleChange}
                  className="border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Student</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="Contact"
                  checked={formData.type === 'Contact'}
                  onChange={handleChange}
                  className="border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Contact</span>
              </label>
            </div>
            
            <select
              id="personId"
              name="personId"
              value={formData.personId}
              onChange={handleChange}
              className={`block w-full pl-3 pr-10 py-2 text-base border ${
                errors.personId ? 'border-red-300' : 'border-gray-300'
              } focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
            >
              <option value="">Select {formData.type}</option>
              
              {formData.type === 'Student' 
                ? students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} (Grade {student.grade})
                    </option>
                  ))
                : contacts.map(contact => (
                    <option key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName} ({contact.type})
                    </option>
                  ))
              }
            </select>
            {errors.personId && <p className="mt-1 text-sm text-red-600">{errors.personId}</p>}
          </div>
          
          {/* Reasons */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Reasons for Interaction
              </label>
              {errors.reasonIds && (
                <p className="text-sm text-red-600">{errors.reasonIds}</p>
              )}
            </div>
            
            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto bg-gray-50">
              {Object.entries(reasonsByCategory).map(([category, reasons]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reasons.map(reason => (
                      <label key={reason.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="reasonIds"
                          value={reason.id}
                          checked={formData.reasonIds.includes(reason.id)}
                          onChange={handleReasonChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{reason.subcategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter details about the interaction..."
            ></textarea>
          </div>
          
          {/* Follow-up */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="followUpNeeded"
                name="followUpNeeded"
                checked={formData.followUpNeeded}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="followUpNeeded" className="ml-2 text-sm font-medium text-gray-700">
                Follow-up Required
              </label>
            </div>
            
            {formData.followUpNeeded && (
              <div className="ml-6">
                <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarClock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="followUpDate"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    min={today}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.followUpDate ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                </div>
                {errors.followUpDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.followUpDate}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Update Interaction' : 'Log Interaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InteractionForm;