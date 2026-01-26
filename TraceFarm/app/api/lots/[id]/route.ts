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
