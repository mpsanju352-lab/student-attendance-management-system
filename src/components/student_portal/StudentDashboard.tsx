/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Mail,
  Phone,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const {
    currentUser,
    students,
    attendance,
    subjects,
    getStudentSummary,
    getStudentSubjectBreakdown
  } = useApp();

  // Find student record associated with logged in user
  const currentStudent = useMemo(() => {
    return (
      students.find((s) => s.user_id === currentUser?.user_id) ||
      students.find((s) => s.student_id === currentUser?.linked_id) ||
      students[0]
    );
  }, [students, currentUser]);

  const summary = getStudentSummary(currentStudent.student_id);
  const subjectBreakdown = getStudentSubjectBreakdown(currentStudent.student_id);

  // Recent attendance entries for this student
  const recentHistory = useMemo(() => {
    return attendance
      .filter((a) => a.student_id === currentStudent.student_id)
      .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date))
      .slice(0, 8);
  }, [attendance, currentStudent]);

  // Color classes for progress
  const getProgressColor = (pct: number) => {
    if (pct >= 90) return 'bg-emerald-500 text-emerald-600';
    if (pct >= 75) return 'bg-blue-600 text-blue-600';
    return 'bg-rose-500 text-rose-600';
  };

  return (
    <div className="space-y-6">
      {/* Low Attendance Statutory Warning Banner (<75%) */}
      {summary.is_warning && (
        <div className="p-4 sm:p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-900">
                Official Academic Notice: Attendance Below 75% Minimum Requirement
              </h2>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                Your current cumulative attendance is{' '}
                <strong className="font-mono font-bold">{summary.percentage}%</strong>, which is below
                the University mandatory 75% minimum requirement for examination hall ticket issuance.
                Please meet with your course mentor immediately.
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold font-mono shrink-0">
            {summary.percentage}% CUMULATIVE
          </div>
        </div>
      )}

      {/* Student Profile Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg font-mono shrink-0">
              {currentStudent.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentStudent.full_name}
                </h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentStudent.roll_number}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>
                  {currentStudent.course} · Semester {currentStudent.semester} (Section {currentStudent.section})
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {currentStudent.email}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {currentStudent.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right text-xs text-slate-500 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div>Admission Date: <span className="font-mono text-slate-800">{currentStudent.admission_date}</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">Status: Active Student Register</div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards & Progress Bar (Section 7 & 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Percentage Card */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Overall Attendance</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                summary.percentage < 75
                  ? 'text-rose-600'
                  : summary.percentage >= 90
                  ? 'text-emerald-600'
                  : 'text-blue-600'
              }`}
            >
              {summary.percentage}%
            </span>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                summary.percentage < 75
                  ? 'text-rose-600'
                  : summary.percentage >= 90
                  ? 'text-emerald-600'
                  : 'text-blue-600'
              }`}
            >
              {summary.status_category}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                summary.percentage < 75
                  ? 'bg-rose-500'
                  : summary.percentage >= 90
                  ? 'bg-emerald-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(summary.percentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Total Conducted */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Classes Conducted</span>
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {summary.total_conducted}
            </span>
            <span className="text-[11px] text-slate-400">Total sessions</span>
          </div>
        </div>

        {/* Classes Attended */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
            <span>Classes Attended</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {summary.attended}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Present</span>
          </div>
        </div>

        {/* Classes Missed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider flex items-center justify-between">
            <span>Classes Missed</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700 font-mono">
              {summary.missed}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">Absences</span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Subject-Wise Attendance Breakdown
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Attendance performance across individual curriculum courses.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Mandatory criteria: <span className="font-bold text-slate-700">&ge; 75% per subject</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {subjectBreakdown.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No subjects registered for this semester.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Subject Code</th>
                  <th className="py-2.5 px-4">Subject Name</th>
                  <th className="py-2.5 px-4 text-center">Conducted</th>
                  <th className="py-2.5 px-4 text-center">Attended</th>
                  <th className="py-2.5 px-4 text-center">Missed</th>
                  <th className="py-2.5 px-4 w-48">Progress Indicator</th>
                  <th className="py-2.5 px-4 text-right">Percentage</th>
                  <th className="py-2.5 px-4 text-right">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectBreakdown.map((sub) => {
                  const isWarning = sub.total_conducted > 0 && sub.percentage < 75;
                  return (
                    <tr key={sub.subject_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {sub.subject_code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {sub.subject_name}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">
                        {sub.total_conducted}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-emerald-700">
                        {sub.attended}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-rose-700">
                        {sub.missed}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              isWarning
                                ? 'bg-rose-500'
                                : sub.percentage >= 90
                                ? 'bg-emerald-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                        <span
                          className={
                            isWarning
                              ? 'text-rose-600'
                              : sub.percentage >= 90
                              ? 'text-emerald-600'
                              : 'text-blue-600'
                          }
                        >
                          {sub.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            isWarning
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : sub.percentage >= 90
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isWarning ? 'Low' : sub.percentage >= 90 ? 'Excellent' : 'Good'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent History Table (Strictly Read-Only) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Attendance Sessions (Read-Only)
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Individual class log entries for verification. (Modifications restricted to authorized faculty).
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('attendance_history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Subject Code</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentHistory.map((h) => {
                const sub = subjects.find((s) => s.subject_id === h.subject_id);
                return (
                  <tr key={h.attendance_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                      {h.attendance_date}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {sub?.subject_name}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {sub?.subject_code}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                          h.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {h.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
