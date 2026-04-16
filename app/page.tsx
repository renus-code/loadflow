import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";

// Dynamically load heavy Bootstrap Modals only when requested, saving ~40KB of unused initial JS
const RequestDemoModal = dynamic(() => import("@/components/RequestDemoModal"));
const CheckPricesModal = dynamic(() => import("@/components/CheckPricesModal"));

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dashboard-soft scroll-smooth">
      <Navbar />

      <main className="flex-grow-1 d-flex flex-column">
        {/* HERO SECTION */}
        <section
          className="position-relative d-flex align-items-center overflow-hidden bg-dark"
          style={{ minHeight: "90vh" }}
        >
          {/* LCP Optimized Background Image */}
          <Image
            src="/truck%20&%20trailer.png"
            alt="Logistics Transport Truck"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
          />

          {/* Core Dark Gradient Overlay (Replaces the background-image linear-gradient) */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100" 
            style={{ backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1 }}
          ></div>

          {/* Left-Side Fading Gradient Overlay (Desktop) */}
          <div
            className="position-absolute w-50 h-100 d-none d-lg-block"
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)",
              left: 0,
              top: 0,
              zIndex: 1
            }}
          ></div>
          
          {/* Bottom Fading Gradient Overlay (Mobile) */}
          <div
            className="position-absolute w-100 h-100 d-block d-lg-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              left: 0,
              bottom: 0,
              zIndex: 1
            }}
          ></div>

          <div className="container position-relative py-5 mt-5" style={{ zIndex: 2 }}>
            <div className="row align-items-center">
              <div className="col-12 col-lg-7 text-center text-lg-start pt-5 mt-4">
                <h1
                  className="display-4 fw-bolder text-white mb-4 lh-base animate-slide-in-left"
                  style={{
                    fontFamily: "var(--font-syne)",
                    letterSpacing: "-0.02em",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  <span style={{ color: "#2bdd66" }}>Driven to</span> Deliver.{" "}
                  <br className="d-none d-lg-inline" />
                  Trusted to <span style={{ color: "#2bdd66" }}>Lead.</span>
                </h1>

                <p
                  className="lead text-white mb-5 fw-bold animate-slide-in-left delay-100"
                  style={{
                    textShadow: "0 4px 12px rgba(0,0,0,0.9)",
                    fontSize: "1.35rem",
                    maxWidth: "600px",
                  }}
                >
                  Canada – U.S. Cross Border Trucking,
                  <br />
                  Built on Precision, Power, and Performance
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mt-4 animate-slide-in-left delay-200">
                  <Link
                    href="/register"
                    className="btn btn-lg fw-bold px-5 py-3 shadow-lg d-flex align-items-center justify-content-center hover-zoom text-dark"
                    style={{
                      backgroundColor: "#2bdd66",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "1.15rem",
                    }}
                  >
                    Get Started Now
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn btn-outline-light btn-lg fw-bold px-5 py-3 d-flex align-items-center justify-content-center gap-2 hover-zoom"
                    style={{
                      borderRadius: "4px",
                      borderWidth: "2px",
                      fontSize: "1.15rem",
                    }}
                  >
                    View dashboard &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HYPER-PREMIUM STATISTICS SECTION */}
        <section className="py-5 bg-white position-relative overflow-hidden">
          {/* Glowing Top & Bottom Gradient Borders */}
          <div className="position-absolute top-0 start-0 w-100 z-2" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(43,221,102,0.5) 50%, transparent 100%)", boxShadow: "0 2px 10px rgba(43,221,102,0.3)" }}></div>
          <div className="position-absolute bottom-0 start-0 w-100 z-2" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(43,221,102,0.5) 50%, transparent 100%)", boxShadow: "0 -2px 10px rgba(43,221,102,0.3)" }}></div>
          <div className="container py-4 position-relative z-1">
            <div className="row text-center g-4">
              {/* Stat 1: Multi-Stop Loads */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="p-4 rounded-4 glass-card-premium h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="icon-orb glow-primary mb-3">
                    <i className="bi bi-truck text-white fs-3"></i>
                  </div>
                  <div className="stat-value-premium display-6 mb-1 fw-bold text-dark">
                    5000+
                  </div>
                  <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-0">
                    Multi-Stop Loads
                  </p>
                </div>
              </div>
              {/* Stat 2: Sync Rate */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="p-4 rounded-4 glass-card-premium h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="icon-orb glow-success mb-3">
                    <i className="bi bi-arrow-repeat text-white fs-3"></i>
                  </div>
                  <div className="stat-value-premium display-6 mb-1 fw-bold text-dark">
                    99.9%
                  </div>
                  <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-0">
                    Board Sync Rate
                  </p>
                </div>
              </div>
              {/* Stat 3: Verified Drivers */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="p-4 rounded-4 glass-card-premium h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="icon-orb glow-warning mb-3">
                    <i className="bi bi-person-check text-white fs-3"></i>
                  </div>
                  <div className="stat-value-premium display-6 mb-1 fw-bold text-dark">
                    30
                  </div>
                  <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-0">
                    Certified Drivers
                  </p>
                </div>
              </div>
              {/* Stat 4: Digital POD Value */}
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="p-4 rounded-4 glass-card-premium h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="icon-orb glow-danger mb-3">
                    <i className="bi bi-file-earmark-check text-white fs-3"></i>
                  </div>
                  <div className="stat-value-premium display-6 mb-1 fw-bold text-dark">
                    $1.2B
                  </div>
                  <p className="text-secondary small fw-bold text-uppercase tracking-wider mb-0">
                    Digital POD Value
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HYPER-PREMIUM FEATURES SECTION */}
        <section id="features" className="py-5 bg-white position-relative overflow-hidden">
          {/* Glowing Bottom Gradient Border */}
          <div className="position-absolute bottom-0 start-0 w-100 z-2" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(43,221,102,0.5) 50%, transparent 100%)", boxShadow: "0 -2px 10px rgba(43,221,102,0.3)" }}></div>
          <div className="container py-5 position-relative z-1">
            <div className="text-center mb-5 max-w-700 mx-auto">
              <p
                className="text-success fw-bold text-uppercase tracking-widest mb-3"
                style={{ fontSize: "0.9rem", margin: 0 }}
              >
                Tailored Features
              </p>
              <h2
                className="display-5 fw-bold text-dark mb-4"
                style={{
                  fontFamily: "var(--font-syne)",
                  letterSpacing: "-0.01em",
                }}
              >
                Everything you need to lead.
              </h2>
              <p className="lead text-secondary">
                Built for the high-stakes demands of North American freight
                movement.
              </p>
            </div>

            <div className="row g-4 pt-4">
              {/* Feature 1: Multi-Stop Dispatching */}
              <div className="col-md-4">
                <div className="card h-100 border-0 rounded-5 p-4 text-start glass-card-premium">
                  <div className="card-body p-2">
                    <div className="icon-orb glow-primary mb-4 shadow-primary-glow">
                      <i className="bi bi-layers-half text-white fs-2"></i>
                    </div>
                    <h3
                      className="card-title fw-bold text-dark mb-3 h4"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      Multi-Stop Dispatching
                    </h3>
                    <p
                      className="card-text text-secondary mb-0"
                      style={{ fontSize: "1.05rem", lineHeight: "1.7" }}
                    >
                      Effortless management of complex freight with unlimited
                      pickup and delivery stations per load. Scale your routes
                      without limits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Real-Time Sync */}
              <div className="col-md-4">
                <div className="card h-100 border-0 rounded-5 p-4 text-start glass-card-premium">
                  <div className="card-body p-2">
                    <div className="icon-orb glow-success mb-4 shadow-success-glow">
                      <i className="bi bi-arrow-repeat text-white fs-2"></i>
                    </div>
                    <h3
                      className="card-title fw-bold text-dark mb-3 h4"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      Real-Time Board Sync
                    </h3>
                    <p
                      className="card-text text-secondary mb-0"
                      style={{ fontSize: "1.05rem", lineHeight: "1.7" }}
                    >
                      High-velocity data synchronization across your entire
                      fleet. Instant dashboard updates keep dispatchers and
                      drivers perfectly in sync.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Digital POD */}
              <div className="col-md-4">
                <div className="card h-100 border-0 rounded-5 p-4 text-start glass-card-premium">
                  <div className="card-body p-2">
                    <div className="icon-orb glow-info mb-4 shadow-info-glow">
                      <i className="bi bi-file-earmark-check text-white fs-2"></i>
                    </div>
                    <h3
                      className="card-title fw-bold text-dark mb-3 h4"
                      style={{ fontFamily: "var(--font-syne)" }}
                    >
                      Digital POD Control
                    </h3>
                    <p
                      className="card-text text-secondary mb-0"
                      style={{ fontSize: "1.05rem", lineHeight: "1.7" }}
                    >
                      Secure document management with instant Proof of Delivery
                      (POD) uploads and verification. Accelerate your billing
                      cycle from the road.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HYPER-PREMIUM SOLUTIONS SECTION */}
        <section
          id="solutions"
          className="py-5 bg-dark text-white position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a0f1e 0%, #050814 100%)",
          }}
        >
          {/* Glowing Bottom Gradient Border */}
          <div className="position-absolute bottom-0 start-0 w-100 z-2" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(43,221,102,0.5) 50%, transparent 100%)", boxShadow: "0 -2px 10px rgba(43,221,102,0.3)" }}></div>
          {/* Animated Nebula Glows */}
          <div className="position-absolute top-0 start-0 w-100 h-100 z-0 opacity-50">
            <div
              className="position-absolute top-0 start-0 w-50 h-50 rounded-circle"
              style={{
                background:
                  "radial-gradient(circle, rgba(43, 221, 102, 0.15) 0%, transparent 70%)",
                transform: "translate(-20%, -20%)",
                filter: "blur(100px)",
              }}
            ></div>
            <div
              className="position-absolute bottom-0 end-0 w-50 h-50 rounded-circle"
              style={{
                background:
                  "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
                transform: "translate(20%, 20%)",
                filter: "blur(100px)",
              }}
            ></div>
          </div>

          <div className="container py-5 position-relative z-1">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-success bg-opacity-10 border border-success border-opacity-20 mb-4">
                  <span
                    className="bg-success rounded-circle"
                    style={{
                      width: "8px",
                      height: "8px",
                      boxShadow: "0 0 10px var(--accent-emerald)",
                    }}
                  ></span>
                  <p
                    className="text-success fw-bold text-uppercase small tracking-widest mb-0"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Global Infrastructure
                  </p>
                </div>

                <h2
                  className="display-4 fw-bold mb-4 pe-lg-5"
                  style={{ fontFamily: "var(--font-syne)", lineHeight: "1.2" }}
                >
                  Tailored for <span style={{ color: "#2bdd66" }}>Freight</span>{" "}
                  Momentum
                </h2>

                <p
                  className="lead text-white text-opacity-70 mb-5 pe-lg-5"
                  style={{ fontSize: "1.25rem" }}
                >
                  We provide the mission-critical infrastructure for modern load
                  management, from multi-stop routing to secure digital
                  proof-of-delivery.
                </p>

                <div className="d-flex flex-column gap-4">
                  <div
                    className="d-flex align-items-start gap-4 p-4 rounded-4 border border-white border-opacity-5 hover-float transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="shrink-0 bg-success bg-opacity-10 rounded-3 p-3 border border-success border-opacity-20 shadow-glow-emerald">
                      <i className="bi bi-diagram-3 text-success fs-3"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-2 h5">
                        Infinite Route Complexity
                      </h3>
                      <p className="text-white text-opacity-60 mb-0 small">
                        Scale your operations with support for complex multi-leg
                        journeys and unlimited stop-off segments.
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-start gap-4 p-4 rounded-4 border border-white border-opacity-5 hover-float transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="shrink-0 bg-info bg-opacity-10 rounded-3 p-3 border border-info border-opacity-20 text-info">
                      <i className="bi bi-map fs-3"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-2 text-white h5">
                        Intelligent Region Mapping
                      </h3>
                      <p className="text-white text-opacity-60 mb-0 small">
                        Precision targeting for North American freight with
                        dynamic city and province-specific database
                        intelligence.
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-start gap-4 p-4 rounded-4 border border-white border-opacity-5 hover-float transition-all"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="shrink-0 bg-warning bg-opacity-10 rounded-3 p-3 border border-warning border-opacity-20 text-warning">
                      <i className="bi bi-people fs-3"></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-2 text-white h5">
                        Role-Based Freight Control
                      </h3>
                      <p className="text-white text-opacity-60 mb-0 small">
                        Unified command structure with dedicated Admin,
                        Dispatcher, and Driver permission hierarchies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="position-relative">
                  <div
                    className="position-absolute translate-middle top-50 start-50 w-75 h-75 bg-success bg-opacity-20 rounded-circle z-0"
                    style={{ filter: "blur(100px)" }}
                  ></div>

                  <div className="rounded-5 overflow-hidden shadow-2xl border border-white border-opacity-20 z-1 position-relative hover-tilt ripple-effect">
                    <Image
                      src="/truck%20&%20trailer.png"
                      alt="Logistics Solution"
                      width={800}
                      height={600}
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 800px"
                      className="img-fluid w-100 h-auto"
                      style={{
                        transform: "scale(1.1)",
                        filter: "brightness(0.9) contrast(1.1)",
                      }}
                    />


                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DISPATCHER PRO HORIZONTAL BANNER */}
        <section
          id="pricing"
          className="py-5 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #02180e 0%, #000000 100%)",
          }}
        >
          {/* Glowing Bottom Gradient Border */}
          <div className="position-absolute bottom-0 start-0 w-100" style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(43,221,102,0.5) 50%, transparent 100%)", boxShadow: "0 -2px 10px rgba(43,221,102,0.3)" }}></div>

          {/* Subtle background texture & glows */}
          <div className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: "800px", height: "500px", background: "radial-gradient(ellipse, rgba(43,221,102,0.12) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>
          <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", zIndex: 0 }}></div>

          <div className="container position-relative z-1 py-5">
            <div className="row align-items-center justify-content-between g-5">

              {/* Left Column: Title & Subtitle */}
              <div className="col-lg-4 text-center text-lg-start pe-lg-3 position-relative z-1">
                <span className="badge bg-success bg-opacity-25 text-success fw-bold px-3 py-2 rounded-pill border border-success border-opacity-50 mb-4 d-inline-flex align-items-center gap-2" style={{ letterSpacing: "1px", fontSize: "0.75rem", boxShadow: "0 0 20px rgba(43, 221, 102, 0.2)" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2bdd66", display: "inline-block" }}></span>
                  INDUSTRY STANDARD
                </span>
                <h2 className="fw-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)", fontSize: "3rem", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Dispatcher Pro</h2>
                <p className="text-white text-opacity-50 mb-0" style={{ fontSize: "1.1rem" }}>No hidden fees. Direct, high-octane logistics power.</p>
              </div>

              {/* Middle Column: Features */}
              <div className="col-lg-5 p-lg-5 border-start border-end border-white border-opacity-10 my-4 my-lg-0 position-relative z-1">
                <div className="row g-4">
                  <div className="col-sm-6 d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style={{ width: "32px", height: "32px" }}>
                      <i className="bi bi-check-lg text-success fs-5"></i>
                    </div>
                    <span className="text-white fw-medium text-opacity-90 small pb-0 mb-0">Unlimited Dispatch Board</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style={{ width: "32px", height: "32px" }}>
                      <i className="bi bi-check-lg text-success fs-5"></i>
                    </div>
                    <span className="text-white fw-medium text-opacity-90 small pb-0 mb-0">Real-Time Board Sync</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style={{ width: "32px", height: "32px" }}>
                      <i className="bi bi-check-lg text-success fs-5"></i>
                    </div>
                    <span className="text-white fw-medium text-opacity-90 small pb-0 mb-0">Digital POD Management</span>
                  </div>
                  <div className="col-sm-6 d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10" style={{ width: "32px", height: "32px" }}>
                      <i className="bi bi-check-lg text-success fs-5"></i>
                    </div>
                    <span className="text-white fw-medium text-opacity-90 small pb-0 mb-0">Priority Fleet Support</span>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA */}
              <div className="col-lg-3 text-center text-lg-end ps-lg-4 d-flex flex-column gap-3 justify-content-center position-relative z-1">
                <button 
                  className="btn w-100 fw-bold py-3 rounded-pill shadow-success-glow border-0 d-flex justify-content-center align-items-center gap-2 hover-zoom"
                  style={{ backgroundColor: "#2bdd66", color: "#000", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}
                  data-bs-toggle="modal" 
                  data-bs-target="#requestDemoModal"
                >
                  Request Demo 
                  <span className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "26px", height: "26px", backgroundColor: "rgba(0, 0, 0, 0.15)", marginLeft: "4px" }}>
                    <i className="bi bi-arrow-right" style={{ fontSize: "1rem" }}></i>
                  </span>
                </button>
                <button 
                  className="btn w-100 fw-bold py-2 rounded-pill ghost-btn text-white"
                  style={{ fontSize: "0.9rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  data-bs-toggle="modal"
                  data-bs-target="#checkPricesModal"
                >
                  Check Prices
                </button>
              </div>

            </div>
          </div>
        </section>
        {/* MODALS */}
        <RequestDemoModal />
        <CheckPricesModal />
      </main>

      {/* FOOTER */}
      <footer className="position-relative" style={{ background: "linear-gradient(180deg, #080c14 0%, #0a0f1e 100%)" }}>
        <div className="container px-4 py-5">
          <div className="row g-5">
            {/* Brand */}
            <div className="col-lg-5">
              <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
                <div className="rounded overflow-hidden d-flex align-items-center justify-content-center shadow-sm" style={{ width: 38, height: 38, flexShrink: 0 }}>
                  <Image src="/truck-logo.png" alt="LoadFlow Logo" width={40} height={40} sizes="40px" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <span className="fs-4 fw-bold d-flex align-items-center" style={{ fontFamily: "var(--font-syne)" }}>
                  <span className="brand-text-load">Load</span><span className="brand-text-flow">Flow</span>
                </span>
              </Link>
              <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", maxWidth: 320, lineHeight: 1.7 }}>
                The enterprise dispatch platform built for modern trucking teams. Secure, fast, and built to scale across every border.
              </p>
              <div className="d-flex gap-2">
                {["bi-twitter-x", "bi-linkedin", "bi-github"].map((icon) => (
                  <a key={icon} href="#" aria-label={`Follow us on ${icon}`} className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.9rem" }}>
                    <i className={`bi ${icon}`} />
                  </a>
                ))}
              </div>
            </div>
            {/* Platform */}
            <div className="col-6 col-md-3 col-lg-2">
              <p className="fw-semibold mb-4 text-uppercase" style={{ color: "#10b981", fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 700 }}>Platform</p>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                {[{ label: "Features", href: "#features" }, { label: "Solutions", href: "#solutions" }, { label: "Pricing", href: "#pricing" }, { label: "Dashboard", href: "/dashboard" }].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-decoration-none" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div className="col-6 col-md-3 col-lg-2">
              <p className="fw-semibold mb-4 text-uppercase" style={{ color: "#10b981", fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 700 }}>Company</p>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                {[{ label: "Contact", href: "/contact" }, { label: "Register", href: "/register" }, { label: "Sign In", href: "/login" }].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="text-decoration-none" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>{label}</Link></li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div className="col-lg-3">
              <p className="fw-semibold mb-4 text-uppercase" style={{ color: "#10b981", fontSize: "0.7rem", letterSpacing: "0.1em", fontWeight: 700 }}>Get In Touch</p>
              <div className="d-flex flex-column gap-3">
                {[{ icon: "bi-envelope", text: "support@loadflow.ca" }, { icon: "bi-telephone", text: "+1 (437) 383-1996" }, { icon: "bi-geo-alt", text: "Toronto, Ontario, Canada" }].map(({ icon, text }) => (
                  <div key={text} className="d-flex align-items-center gap-2">
                    <i className={`bi ${icon}`} style={{ color: "#10b981", fontSize: "0.85rem", flexShrink: 0 }} />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>&copy; 2026 LoadFlow Inc. · CargoConnect Team · All rights reserved.</p>
            <p className="mb-0" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>Precision. Power. Performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
