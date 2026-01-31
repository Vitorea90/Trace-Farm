import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Basic validation
        if (!data.name || !data.email) {
            return NextResponse.json(
                { error: 'Nome e Email são obrigatórios' },
                { status: 400 }
            );
        }

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                username: data.username,
                password: data.password,
                role: data.role || 'PRODUCER',
                farmName: data.farmName,
                farmLatitude: data.farmLatitude ? parseFloat(data.farmLatitude) : null,
                farmLongitude: data.farmLongitude ? parseFloat(data.farmLongitude) : null,
                profileImage: data.profileImage,
                bio: data.bio,
                phone: data.phone,
                website: data.website,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Erro ao criar usuário' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao buscar usuários' },
            { status: 500 }
        );
    }
}
