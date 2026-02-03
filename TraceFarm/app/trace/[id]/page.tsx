import prisma from "@/lib/prisma";
import { Timeline } from "@/components/ui/timeline";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Leaf, Award, MapPin, Calendar, Sprout, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <div className="min-h-screen bg-[rgb(var(--charcoal-bg))] dark:bg-[rgb(var(--charcoal-bg))]">
            {/* Hero Image Section */}
            <div className="relative h-[500px] bg-gradient-to-br from-[rgb(var(--forest-green-dark))] to-[rgb(var(--forest-green))] overflow-hidden">
                {/* Background Image - Bee Farm/Honeycomb */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--charcoal-bg))] via-transparent to-transparent" />

                {/* Content Container */}
                <div className="relative h-full max-w-7xl mx-auto px-6 md:px-8 flex flex-col justify-center">
                    {/* TraceFarm Logo */}
                    <Link href="/" className="mb-8 inline-block">
                        <Image
                            src="/tracefarm-logo.png"
                            alt="TraceFarm"
                            width={320}
                            height={80}
                            className="w-auto h-20 brightness-0 invert"
                            priority
                        />
                    </Link>

                    {/* Product Title */}
                    <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight">
                        {lot.cropType}
                    </h1>

                    {/* Lot Info */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80 text-base mb-6">
                        <span className="flex items-center gap-2 font-mono text-[rgb(var(--neon-green))]">
                            LOT-{lot.code}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={18} />
                            {formatDate(lot.harvestDate)}
                        </span>
                        {lot.locationname && (
                            <span className="flex items-center gap-2">
                                <MapPin size={18} />
                                {lot.locationname}
                            </span>
                        )}
                    </div>

                    {/* Floating Authenticity Badge */}
                    <div className="inline-flex items-center gap-3 glass-card px-6 py-4 rounded-2xl border-2 border-[rgb(var(--neon-green))]/30 neon-glow floating-badge max-w-fit">
                        <div className="h-10 w-10 rounded-full bg-[rgb(var(--neon-green))] flex items-center justify-center">
                            <ShieldCheck className="text-[rgb(var(--charcoal-bg))]" size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">Autenticidade Verificada</h3>
                            <p className="text-sm text-white/70">Rastreabilidade garantida</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 relative z-10">

                {/* Product Journey */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Leaf className="text-[rgb(var(--neon-green))]" size={28} />
                        Jornada do Produto
                    </h2>

                    <div className="glass-card rounded-3xl p-8">
                        <Timeline events={lot.events} />
                    </div>
                </section>

                {/* Cooperative Section */}
                {lot.createdBy && lot.createdBy.role === 'COOP' && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <Sprout className="text-[rgb(var(--neon-green))]" size={28} />
                            Cooperativa
                        </h2>

                        <Link
                            href={`/cooperative/${lot.createdBy.id}`}
                            className="block glass-card rounded-3xl overflow-hidden hover:border-[rgb(var(--neon-green))]/50 transition-all group"
                        >
                            <div className="p-8 flex items-center gap-6">
                                {/* Cooperative Logo */}
                                <div className="h-24 w-24 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/20 flex items-center justify-center shrink-0">
                                    {lot.createdBy.cooperativeImage ? (
                                        <img
                                            src={lot.createdBy.cooperativeImage}
                                            alt={lot.createdBy.name || 'Cooperativa'}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Sprout className="text-[rgb(var(--neon-green))]" size={48} />
                                    )}
                                </div>

                                {/* Cooperative Info */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {lot.createdBy.name || 'Cooperativa'}
                                    </h3>
                                    {lot.createdBy.profile ? (
                                        <p className="text-base text-white/70 line-clamp-2">
                                            {lot.createdBy.profile}
                                        </p>
                                    ) : (
                                        <p className="text-base text-white/60">
                                            Cooperativa certificada
                                        </p>
                                    )}
                                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--neon-green))]/20 text-[rgb(var(--neon-green))] text-sm font-semibold">
                                        Cooperativa
                                    </div>
                                </div>

                                {/* View Profile Button */}
                                <div className="flex items-center gap-2 text-[rgb(var(--neon-green))] font-semibold group-hover:gap-3 transition-all">
                                    Ver Perfil
                                    <User size={20} />
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Producers Section */}
                {lot.producers.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-8">Produtores Responsáveis</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lot.producers.map(producer => (
                                <Link
                                    key={producer.id}
                                    href={`/producer/${producer.id}`}
                                    className="block glass-card rounded-3xl overflow-hidden hover:border-[rgb(var(--neon-green))]/50 transition-all group"
                                >
                                    {/* Farm Image */}
                                    <div className="h-48 bg-white/5 w-full relative overflow-hidden">
                                        {producer.farmImage ? (
                                            <img src={producer.farmImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Farm" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/30">
                                                <Sprout size={64} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-bold shrink-0 overflow-hidden border-2 border-white/20">
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
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white">{producer.name || 'Produtor'}</h3>
                                                <p className="text-sm text-white/60 font-medium">{producer.farmName}</p>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--neon-green))]/20 text-[rgb(var(--neon-green))] text-sm font-semibold">
                                            Produtor #{producer.id.slice(0, 6)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Location Map */}
                {locations.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <MapPin className="text-[rgb(var(--neon-green))]" size={28} />
                            Localização de Origem
                        </h2>
                        <div className="glass-card rounded-3xl p-8">
                            <MapView locations={locations} height="450px" />
                        </div>
                    </section>
                )}


                {/* Certifications - from lot data */}
                {lot.certifications && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-white mb-8">Certificações</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {lot.certifications.split(',').map((cert: string, idx: number) => (
                                <div key={idx} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgb(var(--neon-green))]/50 transition-all">
                                    <div className="h-16 w-16 rounded-full bg-[rgb(var(--neon-green))]/20 flex items-center justify-center mb-4">
                                        <Award className="text-[rgb(var(--neon-green))]" size={32} />
                                    </div>
                                    <p className="text-sm font-semibold text-white">{cert.trim()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}



                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card rounded-3xl p-8 text-center hover:border-[rgb(var(--neon-green))]/50 transition-all">
                        <div className="h-16 w-16 rounded-full bg-[rgb(var(--neon-green))]/20 flex items-center justify-center mx-auto mb-4">
                            <Sprout className="text-[rgb(var(--neon-green))]" size={32} />
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">
                            {lot.area} <span className="text-2xl font-normal text-white/60">{lot.unit === 'LITERS' || lot.unit === 'LITROS' || lot.unit === 'Litros' ? 'L' : lot.unit === 'KG' ? 'kg' : lot.unit}</span>
                        </div>
                        <div className="text-sm text-white/70 font-medium">Volume do Lote</div>
                    </div>
                    <div className="glass-card rounded-3xl p-8 text-center hover:border-[rgb(var(--neon-green))]/50 transition-all">
                        <div className="h-16 w-16 rounded-full bg-[rgb(var(--neon-green))]/20 flex items-center justify-center mx-auto mb-4">
                            <User className="text-[rgb(var(--neon-green))]" size={32} />
                        </div>
                        <div className="text-5xl font-bold text-white mb-2">{lot.producers.length}</div>
                        <div className="text-sm text-white/70 font-medium">Famílias Envolvidas</div>
                    </div>
                    <div className="glass-card rounded-3xl p-8 text-center hover:border-[rgb(var(--neon-green))]/50 transition-all">
                        <div className="h-16 w-16 rounded-full bg-[rgb(var(--neon-green))]/20 flex items-center justify-center mx-auto mb-4">
                            <MapPin className="text-[rgb(var(--neon-green))]" size={32} />
                        </div>
                        <div className="text-2xl font-bold text-white mb-2">
                            {lot.locationname || lot.producers[0]?.farmName?.split(',').pop()?.trim() || 'Brasil'}
                        </div>
                        <div className="text-sm text-white/70 font-medium">Região de Origem</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-12 pb-8">
                    <p className="text-sm text-white/40">
                        Rastreabilidade fornecida por <strong className="text-[rgb(var(--neon-green))]">TraceFarm</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
