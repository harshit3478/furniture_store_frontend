// app/api/vendor/register/route.ts
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, email, address, uid } = await request.json();
    console.log(name, email, address, uid);
  
    try {
     
      await adminAuth.setCustomUserClaims(uid, { vendor: true });
  
      const vendor = await prisma.vendor.create({
        data: {
          id: uid,
          name,
          email,
          address,
        },
      });
  
      console.log(vendor);
      return NextResponse.json({ message: 'Vendor registered successfully', vendor }, { status: 201 });
    } catch (error) {
      console.error('Server-side registration error:', error);
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }
  
