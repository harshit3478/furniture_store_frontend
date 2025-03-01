import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    // Extract ID from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Get the last segment (e.g., "123")
    if (!id) {
      return NextResponse.json(
        { error: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    // Parse request body
    const { quantity } = await request.json();
    if (typeof quantity !== "number" || isNaN(quantity)) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    // Fetch user by Firebase UID
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert id to integer (since CartItem.id is Int in your schema)
    const cartItemId = parseInt(id, 10);
    if (isNaN(cartItemId)) {
      return NextResponse.json(
        { error: "Invalid cart item ID" },
        { status: 400 }
      );
    }

    // Ensure the cart item belongs to the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Update or delete based on quantity
    if (quantity < 1) {
      await prisma.cartItem.delete({
        where: {
          id: cartItemId,
          cartId: cart.id, // Verify ownership
        },
      });
    } else {
      await prisma.cartItem.update({
        where: {
          id: cartItemId,
          cartId: cart.id, // Verify ownership
        },
        data: { quantity },
      });
    }

    return NextResponse.json({ message: "Quantity updated" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}