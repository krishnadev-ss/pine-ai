"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Building2, Globe, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, LayoutDashboard, Settings, User, LogOut, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const languageData = [
  { name: "Hindi", value: 4500, color: "#C8F135" }, // pine-lime
  { name: "English", value: 3200, color: "#0D2B2B" }, // pine-dark
  { name: "Tamil", value: 1800, color: "#22C55E" }, // pine-success
  { name: "Telugu", value: 1500, color: "#4A4A4A" }, // pine-gray
  { name: "Marathi", value: 1200, color: "#B8E020" }, // pine-lime-hover
];

const bankIssues = [
  { bank: "HDFC", failures: 1240, retrySuccess: 890 },
  { bank: "SBI", failures: 3450, retrySuccess: 1200 },
  { bank: "ICICI", failures: 890, retrySuccess: 640 },
  { bank: "Axis", failures: 560, retrySuccess: 410 },
];

export default function PineLabsDashboard() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-pine-light font-sans text-pine-dark">
      
      {/* Sidebar */}
      <aside className="w-[240px] bg-pine-dark text-white flex flex-col hidden md:flex fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-pine-lime rounded-sm"></div>
          <span className="text-[20px] font-bold tracking-tight">pine labs</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/merchant" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard size={20} className="text-white" />
            Dashboard
          </Link>
          <Link href="/pinelabs" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${pathname === '/pinelabs' ? 'bg-white/10 text-pine-lime' : 'text-white hover:bg-white/5'}`}>
            <RefreshCw size={20} className={pathname === '/pinelabs' ? 'text-pine-lime' : 'text-white'} />
            Network Hub
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white hover:bg-white/5 transition-colors">
            <User size={20} className="text-white" />
            Customers
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white hover:bg-white/5 transition-colors">
            <Settings size={20} className="text-white" />
            Settings
          </Link>
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 text-[15px] font-medium text-white/70 hover:text-white transition-colors">
            <LogOut size={20} />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[240px] p-8">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center text-sm font-bold text-pine-lime uppercase tracking-wider mb-2">
                Pine Labs Operations
              </div>
              <h1 className="text-[32px] font-bold tracking-tight flex items-center gap-3">
                Global Network Hub
              </h1>
              <p className="text-[16px] text-pine-gray mt-1">Network-wide checkout intelligence and recovery metrics</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-white border-2 border-pine-dark text-pine-dark font-bold px-6 py-2.5 rounded-full hover:bg-pine-light transition-colors">
                Global Network Report
              </button>
            </div>
          </div>

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <span className="text-pine-gray font-semibold text-[14px] uppercase tracking-wider mb-4 block">Network Recovered (7d)</span>
              <div>
                <div className="text-[32px] font-bold">₹4.2 Cr</div>
                <div className="text-[14px] font-medium text-pine-success mt-2 flex items-center">
                  <TrendingUp size={16} className="mr-1" /> +24% vs last week
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <span className="text-pine-gray font-semibold text-[14px] uppercase tracking-wider mb-4 block">Voice Calls Made</span>
              <div>
                <div className="text-[32px] font-bold">84,500</div>
                <div className="text-[14px] font-medium text-pine-dark mt-2 flex items-center">
                  <Globe size={16} className="mr-1" /> Across 8 languages
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <span className="text-pine-gray font-semibold text-[14px] uppercase tracking-wider mb-4 block">High Drop-off Merchants</span>
              <div>
                <div className="text-[32px] font-bold text-red-600">142</div>
                <div className="text-[14px] font-medium text-red-500 mt-2 flex items-center">
                  <AlertTriangle size={16} className="mr-1" /> Requires optimization
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <span className="text-pine-gray font-semibold text-[14px] uppercase tracking-wider mb-4 block">EMI Attachment Boost</span>
              <div>
                <div className="text-[32px] font-bold text-pine-dark">+14.5%</div>
                <div className="text-[14px] font-medium text-pine-success mt-2 flex items-center">
                  <ShieldCheck size={16} className="mr-1" /> Via Conversational Agent
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recovery by Language */}
            <div className="bg-white rounded-2xl border border-pine-border p-8 hover:border-pine-dark transition-colors flex flex-col">
              <h3 className="text-[20px] font-bold mb-6 text-pine-dark">Recovery Calls by Language</h3>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <RechartsTooltip contentStyle={{ borderRadius: "12px", border: "1px solid #E8E8E8", boxShadow: "none" }} />
                    <Pie data={languageData} innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[32px] font-bold text-pine-dark">12.2k</span>
                  <span className="text-[14px] text-pine-gray font-semibold tracking-wider uppercase">Total</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {languageData.map(lang => (
                  <div key={lang.name} className="flex items-center text-[14px] font-medium text-pine-dark">
                    <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: lang.color }}></div>
                    {lang.name} ({lang.value})
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Health */}
            <div className="bg-white rounded-2xl border border-pine-border p-8 hover:border-pine-dark transition-colors">
              <h3 className="text-[20px] font-bold mb-6 text-pine-dark flex items-center">
                Infrastructure Signal: Bank Redirects <AlertTriangle className="w-5 h-5 ml-2 text-pine-gray"/>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bankIssues} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                    <XAxis dataKey="bank" axisLine={false} tickLine={false} tick={{fill: '#4A4A4A', fontSize: 13, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#4A4A4A', fontSize: 13}} />
                    <RechartsTooltip cursor={{ fill: '#F5F7F5' }} contentStyle={{ borderRadius: "12px", border: "1px solid #E8E8E8", boxShadow: "none" }} />
                    <Bar dataKey="failures" fill="#0D2B2B" name="Hard Failures" radius={[4, 4, 0, 0]} barSize={40} />
                    <Bar dataKey="retrySuccess" fill="#C8F135" name="Recovered via UPI Link" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 bg-pine-light p-5 rounded-xl border border-pine-border">
                <p className="text-[14px] text-pine-gray leading-relaxed">
                  <span className="font-bold text-pine-dark block mb-2">Automated Fallback Triggered</span>
                  SBI is currently experiencing high redirect timeouts. PayIntent automatically switched 1,200 SBI customers to intent-based UPI links, saving <span className="font-bold text-pine-dark">₹1.4 Cr</span> in volume.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
