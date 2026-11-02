/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Workflow,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';

type SubSection = 'srs' | 'sdlc' | 'diagrams' | 'testing';

export const SoftwareEngineeringHub: React.FC = () => {
  const { runSoftwareTests, testResults } = useApp();
  const [activeSub, setActiveSub] = useState<SubSection>('diagrams');
  const [selectedDiagram, setSelectedDiagram] = useState<number>(1);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const handleRunTests = () => {
    setIsTestRunning(true);
    setTimeout(() => {
      runSoftwareTests();
      setIsTestRunning(false);
    }, 400);
  };

  const diagrams = [
    { id: 1, title: '1. Use-Case Diagram', desc: 'Actor boundaries & system interactions (Admin, Faculty, Student)' },
    { id: 2, title: '2. System Architecture Diagram', desc: 'Multi-tier modular architectural framework' },
    { id: 3, title: '3. Data Flow Diagram (DFD Level 0)', desc: 'High-level context diagram of information flow' },
    { id: 4, title: '4. Data Flow Diagram (DFD Level 1)', desc: 'Decomposition into Auth, Attendance, and Reporting processes' },
    { id: 5, title: '5. Entity-Relationship (ER) Diagram', desc: 'Normalized 3NF relational schema with cardinalities' },
    { id: 6, title: '6. UML Class Diagram', desc: 'Object-oriented entities, attributes, and method signatures' },
    { id: 7, title: '7. Activity Diagram', desc: 'Workflow logic for class attendance recording and duplicate validation' },
    { id: 8, title: '8. Sequence Diagram', desc: 'Chronological message flow for user authentication & attendance commit' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Software Engineering PBL Documentation &amp; Artifacts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Requirements Engineering, Software Requirement Specification (SRS), SDLC Lifecycle, UML Diagrams, and Verification Testing.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSub('diagrams')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSub === 'diagrams'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Software Design Artifacts (8 Diagrams)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSub('testing')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSub === 'testing'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Software Testing &amp; Verification Suite</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSub('srs')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSub === 'srs'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>SRS Document (12 Sections)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSub('sdlc')}
          className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeSub === 'sdlc'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>SDLC Lifecycle Explorer</span>
        </button>
      </div>

      {/* SUB-SECTION 1: SOFTWARE DESIGN ARTIFACTS (DIAGRAMS) */}
      {activeSub === 'diagrams' && (
        <div className="space-y-6">
          {/* Diagram Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {diagrams.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiagram(d.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedDiagram === d.id
                    ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500 text-blue-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold leading-tight">{d.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{d.desc}</div>
              </button>
            ))}
          </div>

          {/* Rendered Interactive Diagram Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {diagrams.find((d) => d.id === selectedDiagram)?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {diagrams.find((d) => d.id === selectedDiagram)?.desc}
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                UML 2.5 Specification
              </span>
            </div>

            {/* DIAGRAM 1: USE CASE */}
            {selectedDiagram === 1 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 480" className="w-full max-w-4xl mx-auto h-auto">
                  {/* System Boundary */}
                  <rect x="220" y="20" width="410" height="440" rx="12" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
                  <text x="240" y="45" fill="#334155" fontSize="13" fontWeight="bold">Student Attendance Management System Boundary</text>

                  {/* Actor 1: Administrator */}
                  <g transform="translate(60, 90)">
                    <circle cx="30" cy="20" r="14" fill="#f8fafc" stroke="#0284c7" strokeWidth="2" />
                    <line x1="30" y1="34" x2="30" y2="70" stroke="#0284c7" strokeWidth="2" />
                    <line x1="10" y1="46" x2="50" y2="46" stroke="#0284c7" strokeWidth="2" />
                    <line x1="30" y1="70" x2="12" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <line x1="30" y1="70" x2="48" y2="100" stroke="#0284c7" strokeWidth="2" />
                    <text x="30" y="120" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Administrator</text>
                  </g>

                  {/* Actor 2: Faculty */}
                  <g transform="translate(60, 260)">
                    <circle cx="30" cy="20" r="14" fill="#f8fafc" stroke="#4f46e5" strokeWidth="2" />
                    <line x1="30" y1="34" x2="30" y2="70" stroke="#4f46e5" strokeWidth="2" />
                    <line x1="10" y1="46" x2="50" y2="46" stroke="#4f46e5" strokeWidth="2" />
                    <line x1="30" y1="70" x2="12" y2="100" stroke="#4f46e5" strokeWidth="2" />
                    <line x1="30" y1="70" x2="48" y2="100" stroke="#4f46e5" strokeWidth="2" />
                    <text x="30" y="120" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Faculty</text>
                  </g>

                  {/* Actor 3: Student */}
                  <g transform="translate(710, 220)">
                    <circle cx="30" cy="20" r="14" fill="#f8fafc" stroke="#16a34a" strokeWidth="2" />
                    <line x1="30" y1="34" x2="30" y2="70" stroke="#16a34a" strokeWidth="2" />
                    <line x1="10" y1="46" x2="50" y2="46" stroke="#16a34a" strokeWidth="2" />
                    <line x1="30" y1="70" x2="12" y2="100" stroke="#16a34a" strokeWidth="2" />
                    <line x1="30" y1="70" x2="48" y2="100" stroke="#16a34a" strokeWidth="2" />
                    <text x="30" y="120" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Student</text>
                  </g>

                  {/* Use Cases */}
                  {[
                    { text: 'Authenticate / Role Login', y: 80, x: 425 },
                    { text: 'Manage Students & Faculty (CRUD)', y: 140, x: 425 },
                    { text: 'Allocate Subjects & Classes', y: 200, x: 425 },
                    { text: 'Mark & Validate Class Attendance', y: 260, x: 425 },
                    { text: 'Generate Statutory Attendance Reports', y: 320, x: 425 },
                    { text: 'View Attendance % & Receive <75% Alert', y: 380, x: 425 }
                  ].map((uc, i) => (
                    <g key={i}>
                      <ellipse cx={uc.x} cy={uc.y} rx="140" ry="22" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5" />
                      <text x={uc.x} y={uc.y + 4} textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="600">{uc.text}</text>
                    </g>
                  ))}

                  {/* Association Lines */}
                  {/* Admin to Auth, Manage, Allocate, Reports */}
                  <line x1="120" y1="120" x2="285" y2="80" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="120" y1="130" x2="285" y2="140" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="120" y1="140" x2="285" y2="200" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="120" y1="150" x2="285" y2="320" stroke="#94a3b8" strokeWidth="1.2" />

                  {/* Faculty to Auth, Mark, Reports */}
                  <line x1="120" y1="300" x2="285" y2="85" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="120" y1="310" x2="285" y2="260" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="120" y1="320" x2="285" y2="320" stroke="#94a3b8" strokeWidth="1.2" />

                  {/* Student to Auth, View Attendance */}
                  <line x1="710" y1="260" x2="565" y2="85" stroke="#94a3b8" strokeWidth="1.2" />
                  <line x1="710" y1="280" x2="565" y2="380" stroke="#94a3b8" strokeWidth="1.2" />
                </svg>
              </div>
            )}

            {/* DIAGRAM 2: SYSTEM ARCHITECTURE */}
            {selectedDiagram === 2 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 420" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Client Tier */}
                  <rect x="50" y="40" width="220" height="340" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="50" y="40" width="220" height="36" rx="8" fill="#e0f2fe" />
                  <text x="160" y="63" textAnchor="middle" fill="#0369a1" fontSize="12" fontWeight="bold">Presentation Tier (Client UI)</text>
                  <text x="70" y="110" fill="#334155" fontSize="11">• HTML5 / CSS3 / JavaScript</text>
                  <text x="70" y="140" fill="#334155" fontSize="11">• Chart.js Interactive Dashboards</text>
                  <text x="70" y="170" fill="#334155" fontSize="11">• Role-Based Navigation (Admin/Fac/Stu)</text>
                  <text x="70" y="200" fill="#334155" fontSize="11">• Client-side Form Validation</text>
                  <text x="70" y="230" fill="#334155" fontSize="11">• Responsive Desktop/Tablet/Mobile</text>
                  <text x="70" y="260" fill="#334155" fontSize="11">• Print Layout Stylesheets</text>

                  {/* Application / Server Tier */}
                  <rect x="330" y="40" width="220" height="340" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="330" y="40" width="220" height="36" rx="8" fill="#e0e7ff" />
                  <text x="440" y="63" textAnchor="middle" fill="#4338ca" fontSize="12" fontWeight="bold">Logic Tier (Python Flask)</text>
                  <text x="350" y="110" fill="#334155" fontSize="11">• RESTful Routing Controllers</text>
                  <text x="350" y="140" fill="#334155" fontSize="11">• Flask Sessions &amp; RBAC Decorators</text>
                  <text x="350" y="170" fill="#334155" fontSize="11">• Werkzeug Password Hashing</text>
                  <text x="350" y="200" fill="#334155" fontSize="11">• Attendance Formula Engine</text>
                  <text x="350" y="230" fill="#334155" fontSize="11">• Duplicate Protection Validator</text>
                  <text x="350" y="260" fill="#334155" fontSize="11">• MySQL Connector Integration</text>

                  {/* Database Tier */}
                  <rect x="610" y="40" width="200" height="340" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                  <rect x="610" y="40" width="200" height="36" rx="8" fill="#ecfdf5" />
                  <text x="710" y="63" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="bold">Data Tier (MySQL 8.0)</text>
                  <text x="630" y="110" fill="#334155" fontSize="11">• users (RBAC Credentials)</text>
                  <text x="630" y="140" fill="#334155" fontSize="11">• students (Admission details)</text>
                  <text x="630" y="170" fill="#334155" fontSize="11">• faculty (Departments)</text>
                  <text x="630" y="200" fill="#334155" fontSize="11">• classes &amp; subjects</text>
                  <text x="630" y="230" fill="#334155" fontSize="11">• faculty_assignments</text>
                  <text x="630" y="260" fill="#334155" fontSize="11">• attendance (Normalized 3NF)</text>
                  <text x="630" y="290" fill="#334155" fontSize="11">• Foreign Keys &amp; Indexes</text>

                  {/* Connection Arrows */}
                  <line x1="270" y1="180" x2="330" y2="180" stroke="#0284c7" strokeWidth="2" markerEnd="url(#arrow)" />
                  <line x1="330" y1="200" x2="270" y2="200" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="300" y="172" textAnchor="middle" fill="#64748b" fontSize="9">JSON / HTTP</text>

                  <line x1="550" y1="180" x2="610" y2="180" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="610" y1="200" x2="550" y2="200" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
                  <text x="580" y="172" textAnchor="middle" fill="#64748b" fontSize="9">SQL / TCP</text>
                </svg>
              </div>
            )}

            {/* DIAGRAM 3: DFD LEVEL 0 */}
            {selectedDiagram === 3 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 360" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Central Process */}
                  <circle cx="425" cy="180" r="90" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <text x="425" y="165" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">0.0</text>
                  <text x="425" y="185" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Student Attendance</text>
                  <text x="425" y="202" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Management System</text>

                  {/* External Entities */}
                  {/* Administrator */}
                  <rect x="50" y="60" width="140" height="60" fill="#ffffff" stroke="#475569" strokeWidth="2" />
                  <text x="120" y="95" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Administrator</text>

                  {/* Faculty */}
                  <rect x="50" y="240" width="140" height="60" fill="#ffffff" stroke="#475569" strokeWidth="2" />
                  <text x="120" y="275" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Faculty</text>

                  {/* Student */}
                  <rect x="660" y="150" width="140" height="60" fill="#ffffff" stroke="#475569" strokeWidth="2" />
                  <text x="730" y="185" textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">Student</text>

                  {/* Flows */}
                  <line x1="190" y1="90" x2="350" y2="140" stroke="#64748b" strokeWidth="1.5" />
                  <text x="240" y="105" fill="#475569" fontSize="10">Student/Faculty Records</text>

                  <line x1="190" y1="270" x2="350" y2="220" stroke="#64748b" strokeWidth="1.5" />
                  <text x="240" y="260" fill="#475569" fontSize="10">Daily Attendance Marking</text>

                  <line x1="515" y1="180" x2="660" y2="180" stroke="#64748b" strokeWidth="1.5" />
                  <text x="585" y="170" textAnchor="middle" fill="#475569" fontSize="10">Attendance % &amp; Alerts</text>
                </svg>
              </div>
            )}

            {/* DIAGRAM 4: DFD LEVEL 1 */}
            {selectedDiagram === 4 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 440" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Process 1.0 Auth */}
                  <circle cx="150" cy="100" r="50" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="150" y="95" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">1.0 Verify</text>
                  <text x="150" y="112" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Credentials</text>

                  {/* Process 2.0 Student & Faculty Mgmt */}
                  <circle cx="425" cy="100" r="50" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="425" y="95" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">2.0 Manage</text>
                  <text x="425" y="112" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Records</text>

                  {/* Process 3.0 Mark Attendance */}
                  <circle cx="280" cy="280" r="50" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="280" y="275" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">3.0 Record</text>
                  <text x="280" y="292" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Attendance</text>

                  {/* Process 4.0 Calculation & Reporting */}
                  <circle cx="580" cy="280" r="50" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
                  <text x="580" y="275" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">4.0 Calculate</text>
                  <text x="580" y="292" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">&amp; Reports</text>

                  {/* Data Stores (Parallel lines) */}
                  <g transform="translate(680, 70)">
                    <line x1="0" y1="0" x2="130" y2="0" stroke="#0f172a" strokeWidth="2" />
                    <line x1="0" y1="36" x2="130" y2="36" stroke="#0f172a" strokeWidth="2" />
                    <text x="65" y="23" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">D1: users</text>
                  </g>

                  <g transform="translate(680, 150)">
                    <line x1="0" y1="0" x2="130" y2="0" stroke="#0f172a" strokeWidth="2" />
                    <line x1="0" y1="36" x2="130" y2="36" stroke="#0f172a" strokeWidth="2" />
                    <text x="65" y="23" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">D2: students</text>
                  </g>

                  <g transform="translate(400, 380)">
                    <line x1="0" y1="0" x2="150" y2="0" stroke="#0f172a" strokeWidth="2" />
                    <line x1="0" y1="36" x2="150" y2="36" stroke="#0f172a" strokeWidth="2" />
                    <text x="75" y="23" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">D3: attendance</text>
                  </g>

                  {/* Connecting Flows */}
                  <line x1="200" y1="100" x2="375" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="475" y1="100" x2="680" y2="168" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="330" y1="280" x2="530" y2="280" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="280" y1="330" x2="400" y2="390" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="550" y1="380" x2="580" y2="330" stroke="#94a3b8" strokeWidth="1.5" />
                </svg>
              </div>
            )}

            {/* DIAGRAM 5: ER DIAGRAM (CROW'S FOOT NOTATION) */}
            {selectedDiagram === 5 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 460" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Table: USERS */}
                  <rect x="40" y="30" width="160" height="130" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="40" y="30" width="160" height="24" fill="#f1f5f9" />
                  <text x="120" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">USERS</text>
                  <text x="50" y="72" fill="#0369a1" fontSize="10" fontWeight="bold">PK user_id</text>
                  <text x="50" y="90" fill="#334155" fontSize="10">username (UQ)</text>
                  <text x="50" y="108" fill="#334155" fontSize="10">password_hash</text>
                  <text x="50" y="126" fill="#334155" fontSize="10">role (ENUM)</text>
                  <text x="50" y="144" fill="#334155" fontSize="10">is_active, created_at</text>

                  {/* Table: STUDENTS */}
                  <rect x="250" y="30" width="170" height="160" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="250" y="30" width="170" height="24" fill="#f1f5f9" />
                  <text x="335" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">STUDENTS</text>
                  <text x="260" y="72" fill="#0369a1" fontSize="10" fontWeight="bold">PK student_id</text>
                  <text x="260" y="90" fill="#334155" fontSize="10">roll_number (UQ)</text>
                  <text x="260" y="108" fill="#334155" fontSize="10">full_name, email</text>
                  <text x="260" y="126" fill="#334155" fontSize="10">phone, course</text>
                  <text x="260" y="144" fill="#334155" fontSize="10">semester, section</text>
                  <text x="260" y="162" fill="#4338ca" fontSize="10">FK user_id</text>
                  <text x="260" y="180" fill="#334155" fontSize="10">admission_date</text>

                  {/* Table: FACULTY */}
                  <rect x="40" y="240" width="160" height="130" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="40" y="240" width="160" height="24" fill="#f1f5f9" />
                  <text x="120" y="257" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">FACULTY</text>
                  <text x="50" y="282" fill="#0369a1" fontSize="10" fontWeight="bold">PK faculty_id</text>
                  <text x="50" y="300" fill="#334155" fontSize="10">faculty_name</text>
                  <text x="50" y="318" fill="#334155" fontSize="10">email, phone</text>
                  <text x="50" y="336" fill="#334155" fontSize="10">department</text>
                  <text x="50" y="354" fill="#4338ca" fontSize="10">FK user_id</text>

                  {/* Table: ATTENDANCE */}
                  <rect x="470" y="30" width="180" height="160" rx="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  <rect x="470" y="30" width="180" height="24" fill="#dbeafe" />
                  <text x="560" y="47" textAnchor="middle" fill="#1e40af" fontSize="11" fontWeight="bold">ATTENDANCE</text>
                  <text x="480" y="72" fill="#0369a1" fontSize="10" fontWeight="bold">PK attendance_id</text>
                  <text x="480" y="90" fill="#4338ca" fontSize="10">FK student_id</text>
                  <text x="480" y="108" fill="#4338ca" fontSize="10">FK subject_id</text>
                  <text x="480" y="126" fill="#4338ca" fontSize="10">FK class_id</text>
                  <text x="480" y="144" fill="#4338ca" fontSize="10">FK faculty_id</text>
                  <text x="480" y="162" fill="#334155" fontSize="10">attendance_date (DATE)</text>
                  <text x="480" y="180" fill="#334155" fontSize="10">status (ENUM)</text>

                  {/* Table: SUBJECTS */}
                  <rect x="680" y="30" width="140" height="110" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="680" y="30" width="140" height="24" fill="#f1f5f9" />
                  <text x="750" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">SUBJECTS</text>
                  <text x="690" y="72" fill="#0369a1" fontSize="10" fontWeight="bold">PK subject_id</text>
                  <text x="690" y="90" fill="#334155" fontSize="10">subject_code (UQ)</text>
                  <text x="690" y="108" fill="#334155" fontSize="10">subject_name</text>
                  <text x="690" y="126" fill="#334155" fontSize="10">semester, course</text>

                  {/* Table: CLASSES */}
                  <rect x="680" y="240" width="140" height="110" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="680" y="240" width="140" height="24" fill="#f1f5f9" />
                  <text x="750" y="257" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">CLASSES</text>
                  <text x="690" y="282" fill="#0369a1" fontSize="10" fontWeight="bold">PK class_id</text>
                  <text x="690" y="300" fill="#334155" fontSize="10">course</text>
                  <text x="690" y="318" fill="#334155" fontSize="10">semester</text>
                  <text x="690" y="336" fill="#334155" fontSize="10">section</text>

                  {/* Table: FACULTY_ASSIGNMENTS */}
                  <rect x="330" y="260" width="180" height="110" rx="4" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
                  <rect x="330" y="260" width="180" height="24" fill="#f1f5f9" />
                  <text x="420" y="277" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">FACULTY_ASSIGNMENTS</text>
                  <text x="340" y="302" fill="#0369a1" fontSize="10" fontWeight="bold">PK assignment_id</text>
                  <text x="340" y="320" fill="#4338ca" fontSize="10">FK faculty_id</text>
                  <text x="340" y="338" fill="#4338ca" fontSize="10">FK subject_id</text>
                  <text x="340" y="356" fill="#4338ca" fontSize="10">FK class_id</text>

                  {/* Relationship lines */}
                  {/* Students to Attendance (1 to Many) */}
                  <line x1="420" y1="110" x2="470" y2="110" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="435" y="103" fill="#0284c7" fontSize="9">1:N</text>

                  {/* Attendance to Subjects */}
                  <line x1="650" y1="85" x2="680" y2="85" stroke="#0284c7" strokeWidth="1.5" />

                  {/* Attendance to Faculty */}
                  <line x1="200" y1="280" x2="330" y2="280" stroke="#0284c7" strokeWidth="1.5" />
                </svg>
              </div>
            )}

            {/* DIAGRAM 6: UML CLASS DIAGRAM */}
            {selectedDiagram === 6 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 440" className="w-full max-w-4xl mx-auto h-auto">
                  {/* User Class */}
                  <rect x="40" y="30" width="180" height="140" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
                  <rect x="40" y="30" width="180" height="24" fill="#e2e8f0" />
                  <text x="130" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">User</text>
                  <text x="50" y="70" fill="#334155" fontSize="10">- userId: int</text>
                  <text x="50" y="86" fill="#334155" fontSize="10">- username: string</text>
                  <text x="50" y="102" fill="#334155" fontSize="10">- passwordHash: string</text>
                  <text x="50" y="118" fill="#334155" fontSize="10">- role: UserRole</text>
                  <line x1="40" y1="126" x2="220" y2="126" stroke="#e2e8f0" />
                  <text x="50" y="142" fill="#0369a1" fontSize="10">+ verifyPassword(): bool</text>
                  <text x="50" y="158" fill="#0369a1" fontSize="10">+ hasRole(r): bool</text>

                  {/* Student Class */}
                  <rect x="300" y="30" width="220" height="170" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
                  <rect x="300" y="30" width="220" height="24" fill="#e2e8f0" />
                  <text x="410" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Student</text>
                  <text x="310" y="70" fill="#334155" fontSize="10">- studentId: int</text>
                  <text x="310" y="86" fill="#334155" fontSize="10">- rollNumber: string</text>
                  <text x="310" y="102" fill="#334155" fontSize="10">- fullName: string</text>
                  <text x="310" y="118" fill="#334155" fontSize="10">- course, semester, section</text>
                  <line x1="300" y1="126" x2="520" y2="126" stroke="#e2e8f0" />
                  <text x="310" y="142" fill="#0369a1" fontSize="10">+ getAttendanceSummary(): Summary</text>
                  <text x="310" y="158" fill="#0369a1" fontSize="10">+ isBelowThreshold(): bool</text>
                  <text x="310" y="174" fill="#0369a1" fontSize="10">+ getSubjectBreakdown(): List</text>

                  {/* AttendanceSession Class */}
                  <rect x="580" y="30" width="230" height="180" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
                  <rect x="580" y="30" width="230" height="24" fill="#e2e8f0" />
                  <text x="695" y="47" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">AttendanceSession</text>
                  <text x="590" y="70" fill="#334155" fontSize="10">- attendanceId: int</text>
                  <text x="590" y="86" fill="#334155" fontSize="10">- date: Date</text>
                  <text x="590" y="102" fill="#334155" fontSize="10">- subjectId, classId, facultyId</text>
                  <text x="590" y="118" fill="#334155" fontSize="10">- entries: List&lt;AttendanceRecord&gt;</text>
                  <line x1="580" y1="126" x2="810" y2="126" stroke="#e2e8f0" />
                  <text x="590" y="142" fill="#0369a1" fontSize="10">+ validateUniqueness(): bool</text>
                  <text x="590" y="158" fill="#0369a1" fontSize="10">+ markBatch(records): void</text>
                  <text x="590" y="174" fill="#0369a1" fontSize="10">+ calculateStats(): {`{present, absent}`}</text>

                  {/* Faculty Class */}
                  <rect x="40" y="240" width="200" height="150" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="1.5" />
                  <rect x="40" y="240" width="200" height="24" fill="#e2e8f0" />
                  <text x="140" y="257" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Faculty</text>
                  <text x="50" y="280" fill="#334155" fontSize="10">- facultyId: int</text>
                  <text x="50" y="296" fill="#334155" fontSize="10">- facultyName: string</text>
                  <text x="50" y="312" fill="#334155" fontSize="10">- department: string</text>
                  <line x1="40" y1="320" x2="240" y2="320" stroke="#e2e8f0" />
                  <text x="50" y="336" fill="#0369a1" fontSize="10">+ markClassAttendance(): void</text>
                  <text x="50" y="352" fill="#0369a1" fontSize="10">+ generateClassReport(): Report</text>
                </svg>
              </div>
            )}

            {/* DIAGRAM 7: ACTIVITY DIAGRAM */}
            {selectedDiagram === 7 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 420" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Start Node */}
                  <circle cx="425" cy="30" r="12" fill="#0f172a" />

                  {/* Step 1: Select Session */}
                  <rect x="330" y="70" width="190" height="38" rx="19" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="425" y="94" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">Select Class, Subject &amp; Date</text>
                  <line x1="425" y1="42" x2="425" y2="70" stroke="#64748b" strokeWidth="1.5" />

                  {/* Step 2: Query Existing Session */}
                  <rect x="330" y="140" width="190" height="38" rx="19" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="425" y="164" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">Check Database for Duplicate</text>
                  <line x1="425" y1="108" x2="425" y2="140" stroke="#64748b" strokeWidth="1.5" />

                  {/* Decision Diamond */}
                  <polygon points="425,205 485,235 425,265 365,235" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="425" y="239" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">Already Marked?</text>
                  <line x1="425" y1="178" x2="425" y2="205" stroke="#64748b" strokeWidth="1.5" />

                  {/* Yes Branch: Show Overwrite Prompt */}
                  <line x1="365" y1="235" x2="220" y2="235" stroke="#64748b" strokeWidth="1.5" />
                  <rect x="110" y="215" width="110" height="40" rx="8" fill="#fffbeb" stroke="#f59e0b" />
                  <text x="165" y="238" textAnchor="middle" fill="#92400e" fontSize="10">Prompt Overwrite Mode</text>
                  <text x="290" y="228" fill="#64748b" fontSize="10">[Yes]</text>

                  {/* No Branch: Render Roster */}
                  <line x1="425" y1="265" x2="425" y2="295" stroke="#64748b" strokeWidth="1.5" />
                  <text x="435" y="285" fill="#64748b" fontSize="10">[No]</text>
                  <rect x="330" y="295" width="190" height="38" rx="19" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="425" y="319" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="600">Mark Present / Absent Radios</text>

                  {/* Save to DB */}
                  <line x1="425" y1="333" x2="425" y2="360" stroke="#64748b" strokeWidth="1.5" />
                  <rect x="330" y="360" width="190" height="38" rx="19" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                  <text x="425" y="384" textAnchor="middle" fill="#065f46" fontSize="11" fontWeight="bold">Commit Transaction to MySQL</text>
                </svg>
              </div>
            )}

            {/* DIAGRAM 8: SEQUENCE DIAGRAM */}
            {selectedDiagram === 8 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                <svg viewBox="0 0 850 420" className="w-full max-w-4xl mx-auto h-auto">
                  {/* Lifeline Headers */}
                  <rect x="50" y="20" width="110" height="30" rx="4" fill="#f8fafc" stroke="#64748b" />
                  <text x="105" y="39" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Faculty User</text>
                  <line x1="105" y1="50" x2="105" y2="390" stroke="#cbd5e1" strokeDasharray="4 4" />

                  <rect x="250" y="20" width="120" height="30" rx="4" fill="#f8fafc" stroke="#64748b" />
                  <text x="310" y="39" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Attendance UI</text>
                  <line x1="310" y1="50" x2="310" y2="390" stroke="#cbd5e1" strokeDasharray="4 4" />

                  <rect x="470" y="20" width="120" height="30" rx="4" fill="#f8fafc" stroke="#64748b" />
                  <text x="530" y="39" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Flask Controller</text>
                  <line x1="530" y1="50" x2="530" y2="390" stroke="#cbd5e1" strokeDasharray="4 4" />

                  <rect x="680" y="20" width="120" height="30" rx="4" fill="#f8fafc" stroke="#64748b" />
                  <text x="740" y="39" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">MySQL Database</text>
                  <line x1="740" y1="50" x2="740" y2="390" stroke="#cbd5e1" strokeDasharray="4 4" />

                  {/* Messages */}
                  {/* 1 */}
                  <line x1="105" y1="80" x2="310" y2="80" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="200" y="74" textAnchor="middle" fill="#0284c7" fontSize="10">1. Select Class &amp; Subject</text>

                  {/* 2 */}
                  <line x1="310" y1="120" x2="530" y2="120" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="420" y="114" textAnchor="middle" fill="#0284c7" fontSize="10">2. GET /api/students?class_id=X</text>

                  {/* 3 */}
                  <line x1="530" y1="150" x2="740" y2="150" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="635" y="144" textAnchor="middle" fill="#0284c7" fontSize="10">3. SELECT * FROM students</text>

                  {/* 4 */}
                  <line x1="740" y1="180" x2="530" y2="180" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="635" y="174" textAnchor="middle" fill="#64748b" fontSize="10">4. Student Records Result</text>

                  {/* 5 */}
                  <line x1="105" y1="240" x2="310" y2="240" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="200" y="234" textAnchor="middle" fill="#0284c7" fontSize="10">5. Click "Save Attendance"</text>

                  {/* 6 */}
                  <line x1="310" y1="280" x2="530" y2="280" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="420" y="274" textAnchor="middle" fill="#0284c7" fontSize="10">6. POST /api/attendance/batch</text>

                  {/* 7 */}
                  <line x1="530" y1="320" x2="740" y2="320" stroke="#16a34a" strokeWidth="2" />
                  <text x="635" y="314" textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="bold">7. INSERT INTO attendance VALUES ...</text>

                  {/* 8 */}
                  <line x1="740" y1="350" x2="310" y2="350" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="525" y="344" textAnchor="middle" fill="#16a34a" fontSize="10">8. Transaction Committed (200 OK)</text>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: SOFTWARE TESTING SUITE (Section 14) */}
      {activeSub === 'testing' && (
        <div className="space-y-6">
          {/* Test Runner Control Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Automated Verification &amp; Software Testing Suite
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Execute unit tests, validation assertions, integration checks, and security guards.
              </p>
            </div>

            <button
              type="button"
              disabled={isTestRunning}
              onClick={handleRunTests}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isTestRunning ? 'Executing Test Assertions...' : 'Run Test Suite'}</span>
            </button>
          </div>

          {/* Test Case Table (Section 14) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Formal Test Execution Matrix
              </span>
              <span className="text-xs font-mono text-slate-500">
                {testResults.length > 0 ? `${testResults.filter((t) => t.status === 'Pass').length} of ${testResults.length} Passed` : 'Ready to execute'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 w-28">Test ID</th>
                    <th className="py-2.5 px-4 w-24">Type</th>
                    <th className="py-2.5 px-4">Test Scenario</th>
                    <th className="py-2.5 px-4">Input Parameters</th>
                    <th className="py-2.5 px-4">Expected Result</th>
                    <th className="py-2.5 px-4">Actual Result</th>
                    <th className="py-2.5 px-4 text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(testResults.length > 0
                    ? testResults
                    : [
                        {
                          id: 'TC-UT-01',
                          type: 'Unit',
                          scenario: 'Attendance Percentage Calculation (Normal Case: 32/40)',
                          input: 'attended=32, total=40',
                          expectedResult: '80% (Status: Good)',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-UT-02',
                          type: 'Unit',
                          scenario: 'Zero Division Guard (No classes conducted)',
                          input: 'attended=0, total=0',
                          expectedResult: '0% (No crash/NaN)',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-UT-03',
                          type: 'Unit',
                          scenario: 'Low Attendance Alert Threshold (<75%)',
                          input: 'attended=14, total=20 (70%)',
                          expectedResult: 'Status: Low Attendance, is_warning: true',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-VAL-01',
                          type: 'Validation',
                          scenario: 'Student Roll Number Uniqueness Validation',
                          input: "roll_number='BCA2024-001' (Existing)",
                          expectedResult: 'Reject creation with duplicate error message',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-VAL-02',
                          type: 'Validation',
                          scenario: 'Email Address Format Verification',
                          input: "email='invalid-email-at-domain'",
                          expectedResult: 'Reject creation with format error',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-VAL-03',
                          type: 'Validation',
                          scenario: 'Duplicate Attendance Entry Prevention',
                          input: 'Same student_id, subject_id, class_id, date without overwrite flag',
                          expectedResult: 'Reject duplicate attendance insertion',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-INT-01',
                          type: 'Integration',
                          scenario: 'User Login & Role Mismatch Verification',
                          input: "username='admin', role='student'",
                          expectedResult: 'Reject login due to role mismatch',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-INT-02',
                          type: 'Integration',
                          scenario: 'Faculty-to-Subject Assignment Referential Integrity',
                          input: 'Faculty ID 1 assigned to Subject 1 and Class 1',
                          expectedResult: 'Assignment registered in relational state',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-SYS-01',
                          type: 'System',
                          scenario: 'End-to-End Attendance Marking & Summary Aggregation',
                          input: 'Batch attendance mark for BCA 3A -> check student aggregate',
                          expectedResult: 'Summary percentage recalculates automatically',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        },
                        {
                          id: 'TC-SEC-01',
                          type: 'Validation',
                          scenario: 'Student Access Control Enforcement',
                          input: 'Student role attempting to mark or alter attendance records',
                          expectedResult: 'Action blocked by role-based access control (RBAC)',
                          actualResult: 'Pending execution',
                          status: 'Pending'
                        }
                      ]
                  ).map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{t.id}</td>
                      <td className="py-2.5 px-4 text-slate-500 font-medium">{t.type}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{t.scenario}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">{t.input}</td>
                      <td className="py-2.5 px-4 text-slate-700">{t.expectedResult}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">{t.actualResult}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            t.status === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : t.status === 'Fail'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: SRS DOCUMENT (12 SECTIONS) */}
      {activeSub === 'srs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs text-slate-700 leading-relaxed max-w-4xl">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              IEEE Std 830-1998 Compatible
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Software Requirement Specification (SRS)
            </h2>
            <p className="text-xs text-slate-500">
              Project: Student Attendance Management System (BCA Software Engineering PBL)
            </p>
          </div>

          <div className="space-y-4">
            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">1. Introduction</h3>
              <p>
                The Student Attendance Management System (SAMS) is an automated web-based enterprise solution developed to replace manual paper register roll-calls in collegiate institutions. It provides high-integrity logging, real-time calculation of student attendance percentages, and immediate warning flags for students falling below the mandatory statutory attendance threshold.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">2. Purpose</h3>
              <p>
                The primary purpose is to streamline attendance logging for faculty, provide transparent real-time academic standing to students, and generate verifiable compliance audits for department heads and administrators.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">3. Scope</h3>
              <p>
                The scope encompasses role-based user authentication, student admissions management, faculty curriculum allocations, interactive class attendance rosters, statistical reporting via Chart.js, and automated low-attendance warnings.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">4. Existing System vs. 5. Proposed System</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-3 bg-rose-50/50 rounded-lg border border-rose-200">
                  <span className="font-bold text-rose-800 block mb-1">Existing Manual System</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Paper registers vulnerable to physical loss &amp; tampering.</li>
                    <li>Time-consuming end-of-semester manual percentage tallying.</li>
                    <li>Prone to human transcription errors.</li>
                    <li>Delayed notification of low attendance to students.</li>
                  </ul>
                </div>
                <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">Proposed SAMS Solution</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Instant digital recording with duplicate rejection.</li>
                    <li>Automatic real-time percentage computation: (Attended / Conducted) * 100.</li>
                    <li>Real-time &lt;75% warning alerts on student portal.</li>
                    <li>Parameterized SQL queries preventing SQL injection.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">6. Functional Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>FR-01:</strong> Role-based authentication (Admin, Faculty, Student) with hashed passwords.</li>
                <li><strong>FR-02:</strong> Student enrollment CRUD with unique roll number validation.</li>
                <li><strong>FR-03:</strong> Faculty directory CRUD with department allocations.</li>
                <li><strong>FR-04:</strong> Batch attendance recording with duplicate session prevention.</li>
                <li><strong>FR-05:</strong> Real-time attendance formula calculation with division-by-zero protection.</li>
                <li><strong>FR-06:</strong> Low attendance alerts triggered when attendance falls below 75%.</li>
                <li><strong>FR-07:</strong> Exportable reports (Daily, Monthly, Class-wise, Student-wise, CSV/Print).</li>
                <li><strong>FR-08:</strong> Read-only student attendance history access.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">7. Non-Functional Requirements</h3>
              <p>
                <strong>Security:</strong> Session tokens, PBKDF2/bcrypt hashing, RBAC route guarding.<br />
                <strong>Performance:</strong> Sub-200ms query latency, responsive table indexing.<br />
                <strong>Reliability:</strong> 99.9% uptime, referential integrity with foreign key cascading.<br />
                <strong>Usability:</strong> Zero-clutter dashboard adhering to WCAG AA accessibility.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">8. Hardware &amp; 9. Software Requirements</h3>
              <p>
                <strong>Server:</strong> Quad-Core 2.4 GHz, 8 GB RAM, 50 GB SSD.<br />
                <strong>Client:</strong> Any modern browser (Chrome 110+, Safari 16+, Edge, Firefox).<br />
                <strong>Environment:</strong> Python 3.10+, Flask 2.3+, MySQL 8.0, HTML5/CSS3/JavaScript.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">10. User Characteristics</h3>
              <p>
                <strong>Admin:</strong> Full system access, account provisioning, institutional audit oversight.<br />
                <strong>Faculty:</strong> Class session marking, student roster views, subject analytics.<br />
                <strong>Student:</strong> Personal attendance review, subject breakdowns, compliance notifications.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold text-slate-900 mb-1">11. Constraints &amp; 12. Assumptions</h3>
              <p>
                Assumes reliable intranet/internet connectivity. System enforces one attendance log per student per subject per class per calendar date.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: SDLC LIFECYCLE */}
      {activeSub === 'sdlc' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs text-slate-700 leading-relaxed max-w-4xl">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Iterative Waterfall Methodology
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Software Development Life Cycle (SDLC) Phases
            </h2>
            <p className="text-xs text-slate-500">
              Systematic engineering progression applied to the Attendance Management System.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                phase: 'Phase 1: Planning and Feasibility Study',
                content:
                  'Analyzed operational challenges of paper attendance registers in BCA classrooms. Determined economic feasibility (open-source Python/MySQL stack), technical feasibility (browser-based zero-install architecture), and operational viability across college departments.'
              },
              {
                phase: 'Phase 2: Requirement Analysis & Specification',
                content:
                  'Gathered functional needs from academic stakeholders (HODs, lecturers, students). Formulated IEEE 830-compliant SRS defining functional criteria, mathematical attendance formulas, and security boundaries.'
              },
              {
                phase: 'Phase 3: System Design & Architectural Modeling',
                content:
                  'Constructed UML 2.5 models including Use-Case, System Architecture, DFD Level 0/1, Crow-Foot ER Diagrams, Class Diagrams, and Sequence Diagrams. Designed a 3NF normalized relational schema preventing duplicate session insertions.'
              },
              {
                phase: 'Phase 4: Implementation & Coding',
                content:
                  'Developed the backend using Python Flask with modular blueprints and MySQL Connector with parameterized queries. Crafted responsive frontend UI using Tailwind CSS and Chart.js dashboards.'
              },
              {
                phase: 'Phase 5: Software Testing & Verification',
                content:
                  'Implemented comprehensive Unit Testing (testing division by zero, percentage formula bounds), Integration Testing (verifying Flask-MySQL data binding), Validation Testing (roll number uniqueness, email regex), and System Testing.'
              },
              {
                phase: 'Phase 6: Deployment',
                content:
                  'Packaged system with requirements.txt, schema.sql DDL scripts, and environment variable configurations for seamless deployment on Linux/Cloud environments.'
              },
              {
                phase: 'Phase 7: Maintenance & Quality Assurance',
                content:
                  'Continuous database indexing, automated session log archiving, and responsive UI updates ensuring compatibility with modern mobile and desktop client viewports.'
              }
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 mb-1">{p.phase}</h3>
                <p className="text-slate-600">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
