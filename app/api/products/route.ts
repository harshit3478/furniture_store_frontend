// get all products from the database

import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try{
        const products = await prisma.product.findMany();
        return NextResponse.json({"success": true , "products": products});

    }catch(e){
        return NextResponse.json({"success": false, "message": (e as Error).message}, {status: 500});
    }
}