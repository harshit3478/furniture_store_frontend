import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyVendor } from '@/lib/auth';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
    try {
        const vendorId = await verifyVendor(request);
        if (!vendorId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // fetch the vendor details from the prisma using the vendorId
        const vendor = await prisma.vendor.findUnique({
            where: { id: vendorId }
        });
        // now we can return the vendor details
        return NextResponse.json(vendor);


    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}