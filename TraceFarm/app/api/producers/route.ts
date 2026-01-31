import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value;
        const role = cookieStore.get('auth_role')?.value;

        let where: any = { role: 'PRODUCER' };

        // If not Admin, filter by Creator (Cooperative)
        if (role !== 'admin' && userId) {
            where.createdById = userId;
        }

        const producers = await prisma.user.findMany({
            where,
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(producers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch producers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value; // Current Coop ID

        const body = await request.json();
        const {
            name,
            email,
            farmName,
            farmLatitude,
            farmLongitude,
            farmImage,
            farmImages,
            profileImage,
            bio,
            phone,
            certifications,
            website
        } = body;

        const producer = await prisma.user.create({
            data: {
                name,
                email,
                role: 'PRODUCER',
                createdById: userId, // Link to creating Coop
                farmName,
                farmLatitude: parseFloat(farmLatitude),
                farmLongitude: parseFloat(farmLongitude),
                farmImage,
                farmImages,
                profileImage,
                bio,
                phone,
                certifications,
                website
            }
        });

        return NextResponse.json(producer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create producer' }, { status: 500 });
    }
}
