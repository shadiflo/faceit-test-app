import { NextRequest } from 'next/server';
import { FaceitVisa } from 'faceit-visa';
import { cookies } from 'next/headers';

const visa = new FaceitVisa({
  clientId: process.env.FACEIT_CLIENT_ID!,
  clientSecret: process.env.FACEIT_CLIENT_SECRET!,
  redirectUri: `${process.env.NEXTAUTH_URL || 'https://localhost:3000'}/api/auth/faceit/callback`
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return Response.redirect('/?error=no_code');
  }

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('faceit_code_verifier')?.value;
  
  if (!codeVerifier) {
    return Response.redirect('/?error=no_verifier');
  }

  try {
    const tokenResponse = await visa.exchangeCode(code, codeVerifier);
    if (!tokenResponse) {
      return Response.redirect('/?error=token_failed');
    }

    const user = await visa.getUserProfile(tokenResponse.access_token);
    if (!user) {
      return Response.redirect('/?error=profile_failed');
    }

    // Create response and store user data
    const response = Response.redirect('/');
    
    // Store user data in httpOnly cookie
    response.cookies.set('faceit_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    });

    // Store access token if needed (optional)
    response.cookies.set('faceit_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    });

    // Clear code verifier
    response.cookies.delete('faceit_code_verifier');

    return response;
  } catch (error) {
    console.error('FACEIT auth error:', error);
    return Response.redirect('/?error=auth_failed');
  }
}