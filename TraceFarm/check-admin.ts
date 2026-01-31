import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking for admin user...");
        const admin = await prisma.user.findFirst({
            where: { username: "admin" }
        });

        if (admin) {
            console.log(`FOUND_ADMIN: ${admin.username}`);
            console.log(`ROLE: ${admin.role}`);
            console.log(`PASSWORD_MATCH: ${admin.password === 'admin'}`);
        } else {
            console.log("ADMIN_NOT_FOUND");
        }
    } catch (e) {
        console.error("PRISMA_ERROR:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
