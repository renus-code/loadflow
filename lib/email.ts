import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface InvitationEmailProps {
  to: string;
  name: string;
  role: string;
}

export async function sendInvitationEmail({ to, name, role }: InvitationEmailProps) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('GMAIL_USER or GMAIL_APP_PASSWORD is not defined in environment variables.');
    return { error: 'Email service not configured' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const registerUrl = `${appUrl}/register?email=${encodeURIComponent(to)}`;

  try {
    const info = await transporter.sendMail({
      from: `"LoadFlow Dispatch" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: `Invitation to join LoadFlow as a ${role}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #060e20; color: #ffffff; padding: 40px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2bdd66; margin: 0; font-size: 28px; letter-spacing: -1px; font-weight: 800;">Load<span style="color: #ffffff;">Flow</span></h1>
            <p style="opacity: 0.6; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">Premium Logistics Management</p>
          </div>
          
          <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
            <h2 style="margin-top: 0; font-size: 22px; font-weight: 700;">Hello, ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.6; opacity: 0.8;">
              You have been officially invited to join the <strong>LoadFlow</strong> platform as a <strong>${role}</strong>.
            </p>
            <p style="font-size: 16px; line-height: 1.6; opacity: 0.8;">
              To complete your registration and set up your secure account, please click the button below:
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${registerUrl}" style="background-color: #2bdd66; color: #000000; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(43, 221, 102, 0.2);">
                Complete Registration
              </a>
            </div>
            
            <p style="font-size: 14px; opacity: 0.5; font-style: italic;">
              If the button doesn't work, copy and paste this link into your browser:<br/>
              <span style="color: #2bdd66;">${registerUrl}</span>
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; opacity: 0.4;">
            <p>© 2026 LoadFlow Logistics. All rights reserved.</p>
            <p>This is an automated system email. Please do not reply.</p>
          </div>
        </div>
      `,
    });

    return { data: info };
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return { error };
  }
}
