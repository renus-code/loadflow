import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center p-6 py-24 lg:py-32 text-center bg-[#111827] overflow-hidden">
          {/* Diagonal lines pattern overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 16px)"
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="mb-10 inline-flex items-center rounded-full border border-slate-600/50 bg-slate-800/20 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
                Freight Management Platform
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-[88px] font-extrabold text-white tracking-tight mb-8 leading-[1.05] font-syne drop-shadow-sm">
              <span className="block">Move freight.</span>
              <span className="block">Move faster.</span>
            </h1>
            
            <p className="max-w-2xl text-[19px] text-slate-300 mb-12 leading-relaxed font-medium">
              End-to-end load management for carriers, brokers, and shippers. Real-time visibility from pickup to delivery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/register"
                className="bg-white text-[#0f172a] font-bold px-8 py-3.5 rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
              >
                Start for free
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 rounded-xl border border-slate-600 font-semibold text-white transition-all hover:bg-slate-800/50 hover:border-slate-500 flex items-center justify-center gap-2 group"
              >
                View dashboard
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="bg-white py-20 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            <div>
              <h3 className="text-4xl font-syne font-bold text-[#0f172a] mb-2">48,000+</h3>
              <p className="text-slate-500 font-medium">Loads delivered</p>
            </div>
            <div>
              <h3 className="text-4xl font-syne font-bold text-[#0f172a] mb-2">99.4%</h3>
              <p className="text-slate-500 font-medium">On-time rate</p>
            </div>
            <div>
              <h3 className="text-4xl font-syne font-bold text-[#0f172a] mb-2">3,200+</h3>
              <p className="text-slate-500 font-medium">Active carriers</p>
            </div>
            <div>
              <h3 className="text-4xl font-syne font-bold text-[#0f172a] mb-2">$2.1B</h3>
              <p className="text-slate-500 font-medium">Freight moved</p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-[#f8fafc] py-24 flex-1">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-syne font-bold text-[#0f172a]">Everything you need to manage loads</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M1 3h15v13H1z" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">Real-time Tracking</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">
                  Live GPS updates on every load. Know where your freight is at all times.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M1 3h15v13H1z" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">Smart Dispatch</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">
                  AI-powered matching connects your loads with the best available carriers.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center text-white mb-6">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <path d="M1 3h15v13H1z" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">Instant Payments</h3>
                <p className="text-slate-500 leading-relaxed text-[15px]">
                  Automated invoicing and same-day payments for delivered loads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="bg-white py-24 text-center border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-syne font-bold text-[#0f172a] mb-6">
              Ready to streamline your operations?
            </h2>
            <p className="text-xl text-slate-500 mb-10 font-medium">
              Join thousands of freight professionals already using LoadFlow.
            </p>
            <Link
              href="/register"
              className="inline-flex bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium px-8 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-[#0f172a] font-bold font-syne text-xl mb-4 md:mb-0">
            LoadFlow
          </div>
          <p className="text-slate-500 text-sm">
            &copy; 2026 LoadFlow Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
