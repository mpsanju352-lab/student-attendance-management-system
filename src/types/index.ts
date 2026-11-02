/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  linked_id?: number; // student_id or faculty_id
}

export interface Student {
  student_id: number;
  roll_number: string;
  full_name: string;
  email: string;
  phone: string;
  course: string;
  semester: number;
  section: string;
  admission_date: string;
  user_id: number;
}

export interface Faculty {
  faculty_id: number;
  faculty_name: string;
  email: string;
  phone: string;
  department: string;
  user_id: number;
  assigned_subject_ids?: number[];
  assigned_class_ids?: number[];
}

export interface Subject {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  semester: number;
  course: string;
}

export interface ClassEntity {
  class_id: number;
  course: string;
  semester: number;
  section: string;
}

export interface FacultyAssignment {
  assignment_id: number;
  faculty_id: number;
  subject_id: number;
  class_id: number;
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  attendance_id: number;
  student_id: number;
  subject_id: number;
  class_id: number;
  faculty_id: number;
  attendance_date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  created_at: string;
}

export interface AttendanceSummary {
  total_conducted: number;
  attended: number;
  missed: number;
  percentage: number;
  status_category: 'Excellent' | 'Good' | 'Low Attendance';
  is_warning: boolean;
}

export interface SubjectAttendanceSummary {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  total_conducted: number;
  attended: number;
  missed: number;
  percentage: number;
}

export interface TestCase {
  id: string;
  type: 'Unit' | 'Integration' | 'Validation' | 'System';
  scenario: string;
  input: string;
  expectedResult: string;
  actualResult: string;
  status: 'Pass' | 'Fail' | 'Pending';
}
