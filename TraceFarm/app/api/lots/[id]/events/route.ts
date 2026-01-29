import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { type, title, description, date, buyerName, buyerType, quantitySold } = body;

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

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
