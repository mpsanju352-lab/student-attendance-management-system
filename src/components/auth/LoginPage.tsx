/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, Lock, User, Shield, GraduationCap, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    const res = login(username, password, role);
    if (!res.success) {
      setErrorMessage(res.message || 'Login failed. Please check your credentials.');
    } else {
      setSuccessMessage('Login successful! Redirecting to dashboard...');
    }
  };

  const handleQuickFill = (demoRole: UserRole, user: string, pass: string) => {
    setRole(demoRole);
    setUsername(user);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* University Crest & Title */}
        <div className="text-center">
          <div className="inline-flex p-1 rounded-full bg-white/10 ring-1 ring-white/20 mb-3 shadow-lg">
            <img
              src="/src/assets/images/college_attendance_logo_1793254434920.jpg"
              alt="University Seal"
              className="w-16 h-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Student Attendance Management System
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            BCA Software Engineering PBL · Role-Based Academic Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900">Sign in to your portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your academic role and enter your institutional credentials.
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-tight">{errorMessage}</div>
              </div>
            )}
            {successMessage && (
              <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="font-medium leading-tight">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Academic Role
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-all ${
                      role === 'admin'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('faculty')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-all ${
                      role === 'faculty'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-md transition-all ${
                      role === 'student'
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Student</span>
                  </button>
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter institutional username"
                    className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Password Input with Show/Hide toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="block w-full pl-9 pr-10 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-2 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            </form>

            {/* Quick Demo Credentials Autofill Helper */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                PBL Demo Credentials (1-Click Fill)
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin', 'admin', 'admin123')}
                  className="w-full text-left px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-medium text-slate-800">Administrator</span>
                  <span className="font-mono text-[11px] text-slate-500">admin / admin123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('faculty', 'faculty.rajesh', 'faculty123')}
                  className="w-full text-left px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-medium text-slate-800">Faculty (Prof. Rajesh)</span>
                  <span className="font-mono text-[11px] text-slate-500">faculty.rajesh / faculty123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('student', 'student.rahul', 'student123')}
                  className="w-full text-left px-2.5 py-1.5 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-medium text-slate-800">Student (Rahul Sharma - 90%)</span>
                  <span className="font-mono text-[11px] text-slate-500">student.rahul / student123</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('student', 'student.amit', 'student123')}
                  className="w-full text-left px-2.5 py-1.5 rounded border border-rose-200 bg-rose-50/50 hover:bg-rose-50 flex items-center justify-between text-xs transition-colors"
                >
                  <span className="font-medium text-rose-800">Student (Amit Verma - &lt;75% Warning)</span>
                  <span className="font-mono text-[11px] text-rose-600">student.amit / student123</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Software Engineering Footer Note */}
        <div className="mt-4 text-center text-xs text-slate-400">
          Role-Based Access Control (RBAC) &amp; Password Hashing enabled.
        </div>
      </div>
    </div>
  );
};
