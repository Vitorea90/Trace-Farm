import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const lots = await prisma.lot.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { events: true } },
                producers: true
            }
        });
        return NextResponse.json(lots);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lots' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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
            producerIds // Array of strings
        } = body;

        // Generate unique code
        const code = `LOT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;

        const lot = await prisma.lot.create({
            data: {
                code,
                cropType,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                area: parseFloat(area),
                unit,
                plantingDate: new Date(plantingDate),
                harvestDate: new Date(harvestDate),
                harvestWeight: harvestWeight ? parseFloat(harvestWeight) : null,
                quality: quality || null,
                certifications: certifications || null,
                storageLocation: storageLocation || null,
                producers: {
                    connect: producerIds.map((id: string) => ({ id }))
                }
                // No automatic event creation - events are for sales only
            },
        });

        return NextResponse.json(lot);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create lot' }, { status: 500 });
    }
}
