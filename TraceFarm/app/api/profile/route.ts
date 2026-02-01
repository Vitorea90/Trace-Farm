import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { profile, cooperativeImage, cooperativeGallery } = body;

        // Build update data object
        const updateData: any = {};
        if (profile !== undefined) updateData.profile = profile;
        if (cooperativeImage !== undefined) updateData.cooperativeImage = cooperativeImage;
        if (cooperativeGallery !== undefined) updateData.cooperativeGallery = cooperativeGallery;

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            profile: updatedUser.profile,
            cooperativeImage: updatedUser.cooperativeImage,
            cooperativeGallery: updatedUser.cooperativeGallery
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({
            error: 'Erro ao atualizar perfil'
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = cookies();
        const userId = cookieStore.get('auth_user')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                profile: true,
                name: true,
                role: true,
                cooperativeImage: true,
                cooperativeGallery: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({
            error: 'Erro ao buscar perfil'
        }, { status: 500 });
    }
}
