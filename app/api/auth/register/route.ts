// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";


const prisma = new PrismaClient();

export async function POST(request: Request) {

  try {
    
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    
    const idToken = authHeader.split("Bearer ")[1];
    const firebaseUser = await adminAuth.verifyIdToken(idToken);

    const { displayName, photoURL } = await request.json();


    // check if the email is already registered
    const userExists = await prisma.user.findFirst({
      where: { email: firebaseUser.email },
    });
    if (userExists) {
        return NextResponse.json({ message: "User already registered" }, { status: 200 });
        }
    console.log("name : ", displayName, "photourl : " , photoURL, "firebaseUid:", firebaseUser.uid , " email : " , firebaseUser.email)
    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        email : firebaseUser?.email || "",
        firebaseUid:firebaseUser.uid,
        name : displayName|| "",
        photoUrl : photoURL || "",
      },
    });
    console.log("user registered is : " , user)
    return NextResponse.json({ message: "User registered successfully", userId: user.id }, {status : 201});
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
