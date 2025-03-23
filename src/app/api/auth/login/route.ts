import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createToken, setUserCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return new NextResponse('نام کاربری یا رمز عبور اشتباه است', { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return new NextResponse('نام کاربری یا رمز عبور اشتباه است', { status: 401 });
    }

    const token = await createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    await setUserCookie(token);

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return new NextResponse('خطای سرور', { status: 500 });
  }
}