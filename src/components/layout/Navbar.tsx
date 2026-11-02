/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { LogOut, RotateCcw, BookOpen, ShieldCheck, GraduationCap, Users } from 'lucide-react';

interface NavbarProps {
  onOpenSEModal?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSEModal, activeTab, setActiveTab }) => {
  const { currentUser, logout, switchUser, users, resetDatabase } = useApp();

  if (!currentUser) return null;

  const roleColor = {
    admin: 'text-amber-700 bg-amber-50 border-amber-200',
    faculty: 'text-blue-700 bg-blue-50 border-blue-200',
    student: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  }[currentUser.role];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Project Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/src/assets/images/college_attendance_logo_1793254434920.jpg"
              alt="University Emblem"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base tracking-tight whitespace-nowrap">
                  Student Attendance Management System
                </span>
                <span className="text-xs text-slate-500 font-mono hidden md:inline">
                  BCA Software Engineering PBL
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-xs md:max-w-md hidden sm:block">
                Software Engineering Principles · SDLC · SRS &amp; UML
              </p>
            </div>
          </div>

          {/* Quick Controls & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher: Essential for professors to quickly evaluate roles without logout friction */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 px-1.5 font-medium">Quick Role View:</span>
              <button
                type="button"
                onClick={() => switchUser(1)}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  currentUser.role === 'admin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Admin (user_id: 1)"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => switchUser(2)}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  currentUser.role === 'faculty' && currentUser.user_id === 2
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Faculty (Prof. Rajesh)"
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => switchUser(5)}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  currentUser.role === 'student' && currentUser.user_id === 5
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Student (Rahul Sharma - High %)"
              >
                Student (Good %)
              </button>
              <button
                type="button"
                onClick={() => switchUser(7)}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  currentUser.role === 'student' && currentUser.user_id === 7
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-rose-600 hover:text-rose-900'
                }`}
                title="Switch to Student (Amit Verma - Low Attendance Alert <75%)"
              >
                Student (&lt;75% Alert)
              </button>
            </div>

            {/* SE Documentation Quick Nav Button */}
            <button
              type="button"
              onClick={() => setActiveTab('se_hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                activeTab === 'se_hub'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>SE Hub &amp; Diagrams</span>
            </button>

            {/* Python / MySQL Code Hub Button */}
            <button
              type="button"
              onClick={() => setActiveTab('code_export')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                activeTab === 'code_export'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono font-bold text-xs text-emerald-700">&lt;/&gt;</span>
              <span className="hidden sm:inline">Flask/MySQL Code</span>
            </button>

            {/* User Profile & Role Indicator */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-900">{currentUser.username}</div>
                <div className="text-[11px] capitalize text-slate-500">{currentUser.role}</div>
              </div>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${roleColor}`}
              >
                {currentUser.role}
              </span>

              {/* Reset to Factory Defaults button */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset database to clean initial state with sample records?')) {
                    resetDatabase();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                title="Reset Database to initial sample state"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                title="Log out of system"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
