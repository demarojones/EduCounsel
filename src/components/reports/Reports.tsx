import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminReports from './AdminReports';
import CounselorReports from './CounselorReports';

const Reports: React.FC = () => {
  const { isAdmin } = useAuth();

  return isAdmin ? <AdminReports /> : <CounselorReports />;
};

export default Reports;
