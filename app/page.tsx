import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dashboard-soft">
      <Navbar />
      
      <main className="flex-grow-1 d-flex flex-column">
        {/* HERO SECTION */}
        <section 
          className="position-relative d-flex align-items-center overflow-hidden bg-dark" 
          style={{ 
            minHeight: '90vh', 
            backgroundImage: "url('/truck%20&%20trailer.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Soft gradient just behind the text to ensure readability, while keeping the rest of the image 100% clear */}
          <div 
            className="position-absolute w-50 h-100 z-0 d-none d-lg-block"
            style={{ 
              background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
              left: 0, top: 0
            }}
          ></div>
          <div 
            className="position-absolute w-100 h-100 z-0 d-block d-lg-none"
            style={{ 
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              left: 0, bottom: 0
            }}
          ></div>

          <div className="container position-relative z-1 py-5 mt-5">
            <div className="row align-items-center">
              <div className="col-12 col-lg-7 text-center text-lg-start pt-5 mt-4">
                <h1 className="display-4 fw-bolder text-white mb-4 lh-base animate-slide-in-left" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  <span style={{ color: '#2bdd66' }}>Driven to</span> Deliver. <br className="d-none d-lg-inline"/>
                  Trusted to <span style={{ color: '#2bdd66' }}>Lead.</span>
                </h1>
                
                <p className="lead text-light mb-5 fw-medium animate-slide-in-left delay-100" style={{ opacity: 0.9, textShadow: '0 2px 5px rgba(0,0,0,0.6)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                  Canada – U.S. Cross Border Trucking,<br/>
                  Built on Precision, Power, and Performance
                </p>
                
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mt-4 animate-slide-in-left delay-200">
                  <Link
                    href="/register"
                    className="btn btn-lg fw-bold px-5 py-3 shadow-lg d-flex align-items-center justify-content-center hover-zoom text-dark"
                    style={{ backgroundColor: '#2bdd66', border: 'none', borderRadius: '4px', fontSize: '1.15rem' }}
                  >
                    Start for free
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn btn-outline-light btn-lg fw-bold px-5 py-3 d-flex align-items-center justify-content-center gap-2 hover-zoom"
                    style={{ borderRadius: '4px', borderWidth: '2px', fontSize: '1.15rem' }}
                  >
                    View dashboard &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="py-5 border-bottom border-secondary border-opacity-10 bg-white bg-opacity-50 backdrop-blur-md">
          <div className="container py-4">
            <div className="row text-center gy-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <h3 className="display-5 fw-bold text-primary mb-2" style={{ fontFamily: 'var(--font-syne)' }}>48,000+</h3>
                <p className="text-secondary fw-medium mb-0">Loads delivered</p>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h3 className="display-5 fw-bold text-success mb-2" style={{ fontFamily: 'var(--font-syne)' }}>99.4%</h3>
                <p className="text-secondary fw-medium mb-0">On-time rate</p>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h3 className="display-5 fw-bold text-warning mb-2" style={{ fontFamily: 'var(--font-syne)' }}>3,200+</h3>
                <p className="text-secondary fw-medium mb-0">Active carriers</p>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <h3 className="display-5 fw-bold text-danger mb-2" style={{ fontFamily: 'var(--font-syne)' }}>$2.1B</h3>
                <p className="text-secondary fw-medium mb-0">Freight moved</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-5">
          <div className="container py-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark" style={{ fontFamily: 'var(--font-syne)' }}>Everything you need to manage loads</h2>
            </div>

            <div className="row g-4">
              {/* Feature 1 */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-lg rounded-4 p-4 text-start hover-zoom glass-card" style={{ transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div className="card-body p-2">
                    <div className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center mb-4 shadow" style={{ width: '64px', height: '64px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                        <path d="M1 3h15v13H1z" />
                        <path d="M16 8h4l3 3v5h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                    <h4 className="card-title fw-bold text-dark mb-3">Real-time Tracking</h4>
                    <p className="card-text text-secondary mb-0" style={{ fontSize: '1.05rem' }}>
                      Live GPS updates on every load. Know where your freight is at all times.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-lg rounded-4 p-4 text-start hover-zoom glass-card" style={{ transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div className="card-body p-2">
                     <div className="bg-success bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center mb-4 shadow" style={{ width: '64px', height: '64px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                        <line x1="12" y1="22.08" x2="12" y2="12" />
                      </svg>
                    </div>
                    <h4 className="card-title fw-bold text-dark mb-3">Smart Dispatch</h4>
                    <p className="card-text text-secondary mb-0" style={{ fontSize: '1.05rem' }}>
                      AI-powered matching connects your loads with the best available carriers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-lg rounded-4 p-4 text-start hover-zoom glass-card" style={{ transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div className="card-body p-2">
                     <div className="bg-danger bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center mb-4 shadow" style={{ width: '64px', height: '64px' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                    </div>
                    <h4 className="card-title fw-bold text-dark mb-3">Instant Payments</h4>
                    <p className="card-text text-secondary mb-0" style={{ fontSize: '1.05rem' }}>
                      Automated invoicing and same-day payments for delivered loads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="py-5 text-center border-top border-secondary border-opacity-10 bg-white bg-opacity-50 backdrop-blur-md">
          <div className="container py-5">
             <div className="row justify-content-center py-4">
               <div className="col-md-8">
                  <h2 className="display-5 fw-bold text-dark mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
                    Ready to streamline your operations?
                  </h2>
                  <p className="lead text-secondary mb-5 fw-medium">
                    Join thousands of freight professionals already using LoadFlow.
                  </p>
                  <Link
                    href="/register"
                    className="btn btn-dark btn-lg fw-semibold px-5 py-3 rounded-3 shadow-sm"
                  >
                    Create free account
                  </Link>
               </div>
             </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white bg-opacity-75 backdrop-blur-md border-top border-secondary border-opacity-10 py-4 mt-auto">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div className="fs-5 text-dark mb-2 mb-md-0 d-flex align-items-center" style={{ fontFamily: 'var(--font-syne)' }}>
            <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
          </div>
          <p className="text-secondary small mb-0 fw-medium">
            &copy; 2026 LoadFlow Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
