import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        console.log("Received Lot Data:", body); // Debug log

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
            producerIds = [] // Default to empty array
        } = body;

        // --- Validation & Parsing ---

        // 1. Area (Required Float)
        const areaFloat = parseFloat(area);
        if (!area || isNaN(areaFloat)) {
            return NextResponse.json({ error: 'Área inválida. Informe um número.' }, { status: 400 });
        }

        // 2. Dates (Required Date)
        const pDate = new Date(plantingDate);
        const hDate = new Date(harvestDate);
        if (isNaN(pDate.getTime()) || isNaN(hDate.getTime())) {
            return NextResponse.json({ error: 'Datas de plantio ou colheita inválidas.' }, { status: 400 });
        }

        // 3. Optional Floats
        const latFloat = latitude ? parseFloat(latitude) : null;
        const lngFloat = longitude ? parseFloat(longitude) : null;
        const weightFloat = harvestWeight ? parseFloat(harvestWeight) : null;

        // Generate unique code
        const code = `LOT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;

        // Construct data object
        // Cast to 'any' to bypass potential Prisma Client mismatch if types are stale
        const createData: any = {
            code,
            cropType: cropType || 'Mel', // Default fallback
            latitude: (latFloat !== null && !isNaN(latFloat)) ? latFloat : null,
            longitude: (lngFloat !== null && !isNaN(lngFloat)) ? lngFloat : null,
            area: areaFloat,
            unit: unit || 'KG',
            plantingDate: pDate,
            harvestDate: hDate,
            harvestWeight: (weightFloat !== null && !isNaN(weightFloat)) ? weightFloat : null,
            quality: quality || null,
            certifications: certifications || null,
            storageLocation: storageLocation || null,
            status: 'ACTIVE',
            producers: {
                connect: Array.isArray(producerIds) ? producerIds.map((id: string) => ({ id })) : []
            }
        };

        const lot = await prisma.lot.create({
            data: createData
        });

        return NextResponse.json(lot);
    } catch (error: any) {
        console.error("Create Lot Error (Full):", error);

        // Return raw error for debugging
        return NextResponse.json({
            error: 'Erro Interno: ' + (error.message || JSON.stringify(error))
        }, { status: 500 });
    }
}
