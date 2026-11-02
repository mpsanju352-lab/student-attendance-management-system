/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Calendar,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Download,
  Check,
  X
} from 'lucide-react';

export const AttendanceHistory: React.FC = () => {
  const {
    currentUser,
    attendance,
    students,
    subjects,
    classes,
    faculty,
    updateSingleAttendance,
    deleteAttendanceRecord
  } = useApp();

  // Filters state
  const [searchStudent, setSearchStudent] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Editing single record modal/inline
  const [editingId, setEditingId] = useState<number | null>(null);

  // If current user is student, restrict strictly to their student_id
  const studentProfile = useMemo(() => {
    if (currentUser?.role === 'student') {
      return students.find((s) => s.user_id === currentUser.user_id || s.student_id === currentUser.linked_id);
    }
    return null;
  }, [currentUser, students]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return attendance
      .filter((record) => {
        // Role restrictions: students can only see their own attendance
        if (studentProfile && record.student_id !== studentProfile.student_id) {
          return false;
        }

        // Student name / roll search
        if (searchStudent.trim()) {
          const st = students.find((s) => s.student_id === record.student_id);
          const term = searchStudent.toLowerCase();
          const matchName = st?.full_name.toLowerCase().includes(term);
          const matchRoll = st?.roll_number.toLowerCase().includes(term);
          if (!matchName && !matchRoll) return false;
        }

        // Date filter
        if (filterDate && record.attendance_date !== filterDate) {
          return false;
        }

        // Subject filter
        if (filterSubjectId !== 'all' && record.subject_id !== Number(filterSubjectId)) {
          return false;
        }

        // Class filter
        if (filterClassId !== 'all' && record.class_id !== Number(filterClassId)) {
          return false;
        }

        // Status filter
        if (filterStatus !== 'all' && record.status !== filterStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.attendance_date.localeCompare(a.attendance_date) || b.attendance_id - a.attendance_id);
  }, [
    attendance,
    studentProfile,
    searchStudent,
    filterDate,
    filterSubjectId,
    filterClassId,
    filterStatus,
    students
  ]);

  const totalFiltered = filteredRecords.length;
  const presentCount = filteredRecords.filter((r) => r.status === 'Present').length;
  const absentCount = totalFiltered - presentCount;
  const pct = totalFiltered > 0 ? Math.round((presentCount / totalFiltered) * 100) : 0;

  const handleResetFilters = () => {
    setSearchStudent('');
    setFilterDate('');
    setFilterSubjectId('all');
    setFilterClassId('all');
    setFilterStatus('all');
  };

  const handleExportCSV = () => {
    const headers = ['Attendance ID,Date,Roll Number,Student Name,Course,Semester,Section,Subject Code,Subject Name,Faculty,Status'];
    const rows = filteredRecords.map((r) => {
      const st = students.find((s) => s.student_id === r.student_id);
      const sub = subjects.find((s) => s.subject_id === r.subject_id);
      const cl = classes.find((c) => c.class_id === r.class_id);
      const f = faculty.find((fac) => fac.faculty_id === r.faculty_id);
      return `"${r.attendance_id}","${r.attendance_date}","${st?.roll_number || ''}","${st?.full_name || ''}","${cl?.course || ''}","${cl?.semester || ''}","${cl?.section || ''}","${sub?.subject_code || ''}","${sub?.subject_name || ''}","${f?.faculty_name || ''}","${r.status}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Attendance History &amp; Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Query, filter, and audit attendance logs stored in MySQL database.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Controls Bar (Section 10) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by Name/Roll */}
          {currentUser?.role !== 'student' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Search Student
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Name or Roll No..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Subject
            </label>
            <select
              value={filterSubjectId}
              onChange={(e) => setFilterSubjectId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_code} · {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          {currentUser?.role !== 'student' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Class / Section
              </label>
              <select
                value={filterClassId}
                onChange={(e) => setFilterClassId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Classes</option>
                {classes.map((c) => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.course} Sem {c.semester}-{c.section}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="font-mono text-slate-900">{totalFiltered}</strong> records</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-emerald-700 font-semibold font-mono">{presentCount} Present ({pct}%)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-rose-700 font-semibold font-mono">{absentCount} Absent</span>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No attendance records found matching the active query criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">ID</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4">Faculty</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  {currentUser?.role !== 'student' && (
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => {
                  const st = students.find((s) => s.student_id === r.student_id);
                  const sub = subjects.find((s) => s.subject_id === r.subject_id);
                  const cl = classes.find((c) => c.class_id === r.class_id);
                  const f = faculty.find((fac) => fac.faculty_id === r.faculty_id);
                  const isEditing = editingId === r.attendance_id;

                  return (
                    <tr key={r.attendance_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                        {r.attendance_id}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                        {r.attendance_date}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{st?.full_name || '—'}</div>
                        <div className="text-[11px] font-mono text-slate-500">{st?.roll_number}</div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        {cl ? `${cl.course} Sem ${cl.semester}-${cl.section}` : '—'}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="text-slate-900 font-medium">{sub?.subject_name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{sub?.subject_code}</div>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {f?.faculty_name || 'System Admin'}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                updateSingleAttendance(r.attendance_id, 'Present');
                                setEditingId(null);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800"
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateSingleAttendance(r.attendance_id, 'Absent');
                                setEditingId(null);
                              }}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800"
                            >
                              Absent
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                              r.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {r.status}
                          </span>
                        )}
                      </td>
                      {currentUser?.role !== 'student' && (
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingId(isEditing ? null : r.attendance_id)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                              title="Edit status"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {currentUser?.role === 'admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete attendance record #${r.attendance_id}?`)) {
                                    deleteAttendanceRecord(r.attendance_id);
                                  }
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
