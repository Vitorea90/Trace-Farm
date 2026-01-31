import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Create Admins
        const adminEmail = "admin@tracefarm.com";
        const adminExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: adminEmail },
                    { username: "admin" }
                ]
            }
        });

        if (!adminExists) {
            await prisma.user.create({
                data: {
                    name: "Administrador",
                    email: adminEmail,
                    username: "admin",
                    password: "admin", // In a real app, hash this!
                    role: "ADMIN"
                }
            });
            console.log("Admin user created.");
        }

        // 2. Create Cofamel Producer
        const producerEmail = "contato@cofamel.com.br";
        const producerExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: producerEmail },
                    { username: "cofamel" }
                ]
            }
        });

        if (!producerExists) {
            await prisma.user.create({
                data: {
                    name: "Cofamel",
                    email: producerEmail,
                    username: "cofamel",
                    password: "cofamel2025", // In a real app, hash this!
                    role: "PRODUCER",
                    farmName: "Cooperativa Cofamel"
                }
            });
            console.log("Producer user created.");
        } else {
            // Update password if exists just to be sure
            await prisma.user.update({
                where: { id: producerExists.id },
                data: { password: "cofamel2025" }
            });
        }

        return NextResponse.json({ message: "Database seeded successfully." });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { error: "Error seeding database." },
            { status: 500 }
        );
    }
}
