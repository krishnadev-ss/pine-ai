"use client";

import { useState, useRef, useEffect } from "react";
import { Smartphone, ShieldCheck, Send, ArrowLeft, Bot, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "agent", content: "Hi! I'm your PayIntent checkout assistant. I can find you the best EMI deal, apply discounts, or help you pick a payment method. What would you like?" }
  ]);
  const [input, setInput] = useState("");
  const [cartTotal, setCartTotal] = useState(4500);
  const [activeScreen, setActiveScreen] = useState("payment_method");
  const [isLoading, setIsLoading] = useState(false);
  const [customerPhone, setCustomerPhone] = useState(process.env.NEXT_PUBLIC_TEST_CUSTOMER_PHONE || "");
  const [customerEmail, setCustomerEmail] = useState(process.env.NEXT_PUBLIC_TEST_CUSTOMER_EMAIL || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/checkout/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          cart_total: cartTotal,
          history: messages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "agent", content: data.reply }]);

      // Handle actions from the AI
      if (data.action) {
        switch (data.action.type) {
          case "navigate_otp":
            setTimeout(() => setActiveScreen("otp"), 1500);
            break;
          case "apply_offer":
            if (data.action.value) setCartTotal(parseInt(data.action.value));
            break;
          case "select_emi":
            // Could update UI to show EMI badge
            break;
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I'm having a connection issue. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const logDropOff = async (reason: string) => {
    if (!customerPhone) {
      alert("Please enter a customer phone number first!");
      return;
    }
    
    try {
      await fetch("/api/webhook/frontend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: "TXN_" + Math.floor(Math.random() * 100000),
          customer_phone: customerPhone,
          customer_name: "Customer",
          amount: cartTotal.toString(),
          merchant_name: "Croma",
          drop_off_reason: reason,
          last_screen: activeScreen,
          time_spent_on_last_screen: Math.floor(Math.random() * 60) + 10,
        }),
      });
      alert(`Drop-off event sent: ${reason}\nCheck your server console for the AI classification and Bolna trigger logs!`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
        {/* Left Side: Order Summary */}
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Demo Hub
          </Link>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Croma Store</h2>
              <div className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 mr-1" /> Secure Checkout
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Samsung S24 Ultra</h3>
                    <p className="text-gray-500">Titanium Gray, 256GB</p>
                  </div>
                </div>
                <div className="font-semibold text-lg">₹{cartTotal.toLocaleString()}</div>
              </div>

              <div className="flex justify-between items-center py-2 text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-gray-500">
                <span>Shipping</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center py-4 border-t border-gray-100 font-bold text-xl">
                <span>Total to pay</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Customer Details Form */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Customer Details (For Demo AI calls)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone Number (E.164 context, e.g. +91...)</label>
                  <input 
                    type="text" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="+919876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 outline-none transition-all"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
            </div>
          </div>


          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800 text-sm">
            <p className="font-semibold mb-2">🧪 Demo Tools — Simulate Drop-offs</p>
            <p className="text-xs text-orange-600 mb-3">These fire real AI classification + Bolna voice triggers. Check your server console.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => logDropOff("price_shock")} className="bg-white border border-orange-200 px-3 py-1.5 rounded shadow-sm hover:bg-orange-100 transition-colors">Price Shock</button>
              <button onClick={() => logDropOff("emi_confusion")} className="bg-white border border-orange-200 px-3 py-1.5 rounded shadow-sm hover:bg-orange-100 transition-colors">EMI Confusion</button>
              <button onClick={() => logDropOff("otp_timeout")} className="bg-white border border-orange-200 px-3 py-1.5 rounded shadow-sm hover:bg-orange-100 transition-colors">OTP Timeout</button>
              <button onClick={() => logDropOff("payment_method")} className="bg-white border border-orange-200 px-3 py-1.5 rounded shadow-sm hover:bg-orange-100 transition-colors">Method Confusion</button>
            </div>
          </div>
        </div>

        {/* Right Side: Agent / Payment flow */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-[700px]">
          <div className="bg-emerald-600 text-white p-6 flex items-center justify-between shadow-md z-10 relative">
            <div>
              <h2 className="font-bold text-xl flex items-center gap-2">
                <Bot /> PayIntent Assistant
              </h2>
              <p className="text-emerald-100 text-sm mt-1">Powered by Gemini AI</p>
            </div>
            <div className="text-xs bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full font-medium">
              Live AI
            </div>
          </div>

          {activeScreen === "payment_method" && (
            <div className="flex-1 flex flex-col bg-gray-50 relative">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === "user" ? "bg-emerald-600 text-white rounded-tr-sm" : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-400 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="Ask for EMIs, offers, or payment options..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl px-4 py-3 shadow-md transition-colors flex items-center justify-center"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  <button onClick={() => setInput("What EMI deals are there?")} className="shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors">Find EMI options</button>
                  <button onClick={() => setInput("Apply the best offer")} className="shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors">Apply best offer</button>
                  <button onClick={() => setInput("What payment methods do I have?")} className="shrink-0 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors">Payment methods</button>
                </div>
              </div>
            </div>
          )}

          {activeScreen === "otp" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Bank OTP</h3>
              <p className="text-center text-gray-500 mb-8">We&apos;ve sent a 6-digit code to +91 98765 43210</p>

              <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                ))}
              </div>

              <div className="space-y-4 w-full">
                <button onClick={() => setActiveScreen("success")} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-md">
                  Verify & Pay
                </button>
                <button onClick={() => logDropOff("otp_timeout")} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100">
                  Simulate OTP Drop-off
                </button>
              </div>
            </div>
          )}

          {activeScreen === "success" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-center text-gray-500 mb-8">Your transaction ID is TXN_98765. Receipt sent to your email.</p>
              <Link href="/">
                <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800">
                  Return Home
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
