import Link from "next/link";
import { ArrowRight, ShoppingCart, BarChart3, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white border-b border-pine-border z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-pine-dark rounded-sm"></div>
            <span className="text-[20px] font-bold text-pine-dark lowercase tracking-tight">pine labs</span>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-pine-dark">
            <Link href="#" className="hover:opacity-70 transition-opacity">Products</Link>
            <Link href="#" className="hover:opacity-70 transition-opacity">Solutions</Link>
            <Link href="#" className="hover:opacity-70 transition-opacity">Developers</Link>
          </div>

          {/* CTA */}
          <button className="bg-pine-lime text-pine-dark font-bold px-6 py-2.5 rounded-full hover:bg-pine-lime-hover transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-[80px]">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <h1 className="text-[64px] font-bold text-pine-dark leading-[1.1] tracking-tight">
            PayIntent <br /> Intelligent Checkout Recovery
          </h1>
          <p className="text-[16px] text-pine-gray">
            Every Indian payment gateway tells you what failed. PayIntent tells you why it failed, calls your customer in their language, fixes it on the call, and shows you the revenue you got back.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Demo 1: The Checkout */}
          <Link href="/checkout" className="group">
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-pine-light rounded-xl flex items-center justify-center text-pine-dark mb-6">
                  <ShoppingCart size={24} />
                </div>
                <h3 className="text-[20px] font-semibold text-pine-dark tracking-tight mb-3">
                  1. Try the Checkout
                </h3>
                <p className="text-[16px] text-pine-gray">
                  Experience the conversational checkout and drop-off tracking in action.
                </p>
              </div>
              <div className="mt-8 flex items-center text-pine-dark font-medium">
                Try Demo <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Demo 2: Merchant Dashboard */}
          <Link href="/merchant" className="group">
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-pine-light rounded-xl flex items-center justify-center text-pine-dark mb-6">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-[20px] font-semibold text-pine-dark tracking-tight mb-3">
                  2. Merchant Dashboard
                </h3>
                <p className="text-[16px] text-pine-gray">
                  View real-time funnel drop-offs, recovery analytics, and transaction logs.
                </p>
              </div>
              <div className="mt-8 flex items-center text-pine-dark font-medium">
                View Dashboard <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Demo 3: Pine Labs Network */}
          <Link href="/pinelabs" className="group">
            <div className="bg-white p-6 rounded-2xl border border-pine-border hover:border-pine-dark transition-all duration-200 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-pine-light rounded-xl flex items-center justify-center text-pine-dark mb-6">
                  <Building2 size={24} />
                </div>
                <h3 className="text-[20px] font-semibold text-pine-dark tracking-tight mb-3">
                  3. Pine Labs Hub
                </h3>
                <p className="text-[16px] text-pine-gray">
                  Global network-wide view, bank performance, and total recovered volume.
                </p>
              </div>
              <div className="mt-8 flex items-center text-pine-dark font-medium">
                View Network <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
          
        </div>
      </main>
    </div>
  );
}
