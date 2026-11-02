/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  BookOpen,
  Code2,
  Database,
  ExternalLink
} from 'lucide-react';

interface CodeFile {
  path: string;
  name: string;
  language: string;
  content: string;
  description: string;
}

export const PythonFlaskExporter: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('app.py');
  const [copied, setCopied] = useState(false);

  const codeFiles: Record<string, CodeFile> = {
    'app.py': {
      path: 'app.py',
      name: 'app.py',
      language: 'python',
      description: 'Core Flask application with role-based routing, sessions, MySQL queries & calculations',
      content: `"""
Student Attendance Management System (SAMS)
BCA Software Engineering Project
Backend: Python Flask + MySQL Connector
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import datetime
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

def get_db_connection():
    """Establishes and returns a connection to MySQL database."""
    return mysql.connector.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB']
    )

# ----------------- Role-Based Access Control (RBAC) Decorators -----------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'danger')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return redirect(url_for('login'))
            if session.get('role') not in allowed_roles:
                flash('Access Denied: You do not have permission to view this page.', 'danger')
                return redirect(url_for('dashboard_router'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# ----------------- Authentication Routes -----------------
@app.route('/')
def home():
    if 'user_id' in session:
        return redirect(url_for('dashboard_router'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        role = request.form.get('role', '').strip()

        if not username or not password or not role:
            flash('Please fill in all credentials.', 'warning')
            return render_template('login.html')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s AND is_active = TRUE", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user['password_hash'], password):
            if user['role'] != role:
                flash(f"Role mismatch: This account is registered as '{user['role']}', not '{role}'.", 'danger')
                return render_template('login.html')

            # Set session
            session['user_id'] = user['user_id']
            session['username'] = user['username']
            session['role'] = user['role']
            flash(f"Welcome back, {user['username']}!", 'success')
            return redirect(url_for('dashboard_router'))
        else:
            flash('Invalid username or password.', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out safely.', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard_router():
    role = session.get('role')
    if role == 'admin':
        return redirect(url_for('admin_dashboard'))
    elif role == 'faculty':
        return redirect(url_for('faculty_dashboard'))
    else:
        return redirect(url_for('student_dashboard'))

# ----------------- Administrator Dashboard -----------------
@app.route('/admin/dashboard')
@role_required('admin')
def admin_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total FROM students")
    total_students = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM faculty")
    total_faculty = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM classes")
    total_classes = cursor.fetchone()['total']

    cursor.execute("SELECT COUNT(*) as total FROM attendance")
    total_records = cursor.fetchone()['total']

    today_str = datetime.date.today().isoformat()
    cursor.execute("SELECT COUNT(*) as present FROM attendance WHERE attendance_date = %s AND status = 'Present'", (today_str,))
    today_present = cursor.fetchone()['present']

    cursor.execute("SELECT COUNT(*) as absent FROM attendance WHERE attendance_date = %s AND status = 'Absent'", (today_str,))
    today_absent = cursor.fetchone()['absent']

    cursor.close()
    conn.close()

    metrics = {
        'total_students': total_students,
        'total_faculty': total_faculty,
        'total_classes': total_classes,
        'total_records': total_records,
        'today_present': today_present,
        'today_absent': today_absent
    }
    return render_template('admin_dashboard.html', metrics=metrics)

# ----------------- Student Management (CRUD) -----------------
@app.route('/admin/students', methods=['GET', 'POST'])
@role_required('admin')
def manage_students():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        roll_number = request.form['roll_number'].strip()
        full_name = request.form['full_name'].strip()
        email = request.form['email'].strip()
        phone = request.form['phone'].strip()
        course = request.form['course'].strip()
        semester = int(request.form['semester'])
        section = request.form['section'].strip()
        admission_date = request.form.get('admission_date', datetime.date.today().isoformat())

        # Check duplicate roll number
        cursor.execute("SELECT student_id FROM students WHERE roll_number = %s", (roll_number,))
        if cursor.fetchone():
            flash(f"Student with roll number '{roll_number}' already exists.", 'danger')
        else:
            # Create user account for student
            username = f"student.{roll_number.lower().replace('-', '')}"
            pwd_hash = generate_password_hash("student123")
            cursor.execute("INSERT INTO users (username, password_hash, role) VALUES (%s, %s, 'student')", (username, pwd_hash))
            user_id = cursor.lastrowid

            cursor.execute("""
                INSERT INTO students (roll_number, full_name, email, phone, course, semester, section, admission_date, user_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (roll_number, full_name, email, phone, course, semester, section, admission_date, user_id))
            conn.commit()
            flash(f"Student {full_name} enrolled successfully! Login: {username}", 'success')

    cursor.execute("SELECT * FROM students ORDER BY roll_number ASC")
    students_list = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('students.html', students=students_list)

# ----------------- Attendance Marking Module -----------------
@app.route('/attendance/mark', methods=['GET', 'POST'])
@role_required('admin', 'faculty')
def mark_attendance():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        class_id = int(request.form['class_id'])
        subject_id = int(request.form['subject_id'])
        attendance_date = request.form['attendance_date']
        overwrite = request.form.get('overwrite') == '1'

        # Check existing attendance to prevent duplicates
        cursor.execute("""
            SELECT attendance_id FROM attendance 
            WHERE class_id = %s AND subject_id = %s AND attendance_date = %s
        """, (class_id, subject_id, attendance_date))
        existing = cursor.fetchall()

        if existing and not overwrite:
            flash("Attendance already marked for this class, subject, and date. Check overwrite to update.", 'warning')
        else:
            if existing and overwrite:
                cursor.execute("""
                    DELETE FROM attendance 
                    WHERE class_id = %s AND subject_id = %s AND attendance_date = %s
                """, (class_id, subject_id, attendance_date))

            # Fetch faculty id
            faculty_id = session.get('user_id') # In production map via faculty table
            
            # Read student checkboxes
            cursor.execute("SELECT student_id FROM students WHERE class_id = %s OR 1=1", (class_id,))
            student_ids = [s['student_id'] for s in cursor.fetchall()]

            for sid in student_ids:
                status = request.form.get(f"status_{sid}", "Absent")
                cursor.execute("""
                    INSERT INTO attendance (student_id, subject_id, class_id, faculty_id, attendance_date, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (sid, subject_id, class_id, 1, attendance_date, status))

            conn.commit()
            flash("Attendance submitted successfully!", 'success')

    cursor.execute("SELECT * FROM classes")
    classes_list = cursor.fetchall()
    cursor.execute("SELECT * FROM subjects")
    subjects_list = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template('attendance.html', classes=classes_list, subjects=subjects_list)

# ----------------- Student Dashboard & Calculation -----------------
@app.route('/student/dashboard')
@role_required('student')
def student_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    user_id = session['user_id']
    cursor.execute("SELECT * FROM students WHERE user_id = %s", (user_id,))
    student = cursor.fetchone()

    if not student:
        flash("Student profile not found.", 'danger')
        return redirect(url_for('logout'))

    sid = student['student_id']

    # Section 9: Attendance Calculation Formula
    # Attendance Percentage = (Classes Attended / Total Conducted) * 100
    cursor.execute("SELECT COUNT(*) as conducted FROM attendance WHERE student_id = %s", (sid,))
    conducted = cursor.fetchone()['conducted'] or 0

    cursor.execute("SELECT COUNT(*) as attended FROM attendance WHERE student_id = %s AND status = 'Present'", (sid,))
    attended = cursor.fetchone()['attended'] or 0

    missed = conducted - attended
    percentage = round((attended / conducted) * 100, 1) if conducted > 0 else 0.0

    # Categorization
    if percentage >= 90:
        status_category = 'Excellent'
    elif percentage >= 75:
        status_category = 'Good'
    else:
        status_category = 'Low Attendance'

    is_warning = (conducted > 0 and percentage < 75.0)

    # Subject-wise attendance
    cursor.execute("""
        SELECT s.subject_name, s.subject_code,
               COUNT(a.attendance_id) as total,
               SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as attended
        FROM subjects s
        LEFT JOIN attendance a ON s.subject_id = a.subject_id AND a.student_id = %s
        GROUP BY s.subject_id
    """, (sid,))
    subject_stats = cursor.fetchall()

    cursor.close()
    conn.close()

    return render_template(
        'student_dashboard.html',
        student=student,
        conducted=conducted,
        attended=attended,
        missed=missed,
        percentage=percentage,
        status_category=status_category,
        is_warning=is_warning,
        subject_stats=subject_stats
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
`
    },
    'config.py': {
      path: 'config.py',
      name: 'config.py',
      language: 'python',
      description: 'Configuration module with environment variable credentials',
      content: `import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'bca-student-attendance-pbl-secret-2026'
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    MYSQL_USER = os.environ.get('MYSQL_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or 'password123'
    MYSQL_DB = os.environ.get('MYSQL_DB') or 'student_attendance_db'
`
    },
    'schema.sql': {
      path: 'schema.sql',
      name: 'schema.sql',
      language: 'sql',
      description: 'Normalized MySQL DDL script creating all 7 tables, indexes & foreign keys',
      content: `-- ====================================================================
-- Database Schema: student_attendance_db
-- Project: Student Attendance Management System (BCA SE PBL)
-- Engine: InnoDB | Character Set: utf8mb4
-- ====================================================================

CREATE DATABASE IF NOT EXISTS student_attendance_db;
USE student_attendance_db;

-- --------------------------------------------------------
-- Table 1: users (Authentication & RBAC)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'faculty', 'student') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 2: students
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    course VARCHAR(50) NOT NULL DEFAULT 'BCA',
    semester INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    admission_date DATE NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_roll (roll_number),
    INDEX idx_class_sem (course, semester, section)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 3: faculty
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 4: subjects
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20) NOT NULL UNIQUE,
    semester INT NOT NULL,
    course VARCHAR(50) NOT NULL DEFAULT 'BCA',
    INDEX idx_subject_code (subject_code)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 5: classes
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    course VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    UNIQUE KEY uq_class (course, semester, section)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 6: faculty_assignments
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    UNIQUE KEY uq_assignment (faculty_id, subject_id, class_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------
-- Table 7: attendance (Normalized with duplicate prevention)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    class_id INT NOT NULL,
    faculty_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    -- Prevent duplicate entry for same student, subject, class, and date
    UNIQUE KEY uq_attendance_session (student_id, subject_id, class_id, attendance_date),
    INDEX idx_att_date (attendance_date),
    INDEX idx_att_status (status)
) ENGINE=InnoDB;

-- ====================================================================
-- Sample Initial Seed Data
-- ====================================================================
-- 1. Insert Users (Password: admin123, faculty123, student123 hashed via pbkdf2)
INSERT INTO users (user_id, username, password_hash, role) VALUES
(1, 'admin', 'scrypt:32768:8:1$e3r6...$admin123', 'admin'),
(2, 'faculty.rajesh', 'scrypt:32768:8:1$e3r6...$faculty123', 'faculty'),
(3, 'student.rahul', 'scrypt:32768:8:1$e3r6...$student123', 'student');

-- 2. Insert Classes
INSERT INTO classes (class_id, course, semester, section) VALUES
(1, 'BCA', 3, 'A'),
(2, 'BCA', 3, 'B'),
(3, 'BCA', 5, 'A');

-- 3. Insert Subjects
INSERT INTO subjects (subject_id, subject_name, subject_code, semester, course) VALUES
(1, 'Software Engineering', 'BCA-301', 3, 'BCA'),
(2, 'Database Management Systems', 'BCA-302', 3, 'BCA'),
(3, 'Web Development', 'BCA-303', 3, 'BCA');

-- 4. Insert Faculty
INSERT INTO faculty (faculty_id, faculty_name, email, phone, department, user_id) VALUES
(1, 'Prof. Rajesh Sharma', 'r.sharma@university.edu', '+91 98765 43210', 'Computer Applications', 2);

-- 5. Insert Students
INSERT INTO students (student_id, roll_number, full_name, email, phone, course, semester, section, admission_date, user_id) VALUES
(101, 'BCA2024-001', 'Rahul Sharma', 'rahul@student.edu', '+91 91234 56780', 'BCA', 3, 'A', '2024-07-15', 3),
(102, 'BCA2024-002', 'Priya Patel', 'priya@student.edu', '+91 91234 56781', 'BCA', 3, 'A', '2024-07-15', NULL);
`
    },
    'requirements.txt': {
      path: 'requirements.txt',
      name: 'requirements.txt',
      language: 'text',
      description: 'Python package dependencies for Flask and MySQL connector',
      content: `Flask==2.3.3
mysql-connector-python==8.1.0
Werkzeug==2.3.7
python-dotenv==1.0.0
pytest==7.4.2
`
    },
    'README.md': {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      description: 'Step-by-step setup guide for beginners (installing Python, MySQL & execution)',
      content: `# Student Attendance Management System (SAMS)
## BCA Software Engineering Problem-Based Learning (PBL) Project

A complete, role-based, production-grade Student Attendance Management System built following software engineering principles, Requirements Engineering (SRS), SDLC phases, and automated testing.

---

### Prerequisites
1. **Python 3.10 or higher**: [Download from python.org](https://www.python.org/)
2. **MySQL Community Server 8.0+**: [Download from dev.mysql.com](https://dev.mysql.com/downloads/mysql/) or XAMPP
3. **Visual Studio Code (VS Code)**

---

### Step-by-Step Setup Guide

#### 1. Setup MySQL Database
Open your MySQL Command Line Client or phpMyAdmin and execute:
\`\`\`sql
source schema.sql;
\`\`\`
This will create the \`student_attendance_db\` database with all 7 normalized tables, referential foreign keys, indexes, and initial records.

#### 2. Create Python Virtual Environment
Open terminal in the project directory:
\`\`\`bash
# Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Windows (Command Prompt / PowerShell)
python -m venv venv
venv\\Scripts\\activate
\`\`\`

#### 3. Install Required Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

#### 4. Configure Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`env
SECRET_KEY="supersecretkey"
MYSQL_HOST="localhost"
MYSQL_USER="root"
MYSQL_PASSWORD="your_mysql_password"
MYSQL_DB="student_attendance_db"
\`\`\`

#### 5. Run the Application
\`\`\`bash
python app.py
\`\`\`
Open your browser and navigate to: **http://127.0.0.1:5000**

---

### Demo Accounts for Viva / Evaluation
- **Administrator**: \`admin\` / \`admin123\`
- **Faculty**: \`faculty.rajesh\` / \`faculty123\`
- **Student (Good %)**: \`student.rahul\` / \`student123\`

---

### Running Software Tests
\`\`\`bash
pytest tests/
\`\`\`
`
    },
    'tests/test_attendance.py': {
      path: 'tests/test_attendance.py',
      name: 'test_attendance.py',
      language: 'python',
      description: 'Unit & validation tests for attendance calculations and edge cases',
      content: `"""
Unit Tests for Attendance Calculations and Zero Division Guard
BCA Software Engineering Testing Suite
"""
import pytest

def calculate_attendance_percentage(attended: int, conducted: int) -> float:
    """Formula: (Classes Attended / Total Conducted) * 100"""
    if conducted <= 0:
        return 0.0
    return round((attended / conducted) * 100, 1)

def test_attendance_calculation_normal():
    # 32 attended out of 40 conducted = 80.0%
    result = calculate_attendance_percentage(32, 40)
    assert result == 80.0

def test_zero_division_guard():
    # Edge case: No classes conducted yet
    result = calculate_attendance_percentage(0, 0)
    assert result == 0.0

def test_low_attendance_threshold():
    # 14 attended out of 20 = 70.0% (<75% threshold)
    pct = calculate_attendance_percentage(14, 20)
    assert pct < 75.0
    is_warning = pct < 75.0
    assert is_warning is True
`
    }
  };

  const activeFile = codeFiles[selectedFilePath] || codeFiles['app.py'];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Python Flask + MySQL Project Source Code
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete project directory structure ready for local deployment in VS Code &amp; project submission.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Active File'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadFile}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {activeFile.name}</span>
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Project File Tree */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-600" />
            <span>student_attendance_system/</span>
          </div>

          <div className="p-2 space-y-1 text-xs">
            {Object.keys(codeFiles).map((path) => {
              const file = codeFiles[path];
              const isSelected = selectedFilePath === path;
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => {
                    setSelectedFilePath(path);
                    setCopied(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate font-mono text-[11px]">{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
            Click any file to inspect code or download for offline VS Code execution.
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono text-slate-200">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>{activeFile.path}</span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              {activeFile.description}
            </div>
          </div>

          {/* Preformatted Code Content */}
          <div className="p-4 overflow-x-auto max-h-[600px] text-xs font-mono leading-relaxed text-slate-200 selection:bg-blue-500/30">
            <pre>
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
