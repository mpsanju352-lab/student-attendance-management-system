/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Student, Faculty, Subject, ClassEntity, FacultyAssignment, AttendanceRecord } from '../types';

export const INITIAL_USERS: User[] = [
  {
    user_id: 1,
    username: 'admin',
    password_hash: 'pbkdf2:sha256:admin123', // Demo representation of hashed password
    role: 'admin',
    is_active: true,
    created_at: '2026-08-01 09:00:00'
  },
  {
    user_id: 2,
    username: 'faculty.rajesh',
    password_hash: 'pbkdf2:sha256:faculty123',
    role: 'faculty',
    is_active: true,
    created_at: '2026-08-01 09:15:00',
    linked_id: 1
  },
  {
    user_id: 3,
    username: 'faculty.ananya',
    password_hash: 'pbkdf2:sha256:faculty123',
    role: 'faculty',
    is_active: true,
    created_at: '2026-08-01 09:20:00',
    linked_id: 2
  },
  {
    user_id: 4,
    username: 'faculty.vikram',
    password_hash: 'pbkdf2:sha256:faculty123',
    role: 'faculty',
    is_active: true,
    created_at: '2026-08-01 09:30:00',
    linked_id: 3
  },
  {
    user_id: 5,
    username: 'student.rahul',
    password_hash: 'pbkdf2:sha256:student123',
    role: 'student',
    is_active: true,
    created_at: '2026-08-05 10:00:00',
    linked_id: 101
  },
  {
    user_id: 6,
    username: 'student.priya',
    password_hash: 'pbkdf2:sha256:student123',
    role: 'student',
    is_active: true,
    created_at: '2026-08-05 10:05:00',
    linked_id: 102
  },
  {
    user_id: 7,
    username: 'student.amit',
    password_hash: 'pbkdf2:sha256:student123',
    role: 'student',
    is_active: true,
    created_at: '2026-08-05 10:10:00',
    linked_id: 103 // low attendance demo student (<75%)
  }
];

export const INITIAL_CLASSES: ClassEntity[] = [
  { class_id: 1, course: 'BCA', semester: 3, section: 'A' },
  { class_id: 2, course: 'BCA', semester: 3, section: 'B' },
  { class_id: 3, course: 'BCA', semester: 5, section: 'A' },
  { class_id: 4, course: 'BCA', semester: 1, section: 'A' }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { subject_id: 1, subject_name: 'Software Engineering', subject_code: 'BCA-301', semester: 3, course: 'BCA' },
  { subject_id: 2, subject_name: 'Database Management Systems', subject_code: 'BCA-302', semester: 3, course: 'BCA' },
  { subject_id: 3, subject_name: 'Web Application Development', subject_code: 'BCA-303', semester: 3, course: 'BCA' },
  { subject_id: 4, subject_name: 'Python & Data Analysis', subject_code: 'BCA-501', semester: 5, course: 'BCA' },
  { subject_id: 5, subject_name: 'Cloud Computing & DevOps', subject_code: 'BCA-502', semester: 5, course: 'BCA' },
  { subject_id: 6, subject_name: 'Fundamentals of Programming (C)', subject_code: 'BCA-101', semester: 1, course: 'BCA' }
];

export const INITIAL_FACULTY: Faculty[] = [
  {
    faculty_id: 1,
    faculty_name: 'Prof. Rajesh Sharma',
    email: 'r.sharma@university.edu',
    phone: '+91 98765 43210',
    department: 'Computer Applications',
    user_id: 2,
    assigned_subject_ids: [1, 4],
    assigned_class_ids: [1, 3]
  },
  {
    faculty_id: 2,
    faculty_name: 'Dr. Ananya Iyer',
    email: 'a.iyer@university.edu',
    phone: '+91 98765 43211',
    department: 'Information Technology',
    user_id: 3,
    assigned_subject_ids: [2, 3],
    assigned_class_ids: [1, 2]
  },
  {
    faculty_id: 3,
    faculty_name: 'Prof. Vikram Mehta',
    email: 'v.mehta@university.edu',
    phone: '+91 98765 43212',
    department: 'Computer Applications',
    user_id: 4,
    assigned_subject_ids: [5, 6],
    assigned_class_ids: [3, 4]
  }
];

export const INITIAL_ASSIGNMENTS: FacultyAssignment[] = [
  { assignment_id: 1, faculty_id: 1, subject_id: 1, class_id: 1 }, // Prof. Rajesh -> SE -> BCA 3A
  { assignment_id: 2, faculty_id: 1, subject_id: 4, class_id: 3 }, // Prof. Rajesh -> Python -> BCA 5A
  { assignment_id: 3, faculty_id: 2, subject_id: 2, class_id: 1 }, // Dr. Ananya -> DBMS -> BCA 3A
  { assignment_id: 4, faculty_id: 2, subject_id: 3, class_id: 1 }, // Dr. Ananya -> Web Dev -> BCA 3A
  { assignment_id: 5, faculty_id: 2, subject_id: 2, class_id: 2 }, // Dr. Ananya -> DBMS -> BCA 3B
  { assignment_id: 6, faculty_id: 3, subject_id: 5, class_id: 3 }, // Prof. Vikram -> Cloud -> BCA 5A
  { assignment_id: 7, faculty_id: 3, subject_id: 6, class_id: 4 }  // Prof. Vikram -> C Prog -> BCA 1A
];

export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 101,
    roll_number: 'BCA2024-001',
    full_name: 'Rahul Sharma',
    email: 'rahul.s@student.edu',
    phone: '+91 91234 56780',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-15',
    user_id: 5
  },
  {
    student_id: 102,
    roll_number: 'BCA2024-002',
    full_name: 'Priya Patel',
    email: 'priya.p@student.edu',
    phone: '+91 91234 56781',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-15',
    user_id: 6
  },
  {
    student_id: 103,
    roll_number: 'BCA2024-003',
    full_name: 'Amit Kumar Verma',
    email: 'amit.v@student.edu',
    phone: '+91 91234 56782',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-16',
    user_id: 7
  },
  {
    student_id: 104,
    roll_number: 'BCA2024-004',
    full_name: 'Sneha Kulkarni',
    email: 'sneha.k@student.edu',
    phone: '+91 91234 56783',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-16',
    user_id: 0
  },
  {
    student_id: 105,
    roll_number: 'BCA2024-005',
    full_name: 'Rohan Nambiar',
    email: 'rohan.n@student.edu',
    phone: '+91 91234 56784',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-17',
    user_id: 0
  },
  {
    student_id: 106,
    roll_number: 'BCA2024-006',
    full_name: 'Kavita Sundaram',
    email: 'kavita.s@student.edu',
    phone: '+91 91234 56785',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-18',
    user_id: 0
  },
  {
    student_id: 107,
    roll_number: 'BCA2024-007',
    full_name: 'Arjun Sen',
    email: 'arjun.s@student.edu',
    phone: '+91 91234 56786',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-18',
    user_id: 0
  },
  {
    student_id: 108,
    roll_number: 'BCA2024-008',
    full_name: 'Divya Nair',
    email: 'divya.n@student.edu',
    phone: '+91 91234 56787',
    course: 'BCA',
    semester: 3,
    section: 'A',
    admission_date: '2024-07-19',
    user_id: 0
  },
  {
    student_id: 109,
    roll_number: 'BCA2024-021',
    full_name: 'Manish Rawat',
    email: 'manish.r@student.edu',
    phone: '+91 91234 56788',
    course: 'BCA',
    semester: 3,
    section: 'B',
    admission_date: '2024-07-19',
    user_id: 0
  },
  {
    student_id: 110,
    roll_number: 'BCA2024-022',
    full_name: 'Neha Joshi',
    email: 'neha.j@student.edu',
    phone: '+91 91234 56789',
    course: 'BCA',
    semester: 3,
    section: 'B',
    admission_date: '2024-07-20',
    user_id: 0
  },
  {
    student_id: 111,
    roll_number: 'BCA2023-001',
    full_name: 'Gaurav Singhal',
    email: 'gaurav.s@student.edu',
    phone: '+91 91234 56790',
    course: 'BCA',
    semester: 5,
    section: 'A',
    admission_date: '2023-07-15',
    user_id: 0
  },
  {
    student_id: 112,
    roll_number: 'BCA2023-002',
    full_name: 'Meera Chawla',
    email: 'meera.c@student.edu',
    phone: '+91 91234 56791',
    course: 'BCA',
    semester: 5,
    section: 'A',
    admission_date: '2023-07-15',
    user_id: 0
  }
];

// Helper to generate seed attendance records across several dates
function generateSeedAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let id = 1;

  // Dates in October 2026
  const dates = [
    '2026-10-15', '2026-10-16', '2026-10-19', '2026-10-20',
    '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-26',
    '2026-10-27', '2026-10-28'
  ];

  // BCA 3A students: IDs 101 to 108
  const students3A = [101, 102, 103, 104, 105, 106, 107, 108];

  // Subject 1: Software Engineering (Faculty 1, Class 1)
  dates.forEach((date, dateIdx) => {
    students3A.forEach((studentId) => {
      let isPresent = true;
      // Tailor attendance profiles:
      // Student 101 (Rahul): High attendance (~90%)
      if (studentId === 101 && dateIdx === 3) isPresent = false;
      // Student 102 (Priya): Excellent (~100%)
      if (studentId === 102) isPresent = true;
      // Student 103 (Amit): Low attendance (<75% to trigger alert warning)
      if (studentId === 103 && [1, 2, 4, 6, 8, 9].includes(dateIdx)) isPresent = false;
      // Student 104 (Sneha): Good (~80%)
      if (studentId === 104 && [2, 7].includes(dateIdx)) isPresent = false;
      // Student 105 (Rohan): Low attendance (<75% - 40%)
      if (studentId === 105 && [0, 2, 4, 5, 7, 8].includes(dateIdx)) isPresent = false;
      // Student 106 (Kavita): Good
      if (studentId === 106 && [3].includes(dateIdx)) isPresent = false;
      // Student 107 (Arjun): Excellent
      if (studentId === 107 && [9].includes(dateIdx)) isPresent = false;
      // Student 108 (Divya): Good
      if (studentId === 108 && [1, 8].includes(dateIdx)) isPresent = false;

      records.push({
        attendance_id: id++,
        student_id: studentId,
        subject_id: 1, // Software Engineering
        class_id: 1,   // BCA 3A
        faculty_id: 1, // Prof. Rajesh
        attendance_date: date,
        status: isPresent ? 'Present' : 'Absent',
        created_at: `${date} 10:30:00`
      });
    });
  });

  // Subject 2: DBMS (Faculty 2, Class 1) for a subset of dates
  const dbmsDates = ['2026-10-15', '2026-10-19', '2026-10-21', '2026-10-23', '2026-10-27', '2026-10-28'];
  dbmsDates.forEach((date, dateIdx) => {
    students3A.forEach((studentId) => {
      let isPresent = true;
      if (studentId === 103 && [0, 2, 4].includes(dateIdx)) isPresent = false;
      if (studentId === 105 && [1, 3, 5].includes(dateIdx)) isPresent = false;
      if (studentId === 101 && dateIdx === 1) isPresent = false;

      records.push({
        attendance_id: id++,
        student_id: studentId,
        subject_id: 2, // DBMS
        class_id: 1,   // BCA 3A
        faculty_id: 2, // Dr. Ananya
        attendance_date: date,
        status: isPresent ? 'Present' : 'Absent',
        created_at: `${date} 11:30:00`
      });
    });
  });

  // Subject 3: Web Dev (Faculty 2, Class 1)
  const webDates = ['2026-10-16', '2026-10-20', '2026-10-22', '2026-10-26', '2026-10-28'];
  webDates.forEach((date, dateIdx) => {
    students3A.forEach((studentId) => {
      let isPresent = true;
      if (studentId === 103 && [0, 1, 3].includes(dateIdx)) isPresent = false;
      if (studentId === 101 && dateIdx === 2) isPresent = false;

      records.push({
        attendance_id: id++,
        student_id: studentId,
        subject_id: 3, // Web Dev
        class_id: 1,   // BCA 3A
        faculty_id: 2, // Dr. Ananya
        attendance_date: date,
        status: isPresent ? 'Present' : 'Absent',
        created_at: `${date} 14:00:00`
      });
    });
  });

  return records;
}

export const INITIAL_ATTENDANCE: AttendanceRecord[] = generateSeedAttendance();
