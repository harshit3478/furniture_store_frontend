import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Extract ID from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // Get the last segment of the path (e.g., "abc123")
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Fetch product by ID
    const product = await prisma.product.findUnique({
      where: { id }, // id is a string
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("Error in GET /api/products/[id]:", e);
    return NextResponse.json(
      { success: false, message: (e as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}