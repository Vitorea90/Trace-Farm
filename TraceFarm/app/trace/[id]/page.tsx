import prisma from "@/lib/prisma";
import { Timeline } from "@/components/ui/timeline";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Leaf, Award, MapPin, Calendar, Sprout, User } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TracePage({ params }: { params: { id: string } }) {
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: {
            events: { orderBy: { date: 'desc' } },
            producers: true // Multi producers
        }
    });

    if (!lot) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-earth-50 dark:bg-zinc-950 pb-12">
            {/* Mobile-first Header */}
            <div className="relative h-72 bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-50 dark:from-zinc-950 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="inline-block px-3 py-1 mb-3 rounded-full bg-primary-500/20 backdrop-blur-md border border-primary-400/30 text-primary-100 text-xs font-bold tracking-wider">
                        RASTREADO & VERIFICADO
                    </span>
                    <h1 className="text-4xl font-bold text-white mb-2">{lot.cropType}</h1>
                    <div className="flex items-center text-primary-100 text-sm gap-4">
                        {lot.latitude && (
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> {lot.latitude.toFixed(4)}, {lot.longitude?.toFixed(4)}
                            </span>
                        )}
                        <span className="flex items-center gap-1"><Calendar size={14} /> Safra {new Date(lot.plantingDate).getFullYear()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 max-w-lg mx-auto -mt-10 relative z-10 space-y-8">

                {/* Producers Cards */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 px-1">Produtores Responsáveis</h2>

                    {lot.producers.map(producer => (
                        <div key={producer.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800">
                            {/* Farm Image */}
                            <div className="h-32 bg-zinc-200 w-full relative">
                                {producer.farmImage ? (
                                    <img src={producer.farmImage} className="w-full h-full object-cover" alt="Farm" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-200">
                                        <Sprout size={48} />
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
                                    <MapPin size={10} />
                                    {producer.farmLatitude?.toFixed(4)}, {producer.farmLongitude?.toFixed(4)}
                                </div>
                            </div>

                            <div className="p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-bold shrink-0">
                                    {producer.name ? producer.name[0] : 'P'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{producer.name || 'Produtor'}</h3>
                                    <p className="text-xs text-zinc-500 font-semibold">{producer.farmName}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Story / Timeline */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <Leaf className="text-primary-600" size={20} />
                            Jornada do Produto
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <Timeline events={lot.events} />
                    </div>
                </div>

                {/* Footprint / Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                        <Sprout className="mx-auto text-emerald-600 mb-2" />
                        <div className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {lot.area} <span className="text-sm font-normal">{lot.unit}</span>
                        </div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-300">Volume Total</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
                        <User className="mx-auto text-blue-600 mb-2" />
                        <div className="text-xl font-bold text-blue-900 dark:text-blue-100">{lot.producers.length}</div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">Famílias Produtoras</div>
                    </div>
                </div>

                <div className="text-center pt-8 pb-12 opacity-50">
                    <p className="text-xs">Rastreabilidade fornecida por <strong>AgroTrace</strong></p>
                </div>

            </div>
        </div>
    );
}
