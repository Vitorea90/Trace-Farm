import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const lot = await prisma.lot.findUnique({
            where: { id: params.id },
            include: {
                events: {
                    orderBy: { date: 'desc' }
                },
                producers: true // Include multiple producers
            }
        });

        if (!lot) {
            return NextResponse.json({ error: 'Lot not found' }, { status: 404 });
        }

        return NextResponse.json(lot);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lot' }, { status: 500 });
    }
}

// PUT: Update a lot
// PUT: Update a lot
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const {
            cropType,
            latitude,
            longitude,
            area,
            unit,
            plantingDate,
            harvestDate,
            harvestWeight,
            quality,
            certifications,
            storageLocation,
            producerIds
        } = body;

        // Update lot details
        const lot = await prisma.lot.update({
            where: { id: params.id },
            data: {
                cropType,
                latitude: (latitude !== null && latitude !== undefined) ? Number(latitude) : null,
                longitude: (longitude !== null && longitude !== undefined) ? Number(longitude) : null,
                area: area ? parseFloat(area) : undefined,
                unit,
                plantingDate: plantingDate ? new Date(plantingDate) : undefined,
                harvestDate: harvestDate ? new Date(harvestDate) : undefined,
                harvestWeight: (harvestWeight && !isNaN(parseFloat(harvestWeight))) ? parseFloat(harvestWeight) : null,
                quality: quality || null,
                certifications: certifications || null,
                storageLocation: storageLocation || null,

                // Update relationships if producerIds are provided
                producers: producerIds ? {
                    set: [], // Clear existing
                    connect: producerIds.map((id: string) => ({ id })) // Connect new
                } : undefined
            }
        });

        return NextResponse.json(lot);
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({
            error: 'Erro ao atualizar lote: ' + (error.message || error)
        }, { status: 500 });
    }
}

// DELETE: Remove a lot
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Use transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // 1. Delete all events associated with this lot
            await tx.event.deleteMany({
                where: { lotId: params.id }
            });

            // 2. Delete the lot itself
            await tx.lot.delete({
                where: { id: params.id }
            });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({
            error: 'Erro ao excluir lote. Detalhes: ' + (error.message || error)
        }, { status: 500 });
    }
}
