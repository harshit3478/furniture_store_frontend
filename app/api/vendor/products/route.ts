// app/api/vendor/products/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyVendor } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  const vendorId = await verifyVendor(request);
  if (!vendorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    
    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataURI = `data:${imageFile.type};base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'furniture-rental'
    });

    // Create product in PostgreSQL using Prisma
    const product = await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        price: Number(formData.get('price')),
        category: formData.get('category') as string,
        rating: Number(formData.get('rating')),
        description: formData.get('description') as string,
        image: uploadResponse.secure_url,
        vendorId: vendorId, // Add the vendorId here
      }
    });
    
    return NextResponse.json({ 
      success: true,
      product
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  const vendorId = await verifyVendor(request);
  console.log("vendorId", vendorId);
  if (!vendorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await prisma.product.findMany({ where: { vendorId } });
  return NextResponse.json(products);
}


export async function PUT(request: NextRequest) {
  const vendorId = await verifyVendor(request);
  if (!vendorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, ...updateData } = await request.json();
  const updatedProduct = await prisma.product.update({
    where: { id, vendorId },
    data: updateData,
  });
  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: NextRequest) {
    try{

        const vendorId = await verifyVendor(request);
        if (!vendorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const { id } = await request.json();
        console.log("id", id);
        await prisma.product.delete({
            where: { id, vendorId },
        });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

}
