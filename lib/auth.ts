// lib/auth.ts
import { NextRequest } from 'next/server';
import { adminAuth } from './firebase-admin';

export async function verifyVendor(request: NextRequest): Promise<string | null> {
    // console.log("request in verifyVendor", request);
  const authHeader = request.headers.get('authorization');
//   console.log("authHeader", authHeader);
  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
//   console.log("token", token);
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    // console.log("decodedToken", decodedToken);
    if (!decodedToken.vendor) {
      return null;
    }
    return decodedToken.uid;
  } catch (error) {
    console.error('Server-side verification error:', error);
    return null;
  }
}
