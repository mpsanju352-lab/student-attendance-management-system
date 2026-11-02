/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Printer,
  Calendar,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

type ReportType =
  | 'daily'
  | 'student_wise'
  | 'class_wise'
  | 'subject_wise'
  | 'monthly'
  | 'low_attendance';

export const ReportsModule: React.FC = () => {
  const {
    attendance,
    students,
    classes,
    subjects,
    faculty,
    calculateAttendancePercentage,
    getStudentSummary
  } = useApp();

  const [reportType, setReportType] = useState<ReportType>('class_wise');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');

  // Filtered raw records by date range, class, and subject
  const baseRecords = useMemo(() => {
    return attendance.filter((a) => {
      if (startDate && a.attendance_date < startDate) return false;
      if (endDate && a.attendance_date > endDate) return false;
      if (selectedClassId !== 'all' && a.class_id !== Number(selectedClassId)) return false;
      if (selectedSubjectId !== 'all' && a.subject_id !== Number(selectedSubjectId)) return false;
      return true;
    });
  }, [attendance, startDate, endDate, selectedClassId, selectedSubjectId]);

  // Overall metrics for report
  const totalConducted = baseRecords.length;
  const totalPresent = baseRecords.filter((r) => r.status === 'Present').length;
  const totalAbsent = totalConducted - totalPresent;
  const overallPercentage = totalConducted > 0 ? Math.round((totalPresent / totalConducted) * 100) : 0;

  // Class-wise Report data
  const classWiseData = useMemo(() => {
    return classes.map((c) => {
      const records = baseRecords.filter((r) => r.class_id === c.class_id);
      const conducted = records.length;
      const present = records.filter((r) => r.status === 'Present').length;
      const absent = conducted - present;
      const pct = calculateAttendancePercentage(present, conducted);
      return {
        class_id: c.class_id,
        name: `${c.course} Sem ${c.semester}-${c.section}`,
        conducted,
        present,
        absent,
        percentage: pct
      };
    });
  }, [classes, baseRecords, calculateAttendancePercentage]);

  // Subject-wise Report data
  const subjectWiseData = useMemo(() => {
    return subjects.map((sub) => {
      const records = baseRecords.filter((r) => r.subject_id === sub.subject_id);
      const conducted = records.length;
      const present = records.filter((r) => r.status === 'Present').length;
      const absent = conducted - present;
      const pct = calculateAttendancePercentage(present, conducted);
      return {
        subject_id: sub.subject_id,
        code: sub.subject_code,
        name: sub.subject_name,
        conducted,
        present,
        absent,
        percentage: pct
      };
    });
  }, [subjects, baseRecords, calculateAttendancePercentage]);

  // Student-wise Report data
  const studentWiseData = useMemo(() => {
    return students
      .filter((s) => {
        if (selectedClassId !== 'all') {
          const c = classes.find((cl) => cl.class_id === Number(selectedClassId));
          if (c && (s.course !== c.course || s.semester !== c.semester || s.section !== c.section)) {
            return false;
          }
        }
        return true;
      })
      .map((st) => {
        const records = baseRecords.filter((r) => r.student_id === st.student_id);
        const conducted = records.length;
        const present = records.filter((r) => r.status === 'Present').length;
        const absent = conducted - present;
        const pct = calculateAttendancePercentage(present, conducted);
        return {
          student_id: st.student_id,
          roll_number: st.roll_number,
          name: st.full_name,
          class_label: `${st.course} Sem ${st.semester}-${st.section}`,
          conducted,
          present,
          absent,
          percentage: pct,
          isLow: conducted > 0 && pct < 75
        };
      });
  }, [students, classes, baseRecords, selectedClassId, calculateAttendancePercentage]);

  // Low Attendance Watchlist (<75%)
  const lowAttendanceData = useMemo(() => {
    return studentWiseData.filter((s) => s.isLow).sort((a, b) => a.percentage - b.percentage);
  }, [studentWiseData]);

  // Daily Report data
  const dailyData = useMemo(() => {
    const dates = Array.from(new Set(baseRecords.map((r) => r.attendance_date))).sort();
    return dates.map((date) => {
      const records = baseRecords.filter((r) => r.attendance_date === date);
      const conducted = records.length;
      const present = records.filter((r) => r.status === 'Present').length;
      const absent = conducted - present;
      const pct = calculateAttendancePercentage(present, conducted);
      return {
        date,
        conducted,
        present,
        absent,
        percentage: pct
      };
    });
  }, [baseRecords, calculateAttendancePercentage]);

  // Chart: Present vs Absent
  const pieChartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [totalPresent, totalAbsent],
        backgroundColor: ['#10B981', '#F43F5E'],
        borderColor: '#FFFFFF',
        borderWidth: 2
      }
    ]
  };

  // Chart: Class-wise
  const barChartData = {
    labels: classWiseData.map((c) => c.name),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: classWiseData.map((c) => c.percentage),
        backgroundColor: '#3B82F6',
        borderRadius: 4
      }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    let headers: string[] = [];
    let rows: string[] = [];

    if (reportType === 'class_wise') {
      headers = ['Class ID,Class Name,Total Sessions Logged,Present Count,Absent Count,Attendance %'];
      rows = classWiseData.map((c) => `"${c.class_id}","${c.name}","${c.conducted}","${c.present}","${c.absent}","${c.percentage}%"`);
    } else if (reportType === 'subject_wise') {
      headers = ['Subject Code,Subject Name,Conducted,Present,Absent,Attendance %'];
      rows = subjectWiseData.map((s) => `"${s.code}","${s.name}","${s.conducted}","${s.present}","${s.absent}","${s.percentage}%"`);
    } else if (reportType === 'student_wise' || reportType === 'low_attendance') {
      headers = ['Roll Number,Student Name,Class,Conducted,Present,Absent,Attendance %,Status'];
      const target = reportType === 'low_attendance' ? lowAttendanceData : studentWiseData;
      rows = target.map((st) => `"${st.roll_number}","${st.name}","${st.class_label}","${st.conducted}","${st.present}","${st.absent}","${st.percentage}%","${st.isLow ? 'CRITICAL LOW (<75%)' : 'NORMAL'}"`);
    } else {
      headers = ['Date,Logged Entries,Present,Absent,Attendance Rate %'];
      rows = dailyData.map((d) => `"${d.date}","${d.conducted}","${d.present}","${d.absent}","${d.percentage}%"`);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Print Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Attendance Reports &amp; Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical summaries, statutory audits, and institutional compliance reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Institutional Header (Visible ONLY on print) */}
      <div className="hidden print:block p-4 border-b border-slate-400 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/college_attendance_logo_1793254434920.jpg"
              alt="University Seal"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
                Department of Computer Applications
              </h2>
              <div className="text-xs text-slate-600 font-semibold">
                Official Student Attendance &amp; Statutory Academic Standing Report
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <div>Generated: {new Date().toLocaleDateString()}</div>
            <div>Semester: Odd Term 2026</div>
          </div>
        </div>
      </div>

      {/* Report Controls (Hidden on print) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        {/* Report Type Selector Tabs (Section 11) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Report Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'class_wise', label: 'Class-Wise' },
              { id: 'subject_wise', label: 'Subject-Wise' },
              { id: 'student_wise', label: 'Student-Wise' },
              { id: 'daily', label: 'Daily Log' },
              { id: 'low_attendance', label: 'Low Attendance (<75%)' },
              { id: 'monthly', label: 'Monthly Summary' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setReportType(t.id as ReportType)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  reportType === t.id
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Filter Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.class_id} value={c.class_id}>
                  {c.course} Sem {c.semester}-{c.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Filter Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_code} · {s.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
            Logged Entries
          </span>
          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1 block">
            {totalConducted}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider block">
            Present Entries
          </span>
          <span className="text-xl font-bold font-mono tabular-nums text-emerald-700 mt-1 block">
            {totalPresent}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-rose-700 font-semibold uppercase tracking-wider block">
            Absent Entries
          </span>
          <span className="text-xl font-bold font-mono tabular-nums text-rose-700 mt-1 block">
            {totalAbsent}
          </span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider block">
            Aggregate Rate
          </span>
          <span className="text-xl font-bold font-mono tabular-nums text-blue-700 mt-1 block">
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Chart.js Visual Representations (Hidden on print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Present vs Absent Distribution
          </h3>
          <div className="h-44 w-full flex items-center justify-center">
            <Doughnut
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } }
              }}
            />
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Class Performance Benchmark (%)
          </h3>
          <div className="h-44">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { min: 0, max: 100 } }
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Report Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {reportType === 'class_wise' && 'Class-Wise Attendance Aggregate'}
              {reportType === 'subject_wise' && 'Subject-Wise Attendance Aggregate'}
              {reportType === 'student_wise' && 'Student-Wise Attendance Register'}
              {reportType === 'low_attendance' && 'Statutory Low Attendance Watchlist (<75%)'}
              {reportType === 'daily' && 'Daily Attendance Logs'}
              {reportType === 'monthly' && 'Monthly Attendance Summary'}
            </h3>
            <p className="text-[11px] text-slate-500">
              Reporting Window: {startDate} to {endDate}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-700">
            {reportType === 'low_attendance' ? `${lowAttendanceData.length} flagged` : 'Active Report'}
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'class_wise' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Class / Section</th>
                  <th className="py-2.5 px-4 text-center">Conducted Records</th>
                  <th className="py-2.5 px-4 text-center">Present</th>
                  <th className="py-2.5 px-4 text-center">Absent</th>
                  <th className="py-2.5 px-4 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classWiseData.map((c) => (
                  <tr key={c.class_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-600">{c.conducted}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums font-semibold text-emerald-700">{c.present}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums font-semibold text-rose-700">{c.absent}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-blue-600">{c.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'subject_wise' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Subject Code</th>
                  <th className="py-2.5 px-4">Subject Name</th>
                  <th className="py-2.5 px-4 text-center">Conducted</th>
                  <th className="py-2.5 px-4 text-center">Present</th>
                  <th className="py-2.5 px-4 text-center">Absent</th>
                  <th className="py-2.5 px-4 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectWiseData.map((s) => (
                  <tr key={s.subject_id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{s.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{s.name}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-600">{s.conducted}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-emerald-700 font-semibold">{s.present}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-rose-700 font-semibold">{s.absent}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-blue-600">{s.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(reportType === 'student_wise' || reportType === 'low_attendance') && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Roll Number</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4">Class</th>
                  <th className="py-2.5 px-4 text-center">Conducted</th>
                  <th className="py-2.5 px-4 text-center">Present</th>
                  <th className="py-2.5 px-4 text-center">Absent</th>
                  <th className="py-2.5 px-4 text-right">Attendance %</th>
                  <th className="py-2.5 px-4 text-right">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(reportType === 'low_attendance' ? lowAttendanceData : studentWiseData).map((st) => (
                  <tr key={st.student_id} className={`hover:bg-slate-50 ${st.isLow ? 'bg-rose-50/30' : ''}`}>
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{st.roll_number}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{st.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{st.class_label}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-600">{st.conducted}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-emerald-700 font-semibold">{st.present}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-rose-700 font-semibold">{st.absent}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={st.isLow ? 'text-rose-600' : 'text-blue-600'}>{st.percentage}%</span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          st.isLow
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : st.percentage >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {st.isLow ? 'Below 75%' : st.percentage >= 90 ? 'Excellent' : 'Good'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(reportType === 'daily' || reportType === 'monthly') && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4 text-center">Total Sessions Recorded</th>
                  <th className="py-2.5 px-4 text-center">Present Entries</th>
                  <th className="py-2.5 px-4 text-center">Absent Entries</th>
                  <th className="py-2.5 px-4 text-right">Daily Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dailyData.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{d.date}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-600">{d.conducted}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-emerald-700 font-semibold">{d.present}</td>
                    <td className="py-2.5 px-4 text-center font-mono tabular-nums text-rose-700 font-semibold">{d.absent}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-blue-600">{d.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Print Signature Block (Visible on print) */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-16 text-center text-xs text-slate-700">
        <div>
          <div className="border-t border-slate-400 pt-2 font-semibold">Faculty In-Charge</div>
          <div className="text-[10px] text-slate-500">Sign &amp; Date</div>
        </div>
        <div>
          <div className="border-t border-slate-400 pt-2 font-semibold">Department HOD</div>
          <div className="text-[10px] text-slate-500">Verification Seal</div>
        </div>
        <div>
          <div className="border-t border-slate-400 pt-2 font-semibold">Principal / Academic Dean</div>
          <div className="text-[10px] text-slate-500">Institutional Approval</div>
        </div>
      </div>
    </div>
  );
};
