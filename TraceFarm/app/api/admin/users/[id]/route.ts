import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id }
        });
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const data = await request.json();

        // Remove password if empty string to avoid overwriting with empty
        if (data.password === "") {
            delete data.password;
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                name: data.name,
                email: data.email,
                username: data.username,
                ...(data.password && { password: data.password }),
                role: data.role,
                // Removed complex fields from update as per request for simplification
                phone: data.phone
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.$transaction(async (tx) => {
            // First, find all lots where this user is listed as a producer (many-to-many)
            const lotsWithThisProducer = await tx.lot.findMany({
                where: {
                    producers: {
                        some: {
                            id: params.id
                        }
                    }
                },
                select: { id: true }
            });

            // Disconnect this user from those lots
            for (const lot of lotsWithThisProducer) {
                await tx.lot.update({
                    where: { id: lot.id },
                    data: {
                        producers: {
                            disconnect: { id: params.id }
                        }
                    }
                });
            }

            // For lots created by this user (cooperative), set createdById to null
            // This keeps the lots but removes the creator reference
            await tx.lot.updateMany({
                where: {
                    createdById: params.id
                },
                data: {
                    createdById: null
                }
            });

            // Now we can safely delete the user
            // The schema already handles cascade delete for createdUsers (producers created by this cooperative)
            await tx.user.delete({ where: { id: params.id } });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({
            error: error.message || 'Falha ao excluir usuário. Tente novamente.'
        }, { status: 500 });
    }
}
