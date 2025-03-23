import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new NextResponse('این نام کاربری قبلاً استفاده شده است', { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      id: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse('خطای سرور', { status: 500 });
  }
}