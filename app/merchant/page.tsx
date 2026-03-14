"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ArrowUpRight, TrendingUp, PhoneCall, AlertCircle, ShoppingCart, RefreshCw, LayoutDashboard, Settings, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dropOffData = [
  { stage: "Review Cart", count: 120, loss: 450000 },
  { stage: "Payment Options", count: 340, loss: 1250000 },
  { stage: "EMI Confusion", count: 210, loss: 840000 },
  { stage: "OTP Timeout", count: 480, loss: 1750000 },
  { stage: "Bank Error", count: 150, loss: 590000 },
];

const transactions = [
  { id: "TXN_7841", customer: "Rahul S.", amount: 4500, issue: "OTP Timeout", action: "UPI Link Sent", status: "Recovered" },
  { id: "TXN_5623", customer: "Aditi P.", amount: 12000, issue: "EMI Confusion", action: "EMI Applied", status: "Recovered" },
  { id: "TXN_9012", customer: "Vikram M.", amount: 2500, issue: "Price Shock", action: "Offered 10% Off", status: "Pending" },
  { id: "TXN_3489", customer: "Pooja K.", amount: 8000, issue: "Bank Refused", action: "Card Option", status: "Failed" },
  { id: "TXN_1123", customer: "Sneha R.", amount: 14500, issue: "Payment Options", action: "Voice Call (Hi)", status: "Recovered" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Recovered":
      return "bg-pine-lime text-pine-dark";
    case "Failed":
    case "Dropped":
      return "bg-red-100 text-red-600";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Success":
      return "bg-green-100 text-green-600";
    default:
      return "bg-pine-border text-pine-gray";
  }
};

export default function MerchantDashboard() {
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
          <Link href="/merchant" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${pathname === '/merchant' ? 'bg-white/10 text-pine-lime' : 'text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={20} className={pathname === '/merchant' ? 'text-pine-lime' : 'text-white'} />
            Dashboard
          </Link>
          <Link href="/pinelabs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white hover:bg-white/5 transition-colors">
            <RefreshCw size={20} className="text-white" />
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
              <h1 className="text-[32px] font-bold tracking-tight">Croma Analytics</h1>
              <p className="text-[16px] text-pine-gray mt-1">Real-time funnel monitoring and AI recoveries</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-pine-lime text-pine-dark font-bold px-6 py-2.5 rounded-full hover:bg-pine-lime-hover transition-colors">
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <div className="flex items-center space-x-3 text-pine-gray mb-4">
                <ShoppingCart size={20} />
                <span className="font-semibold text-[14px] uppercase tracking-wider">Total Drop-offs</span>
              </div>
              <div>
                <div className="text-[32px] font-bold">1,300</div>
                <div className="text-[14px] font-medium text-red-500 flex items-center mt-2">
                  <TrendingUp size={16} className="mr-1" /> +12% this week
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <div className="flex items-center space-x-3 text-pine-gray mb-4">
                <PhoneCall size={20} />
                <span className="font-semibold text-[14px] uppercase tracking-wider">AI Calls Made</span>
              </div>
              <div>
                <div className="text-[32px] font-bold">1,024</div>
                <div className="text-[14px] font-medium text-pine-success flex items-center mt-2">
                  <ArrowUpRight size={16} className="mr-1" /> 78% pickup rate
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <div className="flex items-center space-x-3 text-pine-gray mb-4">
                <RefreshCw size={20} />
                <span className="font-semibold text-[14px] uppercase tracking-wider">Recovery Rate</span>
              </div>
              <div>
                <div className="text-[32px] font-bold">34.5%</div>
                <div className="text-[14px] font-medium text-pine-success flex items-center mt-2">
                  <ArrowUpRight size={16} className="mr-1" /> Best in Electronics
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-colors">
              <div className="flex items-center space-x-3 text-pine-gray mb-4">
                <TrendingUp size={20} />
                <span className="font-semibold text-[14px] uppercase tracking-wider">Revenue Recovered</span>
              </div>
              <div>
                <div className="text-[32px] font-bold">₹34.5L</div>
                <div className="text-[14px] font-medium text-pine-success flex items-center mt-2">
                  Saved from abandonment
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Insights & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white rounded-2xl border border-pine-border p-8 hover:border-pine-dark transition-colors">
              <h3 className="text-[20px] font-bold mb-6 flex items-center">
                Drop-offs by Root Cause <AlertCircle className="w-5 h-5 ml-2 text-pine-gray"/>
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dropOffData} layout="vertical" margin={{ left: 50, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E8E8E8"/>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="stage" stroke="#4A4A4A" fontWeight={500} fontSize={13} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: '#F5F7F5' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E8E8E8', boxShadow: 'none' }}
                      formatter={(val: any) => [`${val} checkouts`, "Drop-offs"]}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                      {
                        dropOffData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.stage === "OTP Timeout" ? "#0D2B2B" : "#C8F135"} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-pine-border p-8 flex flex-col justify-center hover:border-pine-dark transition-colors">
              <h3 className="text-[20px] font-bold text-pine-dark mb-4">PayIntent Insight</h3>
              <p className="text-[16px] text-pine-gray mb-6 leading-relaxed">
                <span className="font-bold text-pine-dark">480 customers</span> dropped at OTP this week, costing ₹17.5L in lost revenue.
              </p>
              <div className="bg-pine-light p-5 rounded-xl border border-pine-border mb-6">
                <p className="text-[14px] text-pine-gray">
                  <span className="font-bold text-pine-success block mb-2">Recommendation</span>
                  Switching your default to UPI Intent for mobile shoppers will bypass OTP and is projected to recover <span className="font-bold text-pine-dark">₹1.2L per week</span>.
                </p>
              </div>
              <button className="w-full bg-white border-2 border-pine-dark text-pine-dark font-bold py-3.5 rounded-full hover:bg-pine-light transition-colors">
                Apply UPI as Default
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-2xl border border-pine-border overflow-hidden hover:border-pine-dark transition-colors">
            <div className="px-8 py-6 border-b border-pine-border flex justify-between items-center">
              <h3 className="text-[20px] font-bold">Latest AI-Recovered Checkouts</h3>
              <Link href="#" className="flex items-center font-bold text-pine-gray hover:text-pine-dark transition-colors">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-pine-light border-b border-pine-border text-[14px] font-semibold text-pine-dark">
                    <th className="py-4 px-8">Transaction ID</th>
                    <th className="py-4 px-8">Customer</th>
                    <th className="py-4 px-8">Amount</th>
                    <th className="py-4 px-8">Drop-off Issue</th>
                    <th className="py-4 px-8">Agent Action</th>
                    <th className="py-4 px-8 w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pine-border">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-pine-light transition-colors">
                      <td className="py-4 px-8 font-mono text-[14px] text-pine-gray">{t.id}</td>
                      <td className="py-4 px-8 font-medium text-[15px]">{t.customer}</td>
                      <td className="py-4 px-8 text-pine-gray">₹{t.amount.toLocaleString()}</td>
                      <td className="py-4 px-8 text-pine-gray">{t.issue}</td>
                      <td className="py-4 px-8 text-pine-gray">{t.action}</td>
                      <td className="py-4 px-8">
                        <span className={`px-3 py-1 text-[12px] font-bold rounded-full ${getStatusBadge(t.status)}`}>
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
      </main>
    </div>
  );
}
