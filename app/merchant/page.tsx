"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ArrowUpRight, TrendingUp, PhoneCall, AlertCircle, ShoppingCart, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";

const dropOffData = [
  { stage: "Review Cart", count: 120, loss: 450000 },
  { stage: "Payment Options", count: 340, loss: 1250000 },
  { stage: "EMI Confusion", count: 210, loss: 840000 },
  { stage: "OTP Timeout", count: 480, loss: 1750000 },
  { stage: "Bank Error", count: 150, loss: 590000 },
];

const transactions = [
  { id: "TXN_7841", customer: "Rahul S.", amount: 4500, issue: "OTP Timeout", action: "UPI Link Sent", status: "Recovered", color: "bg-emerald-100 text-emerald-800" },
  { id: "TXN_5623", customer: "Aditi P.", amount: 12000, issue: "EMI Confusion", action: "EMI Applied", status: "Recovered", color: "bg-emerald-100 text-emerald-800" },
  { id: "TXN_9012", customer: "Vikram M.", amount: 2500, issue: "Price Shock", action: "Offered 10% Off", status: "Pending", color: "bg-amber-100 text-amber-800" },
  { id: "TXN_3489", customer: "Pooja K.", amount: 8000, issue: "Bank Refused", action: "Card Option", status: "Dropped", color: "bg-red-100 text-red-800" },
  { id: "TXN_1123", customer: "Sneha R.", amount: 14500, issue: "Payment Options", action: "Voice Call (Hi)", status: "Recovered", color: "bg-emerald-100 text-emerald-800" },
];

export default function MerchantDashboard() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 lg:p-10 font-sans text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center text-sm text-neutral-500 mb-2 space-x-2">
              <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="font-medium text-neutral-800">Croma HQ Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Checkout Recovery</h1>
            <p className="text-neutral-500 mt-1">Real-time funnel monitoring and AI recoveries</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button className="flex items-center bg-white border border-neutral-200 shadow-sm px-4 py-2 rounded-xl text-neutral-700 hover:bg-neutral-50 font-medium">
              <RefreshCw className="mr-2 h-4 w-4" /> This Week
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-4 py-2 rounded-xl font-medium transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 text-neutral-500 mb-4">
              <ShoppingCart className="text-blue-500" />
              <span className="font-semibold text-sm uppercase tracking-wider">Total Drop-offs</span>
            </div>
            <div>
              <div className="text-3xl font-black">1,300</div>
              <div className="text-sm font-medium text-red-500 flex items-center mt-2">
                <TrendingUp size={16} className="mr-1" /> +12% this week
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 text-neutral-500 mb-4">
              <PhoneCall className="text-orange-500" />
              <span className="font-semibold text-sm uppercase tracking-wider">AI Calls Made</span>
            </div>
            <div>
              <div className="text-3xl font-black">1,024</div>
              <div className="text-sm font-medium text-emerald-600 flex items-center mt-2">
                <ArrowUpRight size={16} className="mr-1" /> 78% pickup rate
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 text-neutral-500 mb-4">
              <RefreshCw className="text-indigo-500" />
              <span className="font-semibold text-sm uppercase tracking-wider">Recovery Rate</span>
            </div>
            <div>
              <div className="text-3xl font-black">34.5%</div>
              <div className="text-sm font-medium text-emerald-600 flex items-center mt-2">
                <ArrowUpRight size={16} className="mr-1" /> Best in Electronics
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
            <div className="flex items-center space-x-3 text-emerald-100 mb-4">
              <TrendingUp />
              <span className="font-semibold text-sm uppercase tracking-wider">Revenue Recovered</span>
            </div>
            <div>
              <div className="text-3xl font-black">₹34.5L</div>
              <div className="text-sm font-medium text-emerald-200 flex items-center mt-2">
                Saved from abandonment
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Insights & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              Drop-offs by Root Cause <AlertCircle className="w-5 h-5 ml-2 text-neutral-400"/>
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dropOffData} layout="vertical" margin={{ left: 50, right: 30, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e5e5"/>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="stage" stroke="#737373" fontWeight={500} fontSize={13} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f5f5f5' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(val: any) => [`${val} checkouts`, "Drop-offs"]}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                    {
                      dropOffData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.stage === "OTP Timeout" ? "#f43f5e" : "#4f46e5"} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">PayIntent Insight</h3>
            <p className="text-indigo-800 mb-6 leading-relaxed">
              <span className="font-bold">480 customers</span> dropped at OTP this week, costing ₹17.5L in lost revenue.
            </p>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-indigo-100">
              <p className="text-sm text-neutral-700">
                <span className="font-bold text-emerald-600 block mb-1">Recommendation</span>
                Switching your default to UPI Intent for mobile shoppers will bypass OTP and is projected to recover <span className="font-bold">₹1.2L per week</span>.
              </p>
            </div>
            <button className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 shadow-sm transition-colors">
              Apply UPI as Default
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-neutral-200 bg-neutral-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold">Latest AI-Recovered Checkouts</h3>
            <Link href="#" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
                  <th className="py-4 px-8 font-semibold">Transaction ID</th>
                  <th className="py-4 px-8 font-semibold">Customer</th>
                  <th className="py-4 px-8 font-semibold">Amount</th>
                  <th className="py-4 px-8 font-semibold">Drop-off Issue</th>
                  <th className="py-4 px-8 font-semibold">Agent Action</th>
                  <th className="py-4 px-8 font-semibold w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="py-4 px-8 font-mono text-sm text-neutral-600">{t.id}</td>
                    <td className="py-4 px-8 font-medium">{t.customer}</td>
                    <td className="py-4 px-8 text-neutral-600">₹{t.amount.toLocaleString()}</td>
                    <td className="py-4 px-8 text-neutral-600">{t.issue}</td>
                    <td className="py-4 px-8 text-neutral-600">{t.action}</td>
                    <td className="py-4 px-8">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${t.color}`}>
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
    </div>
  );
}
