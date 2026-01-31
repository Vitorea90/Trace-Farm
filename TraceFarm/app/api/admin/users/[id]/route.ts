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
        // First delete lots created by this user (or if they are producers of lots)
        // Since many-to-many, we disconnect
        // But if they are CREATOR of a lot, we might want to delete the lot?

        // 1. Delete events of lots created by this producer? No, too complex.

        // Simple approach: Use transaction to cleanup
        await prisma.$transaction(async (tx) => {
            // If manual cleanup is needed beyond schema cascade:
            // Delete created users (Producers)
            // Schema cascade handles createdUsers if set.

            // What about Lots? User -> Many-to-Many -> Lots
            // Prisma handles implicit m-n delete usually, but check.

            await tx.user.delete({ where: { id: params.id } });
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: 'Failed to delete user. Ensure all related lots are removed first.' }, { status: 500 });
    }
}
