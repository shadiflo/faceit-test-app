import { NextRequest } from 'next/server';
import { FaceitVisa } from 'faceit-visa';
import { cookies } from 'next/headers';

const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID!,
  clientSecret: process.env.FACEIT_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/api/auth/callback/faceit`
});

export async function GET() {
  const { url, codeVerifier } = visa.getAuthUrl();
  
  // Store code verifier in cookies for the callback
  const cookieStore = await cookies();
  cookieStore.set('faceit_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10 // 10 minutes
  });
  
  return Response.redirect(url);
}