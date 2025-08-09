import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear auth cookies
  cookieStore.delete('faceit_user');
  cookieStore.delete('faceit_token');
  
  return Response.json({ success: true });
}