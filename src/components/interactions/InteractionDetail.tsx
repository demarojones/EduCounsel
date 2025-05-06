import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Clock, Users, AlertCircle, UserPlus } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const InteractionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { interactions, deleteInteraction } = useAppContext();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const fromCalendar = searchParams.get('from') === 'calendar';
  
  const interaction = interactions.find(i => i.id === id);
  
  if (!interaction) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-xl text-gray-700">Interaction not found.</p>
        <Link 
          to={fromCalendar ? '/calendar' : '/interactions'}
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {fromCalendar ? 'Calendar' : 'Interactions'}
        </Link>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteInteraction(interaction.id);
    navigate(fromCalendar ? '/calendar' : '/interactions');
  };
  
  // Format time
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link 
          to={fromCalendar ? '/calendar' : '/interactions'}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {fromCalendar ? 'Calendar' : 'Interactions'}
        </Link>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Interaction Details</h2>
          <div className="flex space-x-2">
            <Link
              to={`/interactions/edit/${interaction.id}${fromCalendar ? '?from=calendar' : ''}`}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
              title="Edit"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Person</h3>
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  interaction.type === 'Student' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {interaction.type === 'Student' ? <Users size={16} /> : <Users size={16} />}
                </div>
                <div className="ml-3">
                  <p className="text-lg font-medium text-gray-800">{interaction.personName}</p>
                  <p className="text-sm text-gray-500">{interaction.type}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <p className="text-base text-gray-700">{formatDate(interaction.date)}</p>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <p className="text-base text-gray-700">
                    {formatTime(interaction.startTime)} - {formatTime(interaction.endTime)} ({interaction.duration} min)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-base text-gray-700 whitespace-pre-line">{interaction.notes || 'No notes provided.'}</p>
            </div>
          </div>
          
          {/* Follow-up */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Follow-up</h3>
            {interaction.followUpNeeded ? (
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle size={16} className="text-amber-500" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">
                    Follow-up scheduled for <span className="font-medium">{interaction.followUpDate}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <AlertCircle size={16} className="text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-base text-gray-700">No follow-up required</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Interaction
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this interaction? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractionDetail;