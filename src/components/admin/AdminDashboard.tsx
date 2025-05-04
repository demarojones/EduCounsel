import React from 'react';
import { Link } from 'react-router-dom';
import { Users, List, FileBarChart } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">User Management</h2>
              <p className="text-sm text-gray-600">Manage counselors and administrators</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/reasons"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <List size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Reason Management</h2>
              <p className="text-sm text-gray-600">Manage shared interaction reasons</p>
            </div>
          </div>
        </Link>

        <Link
          to="/reports"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
              <FileBarChart size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Reports</h2>
              <p className="text-sm text-gray-600">View and generate system reports</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;