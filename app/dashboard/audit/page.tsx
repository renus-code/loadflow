import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuditLogViewer from '@/components/AuditLogViewer';

import * as jose from 'jose';

export default async function AuditLogsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Only allow Admins
    if (payload.role !== 'Admin') {
      redirect('/dashboard');
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="container-fluid px-0 dashboard-page-container page-transition" style={{ maxWidth: "1600px" }}>
        {/* DASHBOARD HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-1 gap-2 border-bottom pb-3 border-opacity-10 border-white">
          <div className="text-start">
            <h1
              className="display-6 text-white m-0 tracking-tight"
              style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.04em', fontWeight: 900 }}
            >
              <span className="text-gradient-emerald">Admin</span> Dashboard
            </h1>
            <p
              className="text-white mt-1 fw-bold mb-0 opacity-35 text-uppercase small"
              style={{ letterSpacing: '0.15rem', fontSize: '0.7rem' }}
            >
              {todayStr}
            </p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 px-2 pb-5">
            <AuditLogViewer />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect('/login');
  }
}
