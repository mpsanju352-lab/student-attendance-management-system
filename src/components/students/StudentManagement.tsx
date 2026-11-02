/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  GraduationCap
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentSummary,
    currentUser
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterSection, setFilterSection] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    roll_number: '',
    full_name: '',
    email: '',
    phone: '',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: new Date().toISOString().split('T')[0]
  });

  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = s.full_name.toLowerCase().includes(term);
        const matchRoll = s.roll_number.toLowerCase().includes(term);
        const matchId = String(s.student_id).includes(term);
        if (!matchName && !matchRoll && !matchId) return false;
      }
      if (filterCourse !== 'all' && s.course !== filterCourse) return false;
      if (filterSemester !== 'all' && s.semester !== Number(filterSemester)) return false;
      if (filterSection !== 'all' && s.section !== filterSection) return false;
      return true;
    });
  }, [students, searchTerm, filterCourse, filterSemester, filterSection]);

  const handleOpenAdd = () => {
    setFormData({
      roll_number: `BCA2024-${String(students.length + 1).padStart(3, '0')}`,
      full_name: '',
      email: '',
      phone: '+91 ',
      course: 'BCA',
      semester: 3,
      section: 'A',
      admission_date: new Date().toISOString().split('T')[0]
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      full_name: student.full_name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      semester: student.semester,
      section: student.section,
      admission_date: student.admission_date
    });
    setFormError('');
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (editingStudent) {
      const res = updateStudent(editingStudent.student_id, formData);
      if (!res.success) {
        setFormError(res.message || 'Update failed.');
        return;
      }
      setToastMessage(`Student ${formData.full_name} updated successfully.`);
      setEditingStudent(null);
    } else {
      const res = addStudent(formData);
      if (!res.success) {
        setFormError(res.message || 'Creation failed.');
        return;
      }
      setToastMessage(`Student ${formData.full_name} enrolled successfully!`);
      setIsAddModalOpen(false);
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteConfirm = () => {
    if (!studentToDelete) return;
    const res = deleteStudent(studentToDelete.student_id);
    if (res.success) {
      setToastMessage(`Student record removed.`);
    } else {
      alert(res.message);
    }
    setStudentToDelete(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Student Management Module
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain student admissions, roll registers, and semester batch assignments.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll New Student</span>
          </button>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search & Filters (Section 10) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Search by Name, Roll No, or ID
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Course</label>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Courses</option>
              <option value="BCA">BCA</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Semester</label>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="3">Semester 3</option>
              <option value="5">Semester 5</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Section</label>
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Found {filteredStudents.length} registered students</span>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setFilterCourse('all');
              setFilterSemester('all');
              setFilterSection('all');
            }}
            className="flex items-center gap-1 hover:text-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No students match the selected search query.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ID</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Admission Date</th>
                  <th className="py-3 px-4 text-center">Attendance %</th>
                  {currentUser?.role === 'admin' && (
                    <th className="py-3 px-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const summary = getStudentSummary(st.student_id);
                  return (
                    <tr key={st.student_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono text-slate-400">
                        {st.student_id}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-900">
                        {st.roll_number}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        {st.full_name}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {st.course} Sem {st.semester}-{st.section}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="text-slate-800">{st.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{st.phone}</div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">
                        {st.admission_date}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-mono font-bold tabular-nums text-xs ${
                              summary.percentage < 75
                                ? 'text-rose-600'
                                : summary.percentage >= 90
                                ? 'text-emerald-600'
                                : 'text-blue-600'
                            }`}
                          >
                            {summary.percentage}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({summary.attended}/{summary.total_conducted})
                          </span>
                        </div>
                      </td>
                      {currentUser?.role === 'admin' && (
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(st)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                              title="Edit student"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentToDelete(st)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

      {/* Add / Edit Student Modal */}
      {(isAddModalOpen || editingStudent) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingStudent ? `Edit Student: ${editingStudent.full_name}` : 'Enroll New Student'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="m-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Roll Number (Unique) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="BCA2024-001"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="name@student.edu"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="BCA">BCA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={3}>Semester 3</option>
                    <option value={5}>Semester 5</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Section</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  value={formData.admission_date}
                  onChange={(e) => setFormData({ ...formData, admission_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  {editingStudent ? 'Update Student Record' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-slate-600 mt-2">
              Are you sure you want to delete the record for student{' '}
              <strong>{studentToDelete.full_name}</strong> (Roll: {studentToDelete.roll_number})?
            </p>
            <p className="text-slate-400 mt-1">
              Note: This will also clean up associated attendance logs and user credentials.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
