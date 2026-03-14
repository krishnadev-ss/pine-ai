import Link from "next/link";
import { ArrowRight, ShoppingCart, BarChart3, Building2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="text-emerald-600 dark:text-emerald-400">PayIntent</span>
          <br /> Intelligent Checkout Recovery
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Every Indian payment gateway tells you what failed. PayIntent tells you why it failed, calls your customer in their language, fixes it on the call, and shows you the revenue you got back.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Demo 1: The Checkout */}
          <Link href="/checkout" className="group">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 hover:shadow-md transition-all h-full flex flex-col items-center text-center space-y-4 cursor-pointer">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-xl font-bold">1. Try the Checkout</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-grow">
                Experience the conversational checkout and drop-off tracking in action.
              </p>
              <ArrowRight className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Demo 2: Merchant Dashboard */}
          <Link href="/merchant" className="group">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 hover:shadow-md transition-all h-full flex flex-col items-center text-center space-y-4 cursor-pointer">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold">2. Merchant Dashboard</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-grow">
                View real-time funnel drop-offs, recovery analytics, and transaction logs.
              </p>
              <ArrowRight className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>

          {/* Demo 3: Pine Labs Network */}
          <Link href="/pinelabs" className="group">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:border-violet-500 hover:shadow-md transition-all h-full flex flex-col items-center text-center space-y-4 cursor-pointer">
              <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                <Building2 size={32} />
              </div>
              <h3 className="text-xl font-bold">3. Pine Labs Hub</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-grow">
                Global network-wide view, bank performance, and total recovered volume.
              </p>
              <ArrowRight className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
