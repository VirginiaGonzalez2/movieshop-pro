import { verifyJwt } from './auth-utils';
import { cookies } from 'next/headers';

export function getSession() {
  return cookies().then(cookieStore => {
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const user = verifyJwt(token);
    return user || null;
  });
}

export function isAdminRole(role: string) {
  return role === 'admin';
}
