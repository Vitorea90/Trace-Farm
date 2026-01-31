import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value;
        const role = cookieStore.get('auth_role')?.value;

        let where: any = {};

        // If not Admin, filter by Creator (Cooperative)
        if (role !== 'admin' && userId) {
            where.createdById = userId;
        }

        const lots = await prisma.lot.findMany({
            where,
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
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value; // Current Coop ID

        const body = await request.json();
        console.log("Received Lot Data:", body);

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
            producerIds = []
        } = body;

        // --- Validation ---
        const areaFloat = parseFloat(area);
        if (!area || isNaN(areaFloat)) {
            return NextResponse.json({ error: 'Área inválida. Informe um número.' }, { status: 400 });
        }

        const latFloat = latitude ? parseFloat(latitude) : null;
        const lngFloat = longitude ? parseFloat(longitude) : null;
        const weightFloat = harvestWeight ? parseFloat(harvestWeight) : null;

        const code = `LOT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;

        const createData: any = {
            code,
            createdById: userId, // Link to creating Coop
            cropType: cropType || 'Mel',
            latitude: (latFloat !== null && !isNaN(latFloat)) ? latFloat : null,
            longitude: (lngFloat !== null && !isNaN(lngFloat)) ? lngFloat : null,
            area: areaFloat,
            unit: unit || 'KG',
            plantingDate: new Date(plantingDate),
            harvestDate: new Date(harvestDate),
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

        // Events
        await prisma.event.createMany({
            data: [
                {
                    lotId: lot.id,
                    type: 'PLANTING',
                    title: 'Início da Produção',
                    description: `Início do período de produção do lote de ${lot.cropType}`,
                    date: new Date(plantingDate),
                },
                {
                    lotId: lot.id,
                    type: 'HARVEST',
                    title: 'Colheita do Mel',
                    description: lot.harvestWeight
                        ? `Colheita de ${lot.harvestWeight} ${lot.unit} de ${lot.cropType}`
                        : `Colheita de ${lot.cropType} realizada`,
                    date: new Date(harvestDate),
                }
            ]
        });

        return NextResponse.json(lot);
    } catch (error: any) {
        console.error("Create Lot Error:", error);
        return NextResponse.json({
            error: 'Erro Interno: ' + (error.message || JSON.stringify(error))
        }, { status: 500 });
    }
}
