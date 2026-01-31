import Link from "next/link";
import prisma from "@/lib/prisma";
import { LotClientActions } from "@/components/dashboard/LotClientActions"; // Import client component
import { Card, CardContent } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { ArrowLeft, Calendar, MapPin, Sprout } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";

export default async function LotDetailPage({ params }: { params: { id: string } }) {
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: { events: { orderBy: { date: 'desc' } } }
    });

    if (!lot) {
        notFound();
    }

    const cookieStore = cookies();
    const userId = cookieStore.get('auth_user')?.value;
    const role = cookieStore.get('auth_role')?.value;

    if (role !== 'admin' && userId && lot.createdById !== userId) {
        notFound();
    }

    // Calcular progresso baseado nas datas
    const plantingDate = new Date(lot.plantingDate);
    const harvestDate = new Date(lot.harvestDate);
    const today = new Date();

    const totalDays = Math.max(1, Math.floor((harvestDate.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysPassed = Math.floor((today.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressPercentage = Math.min(100, Math.max(0, Math.floor((daysPassed / totalDays) * 100)));

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/lots" className="text-zinc-500 hover:text-primary-600 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-xs font-mono font-bold tracking-wider">
                            {lot.code}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{lot.cropType}</h1>
                    <div className="flex flex-wrap gap-4 text-zinc-500 text-sm">
                        {lot.storageLocation && <span className="flex items-center gap-1"><MapPin size={16} /> {lot.storageLocation}</span>}
                        <span className="flex items-center gap-1"><Sprout size={16} /> {lot.area} {lot.unit}</span>
                        <span className="flex items-center gap-1"><Calendar size={16} /> Colheita: {formatDate(lot.harvestDate)}</span>
                    </div>
                </div>

                <LotClientActions lotId={lot.id} lotCode={lot.code} />
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2 border-zinc-100 dark:border-zinc-800">Linha do Tempo</h3>
                    <Timeline events={lot.events} />
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Status Atual</h3>
                            <div className="text-2xl font-bold text-emerald-600 mb-2">
                                {lot.status === 'ACTIVE' ? 'Disponível' : lot.status === 'SOLD' ? 'Vendido' : lot.status}
                            </div>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {lot.status === 'ACTIVE' ? 'Lote cadastrado e disponível para venda' : 'Status do lote'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
