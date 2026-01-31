
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // 1. Create System Admin
    // Admin manages Cooperatives
    const adminEmail = "admin@tracefarm.com";
    let admin = await prisma.user.findFirst({
        where: {
            OR: [{ username: "admin" }, { email: adminEmail }]
        }
    });

    if (!admin) {
        admin = await prisma.user.create({
            data: {
                name: "Administrador Sistema",
                email: adminEmail,
                username: "admin",
                password: "admin",
                role: "ADMIN"
            }
        });
        console.log("Admin user created.");
    } else {
        console.log("Admin user exists.");
        if (admin.role !== 'ADMIN') {
            await prisma.user.update({ where: { id: admin.id }, data: { role: 'ADMIN' } });
        }
    }

    // 2. Create Cooperative (Cofamel)
    // Coop manages Producers
    const coopEmail = "contato@cofamel.com.br";
    let coop = await prisma.user.findFirst({
        where: {
            OR: [{ username: "cofamel" }, { email: coopEmail }]
        }
    });

    if (!coop) {
        coop = await prisma.user.create({
            data: {
                name: "Cooperativa Cofamel",
                email: coopEmail,
                username: "cofamel",
                password: "cofamel2025",
                role: "COOP",
                farmName: "Sede Cofamel",
                createdById: admin.id
            }
        });
        console.log("Cooperative created.");
    } else {
        console.log("Cooperative exists.");
        // Ensure role is COOP and linked to Admin
        await prisma.user.update({
            where: { id: coop.id },
            data: {
                role: 'COOP',
                createdById: admin.id,
                // Ensure login works
                username: "cofamel",
                password: "cofamel2025"
            }
        });
        console.log("Cooperative updated.");
    }

    // 3. Create Producer (Joao) - Managed by Cofamel
    // NO login access (no username/password ideally, or just ignored)
    const producerEmail = "joao@exemplo.com";
    let producer = await prisma.user.findFirst({ where: { email: producerEmail } });

    if (!producer) {
        if (coop) {
            producer = await prisma.user.create({
                data: {
                    name: "João Silva",
                    email: producerEmail,
                    role: "PRODUCER", // Explicitly producer
                    farmName: "Sítio Recanto",
                    createdById: coop.id,
                    // No username/password set implies no login
                    farmLatitude: -24.95,
                    farmLongitude: -53.45
                }
            });
            console.log("Producer created (managed by Cofamel).");
        }
    } else {
        console.log("Producer exists.");
        if (coop && producer.createdById !== coop.id) {
            await prisma.user.update({ where: { id: producer.id }, data: { createdById: coop.id } });
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
