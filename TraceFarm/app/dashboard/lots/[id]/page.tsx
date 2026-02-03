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
        <div className="min-h-screen relative">
            {/* Honey Background */}
            <div
                className="fixed inset-0 z-0 opacity-10 dark:opacity-5"
                style={{
                    backgroundImage: 'url(/honey-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Content */}
            <div className="relative z-10 space-y-12 max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/lots" className="text-zinc-500 hover:text-primary-600 transition-colors">
                                <ArrowLeft size={20} />
                            </Link>
                            <span className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md text-sm font-mono font-bold tracking-wider border border-primary-200 dark:border-primary-800">
                                {lot.code}
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{lot.cropType}</h1>
                        <div className="flex flex-wrap gap-6 text-zinc-600 dark:text-zinc-400 text-sm">
                            {lot.storageLocation && <span className="flex items-center gap-2"><MapPin size={16} /> {lot.storageLocation}</span>}
                            <span className="flex items-center gap-2"><Sprout size={16} /> {lot.area} {lot.unit}</span>
                            <span className="flex items-center gap-2"><Calendar size={16} /> Colheita: {formatDate(lot.harvestDate)}</span>
                        </div>
                    </div>

                    <LotClientActions lotId={lot.id} lotCode={lot.code} />
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Timeline */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-8 text-zinc-900 dark:text-zinc-100">Linha do Tempo do Lote</h3>
                            <Timeline events={lot.events} />
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-lg">
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Status Atual</h3>
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 mb-2">
                                    {lot.status === 'ACTIVE' ? 'Ativo' :
                                        lot.status === 'SOLD' ? 'Vendido' :
                                            lot.status === 'VENDIDO' ? 'Vendido' :
                                                lot.status === 'ATIVO' ? 'Ativo' :
                                                    lot.status}
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    {lot.status === 'ACTIVE' || lot.status === 'ATIVO' ? 'Lote cadastrado e disponível para venda' :
                                        lot.status === 'SOLD' || lot.status === 'VENDIDO' ? 'Lote comercializado' :
                                            'Status do lote'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-lg">
                            <CardContent className="pt-6">
                                <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Informações do Lote</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Área Total:</span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{lot.area} {lot.unit}</span>
                                    </div>
                                    {lot.storageLocation && (
                                        <div className="flex justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-400">Armazenamento:</span>
                                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{lot.storageLocation}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-zinc-600 dark:text-zinc-400">Data de Colheita:</span>
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatDate(lot.harvestDate)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
