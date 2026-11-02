/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Save,
  Check,
  X
} from 'lucide-react';

export const AttendanceMarking: React.FC = () => {
  const {
    currentUser,
    classes,
    subjects,
    faculty,
    students,
    attendance,
    markBatchAttendance,
    hasExistingAttendance,
    getStudentSummary
  } = useApp();

  // Find faculty details if current user is faculty
  const facultyMember = useMemo(() => {
    if (currentUser?.role === 'faculty') {
      return faculty.find((f) => f.user_id === currentUser.user_id);
    }
    return null;
  }, [currentUser, faculty]);

  // Allowed classes & subjects based on role
  const availableClasses = useMemo(() => {
    if (currentUser?.role === 'admin') return classes;
    if (facultyMember && facultyMember.assigned_class_ids) {
      return classes.filter((c) => facultyMember.assigned_class_ids?.includes(c.class_id));
    }
    return classes;
  }, [classes, currentUser, facultyMember]);

  const [selectedClassId, setSelectedClassId] = useState<number>(() =>
    availableClasses[0]?.class_id || 1
  );

  const selectedClass = classes.find((c) => c.class_id === selectedClassId);

  // Available subjects for the selected class & role
  const availableSubjects = useMemo(() => {
    if (!selectedClass) return [];
    let subs = subjects.filter(
      (s) => s.course === selectedClass.course && s.semester === selectedClass.semester
    );
    if (currentUser?.role === 'faculty' && facultyMember?.assigned_subject_ids) {
      subs = subs.filter((s) => facultyMember.assigned_subject_ids?.includes(s.subject_id));
    }
    return subs;
  }, [subjects, selectedClass, currentUser, facultyMember]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(1);
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Track student roster status: mapping student_id -> 'Present' | 'Absent'
  const [studentStatuses, setStudentStatuses] = useState<Record<number, 'Present' | 'Absent'>>({});
  const [isOverwriteConfirmed, setIsOverwriteConfirmed] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Update selected subject when available subjects change
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!availableSubjects.some((s) => s.subject_id === selectedSubjectId)) {
        setSelectedSubjectId(availableSubjects[0].subject_id);
      }
    }
  }, [availableSubjects, selectedSubjectId]);

  // Students belonging to the selected class
  const classStudents = useMemo(() => {
    if (!selectedClass) return [];
    return students
      .filter(
        (s) =>
          s.course === selectedClass.course &&
          s.semester === selectedClass.semester &&
          s.section === selectedClass.section
      )
      .sort((a, b) => a.roll_number.localeCompare(b.roll_number));
  }, [students, selectedClass]);

  // Check if session attendance is already recorded in the database
  const alreadyRecorded = useMemo(() => {
    if (!selectedClassId || !selectedSubjectId || !attendanceDate) return false;
    return hasExistingAttendance(selectedClassId, selectedSubjectId, attendanceDate);
  }, [hasExistingAttendance, selectedClassId, selectedSubjectId, attendanceDate]);

  // Initialize or populate student statuses when class, subject, date, or classStudents change
  useEffect(() => {
    const initialMap: Record<number, 'Present' | 'Absent'> = {};

    if (alreadyRecorded) {
      // Pre-fill with existing records from database
      classStudents.forEach((st) => {
        const existing = attendance.find(
          (a) =>
            a.class_id === selectedClassId &&
            a.subject_id === selectedSubjectId &&
            a.attendance_date === attendanceDate &&
            a.student_id === st.student_id
        );
        initialMap[st.student_id] = existing ? existing.status : 'Present';
      });
      setIsOverwriteConfirmed(true);
      setFeedback({
        type: 'warning',
        text: 'Attendance for this session was previously recorded. Modifying will update existing database records.'
      });
    } else {
      // Default all to Present for fast marking
      classStudents.forEach((st) => {
        initialMap[st.student_id] = 'Present';
      });
      setIsOverwriteConfirmed(false);
      setFeedback(null);
    }

    setStudentStatuses(initialMap);
  }, [selectedClassId, selectedSubjectId, attendanceDate, classStudents, alreadyRecorded, attendance]);

  // Quick batch actions
  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated: Record<number, 'Present' | 'Absent'> = {};
    classStudents.forEach((st) => {
      updated[st.student_id] = status;
    });
    setStudentStatuses(updated);
  };

  const handleToggle = (studentId: number) => {
    setStudentStatuses((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSaveAttendance = () => {
    setFeedback(null);

    if (classStudents.length === 0) {
      setFeedback({ type: 'error', text: 'No students enrolled in the selected class.' });
      return;
    }

    if (!attendanceDate) {
      setFeedback({ type: 'error', text: 'Please select an attendance date.' });
      return;
    }

    // Determine faculty ID to attribute
    const effectiveFacultyId = facultyMember?.faculty_id || 1;

    const entries = classStudents.map((st) => ({
      student_id: st.student_id,
      status: studentStatuses[st.student_id] || 'Present'
    }));

    const result = markBatchAttendance({
      class_id: selectedClassId,
      subject_id: selectedSubjectId,
      faculty_id: effectiveFacultyId,
      attendance_date: attendanceDate,
      entries,
      isOverwrite: isOverwriteConfirmed || alreadyRecorded
    });

    if (result.success) {
      setFeedback({
        type: 'success',
        text: result.message || 'Attendance saved successfully to MySQL database.'
      });
    } else {
      setFeedback({
        type: 'error',
        text: result.message || 'Failed to save attendance.'
      });
    }
  };

  // Real-time metrics
  const presentCount = Object.values(studentStatuses).filter((s) => s === 'Present').length;
  const absentCount = classStudents.length - presentCount;
  const attendancePercentage = classStudents.length > 0
    ? Math.round((presentCount / classStudents.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Attendance Marking Module
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Formulate class attendance roster, verify records, and commit to the database.
        </p>
      </div>

      {/* Attendance Form Selector Box (Section 6) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Session Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class / Section Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Class / Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {availableClasses.map((c) => (
                <option key={c.class_id} value={c.class_id}>
                  {c.course} Semester {c.semester} - Section {c.section}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
              disabled={availableSubjects.length === 0}
              className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-slate-100"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.subject_id} value={sub.subject_id}>
                  {sub.subject_code} · {sub.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attendance Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full text-xs sm:text-sm py-2 px-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Session Overview Stats */}
          <div className="flex flex-col justify-end">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Enrolled Students</span>
                <span className="font-bold text-slate-900 font-mono text-sm">
                  {classStudents.length}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Present Ratio</span>
                <span className="font-bold text-blue-600 font-mono text-sm">
                  {attendancePercentage}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Session Alert / Overwrite Toggle */}
        {alreadyRecorded && (
          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Existing Attendance Detected:</strong> A record exists for this class, subject, and date.
              </span>
            </div>
            <label className="inline-flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={isOverwriteConfirmed}
                onChange={(e) => setIsOverwriteConfirmed(e.target.checked)}
                className="rounded border-amber-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Enable update mode to overwrite</span>
            </label>
          </div>
        )}
      </div>

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Attendance Roster Table & Batch Controls */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Roster ({classStudents.length})
            </div>
            {/* Live Count Display without pill enclosures */}
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-emerald-700 font-mono tabular-nums">
                {presentCount} Present
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-semibold text-rose-700 font-mono tabular-nums">
                {absentCount} Absent
              </span>
            </div>
          </div>

          {/* Batch Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          {classStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No students found for this class. Select another class or enroll students in the Student Management module.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-36">Roll Number</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Cumulative %</th>
                  <th className="py-3 px-4 text-center w-56">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st, idx) => {
                  const status = studentStatuses[st.student_id] || 'Present';
                  const summary = getStudentSummary(st.student_id);

                  return (
                    <tr
                      key={st.student_id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        status === 'Absent' ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                        {st.roll_number}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="font-semibold text-slate-900">{st.full_name}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`font-mono font-bold tabular-nums ${
                            summary.percentage < 75
                              ? 'text-rose-600'
                              : summary.percentage >= 90
                              ? 'text-emerald-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {summary.percentage}%
                        </span>
                        {summary.is_warning && (
                          <span className="block text-[10px] text-rose-500">Below 75%</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {/* Radio Options for Present / Absent */}
                        <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              setStudentStatuses((prev) => ({ ...prev, [st.student_id]: 'Present' }))
                            }
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setStudentStatuses((prev) => ({ ...prev, [st.student_id]: 'Absent' }))
                            }
                            className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              status === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Save Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Referential integrity enforced: Entries linked to student_id, subject_id, class_id, and faculty_id.
          </div>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={classStudents.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance Records</span>
          </button>
        </div>
      </div>
    </div>
  );
};
