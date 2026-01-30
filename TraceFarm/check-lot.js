const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLot() {
    try {
        // Buscar o lote pelo código
        const lot = await prisma.lot.findUnique({
            where: { code: 'LOT-9393-2026' },
            include: {
                producers: true,
                events: true
            }
        });

        if (lot) {
            console.log('✅ Lote encontrado!');
            console.log('ID:', lot.id);
            console.log('Código:', lot.code);
            console.log('Tipo:', lot.cropType);
            console.log('Data de Colheita:', lot.harvestDate);
            console.log('Produtores:', lot.producers.length);
            console.log('Eventos:', lot.events.length);
        } else {
            console.log('❌ Lote não encontrado com código: LOT-9393-2026');

            // Listar todos os lotes disponíveis
            const allLots = await prisma.lot.findMany({
                select: {
                    code: true,
                    cropType: true,
                    createdAt: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10
            });

            console.log('\n📦 Últimos 10 lotes cadastrados:');
            allLots.forEach((lot, index) => {
                console.log(`${index + 1}. ${lot.code} - ${lot.cropType} (${lot.createdAt.toLocaleDateString()})`);
            });
        }
    } catch (error) {
        console.error('Erro ao consultar o banco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkLot();
