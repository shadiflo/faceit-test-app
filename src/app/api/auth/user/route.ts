import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('faceit_user');
  
  if (!userCookie) {
    return Response.json({ user: null });
  }

  try {
    const user = JSON.parse(userCookie.value);
    return Response.json({ user });
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return Response.json({ user: null });
  }
}