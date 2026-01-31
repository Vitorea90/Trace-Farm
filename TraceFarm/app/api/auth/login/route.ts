import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Usuário e senha são obrigatórios' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user || user.password !== password) {
            return NextResponse.json(
                { error: 'Credenciais inválidas' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id, // Return ID for cookie
                name: user.name,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: 'Erro no servidor' },
            { status: 500 }
        );
    }
}
