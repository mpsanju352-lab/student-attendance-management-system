/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyDashboard } from './components/faculty_portal/FacultyDashboard';
import { StudentDashboard } from './components/student_portal/StudentDashboard';
import { AttendanceMarking } from './components/attendance/AttendanceMarking';
import { AttendanceHistory } from './components/attendance/AttendanceHistory';
import { StudentManagement } from './components/students/StudentManagement';
import { FacultyManagement } from './components/faculty/FacultyManagement';
import { ClassSubjectManagement } from './components/classes/ClassSubjectManagement';
import { ReportsModule } from './components/reports/ReportsModule';
import { SoftwareEngineeringHub } from './components/software_engineering/SoftwareEngineeringHub';
import { PythonFlaskExporter } from './components/software_engineering/PythonFlaskExporter';

function MainApp() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>('admin_dashboard');

  // Sync active tab with user role upon login or role switch
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
      setActiveTab((prev) =>
        ['faculty_dashboard', 'student_dashboard'].includes(prev) ? 'admin_dashboard' : prev
      );
    } else if (currentUser.role === 'faculty') {
      setActiveTab((prev) =>
        ['admin_dashboard', 'student_dashboard', 'faculty', 'classes_subjects'].includes(prev)
          ? 'faculty_dashboard'
          : prev
      );
    } else if (currentUser.role === 'student') {
      setActiveTab('student_dashboard');
    }
  }, [currentUser?.role, currentUser?.user_id]);

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Role-Specific Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Admin Routes */}
          {activeTab === 'admin_dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'faculty_dashboard' && <FacultyDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'student_dashboard' && <StudentDashboard setActiveTab={setActiveTab} />}

          {/* Functional Modules */}
          {activeTab === 'mark_attendance' && <AttendanceMarking />}
          {activeTab === 'attendance_history' && <AttendanceHistory />}
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'faculty' && <FacultyManagement />}
          {activeTab === 'classes_subjects' && <ClassSubjectManagement />}
          {activeTab === 'reports' && <ReportsModule />}

          {/* Software Engineering Artifacts & Exporter */}
          {activeTab === 'se_hub' && <SoftwareEngineeringHub />}
          {activeTab === 'code_export' && <PythonFlaskExporter />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
