"use client";

import { useState, useRef, useEffect } from "react";
import { Smartphone, ShieldCheck, Send, ArrowLeft, Bot, MessageSquare, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "agent", content: "Hi! I'm your PayIntent checkout assistant. I can find you the best EMI deal, apply discounts, or help you pick a payment method. What would you like?" }
  ]);
  const [input, setInput] = useState("");
  const [cartTotal, setCartTotal] = useState(4500);
  const [activeScreen, setActiveScreen] = useState("payment_method");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [customerPhone, setCustomerPhone] = useState(process.env.NEXT_PUBLIC_TEST_CUSTOMER_PHONE || "");
  const [customerEmail, setCustomerEmail] = useState(process.env.NEXT_PUBLIC_TEST_CUSTOMER_EMAIL || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isChatOpen]);

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

      if (data.action) {
        switch (data.action.type) {
          case "navigate_otp":
            setTimeout(() => setActiveScreen("otp"), 1500);
            break;
          case "apply_offer":
            if (data.action.value) setCartTotal(parseInt(data.action.value));
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
    <div className="min-h-screen bg-white font-sans text-pine-gray relative pb-24">
      
      {/* Top Nav (Minimal for Checkout) */}
      <nav className="border-b border-pine-border bg-white h-16 flex items-center px-6 sticky top-0 z-40">
        <Link href="/" className="flex items-center text-sm font-medium text-pine-gray hover:text-pine-dark transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4" /> Cancel & Return
        </Link>
      </nav>

      {/* Main Centered Card */}
      <main className="max-w-[480px] mx-auto mt-12 px-6">
        
        {/* Pine Labs Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-5 h-5 bg-pine-dark rounded-sm"></div>
          <span className="text-[20px] font-bold text-pine-dark lowercase tracking-tight">pine labs</span>
        </div>

        <div className="bg-white border border-pine-border rounded-2xl p-6 shadow-sm">
          {/* Merchant Header */}
          <div className="flex items-center justify-between pb-6 border-b border-pine-border">
            <h2 className="text-[20px] font-semibold text-pine-dark">Croma Electronics</h2>
            <div className="flex items-center text-sm font-medium text-pine-success">
              <ShieldCheck className="w-4 h-4 mr-1" /> Secure
            </div>
          </div>

          {/* Cart Item */}
          <div className="py-6 border-b border-pine-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pine-light rounded-lg flex items-center justify-center text-pine-gray">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-pine-dark">Samsung S24 Ultra</h3>
                  <p className="text-sm text-pine-gray">Titanium Gray, 256GB</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium">Total Payable</span>
              <span className="text-xl font-bold text-pine-dark">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {activeScreen === "payment_method" && (
            <div className="py-6 space-y-4">
              <h3 className="text-sm font-semibold text-pine-dark uppercase tracking-wider mb-2">Customer Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-pine-gray mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-pine-border rounded-lg px-4 py-3 text-[16px] text-pine-dark focus:border-pine-dark outline-none transition-colors"
                  placeholder="+919876543210"
                />
              </div>
              
              <div className="pb-4">
                <label className="block text-sm font-medium text-pine-gray mb-1">Email ID</label>
                <input 
                  type="email" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full border border-pine-border rounded-lg px-4 py-3 text-[16px] text-pine-dark focus:border-pine-dark outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <button 
                onClick={() => setActiveScreen("otp")}
                className="w-full bg-pine-lime text-pine-dark font-bold text-[16px] py-3.5 rounded-full hover:bg-pine-lime-hover transition-colors"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          {activeScreen === "otp" && (
            <div className="py-8 flex flex-col items-center">
              <h3 className="text-[20px] font-semibold text-pine-dark mb-2">Enter Bank OTP</h3>
              <p className="text-center text-pine-gray mb-6 text-[14px]">Sent to {customerPhone || "your phone"}</p>

              <div className="flex gap-2 mb-8 justify-center">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input 
                    key={i} 
                    type="text" 
                    maxLength={1} 
                    className="w-10 h-12 text-center text-lg font-bold border border-pine-border rounded-lg focus:border-pine-dark outline-none transition-colors text-pine-dark" 
                  />
                ))}
              </div>

              <button 
                onClick={() => setActiveScreen("success")} 
                className="w-full bg-pine-lime text-pine-dark font-bold text-[16px] py-3.5 rounded-full hover:bg-pine-lime-hover transition-colors shadow-sm"
              >
                Verify & Pay
              </button>
            </div>
          )}

          {activeScreen === "success" && (
            <div className="py-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-pine-success/10 text-pine-success rounded-full flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-[24px] font-bold text-pine-dark mb-2">Payment Successful!</h3>
              <p className="text-pine-gray mb-8">TXN_98765 completed securely.</p>
              
              <Link href="/" className="w-full">
                <button className="w-full bg-white border-2 border-pine-dark text-pine-dark font-bold text-[16px] py-3.5 rounded-full hover:bg-pine-light transition-colors">
                  Return Home
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Demo Tools Box (Subtle) */}
        <div className="mt-8 border border-pine-border rounded-xl p-4 bg-pine-light">
          <p className="text-xs font-bold text-pine-dark uppercase tracking-wider mb-3">🧪 Demo Drop-off Triggers</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => logDropOff("price_shock")} className="text-[13px] font-medium bg-white border border-pine-border px-3 py-1.5 rounded-lg hover:border-pine-dark transition-colors text-pine-gray hover:text-pine-dark">Price Shock</button>
            <button onClick={() => logDropOff("emi_confusion")} className="text-[13px] font-medium bg-white border border-pine-border px-3 py-1.5 rounded-lg hover:border-pine-dark transition-colors text-pine-gray hover:text-pine-dark">EMI Confusion</button>
            <button onClick={() => logDropOff("otp_timeout")} className="text-[13px] font-medium bg-white border border-pine-border px-3 py-1.5 rounded-lg hover:border-pine-dark transition-colors text-pine-gray hover:text-pine-dark">OTP Timeout</button>
          </div>
        </div>

      </main>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="bg-pine-dark w-[360px] h-[500px] rounded-2xl shadow-xl flex flex-col overflow-hidden mb-4 border border-pine-dark/10 transform transition-all">
            {/* Chat Header */}
            <div className="bg-pine-dark text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-pine-lime" />
                <span className="font-semibold tracking-tight text-[15px]">PayIntent Assistant</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
              {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl p-3.5 text-[14px] shadow-sm ${msg.role === "user" ? "bg-pine-dark text-white rounded-tr-sm" : "bg-pine-light text-pine-dark rounded-tl-sm border border-pine-border"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-pine-light text-pine-gray text-[14px] rounded-xl rounded-tl-sm p-3.5 border border-pine-border flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-pine-dark" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-pine-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-pine-light border border-pine-border focus:border-pine-dark rounded-full px-4 py-2 text-[14px] outline-none transition-colors text-pine-dark"
                  placeholder="Ask about EMIs/Offers..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-pine-lime text-pine-dark rounded-full w-10 h-10 flex items-center justify-center hover:bg-pine-lime-hover disabled:opacity-50 transition-colors shrink-0"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${isChatOpen ? 'bg-white text-pine-dark border border-pine-border' : 'bg-pine-dark text-pine-lime'}`}
        >
          {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

    </div>
  );
}
