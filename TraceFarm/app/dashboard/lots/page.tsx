import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

import { ActionButtons } from "@/components/ui/action-buttons";

export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';

export default async function LotsPage() {
    const cookieStore = cookies();
    const userId = cookieStore.get('auth_user')?.value;
    const role = cookieStore.get('auth_role')?.value;

    const where: any = {};

    // If not Admin, filter by Creator (Cooperative)
    if (role !== 'admin' && userId) {
        where.createdById = userId;
    }

    const lots = await prisma.lot.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { events: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Meus Lotes</h1>
                    <p className="text-zinc-500">Gerencie sua produção e acompanhe o progresso.</p>
                </div>
                <Link href="/dashboard/lots/new">
                    <Button>+ Novo Lote</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {lots.map((lot) => (
                    <Card key={lot.id} className="group hover:shadow-lg transition-all border-l-4 border-l-primary-500 relative">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs font-mono text-zinc-400 mb-1 block">{lot.code}</span>
                                    </div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Sprout size={20} className="text-primary-600" />
                                        {lot.cropType}
                                    </CardTitle>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <ActionButtons id={lot.id} type="lots" />
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${lot.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {lot.status === 'ACTIVE' ? 'Em Andamento' : lot.status}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <MapPin size={16} />
                                {lot.storageLocation || 'Local não definido'} • {lot.area} {lot.unit}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <Calendar size={16} />
                                Colheita: {formatDate(lot.harvestDate)}
                            </div>

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-xs text-zinc-500">{lot._count.events} eventos registrados</span>

                                <Link href={`/dashboard/lots/${lot.id}`}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                        Detalhes <ArrowRight size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {lots.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl">
                        <Sprout className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900">Nenhum lote encontrado</h3>
                        <p className="text-zinc-500 mb-4">Comece cadastrando seu primeiro lote de produção.</p>
                        <Link href="/dashboard/lots/new">
                            <Button variant="outline">Cadastrar Lote</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
