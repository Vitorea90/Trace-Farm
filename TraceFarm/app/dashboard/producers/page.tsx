import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionButtons } from "@/components/ui/action-buttons";
import { MapPin, User, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';

export default async function ProducersPage() {
    const cookieStore = cookies();
    const userId = cookieStore.get('auth_user')?.value;
    const role = cookieStore.get('auth_role')?.value;

    const where: any = { role: 'PRODUCER' };

    // If not Admin, filter by Creator (Cooperative)
    if (role !== 'admin' && userId) {
        where.createdById = userId;
    }

    const producers = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { lots: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Produtores & Fazendas</h1>
                    <p className="text-zinc-500">Gerencie os produtores parceiros e suas localizações.</p>
                </div>
                <Link href="/dashboard/producers/new">
                    <Button>+ Novo Produtor</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {producers.map((producer) => (
                    <Card key={producer.id} className="group hover:shadow-lg transition-all relative">
                        <CardHeader className="space-y-0 p-4 flex flex-row gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center">
                                {/* Prioritize Profile Image, fallback to Farm Image, then Initial */}
                                {producer.profileImage ? (
                                    <div className="h-12 w-12 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                                        <img src={producer.profileImage} alt={producer.name || 'Producer'} className="h-full w-full object-cover" />
                                    </div>
                                ) : producer.farmImage ? (
                                    <div className="h-12 w-12 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                                        <img src={producer.farmImage} alt="Farm" className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0 border border-green-200">
                                        {producer.name ? producer.name[0] : 'P'}
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <CardTitle className="text-lg truncate">{producer.name}</CardTitle>
                                    <p className="text-xs text-zinc-500 truncate">{producer.farmName || 'Fazenda sem nome'}</p>
                                </div>
                            </div>
                            <ActionButtons id={producer.id} type="producers" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                <MapPin size={16} />
                                {producer.farmLatitude?.toFixed(4)}, {producer.farmLongitude?.toFixed(4)}
                            </div>

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-xs text-zinc-500">{producer._count.lots} lotes ativos</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {producers.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-200 rounded-xl">
                        <User className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900">Nenhum produtor cadastrado</h3>
                        <Link href="/dashboard/producers/new">
                            <Button variant="outline" className="mt-4">Cadastrar Produtor</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
