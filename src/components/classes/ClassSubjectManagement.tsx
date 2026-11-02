/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Layers,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  GraduationCap
} from 'lucide-react';

export const ClassSubjectManagement: React.FC = () => {
  const {
    classes,
    subjects,
    faculty,
    assignments,
    addClass,
    addSubject,
    assignFaculty,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'classes' | 'subjects' | 'assignments'>('classes');

  // Modals
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Class Form
  const [classForm, setClassForm] = useState({
    course: 'BCA',
    semester: 3,
    section: 'A'
  });

  // Subject Form
  const [subjectForm, setSubjectForm] = useState({
    subject_name: '',
    subject_code: '',
    course: 'BCA',
    semester: 3
  });

  // Assignment Form
  const [assignForm, setAssignForm] = useState({
    faculty_id: 1,
    subject_id: 1,
    class_id: 1
  });

  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const res = addClass(classForm);
    if (!res.success) {
      setFormError(res.message || 'Failed to add class.');
      return;
    }
    setToastMessage('New class created successfully.');
    setIsAddClassOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!subjectForm.subject_name.trim() || !subjectForm.subject_code.trim()) {
      setFormError('Subject Name and Subject Code are required.');
      return;
    }
    const res = addSubject(subjectForm);
    if (!res.success) {
      setFormError(res.message || 'Failed to add subject.');
      return;
    }
    setToastMessage(`Subject '${subjectForm.subject_name}' added.`);
    setIsAddSubjectOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const res = assignFaculty(assignForm);
    if (!res.success) {
      setFormError(res.message || 'Assignment failed.');
      return;
    }
    setToastMessage('Teaching assignment linked successfully.');
    setIsAssignOpen(false);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Classes, Subjects &amp; Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic curriculum, course sections, and faculty teaching allocations.
          </p>
        </div>

        {currentUser?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setIsAddClassOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormError('');
                setIsAddSubjectOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject</span>
            </button>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'classes'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Classes &amp; Sections ({classes.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'subjects'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Curriculum Subjects ({subjects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 px-3 border-b-2 transition-colors ${
            activeTab === 'assignments'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Faculty Allocations ({assignments.length})
        </button>
      </div>

      {/* Classes Table */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Class ID</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Section</th>
                <th className="py-3 px-4">Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((c) => (
                <tr key={c.class_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {c.class_id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{c.course}</td>
                  <td className="py-3 px-4 text-slate-700">Semester {c.semester}</td>
                  <td className="py-3 px-4 font-bold text-blue-600">Section {c.section}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {c.course}-SEM{c.semester}-{c.section}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subjects Table */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Subject ID</th>
                <th className="py-3 px-4">Subject Code</th>
                <th className="py-3 px-4">Subject Name</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((s) => (
                <tr key={s.subject_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-slate-400">
                    {s.subject_id}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {s.subject_code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.subject_name}</td>
                  <td className="py-3 px-4 text-slate-700">{s.course}</td>
                  <td className="py-3 px-4 text-slate-700">Semester {s.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignments Table */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Assignment ID</th>
                <th className="py-3 px-4">Faculty Instructor</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assigned Class / Section</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((a) => {
                const fac = faculty.find((f) => f.faculty_id === a.faculty_id);
                const sub = subjects.find((s) => s.subject_id === a.subject_id);
                const cls = classes.find((c) => c.class_id === a.class_id);

                return (
                  <tr key={a.assignment_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {a.assignment_id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {fac?.faculty_name || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-800">{sub?.subject_code}</span>
                      <span className="text-slate-500 ml-1.5">· {sub?.subject_name}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-blue-700">
                      {cls ? `${cls.course} Semester ${cls.semester} - Section ${cls.section}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Class Modal */}
      {isAddClassOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add New Class Section</h3>
            {formError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                {formError}
              </div>
            )}
            <form onSubmit={handleSaveClass} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course</label>
                <input
                  type="text"
                  required
                  value={classForm.course}
                  onChange={(e) => setClassForm({ ...classForm, course: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={classForm.semester}
                  onChange={(e) => setClassForm({ ...classForm, semester: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Section</label>
                <input
                  type="text"
                  required
                  value={classForm.section}
                  onChange={(e) => setClassForm({ ...classForm, section: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                  placeholder="A, B, C..."
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassOpen(false)}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Curriculum Subject</h3>
            {formError && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded text-xs">
                {formError}
              </div>
            )}
            <form onSubmit={handleSaveSubject} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCA-304"
                  value={subjectForm.subject_code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subject_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subjectForm.subject_name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, subject_name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={subjectForm.semester}
                  onChange={(e) => setSubjectForm({ ...subjectForm, semester: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-3 py-1.5 border rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
