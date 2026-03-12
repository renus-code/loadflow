import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-white w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-[80px] flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
              <path d="M1 3h15v13H1z" />
              <path d="M16 8h4l3 3v5h-7V8z" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="text-[22px] font-bold text-[#0f172a] tracking-tight font-syne">
            LoadFlow
          </span>
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-[15px] font-medium text-slate-500 hover:text-[#0f172a] transition-colors">
            Features
          </Link>
          <Link href="#" className="text-[15px] font-medium text-slate-500 hover:text-[#0f172a] transition-colors">
            Pricing
          </Link>
          <Link href="#" className="text-[15px] font-medium text-slate-500 hover:text-[#0f172a] transition-colors">
            About
          </Link>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-[15px] font-semibold text-slate-600 hover:text-[#0f172a] transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-[15px] font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            Get started
          </Link>
        </div>

      </div>
    </nav>
  );
}
