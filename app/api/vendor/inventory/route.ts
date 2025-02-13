// app/api/vendor/inventory/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyVendor } from '@/lib/auth';

const prisma = new PrismaClient();

import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  const vendorId = await verifyVendor(request);
  if (!vendorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity } = await request.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId, vendorId },
      data: { quantity },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
