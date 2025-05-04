import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Calendar, User, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Interaction, InteractionType } from '../../types';

const InteractionList: React.FC = () => {
  const { interactions, interactionReasons, getReasonById } = useAppContext();
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>(interactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | InteractionType,
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
    category: 'all',
    followUp: false,
  });
  
  useEffect(() => {
    let results = [...interactions];
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(interaction => 
        interaction.personName.toLowerCase().includes(term) ||
        interaction.notes.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      results = results.filter(interaction => interaction.type === filters.type);
    }
    
    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const getDateLimit = () => {
        const date = new Date(today);
        switch (filters.dateRange) {
          case 'today':
            return date;
          case 'week':
            date.setDate(date.getDate() - 7);
            return date;
          case 'month':
            date.setMonth(date.getMonth() - 1);
            return date;
          default:
            return new Date(0); // beginning of time
        }
      };
      
      const dateLimit = getDateLimit();
      results = results.filter(interaction => {
        const interactionDate = new Date(interaction.date);
        return interactionDate >= dateLimit;
      });
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(interaction => 
        interaction.reasonIds.some(reasonId => {
          const reason = getReasonById(reasonId);
          return reason?.category === filters.category;
        })
      );
    }
    
    // Apply follow-up filter
    if (filters.followUp) {
      results = results.filter(interaction => interaction.followUpNeeded);
    }
    
    setFilteredInteractions(results);
  }, [searchTerm, filters, interactions, getReasonById]);
  
  // Get unique categories from reasons
  const categories = Array.from(new Set(interactionReasons.map(reason => reason.category)));
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Interactions</h1>
        <Link
          to="/interactions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Log New Interaction
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search interactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center">
              <Filter size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-500 mr-2">Filters:</span>
            </div>
            
            <select
              className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | InteractionType })}
            >
              <option value="all">All Types</option>
              <option value="Student">Students</option>
              <option value="Contact">Contacts</option>
            </select>
            
            <select
              className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as 'all' | 'today' | 'week' | 'month' })}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            
            <select
              className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={filters.followUp}
                onChange={(e) => setFilters({ ...filters, followUp: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Follow-ups</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {filteredInteractions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No interactions found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredInteractions.map((interaction) => {
              // Get the first reason for display
              const primaryReason = interaction.reasonIds.length > 0
                ? getReasonById(interaction.reasonIds[0])
                : undefined;
                
              const today = new Date().toISOString().split('T')[0];
              const isPastDue = interaction.followUpNeeded && 
                              interaction.followUpDate && 
                              interaction.followUpDate < today;
                
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-base font-medium text-gray-800 mb-1 sm:mb-0">
                          {interaction.personName}
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {interaction.type}
                          </span>
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {interaction.date}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {interaction.duration} min
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2">
                        {primaryReason ? `${primaryReason.category}: ${primaryReason.subcategory}` : 'No reason specified'}
                        {interaction.reasonIds.length > 1 && ` +${interaction.reasonIds.length - 1} more`}
                      </p>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{interaction.notes}</p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        {interaction.followUpNeeded ? (
                          <div className={`flex items-center text-xs font-medium ${
                            isPastDue ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            <AlertCircle size={14} className="mr-1" />
                            {isPastDue ? 'Follow-up overdue' : `Follow-up on ${interaction.followUpDate}`}
                          </div>
                        ) : (
                          <div></div>
                        )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionList;