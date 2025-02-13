// app/api/vendor/register/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password, address } = await request.json();

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { vendor: true });

    const vendor = await prisma.vendor.create({
      data: {
        id: userRecord.uid,
        name,
        email,
        address,
      },
    });

    return NextResponse.json({ message: 'Vendor registered successfully', vendor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
