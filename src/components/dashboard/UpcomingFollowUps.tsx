import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const UpcomingFollowUps: React.FC = () => {
  const { interactions } = useAppContext();
  
  // Filter interactions that need follow-up
  const followUps = interactions
    .filter(interaction => interaction.followUpNeeded && interaction.followUpDate)
    .sort((a, b) => {
      if (!a.followUpDate || !b.followUpDate) return 0;
      return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
    })
    .slice(0, 5);
  
  if (followUps.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No upcoming follow-ups.
      </div>
    );
  }
  
  return (
    <div className="divide-y divide-gray-200">
      {followUps.map((interaction) => {
        const today = new Date().toISOString().split('T')[0];
        const isPastDue = interaction.followUpDate && interaction.followUpDate < today;
        
        return (
          <div key={interaction.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isPastDue ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {isPastDue ? <AlertCircle size={16} /> : <Calendar size={16} />}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-800">
                    {interaction.personName}
                  </h4>
                  <span className={`text-xs ${isPastDue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    {isPastDue ? 'Past Due' : interaction.followUpDate}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                  {interaction.notes}
                </p>
                <div className="mt-2 flex justify-end">
                  <Link 
                    to={`/interactions/${interaction.id}`} 
                    className="text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {followUps.length > 0 && (
        <div className="p-3 bg-gray-50">
          <Link 
            to="/interactions?filter=followup" 
            className="block w-full text-center py-1 text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            View All Follow-ups
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpcomingFollowUps;