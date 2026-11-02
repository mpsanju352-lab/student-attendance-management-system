/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  BookOpen,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';

interface FacultyDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ setActiveTab }) => {
  const { currentUser, faculty, subjects, classes, attendance, students } = useApp();

  const currentFaculty = useMemo(() => {
    return faculty.find((f) => f.user_id === currentUser?.user_id) || faculty[0];
  }, [faculty, currentUser]);

  const assignedSubjects = useMemo(() => {
    return subjects.filter((s) => currentFaculty?.assigned_subject_ids?.includes(s.subject_id));
  }, [subjects, currentFaculty]);

  const assignedClasses = useMemo(() => {
    return classes.filter((c) => currentFaculty?.assigned_class_ids?.includes(c.class_id));
  }, [classes, currentFaculty]);

  // Attendance metrics for this faculty
  const facultyRecords = useMemo(() => {
    return attendance.filter((a) => a.faculty_id === currentFaculty.faculty_id);
  }, [attendance, currentFaculty]);

  const totalSessions = useMemo(() => {
    const sessionKeys = new Set(
      facultyRecords.map((r) => `${r.class_id}-${r.subject_id}-${r.attendance_date}`)
    );
    return sessionKeys.size;
  }, [facultyRecords]);

  const totalLogged = facultyRecords.length;
  const totalPresent = facultyRecords.filter((r) => r.status === 'Present').length;
  const overallAvg = totalLogged > 0 ? Math.round((totalPresent / totalLogged) * 100) : 0;

  // Recent 5 sessions
  const recentSessions = useMemo(() => {
    const map = new Map<string, { date: string; subjectId: number; classId: number; count: number; present: number }>();

    facultyRecords.forEach((r) => {
      const key = `${r.attendance_date}_${r.subject_id}_${r.class_id}`;
      if (!map.has(key)) {
        map.set(key, {
          date: r.attendance_date,
          subjectId: r.subject_id,
          classId: r.class_id,
          count: 0,
          present: 0
        });
      }
      const entry = map.get(key)!;
      entry.count++;
      if (r.status === 'Present') entry.present++;
    });

    return Array.from(map.values())
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [facultyRecords]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            Faculty Portal
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Welcome, {currentFaculty.faculty_name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Department of {currentFaculty.department} · {assignedSubjects.length} Assigned Course(s)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('mark_attendance')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Mark Class Attendance</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Assigned Subjects</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {assignedSubjects.length}
            </span>
            <span className="text-[11px] text-slate-400">Curriculum courses</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Assigned Classes</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {assignedClasses.length}
            </span>
            <span className="text-[11px] text-slate-400">Sections</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Sessions Conducted</span>
            <CheckSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {totalSessions}
            </span>
            <span className="text-[11px] text-slate-400">Lectures recorded</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Avg Attendance %</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600 font-mono">
              {overallAvg}%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Good standing</span>
          </div>
        </div>
      </div>

      {/* Assigned Subjects & Classes Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Subjects Cards */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Assigned Teaching Subjects
          </h2>
          <div className="space-y-3">
            {assignedSubjects.map((sub) => {
              const subRecords = facultyRecords.filter((r) => r.subject_id === sub.subject_id);
              const subPresent = subRecords.filter((r) => r.status === 'Present').length;
              const subPct = subRecords.length > 0 ? Math.round((subPresent / subRecords.length) * 100) : 0;

              return (
                <div
                  key={sub.subject_id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {sub.subject_name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {sub.subject_code} · {sub.course} Semester {sub.semester}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-blue-600">{subPct}%</span>
                    <span className="text-[10px] text-slate-400 block">Avg Attendance</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Attendance Sessions Conducted */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Class Sessions
            </h2>
            <button
              type="button"
              onClick={() => setActiveTab('attendance_history')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentSessions.length === 0 ? (
              <div className="text-xs text-slate-400 p-6 text-center">
                No recent attendance sessions logged yet.
              </div>
            ) : (
              recentSessions.map((session, idx) => {
                const sub = subjects.find((s) => s.subject_id === session.subjectId);
                const cls = classes.find((c) => c.class_id === session.classId);
                const pct = Math.round((session.present / session.count) * 100);

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {sub?.subject_name || 'Subject'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {session.date} · {cls?.course} Sem {cls?.semester}-{cls?.section}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">{pct}% Present</span>
                      <div className="text-[10px] text-slate-400">
                        {session.present} of {session.count} students
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
