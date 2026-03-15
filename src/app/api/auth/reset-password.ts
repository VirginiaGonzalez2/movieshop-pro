import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  const { email, newPassword } = await req.json();
  if (!email || !newPassword) {
    return NextResponse.json({ error: 'Email and new password required' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });
  return NextResponse.json({ success: true });
}
