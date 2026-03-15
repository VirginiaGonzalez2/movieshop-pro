import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth-utils';

export function withAuth(handler: Function, allowedRoles: string[] = ['user', 'admin']) {
  return async (req: NextRequest, ...args: any[]) => {
    const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.replace('Bearer ', '');
    const user = token ? verifyJwt(token) : null;
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    req.user = user;
    return handler(req, ...args);
  };
}

// Ejemplo de uso en un endpoint:
// import { withAuth } from '@/middleware/auth';
// export const GET = withAuth(async (req) => { ... }, ['admin']);
