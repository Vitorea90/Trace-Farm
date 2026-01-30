import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { type, title, description, date, buyerName, buyerType, quantitySold } = body;

        // Verificar se o lote existe e seu status atual
        const lot = await prisma.lot.findUnique({
            where: { id: params.id }
        });

        if (!lot) {
            return NextResponse.json({ error: 'Lote não encontrado' }, { status: 404 });
        }

        // Verificar se já foi vendido
        if (type === 'SOLD' && lot.status === 'SOLD') {
            return NextResponse.json({ error: 'Este lote já foi vendido' }, { status: 400 });
        }

        // Criar o evento
        const event = await prisma.event.create({
            data: {
                lotId: params.id,
                type,
                title,
                description,
                date: date ? new Date(date) : new Date(),
                buyerName: buyerName || null,
                buyerType: buyerType || null,
                quantitySold: quantitySold || null,
                createdBy: "Produtor Demo" // normally from session
            }
        });

        // Se for uma venda, atualizar o status do lote para SOLD
        if (type === 'SOLD') {
            await prisma.lot.update({
                where: { id: params.id },
                data: { status: 'SOLD' }
            });
        }

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
