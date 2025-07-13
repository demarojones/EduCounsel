import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import Header from './components/layout/Header';
import AdminHeader from './components/admin/AdminHeader';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ReasonManagement from './components/admin/ReasonManagement';

// Counselor Components
import Dashboard from './components/dashboard/Dashboard';
import StudentList from './components/students/StudentList';
import StudentDetail from './components/students/StudentDetail';
import StudentForm from './components/students/StudentForm';
import ContactList from './components/contacts/ContactList';
import ContactDetail from './components/contacts/ContactDetail';
import ContactForm from './components/contacts/ContactForm';
import InteractionList from './components/interactions/InteractionList';
import InteractionDetail from './components/interactions/InteractionDetail';
import InteractionForm from './components/interactions/InteractionForm';
import Calendar from './components/calendar/Calendar';
import Reports from './components/reports/Reports';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <div className="min-h-screen bg-gray-50">
                    <AdminHeader />
                    <div className="pt-20 pb-10">
                      <AdminDashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <div className="min-h-screen bg-gray-50">
                    <AdminHeader />
                    <div className="pt-20 pb-10">
                      <UserManagement />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/reasons"
              element={
                <ProtectedRoute requireAdmin>
                  <div className="min-h-screen bg-gray-50">
                    <AdminHeader />
                    <div className="pt-20 pb-10">
                      <ReasonManagement />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Counselor Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <Calendar />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <StudentList />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <StudentDetail />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/new"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <StudentForm />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/students/edit/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <StudentForm isEditing />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contacts"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <ContactList />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contacts/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <ContactDetail />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contacts/new"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <ContactForm />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/contacts/edit/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <ContactForm isEditing />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/interactions"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <InteractionList />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/interactions/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <InteractionDetail />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/interactions/new"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <InteractionForm />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/interactions/edit/:id"
              element={
                <ProtectedRoute requireCounselor>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <InteractionForm isEditing />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Reports Route - Available to both roles */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gray-50">
                    <Header />
                    <div className="pt-20 pb-10">
                      <Reports />
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect based on role */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  {({ isAdmin }) => <Navigate to={isAdmin ? '/admin' : '/'} replace />}
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
