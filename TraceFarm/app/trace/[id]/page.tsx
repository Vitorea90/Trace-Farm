import prisma from "@/lib/prisma";
import { Timeline } from "@/components/ui/timeline";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Leaf, Award, MapPin, Calendar, Sprout, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/ui/map-view'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

export const dynamicParams = true;
export const revalidate = 0;

export default async function TracePage({ params }: { params: { id: string } }) {
    const lot = await prisma.lot.findUnique({
        where: { code: params.id },
        include: {
            events: { orderBy: { date: 'desc' } },
            producers: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                    cooperativeImage: true,
                    profile: true,
                    email: true
                }
            }
        }
    });

    if (!lot) {
        notFound();
    }

    // Prepare location data for map
    const locations = [];

    // Add lot location if available
    if (lot.latitude && lot.longitude) {
        locations.push({
            lat: lot.latitude,
            lng: lot.longitude,
            label: 'Local do Lote',
            description: lot.locationname || 'Localização da produção',
            type: 'lot' as const
        });
    }

    // Add farm locations from producers
    for (const producer of lot.producers) {
        if (producer.farmLatitude && producer.farmLongitude) {
            locations.push({
                lat: producer.farmLatitude,
                lng: producer.farmLongitude,
                label: producer.farmName || 'Fazenda',
                description: `Propriedade de ${producer.name}`,
                type: 'farm' as const
            });
        }
    }

    // If lot has no location, use first producer's farm location as fallback
    if (locations.length === 0 && lot.producers.length > 0) {
        const firstProducer = lot.producers[0];
        if (firstProducer.farmLatitude && firstProducer.farmLongitude) {
            locations.push({
                lat: firstProducer.farmLatitude,
                lng: firstProducer.farmLongitude,
                label: firstProducer.farmName || 'Fazenda',
                description: 'Localização da fazenda produtora',
                type: 'farm' as const
            });
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
            {/* Hero Image Section */}
            <div className="relative h-80 md:h-96 bg-gradient-to-br from-primary-900 to-primary-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{lot.cropType}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-primary-100 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={16} />
                                Colheita {new Date(lot.harvestDate).getFullYear()}
                            </span>
                            {lot.locationname && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    {lot.locationname}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 pb-16 -mt-8 relative z-10">

                {/* Authenticity Verified Badge */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8 shadow-sm">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
                            <ShieldCheck className="text-white" size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Authenticity Verified</h3>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">This product has been traced and verified</p>
                        </div>
                    </div>
                </div>

                {/* Product Journey */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                        <Leaf className="text-primary-600" size={24} />
                        Product Journey
                    </h2>

                    <div className="bg-white dark:bg-zinc-900/50 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                        <Timeline events={lot.events} />
                    </div>
                </section>

                {/* Cooperative Section */}
                {lot.createdBy && lot.createdBy.role === 'COOP' && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                            <Sprout className="text-primary-600" size={24} />
                            Cooperativa Responsável
                        </h2>

                        <Link
                            href={`/cooperative/${lot.createdBy.id}`}
                            className="block bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-950 dark:to-emerald-950 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-200 dark:border-primary-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all hover:shadow-xl group"
                        >
                            <div className="p-6 flex items-center gap-6">
                                {/* Cooperative Logo */}
                                <div className="h-20 w-20 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border-2 border-primary-300 dark:border-primary-700 flex items-center justify-center shrink-0">
                                    {lot.createdBy.cooperativeImage ? (
                                        <img
                                            src={lot.createdBy.cooperativeImage}
                                            alt={lot.createdBy.name || 'Cooperativa'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Sprout className="text-primary-600 dark:text-primary-400" size={40} />
                                    )}
                                </div>

                                {/* Cooperative Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-1">
                                        {lot.createdBy.name || 'Cooperativa'}
                                    </h3>
                                    {lot.createdBy.profile ? (
                                        <p className="text-sm text-primary-700 dark:text-primary-300 line-clamp-2">
                                            {lot.createdBy.profile}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-primary-600 dark:text-primary-400">
                                            Cooperativa certificada
                                        </p>
                                    )}
                                </div>

                                {/* View Profile Button */}
                                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-3 transition-all">
                                    Ver Perfil
                                    <User size={18} />
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Producers Section */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Responsible Producers</h2>

                    <div className="space-y-4">
                        {lot.producers.map(producer => (
                            <Link
                                key={producer.id}
                                href={`/producer/${producer.id}`}
                                className="block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:shadow-xl group"
                            >
                                {/* Farm Image */}
                                <div className="h-40 bg-zinc-200 dark:bg-zinc-800 w-full relative overflow-hidden">
                                    {producer.farmImage ? (
                                        <img src={producer.farmImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Farm" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-primary-950 text-primary-300">
                                            <Sprout size={56} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-xl font-bold shrink-0 overflow-hidden">
                                            {producer.profileImage ? (
                                                <img
                                                    src={producer.profileImage}
                                                    alt={producer.name || 'Produtor'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span>{producer.name ? producer.name[0].toUpperCase() : 'P'}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{producer.name || 'Producer'}</h3>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{producer.farmName}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
                                        Ver Perfil
                                        <User size={18} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Location Map */}
                {locations.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                            <MapPin className="text-emerald-600" size={24} />
                            Localização
                        </h2>
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <MapView locations={locations} height="450px" />
                        </div>
                    </section>
                )}


                {/* Certifications - from lot data */}
                {lot.certifications && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Certifications</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {lot.certifications.split(',').map((cert: string, idx: number) => (
                                <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                    <Award className="text-emerald-600 mb-3" size={32} />
                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{cert.trim()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Our Commitment Card */}
                <section className="mb-8">
                    <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-8 shadow-xl text-white">
                        <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
                        <p className="text-primary-100 leading-relaxed mb-4">
                            We bring transparency to every step of our production process. From production to harvest,
                            every stage is documented and verified to ensure the highest quality and sustainability standards.
                        </p>
                        <p className="text-primary-200 text-sm">
                            By choosing our products, you support sustainable farming practices and local communities.
                        </p>
                    </div>
                </section>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 text-center">
                        <Sprout className="mx-auto text-emerald-600 mb-3" size={32} />
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                            {lot.area} <span className="text-base font-normal">{lot.unit}</span>
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Total Volume</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30 text-center">
                        <User className="mx-auto text-blue-600 mb-3" size={32} />
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{lot.producers.length}</div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Producer Families</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-8 pb-8 opacity-50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Traceability powered by <strong className="text-primary-600">AgroTrace</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
