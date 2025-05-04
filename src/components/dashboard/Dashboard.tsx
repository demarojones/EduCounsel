import React from 'react';
import { Clock, Users, CalendarClock, List, FileBarChart } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import RecentInteractionsList from './RecentInteractionsList';
import StatsCard from './StatsCard';
import UpcomingFollowUps from './UpcomingFollowUps';
import InteractionChart from './InteractionChart';

const Dashboard: React.FC = () => {
  const { stats, interactions, interactionReasons } = useAppContext();
  
  // Format time from minutes to hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get interaction categories
  const getInteractionCategories = (): { [key: string]: number } => {
    const categories: { [key: string]: number } = {};
    
    interactions.forEach(interaction => {
      interaction.reasonIds.forEach(reasonId => {
        const reason = interactionReasons.find(r => r.id === reasonId);
        if (reason) {
          categories[reason.category] = (categories[reason.category] || 0) + 1;
        }
      });
    });
    
    return categories;
  };
  
  const interactionCategories = getInteractionCategories();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Interactions" 
          value={stats.totalInteractions.toString()}
          icon={<List className="text-purple-500" />}
          colorClass="bg-purple-50 text-purple-700 border-purple-200"
        />
        <StatsCard 
          title="Total Time Spent" 
          value={formatTime(stats.totalTimeSpent)}
          icon={<Clock className="text-blue-500" />}
          colorClass="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatsCard 
          title="Student Interactions" 
          value={stats.studentInteractions.toString()}
          icon={<Users className="text-green-500" />}
          colorClass="bg-green-50 text-green-700 border-green-200"
        />
        <StatsCard 
          title="Follow-ups Needed" 
          value={stats.followUpsNeeded.toString()}
          icon={<CalendarClock className="text-amber-500" />}
          colorClass="bg-amber-50 text-amber-700 border-amber-200"
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Interaction Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Interaction Categories</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <FileBarChart size={16} className="mr-1" />
                  <span>Last 30 days</span>
                </div>
              </div>
              <InteractionChart categories={interactionCategories} />
            </div>
          </div>
          
          {/* Recent Interactions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Interactions</h2>
            </div>
            <RecentInteractionsList interactions={interactions.slice(0, 5)} />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Upcoming Follow-ups */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Follow-ups</h2>
            </div>
            <UpcomingFollowUps />
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Quick Stats</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {Object.entries(interactionCategories).map(([category, count]) => (
                  <li key={category} className="flex justify-between">
                    <span className="text-gray-600">{category} Interactions:</span>
                    <span className="font-medium text-gray-800">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;