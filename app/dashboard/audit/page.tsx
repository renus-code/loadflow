import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import AuditLogViewer from '@/components/AuditLogViewer';
import Navbar from '@/components/Navbar';
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

    return (
      <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden bg-dark position-relative">
        <Navbar title="Audit & Security Logs" subtitle="Platform Activity Monitoring" userName={payload.name as string} />
        <div className="flex-grow-1 overflow-y-auto custom-scrollbar p-3 p-md-4 p-xl-5 position-relative z-1" style={{ scrollBehavior: 'smooth' }}>
          <div className="container-fluid max-w-7xl mx-auto px-0 h-100">
            <AuditLogViewer />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect('/login');
  }
}
