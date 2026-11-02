/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileSpreadsheet
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
import { Doughnut, Bar, Line } from 'react-chartjs-2';

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

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { getOverallMetrics, getLowAttendanceStudents, attendance, classes, subjects, faculty } = useApp();
  const metrics = getOverallMetrics();
  const lowAttendanceList = getLowAttendanceStudents(75);

  // Present vs Absent Doughnut Chart Data
  const presentRecords = attendance.filter((a) => a.status === 'Present').length;
  const absentRecords = attendance.filter((a) => a.status === 'Absent').length;
  const doughnutData = {
    labels: ['Present Sessions', 'Absent Sessions'],
    datasets: [
      {
        data: [presentRecords, absentRecords],
        backgroundColor: ['#10B981', '#F43F5E'],
        hoverBackgroundColor: ['#059669', '#E11D48'],
        borderWidth: 1,
        borderColor: '#FFFFFF'
      }
    ]
  };

  // Class-wise Attendance Performance Data
  const classLabels = classes.map((c) => `${c.course} Sem ${c.semester}-${c.section}`);
  const classPercentages = classes.map((c) => {
    const classRecords = attendance.filter((a) => a.class_id === c.class_id);
    if (classRecords.length === 0) return 0;
    const pres = classRecords.filter((a) => a.status === 'Present').length;
    return Math.round((pres / classRecords.length) * 100);
  });

  const barData = {
    labels: classLabels,
    datasets: [
      {
        label: 'Average Attendance (%)',
        data: classPercentages,
        backgroundColor: '#3B82F6',
        borderRadius: 4
      }
    ]
  };

  // 7-Day Trend Line Chart Data
  const recentDates = Array.from(new Set(attendance.map((a) => a.attendance_date)))
    .sort()
    .slice(-7);

  const trendPresent = recentDates.map((d) => {
    const dayRecords = attendance.filter((a) => a.attendance_date === d);
    const pres = dayRecords.filter((a) => a.status === 'Present').length;
    return dayRecords.length > 0 ? Math.round((pres / dayRecords.length) * 100) : 0;
  });

  const lineData = {
    labels: recentDates.map((d) => d.slice(5)), // MM-DD
    datasets: [
      {
        label: 'Daily Attendance Rate (%)',
        data: trendPresent,
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#4F46E5',
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { boxWidth: 12, font: { size: 11 } }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { font: { size: 10 } }
      },
      x: {
        ticks: { font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional overview, live attendance metrics, and compliance monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('mark_attendance')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Attendance Reports</span>
          </button>
        </div>
      </div>

      {/* 6 Mandatory Summary Cards (Section 3) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Students
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalStudents}
            </span>
            <span className="text-[11px] text-slate-500">Enrolled</span>
          </div>
        </div>

        {/* 2. Total Faculty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Faculty
            </span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalFaculty}
            </span>
            <span className="text-[11px] text-slate-500">Active</span>
          </div>
        </div>

        {/* 3. Total Classes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Classes
            </span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalClasses}
            </span>
            <span className="text-[11px] text-slate-500">Sections</span>
          </div>
        </div>

        {/* 4. Total Attendance Records */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Records
            </span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalRecords}
            </span>
            <span className="text-[11px] text-slate-500">Logged</span>
          </div>
        </div>

        {/* 5. Today's Present Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              Today Present
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
              {metrics.todayPresent}
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">Recorded</span>
          </div>
        </div>

        {/* 6. Today's Absent Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">
              Today Absent
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
              {metrics.todayAbsent}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">Recorded</span>
          </div>
        </div>
      </div>

      {/* Chart.js Analytics Grid (Section 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Present vs Absent Doughnut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Overall Attendance Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Cumulative present vs absent count</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {Math.round((presentRecords / (presentRecords + absentRecords || 1)) * 100)}% Present
            </span>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
                }
              }}
            />
          </div>
        </div>

        {/* Class-wise Performance Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Class-Wise Attendance Rate
              </h3>
              <p className="text-[11px] text-slate-500">Average percentage by course &amp; section</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Across {classes.length} Classes</span>
          </div>
          <div className="h-56">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* 7-Day Attendance Trend Line Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Daily Attendance Trend
              </h3>
              <p className="text-[11px] text-slate-500">Daily aggregate attendance rate</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Past 7 Sessions</span>
          </div>
          <div className="h-56">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Critical Action: Low Attendance Alert & Today's Attendance Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Attendance Alert Table (<75% Warning) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-amber-50/40">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Critical Compliance: Low Attendance Watchlist (&lt;75%)
                </h3>
                <p className="text-xs text-slate-500">
                  Students failing the University statutory 75% attendance criteria.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
              {lowAttendanceList.length} Flagged
            </span>
          </div>

          <div className="overflow-x-auto">
            {lowAttendanceList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                All students currently satisfy the 75% attendance threshold.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Roll Number</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Class</th>
                    <th className="py-2.5 px-4 text-center">Classes (Att/Tot)</th>
                    <th className="py-2.5 px-4 text-right">Attendance %</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowAttendanceList.map((st) => (
                    <tr key={st.student_id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-800">
                        {st.roll_number}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{st.full_name}</td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {st.course} Sem {st.semester}-{st.section}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono tabular-nums text-slate-600">
                        {st.summary.attended} / {st.summary.total_conducted}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600 tabular-nums">
                        {st.summary.percentage}%
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          Critical Alert
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Notification notices automatically issued to respective student portals.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('students')}
              className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Manage Student Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Administration Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Software Engineering PBL Modules
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Explore the engineering artifacts, test suites, and source code.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveTab('se_hub')}
                className="w-full p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="text-left">
                  <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>SRS &amp; UML Diagrams</span>
                  </div>
                  <div className="text-[11px] text-indigo-700/80">
                    Use Case, DFD 0/1, ER, Class, Sequence &amp; Activity
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code_export')}
                className="w-full p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 flex items-center justify-between text-xs transition-colors group"
              >
                <div className="text-left">
                  <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                    <span className="font-mono font-bold text-emerald-700">&lt;/&gt;</span>
                    <span>Python Flask &amp; MySQL Code</span>
                  </div>
                  <div className="text-[11px] text-emerald-700/80">
                    schema.sql, app.py, models, and test suite files
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
              >
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Student Directory &amp; Enrollment</div>
                  <div className="text-[11px] text-slate-500">Add, edit, or search student profiles</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faculty')}
                className="w-full p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
              >
                <div className="text-left">
                  <div className="font-semibold text-slate-800">Faculty &amp; Teaching Assignments</div>
                  <div className="text-[11px] text-slate-500">Manage instructors and course mapping</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>SDLC Model: Agile Waterfall</span>
            <span className="font-mono">Status: Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
