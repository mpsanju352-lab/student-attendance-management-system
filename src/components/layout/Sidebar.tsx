/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  History,
  Users,
  UserCheck,
  BookMarked,
  FileBarChart,
  Code2,
  FileText,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, getOverallMetrics } = useApp();
  if (!currentUser) return null;

  const metrics = getOverallMetrics();

  const adminNavItems: NavItem[] = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'mark_attendance', label: 'Mark Attendance', icon: CheckSquare },
    { id: 'attendance_history', label: 'Attendance History', icon: History },
    { id: 'students', label: 'Student Management', icon: Users, badge: metrics.totalStudents },
    { id: 'faculty', label: 'Faculty Management', icon: UserCheck, badge: metrics.totalFaculty },
    { id: 'classes_subjects', label: 'Classes & Subjects', icon: BookMarked },
    { id: 'reports', label: 'Attendance Reports', icon: FileBarChart },
    { id: 'se_hub', label: 'SE Principles & Diagrams', icon: FileText, highlight: true },
    { id: 'code_export', label: 'Python & MySQL Code', icon: Code2, highlight: true }
  ];

  const facultyNavItems: NavItem[] = [
    { id: 'faculty_dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'mark_attendance', label: 'Mark Class Attendance', icon: CheckSquare },
    { id: 'attendance_history', label: 'My Session History', icon: History },
    { id: 'students', label: 'Enrolled Students', icon: Users },
    { id: 'reports', label: 'Class Reports & Analytics', icon: FileBarChart },
    { id: 'se_hub', label: 'SE Principles & Diagrams', icon: FileText, highlight: true },
    { id: 'code_export', label: 'Python & MySQL Code', icon: Code2 }
  ];

  const studentNavItems: NavItem[] = [
    { id: 'student_dashboard', label: 'Student Portal', icon: GraduationCap },
    { id: 'attendance_history', label: 'My Attendance Records', icon: History },
    { id: 'reports', label: 'My Attendance Report', icon: FileBarChart },
    { id: 'se_hub', label: 'SE Principles & Diagrams', icon: FileText, highlight: true },
    { id: 'code_export', label: 'Python & MySQL Code', icon: Code2 }
  ];

  const items =
    currentUser.role === 'admin'
      ? adminNavItems
      : currentUser.role === 'faculty'
      ? facultyNavItems
      : studentNavItems;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-4rem)]">
      {/* Role Banner */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Current Portal
        </div>
        <div className="text-sm font-bold text-white capitalize mt-0.5 flex items-center justify-between">
          <span>{currentUser.role} Navigation</span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
            v1.0
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : item.highlight
                  ? 'text-indigo-300 hover:text-white hover:bg-slate-800/80 bg-indigo-950/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Low Attendance Notice Banner (if any) */}
      {metrics.lowAttendanceCount > 0 && currentUser.role !== 'student' && (
        <div className="p-3 mx-3 mb-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-300 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-200 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Attendance Alert</span>
          </div>
          <p className="text-[11px] text-amber-300/90 leading-tight">
            {metrics.lowAttendanceCount} student(s) below mandatory 75% attendance threshold.
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300">Software Engineering PBL</div>
        <div className="text-[10px] text-slate-500 mt-0.5">Database: Normalized MySQL</div>
        <div className="text-[10px] text-slate-500">Backend: Python Flask REST</div>
      </div>
    </aside>
  );
};
