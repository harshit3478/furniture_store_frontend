import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query')?.toLowerCase() || '';
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get('sortBy') || 'name';

  // Log incoming parameters
  console.log('Received search parameters:', {
    query,
    categories,
    minPrice,
    maxPrice,
    sortBy,
  });

  try {
    const filters: Prisma.ProductWhereInput = {
      name: query ? { contains: query, mode: 'insensitive' } : undefined,
      category: categories.length > 0 ? { in: categories } : undefined,
      price: { gte: minPrice, lte: maxPrice },
    };

    // Log Prisma filter before querying
    console.log('Prisma filter:', JSON.stringify(filters, null, 2));

    const products = await prisma.product.findMany({
      where: filters,
      orderBy: 
        sortBy === 'price_asc' ? { price: 'asc' } :
        sortBy === 'price_desc' ? { price: 'desc' } :
        { name: 'asc' },
    });

    // Log the number of products found
    console.log(`Found ${products.length} products`);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}