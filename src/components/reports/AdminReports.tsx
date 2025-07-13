import React, { useState } from 'react';
import { Download, Filter, Calendar, Users, Clock, BarChart2 } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import TimeDistributionChart from './TimeDistributionChart';
import InteractionTypeChart from './InteractionTypeChart';
import ReasonCategoryChart from './ReasonCategoryChart';

const AdminReports: React.FC = () => {
  const { interactions, interactionReasons, profiles } = useAppContext();

  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0],
  });

  const [selectedCounselor, setSelectedCounselor] = useState<string>('all');

  // Filter interactions based on date range and counselor
  const filteredInteractions = interactions.filter((interaction) => {
    const interactionDate = new Date(interaction.date);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59);

    const isInDateRange = interactionDate >= startDate && interactionDate <= endDate;
    const matchesCounselor =
      selectedCounselor === 'all' || interaction.personId === selectedCounselor;

    return isInDateRange && matchesCounselor;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalInteractions = filteredInteractions.length;
    const totalTime = filteredInteractions.reduce(
      (total, interaction) => total + interaction.duration,
      0
    );
    const avgDuration = totalInteractions > 0 ? Math.round(totalTime / totalInteractions) : 0;
    const studentCount = new Set(
      filteredInteractions.filter((i) => i.type === 'Student').map((i) => i.personId)
    ).size;
    const contactCount = new Set(
      filteredInteractions.filter((i) => i.type === 'Contact').map((i) => i.personId)
    ).size;

    return {
      totalInteractions,
      totalTime,
      avgDuration,
      studentCount,
      contactCount,
    };
  };

  const stats = calculateStats();

  // Calculate reason distribution
  const calculateReasonDistribution = () => {
    const distribution: Record<string, number> = {};

    filteredInteractions.forEach((interaction) => {
      interaction.reasonIds.forEach((reasonId) => {
        const reason = interactionReasons.find((r) => r.id === reasonId);
        if (reason) {
          const category = reason.category;
          distribution[category] = (distribution[category] || 0) + 1;
        }
      });
    });

    return distribution;
  };

  // Format time
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Download report as CSV
  const downloadCSV = () => {
    const counselor =
      selectedCounselor === 'all'
        ? 'All Counselors'
        : profiles.find((p) => p.id === selectedCounselor)?.first_name +
          ' ' +
          profiles.find((p) => p.id === selectedCounselor)?.last_name;

    // Prepare CSV header
    const headers = [
      'Date',
      'Counselor',
      'Start Time',
      'End Time',
      'Duration (min)',
      'Type',
      'Person Name',
      'Reasons',
      'Notes',
      'Follow-up Needed',
      'Follow-up Date',
    ];

    // Prepare CSV data
    const csvData = filteredInteractions.map((interaction) => {
      const counselorName =
        profiles.find((p) => p.id === interaction.personId)?.first_name +
        ' ' +
        profiles.find((p) => p.id === interaction.personId)?.last_name;

      const reasons = interaction.reasonIds
        .map((reasonId) => {
          const reason = interactionReasons.find((r) => r.id === reasonId);
          return reason ? `${reason.category}: ${reason.subcategory}` : '';
        })
        .join('; ');

      return [
        interaction.date,
        counselorName,
        interaction.startTime,
        interaction.endTime,
        interaction.duration.toString(),
        interaction.type,
        interaction.personName,
        reasons,
        `"${interaction.notes.replace(/"/g, '""')}"`, // Escape quotes for CSV
        interaction.followUpNeeded ? 'Yes' : 'No',
        interaction.followUpDate || '',
      ];
    });

    // Combine header and data
    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set file name with counselor and date range
    const fileName = `counseling_report_${counselor.replace(/\s+/g, '_')}_${
      dateRange.startDate
    }_to_${dateRange.endDate}.csv`;

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
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Counseling Reports</h1>
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
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="block pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Counselors</option>
              {profiles
                .filter((profile) => profile.role === 'counselor')
                .map((counselor) => (
                  <option key={counselor.id} value={counselor.id}>
                    {counselor.first_name} {counselor.last_name}
                  </option>
                ))}
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
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalInteractions}</p>
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
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatTime(stats.totalTime)}
                </p>
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
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.studentCount}</p>
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
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.avgDuration} min</p>
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
              studentCount={filteredInteractions.filter((i) => i.type === 'Student').length}
              contactCount={filteredInteractions.filter((i) => i.type === 'Contact').length}
            />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Reason Categories</h2>
          </div>
          <div className="p-6">
            <ReasonCategoryChart distribution={calculateReasonDistribution()} />
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

      {/* Counselor Performance */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Counselor Performance</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Counselor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Interactions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student Interactions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Interactions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avg. Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles
                  .filter((profile) => profile.role === 'counselor')
                  .map((counselor) => {
                    const counselorInteractions = filteredInteractions.filter(
                      (i) => i.personId === counselor.id
                    );
                    const totalInteractions = counselorInteractions.length;
                    const studentInteractions = counselorInteractions.filter(
                      (i) => i.type === 'Student'
                    ).length;
                    const contactInteractions = counselorInteractions.filter(
                      (i) => i.type === 'Contact'
                    ).length;
                    const totalTime = counselorInteractions.reduce(
                      (total, i) => total + i.duration,
                      0
                    );
                    const avgDuration =
                      totalInteractions > 0 ? Math.round(totalTime / totalInteractions) : 0;

                    return (
                      <tr key={counselor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {counselor.first_name} {counselor.last_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {totalInteractions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {studentInteractions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contactInteractions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTime(totalTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {avgDuration} min
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
