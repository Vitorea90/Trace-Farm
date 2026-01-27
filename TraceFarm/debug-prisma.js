
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to create lot...");
        const lot = await prisma.lot.create({
            data: {
                code: "TEST-" + Date.now(),
                cropType: "Mel",
                area: 10,
                plantingDate: new Date(),
                harvestDate: new Date(), // Using 'harvestDate'
                // estimatedHarvestDate: new Date(), // Uncomment to test
                producers: {
                    connect: []
                }
            }
        });
        console.log("Success:", lot);
    } catch (e) {
        console.error("Full Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
