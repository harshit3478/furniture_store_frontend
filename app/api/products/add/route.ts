import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
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