"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Building2, Globe, TrendingUp, AlertTriangle, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

const languageData = [
  { name: "Hindi", value: 4500, color: "#f97316" },
  { name: "English", value: 3200, color: "#3b82f6" },
  { name: "Tamil", value: 1800, color: "#10b981" },
  { name: "Telugu", value: 1500, color: "#8b5cf6" },
  { name: "Marathi", value: 1200, color: "#f43f5e" },
];

const bankIssues = [
  { bank: "HDFC", failures: 1240, retrySuccess: 890 },
  { bank: "SBI", failures: 3450, retrySuccess: 1200 },
  { bank: "ICICI", failures: 890, retrySuccess: 640 },
  { bank: "Axis", failures: 560, retrySuccess: 410 },
];

export default function PineLabsDashboard() {
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-6 lg:p-10 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center text-sm text-gray-500 mb-2 space-x-2">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="font-medium text-gray-800">Pine Labs Network Hub</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Building2 className="text-violet-600 w-8 h-8" /> Pine Labs Operations
            </h1>
            <p className="text-gray-500 mt-1">Network-wide checkout intelligence and recovery metrics</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md px-6 py-2 rounded-xl font-medium transition-colors">
              Global Network Report
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Network Recovered (7d)</span>
            <div className="text-3xl font-black">₹4.2 Cr</div>
            <div className="text-sm font-medium text-emerald-600 mt-2 flex items-center">
              <TrendingUp size={16} className="mr-1" /> +24% vs last week
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">Voice Calls Made</span>
            <div className="text-3xl font-black">84,500</div>
            <div className="text-sm font-medium text-blue-600 mt-2 flex items-center">
              <Globe size={16} className="mr-1" /> Across 8 languages
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">High Drop-off Merchants</span>
            <div className="text-3xl font-black text-red-600">142</div>
            <div className="text-sm font-medium text-red-500 mt-2 flex items-center">
              <AlertTriangle size={16} className="mr-1" /> Requires optimization help
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">EMI Attachment Boost</span>
            <div className="text-3xl font-black text-violet-600">+14.5%</div>
            <div className="text-sm font-medium text-violet-600 mt-2 flex items-center">
              <ShieldCheck size={16} className="mr-1" /> Via Conversational Agent
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recovery by Language */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
            <h3 className="text-lg font-bold mb-6 text-gray-800">Recovery Calls by Language</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Pie data={languageData} innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-800">12.2k</span>
                <span className="text-sm text-gray-500 font-medium tracking-wide">TOTAL</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {languageData.map(lang => (
                <div key={lang.name} className="flex items-center text-sm font-medium">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: lang.color }}></div>
                  {lang.name} ({lang.value})
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
              Infrastructure Signal: Bank Redirect Failures <AlertTriangle className="w-5 h-5 ml-2 text-amber-500"/>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bankIssues} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="bank" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 14, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13}} />
                  <RechartsTooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="failures" fill="#f43f5e" name="Hard Failures" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="retrySuccess" fill="#10b981" name="Recovered via UPI Link" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm mt-4 text-gray-500 text-center font-medium bg-gray-50 py-3 rounded-lg border border-gray-100">
              SBI is currently experiencing high redirect timeouts. PayIntent automatically switched 1,200 SBI customers to intent-based UPI links, saving ₹1.4 Cr in volume.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
