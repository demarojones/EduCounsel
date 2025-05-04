import React from 'react';
import { Calendar, Clock, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Interaction } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

interface RecentInteractionsListProps {
  interactions: Interaction[];
}

const RecentInteractionsList: React.FC<RecentInteractionsListProps> = ({ interactions }) => {
  const { getReasonById } = useAppContext();

  if (interactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No recent interactions found.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {interactions.map((interaction) => {
        // Get the first reason for display
        const primaryReason = interaction.reasonIds.length > 0
          ? getReasonById(interaction.reasonIds[0])
          : undefined;

        return (
          <div key={interaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                interaction.type === 'Student' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {interaction.type === 'Student' ? <Users size={20} /> : <User size={20} />}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium text-gray-800">
                    {interaction.personName}
                  </h4>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {interaction.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {primaryReason ? `${primaryReason.category}: ${primaryReason.subcategory}` : 'No reason specified'}
                  {interaction.reasonIds.length > 1 && ` +${interaction.reasonIds.length - 1} more`}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {interaction.startTime} - {interaction.endTime} ({interaction.duration} min)
                  </span>
                  <Link 
                    to={`/interactions/${interaction.id}`} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="p-4 bg-gray-50">
        <Link 
          to="/interactions" 
          className="block w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View All Interactions
        </Link>
      </div>
    </div>
  );
};

export default RecentInteractionsList;