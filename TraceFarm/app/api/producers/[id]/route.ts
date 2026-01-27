import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch a single producer by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const producer = await prisma.user.findUnique({
            where: { id: params.id, role: 'PRODUCER' }
        });

        if (!producer) {
            return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
        }

        return NextResponse.json(producer);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch producer' }, { status: 500 });
    }
}

// PUT: Update a producer
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();

        const producer = await prisma.user.update({
            where: { id: params.id },
            data: {
                name: data.name,
                email: data.email,
                farmName: data.farmName,
                farmLatitude: data.farmLatitude,
                farmLongitude: data.farmLongitude,
                farmImage: data.farmImage
            }
        });

        return NextResponse.json(producer);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: 'Failed to update producer' }, { status: 500 });
    }
}

// DELETE: Remove a producer
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: 'Failed to delete producer. They may have associated lots.' }, { status: 500 });
    }
}
