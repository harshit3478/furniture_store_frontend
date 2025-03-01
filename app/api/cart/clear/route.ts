import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    const user = await adminAuth.verifyIdToken(
      request.headers.get("Authorization")?.split("Bearer ")[1] || ""
    );
    const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(user.uid) },
    });
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
    return NextResponse.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}