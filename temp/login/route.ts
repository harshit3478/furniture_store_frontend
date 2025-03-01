// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    // Find user in PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate custom token for Firebase Authentication
    const customToken = await adminAuth.createCustomToken(user.firebaseUid);

    return NextResponse.json({ customToken });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
