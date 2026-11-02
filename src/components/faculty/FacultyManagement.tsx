/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Faculty } from '../../types';
import {
  UserCheck,
  UserPlus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';

export const FacultyManagement: React.FC = () => {
  const {
    faculty,
    subjects,
    classes,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    assignFaculty,
    assignments,
    users,
    currentUser
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);
  const [assigningFaculty, setAssigningFaculty] = useState<Faculty | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    faculty_name: '',
    email: '',
    phone: '',
    department: 'Computer Applications'
  });

  // Assign Subject Form state
  const [assignData, setAssignData] = useState({
    subject_id: 1,
    class_id: 1
  });

  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const departments = useMemo(() => {
    return Array.from(new Set(faculty.map((f) => f.department)));
  }, [faculty]);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = f.faculty_name.toLowerCase().includes(term);
        const matchId = String(f.faculty_id).includes(term);
        const matchEmail = f.email.toLowerCase().includes(term);
        if (!matchName && !matchId && !matchEmail) return false;
      }
      if (departmentFilter !== 'all' && f.department !== departmentFilter) {
        return false;
      }
      return true;
    });
  }, [faculty, searchTerm, departmentFilter]);

  const handleOpenAdd = () => {
    setFormData({
      faculty_name: '',
      email: '',
      phone: '+91 ',
      department: 'Computer Applications'
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setFormData({
      faculty_name: f.faculty_name,
      email: f.email,
      phone: f.phone,
      department: f.department
    });
    setFormError('');
  };

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (editingFaculty) {
      const res = updateFaculty(editingFaculty.faculty_id, formData);
      if (!res.success) {
        setFormError(res.message || 'Update failed.');
        return;
      }
      setToastMessage(`Faculty ${formData.faculty_name} updated successfully.`);
      setEditingFaculty(null);
    } else {
      const res = addFaculty(formData);
      if (!res.success) {
        setFormError(res.message || 'Creation failed.');
        return;
      }
      setToastMessage(res.message || 'Faculty added successfully!');
      setIsAddModalOpen(false);
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAssignSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningFaculty) return;

    const res = assignFaculty({
      faculty_id: assigningFaculty.faculty_id,
      subject_id: Number(assignData.subject_id),
      class_id: Number(assignData.class_id)
    });

    if (res.success) {
      setToastMessage(`Assigned subject to ${assigningFaculty.faculty_name}.`);
      setAssigningFaculty(null);
    } else {
      setFormError(res.message || 'Failed to create assignment.');
    }

    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeleteConfirm = () => {
    if (!facultyToDelete) return;
    const res = deleteFaculty(facultyToDelete.faculty_id);
    if (res.success) {
      setToastMessage(`Faculty removed.`);
    } else {
      alert(res.message);
    }
    setFacultyToDelete(null);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Faculty Management Module
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic instructors, teaching departments, and course assignments.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Faculty Member</span>
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2 text-xs">
          <label className="text-slate-600 font-semibold whitespace-nowrap">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {filteredFaculty.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No faculty records found.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">ID</th>
                  <th className="py-3 px-4">Faculty Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Email / Phone</th>
                  <th className="py-3 px-4">Assigned Subjects</th>
                  <th className="py-3 px-4">System User</th>
                  {currentUser?.role === 'admin' && (
                    <th className="py-3 px-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.map((f) => {
                  const assignedSubs = subjects.filter((s) =>
                    f.assigned_subject_ids?.includes(s.subject_id)
                  );
                  const userAccount = users.find((u) => u.user_id === f.user_id);

                  return (
                    <tr key={f.faculty_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-400">
                        {f.faculty_id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{f.faculty_name}</div>
                        <div className="text-[11px] text-slate-400">Instructor ID: FAC-{f.faculty_id}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-medium">{f.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800">{f.email}</div>
                        <div className="text-[11px] font-mono text-slate-400">{f.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        {assignedSubs.length === 0 ? (
                          <span className="text-slate-400 italic">None assigned</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {assignedSubs.map((sub) => (
                              <span
                                key={sub.subject_id}
                                className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200"
                              >
                                {sub.subject_code}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {userAccount?.username || '—'}
                        </span>
                      </td>
                      {currentUser?.role === 'admin' && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setAssigningFaculty(f);
                                setFormError('');
                              }}
                              className="px-2 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                              title="Assign subject & class"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(f)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                              title="Edit faculty"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setFacultyToDelete(f)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete faculty"
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

      {/* Add / Edit Faculty Modal */}
      {(isAddModalOpen || editingFaculty) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFaculty ? `Edit Faculty: ${editingFaculty.faculty_name}` : 'Add Faculty Member'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingFaculty(null);
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

            <form onSubmit={handleSaveFaculty} className="p-4 sm:p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.faculty_name}
                  onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Dr. Rajesh Sharma"
                />
              </div>

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
                  placeholder="faculty@university.edu"
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

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Computer Applications"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingFaculty(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  {editingFaculty ? 'Save Changes' : 'Create Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Subject Modal */}
      {assigningFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Assign Subject: {assigningFaculty.faculty_name}
              </h3>
              <button
                type="button"
                onClick={() => setAssigningFaculty(null)}
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

            <form onSubmit={handleAssignSubject} className="p-4 sm:p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Subject
                </label>
                <select
                  value={assignData.subject_id}
                  onChange={(e) => setAssignData({ ...assignData, subject_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub.subject_id} value={sub.subject_id}>
                      {sub.subject_code} · {sub.subject_name} ({sub.course} Sem {sub.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Target Class / Section
                </label>
                <select
                  value={assignData.class_id}
                  onChange={(e) => setAssignData({ ...assignData, class_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.class_id} value={c.class_id}>
                      {c.course} Semester {c.semester} - Section {c.section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssigningFaculty(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {facultyToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-slate-600 mt-2">
              Are you sure you want to delete the faculty record for{' '}
              <strong>{facultyToDelete.faculty_name}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFacultyToDelete(null)}
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
