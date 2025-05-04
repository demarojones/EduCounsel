import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Phone, Mail, Clock, Users, AlertCircle, UserPlus } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, interactions, deleteContact } = useAppContext();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const contact = contacts.find(c => c.id === id);
  
  if (!contact) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-xl text-gray-700">Contact not found.</p>
        <Link 
          to="/contacts" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Contacts
        </Link>
      </div>
    );
  }
  
  // Get contact interactions
  const contactInteractions = interactions
    .filter(interaction => interaction.type === 'Contact' && interaction.personId === contact.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate statistics
  const totalInteractions = contactInteractions.length;
  const totalMinutes = contactInteractions.reduce((total, interaction) => total + interaction.duration, 0);
  
  const handleDelete = () => {
    deleteContact(contact.id);
    navigate('/contacts');
  };
  
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link 
          to="/contacts" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Contacts
        </Link>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Contact Details</h2>
          <div className="flex space-x-2">
            <Link
              to={`/contacts/edit/${contact.id}`}
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
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <span className="text-xl font-medium">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-800">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {contact.type}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {contact.relation && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Relation</h4>
                    <p className="text-base text-gray-800">{contact.relation}</p>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-400 mr-2" />
                    <p className="text-base text-gray-800">{contact.phone}</p>
                  </div>
                )}
                
                {contact.email && (
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-2" />
                    <p className="text-base text-gray-800">{contact.email}</p>
                  </div>
                )}
              </div>
              
              {contact.notes && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                  <p className="text-base text-gray-700 whitespace-pre-line">{contact.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <Users size={18} />
                  </div>
                  <p className="text-xs text-blue-800 uppercase font-medium">Interactions</p>
                  <p className="text-xl font-bold text-blue-900">{totalInteractions}</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center text-green-600 mb-1">
                    <Clock size={18} />
                  </div>
                  <p className="text-xs text-green-800 uppercase font-medium">Total Time</p>
                  <p className="text-xl font-bold text-green-900">{formatTime(totalMinutes)}</p>
                </div>
              </div>
              
              <Link
                to={{
                  pathname: "/interactions/new",
                  search: `?type=Contact&personId=${contact.id}`
                }}
                className="inline-flex items-center w-full justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserPlus size={16} className="mr-2" />
                Log New Interaction
              </Link>
            </div>
            
            <div className="md:w-2/3 md:border-l md:border-gray-200 md:pl-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Interaction History</h3>
              
              {contactInteractions.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <p>No interactions recorded with this contact yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contactInteractions.map((interaction) => (
                    <div key={interaction.id} className="py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-800">
                            {interaction.date}
                          </div>
                          <span className="mx-2 text-gray-300">•</span>
                          <div className="text-sm text-gray-500">
                            {interaction.startTime} - {interaction.endTime} ({interaction.duration} min)
                          </div>
                        </div>
                        <Link
                          to={`/interactions/${interaction.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Details
                        </Link>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {interaction.notes}
                      </p>
                      
                      {interaction.followUpNeeded && (
                        <div className="flex items-center text-xs font-medium text-amber-600">
                          <AlertCircle size={14} className="mr-1" />
                          {interaction.followUpDate 
                            ? `Follow-up scheduled for ${interaction.followUpDate}` 
                            : 'Follow-up needed'
                          }
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                      Delete Contact
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this contact? All associated data will be permanently removed.
                      </p>
                      <p className="text-sm text-red-500 mt-2">
                        Note: This will not delete interaction records associated with this contact.
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

export default ContactDetail;