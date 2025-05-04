import React, { useState } from 'react';
import { Calendar, Download, Filter, BarChart2, PieChart, Users, Clock } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import TimeDistributionChart from './TimeDistributionChart';
import InteractionTypeChart from './InteractionTypeChart';
import ReasonCategoryChart from './ReasonCategoryChart';

const Reports: React.FC = () => {
  const { interactions, interactionReasons } = useAppContext();
  
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [interactionType, setInteractionType] = useState<'all' | 'Student' | 'Contact'>('all');
  
  // Filter interactions based on date range and type
  const filteredInteractions = interactions.filter(interaction => {
    const interactionDate = new Date(interaction.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59); // Include the entire end date
    
    const isInDateRange = interactionDate >= startDate && interactionDate <= endDate;
    const matchesType = interactionType === 'all' || interaction.type === interactionType;
    
    return isInDateRange && matchesType;
  });
  
  // Calculate statistics
  const totalInteractions = filteredInteractions.length;
  const totalTime = filteredInteractions.reduce((total, interaction) => total + interaction.duration, 0);
  const avgDuration = totalInteractions > 0 ? Math.round(totalTime / totalInteractions) : 0;
  const studentCount = new Set(filteredInteractions
    .filter(i => i.type === 'Student')
    .map(i => i.personId)
  ).size;
  const contactCount = new Set(filteredInteractions
    .filter(i => i.type === 'Contact')
    .map(i => i.personId)
  ).size;
  
  // Calculate interaction reasons distribution
  const calculateReasonDistribution = () => {
    const distribution: Record<string, number> = {};
    
    filteredInteractions.forEach(interaction => {
      interaction.reasonIds.forEach(reasonId => {
        const reason = interactionReasons.find(r => r.id === reasonId);
        if (reason) {
          const category = reason.category;
          distribution[category] = (distribution[category] || 0) + 1;
        }
      });
    });
    
    return distribution;
  };
  
  const reasonDistribution = calculateReasonDistribution();
  
  // Format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Download report as CSV
  const downloadCSV = () => {
    // Prepare CSV header
    const headers = [
      'Date',
      'Start Time',
      'End Time',
      'Duration (min)',
      'Type',
      'Person Name',
      'Reasons',
      'Notes',
      'Follow-up Needed',
      'Follow-up Date'
    ];
    
    // Prepare CSV data
    const csvData = filteredInteractions.map(interaction => {
      const reasons = interaction.reasonIds.map(reasonId => {
        const reason = interactionReasons.find(r => r.id === reasonId);
        return reason ? `${reason.category}: ${reason.subcategory}` : '';
      }).join('; ');
      
      return [
        interaction.date,
        interaction.startTime,
        interaction.endTime,
        interaction.duration.toString(),
        interaction.type,
        interaction.personName,
        reasons,
        `"${interaction.notes.replace(/"/g, '""')}"`, // Escape quotes for CSV
        interaction.followUpNeeded ? 'Yes' : 'No',
        interaction.followUpDate || ''
      ];
    });
    
    // Combine header and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set file name with date range
    const fileName = `counselor_report_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Reports & Analytics</h1>
        <button
          onClick={downloadCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download size={16} className="mr-2" />
          Download CSV Report
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <Filter size={16} className="text-gray-400 mr-1" />
            <span className="text-sm text-gray-500 mr-2">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-1">
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-500 mr-2">From:</span>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="text-gray-400 mr-1" />
              <span className="text-sm text-gray-500 mr-2">To:</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
            
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value as 'all' | 'Student' | 'Contact')}
              className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Interactions</option>
              <option value="Student">Students Only</option>
              <option value="Contact">Contacts Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-50 text-purple-700 border-purple-200">
                <BarChart2 className="text-purple-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Interactions</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalInteractions}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Time</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatTime(totalTime)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 text-green-700 border-green-200">
                <Users className="text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Unique Students</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{studentCount}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="text-amber-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Duration</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{avgDuration} min</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Interaction Types</h2>
          </div>
          <div className="p-6">
            <InteractionTypeChart 
              studentCount={filteredInteractions.filter(i => i.type === 'Student').length}
              contactCount={filteredInteractions.filter(i => i.type === 'Contact').length}
            />
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Reason Categories</h2>
          </div>
          <div className="p-6">
            <ReasonCategoryChart distribution={reasonDistribution} />
          </div>
        </div>
      </div>
      
      {/* Time Distribution */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Time Distribution (Minutes)</h2>
        </div>
        <div className="p-6">
          <TimeDistributionChart interactions={filteredInteractions} />
        </div>
      </div>
      
      {/* Detailed Stats */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Detailed Statistics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-4">Interaction Summary</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Interactions:</span>
                  <span className="font-medium text-gray-800">{totalInteractions}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Student Interactions:</span>
                  <span className="font-medium text-gray-800">
                    {filteredInteractions.filter(i => i.type === 'Student').length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Contact Interactions:</span>
                  <span className="font-medium text-gray-800">
                    {filteredInteractions.filter(i => i.type === 'Contact').length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Unique Students:</span>
                  <span className="font-medium text-gray-800">{studentCount}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Unique Contacts:</span>
                  <span className="font-medium text-gray-800">{contactCount}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-medium text-gray-700 mb-4">Time Analysis</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Time Spent:</span>
                  <span className="font-medium text-gray-800">{formatTime(totalTime)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Average Duration:</span>
                  <span className="font-medium text-gray-800">{avgDuration} minutes</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Time with Students:</span>
                  <span className="font-medium text-gray-800">
                    {formatTime(filteredInteractions
                      .filter(i => i.type === 'Student')
                      .reduce((total, i) => total + i.duration, 0)
                    )}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Time with Contacts:</span>
                  <span className="font-medium text-gray-800">
                    {formatTime(filteredInteractions
                      .filter(i => i.type === 'Contact')
                      .reduce((total, i) => total + i.duration, 0)
                    )}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Follow-ups Needed:</span>
                  <span className="font-medium text-gray-800">
                    {filteredInteractions.filter(i => i.followUpNeeded).length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;