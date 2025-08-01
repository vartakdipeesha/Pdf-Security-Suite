
import React, { useEffect, useState } from 'react';
import {
  Shield, FileText, Activity, AlertTriangle, PieChart as LucidePieChart
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardTabProps {
  currentRole: string;
}

interface FileData {
  id: string;
  name: string;
  status: 'encrypted' | 'cracked';
  uploadTime: string;
  size: string;
}

const DashboardTab = ({ currentRole }: DashboardTabProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    encryptedFiles: 0,
    crackedFiles: 0,
    successRate: 0,
  });

  const fetchData = async () => {
    const res = await fetch('http://localhost:5000/files');
    const data: FileData[] = await res.json();
    setFiles(data.reverse());
    const total = data.length;
    const encrypted = data.filter(f => f.status === 'encrypted').length;
    const cracked = data.filter(f => f.status === 'cracked').length;

    setStats({
      totalFiles: total,
      encryptedFiles: encrypted,
      crackedFiles: cracked,
      successRate: total > 0 ? Math.round((cracked / total) * 100) : 0,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pieData = [
    { name: 'Encrypted', value: stats.encryptedFiles },
    { name: 'Cracked', value: stats.crackedFiles },
  ];

  const handleClearAll = async () => {
    const confirmed = confirm('Are you sure you want to clear all files?');
    if (!confirmed) return;

    const res = await fetch('http://localhost:5000/clear-files', { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      setFiles([]);
      setStats({ totalFiles: 0, encryptedFiles: 0, crackedFiles: 0, successRate: 0 });
      alert('All files cleared successfully.');
    } else {
      alert('Failed to clear files.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Heading */}
      <div className="text-white text-3xl font-bold flex items-center space-x-3">
        <LucidePieChart className="w-8 h-8 text-purple-400" />
        <h1>Security Dashboard</h1>
      </div>

      {/* Chart + Stats */}
      <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/60 flex flex-col md:flex-row items-center gap-10">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-80 flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>

              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? 'url(#greenGradient)' : 'url(#redGradient)'}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: 6 }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Labels */}
          <div className="flex space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <p className="text-white text-sm">Encrypted</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <p className="text-white text-sm">Cracked</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col space-y-6 w-full md:w-1/2">
          <StatCard icon={FileText} label="Total Files" value={stats.totalFiles} color="from-blue-600 to-blue-400" />
          <StatCard icon={Shield} label="Encrypted" value={stats.encryptedFiles} color="from-green-600 to-green-400" />
          <StatCard icon={AlertTriangle} label="Cracked" value={stats.crackedFiles} color="from-red-600 to-pink-600" />
          <StatCard icon={Activity} label="Success Rate" value={`${stats.successRate}%`} color="from-purple-600 to-purple-400" />
        </div>
      </div>

      {/* Recent Files Table */}
      <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/60">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Recent Files</h2>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="min-w-full text-sm text-slate-300">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-600">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Size</th>
                <th className="py-2 pr-4">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-500">
                    No files uploaded yet.
                  </td>
                </tr>
              ) : (
                files.slice(0, 10).map((file, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/40">
                    <td className="py-2 pr-4">{file.name}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        file.status === 'cracked' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                      }`}>
                        {file.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{file.size}</td>
                    <td className="py-2 pr-4">{file.uploadTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;

// Reusable Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-6 shadow-lg flex items-center space-x-4`}>
    <Icon className="w-12 h-12 text-white" />
    <div>
      <p className="text-white text-lg font-semibold">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  </div>
);
