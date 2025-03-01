import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop(); // Get the last segment (e.g., "123")
        if (!id) {
            return NextResponse.json(
                { error: "Invalid cart item ID" },
                { status: 400 }
            );
        }
        // Extract and verify Firebase token
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Fetch user by Firebase UID (assuming firebaseUid links to Firebase)
        const user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }, // Use firebaseUid instead of email
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Convert params.id (string) to Int for Prisma
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

        // Delete the cart item by ID
        await prisma.cartItem.delete({
            where: {
                id: cartItemId,
                cartId: cart.id, // Ensure it belongs to the user's cart
            },
        });

        return NextResponse.json({ message: "Removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        return NextResponse.json(
            { error: "Failed to remove from cart" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect(); // Clean up Prisma connection
    }
}