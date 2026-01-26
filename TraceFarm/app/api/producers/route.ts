import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const producers = await prisma.user.findMany({
            where: { role: 'PRODUCER' },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(producers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch producers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, farmName, farmLatitude, farmLongitude, farmImage } = body;

        const producer = await prisma.user.create({
            data: {
                name,
                email,
                role: 'PRODUCER',
                farmName,
                farmLatitude: parseFloat(farmLatitude),
                farmLongitude: parseFloat(farmLongitude),
                farmImage
            }
        });

        return NextResponse.json(producer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create producer' }, { status: 500 });
    }
}
