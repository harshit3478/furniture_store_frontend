import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { productId } = await request.json();
  try {
    const token = request.headers.get("Authorization")?.split("Bearer ")[1] || "";
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Find or create user
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    });

   // if user is not found return error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 409 });
    }
    // Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Add item to cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: 1 },
      });
    }

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
