import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Phone, Globe, Award, Leaf, Package, Calendar } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/ui/map-view'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

export const dynamicParams = true;
export const revalidate = 0;

export default async function ProducerProfilePage({ params }: { params: { id: string } }) {
    const producer = await prisma.user.findUnique({
        where: { id: params.id },
        include: {
            lots: {
                orderBy: { createdAt: 'desc' },
                take: 10
            }
        }
    });

    if (!producer) {
        notFound();
    }

    // Parse farm images from JSON
    let farmImages: string[] = [];
    try {
        if (producer.farmImages) {
            farmImages = JSON.parse(producer.farmImages);
        }
    } catch (e) {
        console.error('Error parsing farm images:', e);
    }

    // If no gallery images, use the primary image
    if (farmImages.length === 0 && producer.farmImage) {
        farmImages = [producer.farmImage];
    }

    // Prepare location data for map
    const locations = [];
    if (producer.farmLatitude && producer.farmLongitude) {
        locations.push({
            lat: producer.farmLatitude,
            lng: producer.farmLongitude,
            label: producer.farmName || 'Fazenda',
            description: 'Localização da propriedade',
            type: 'farm' as const
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
            {/* Hero Section */}
            <div className="relative h-80 md:h-96 bg-gradient-to-br from-emerald-900 to-green-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-end gap-6">
                            {/* Producer Avatar */}
                            <div className="h-32 w-32 rounded-2xl bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 shadow-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-5xl font-bold shrink-0">
                                {producer.name ? producer.name[0].toUpperCase() : 'P'}
                            </div>

                            <div className="pb-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {producer.name || 'Produtor'}
                                </h1>
                                <p className="text-xl text-emerald-100 font-medium">
                                    {producer.farmName || 'Fazenda'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 pb-16 -mt-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About Section */}
                        {producer.bio && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                    <Leaf className="text-emerald-600" size={24} />
                                    Sobre o Produtor
                                </h2>
                                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                                    {producer.bio}
                                </p>
                            </section>
                        )}

                        {/* Farm Gallery */}
                        {farmImages.length > 0 && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                    <Package className="text-emerald-600" size={24} />
                                    Galeria da Fazenda
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {farmImages.map((image, index) => (
                                        <div key={index} className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 hover:scale-105 transition-transform cursor-pointer">
                                            <img
                                                src={image}
                                                alt={`Fazenda ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Farm Location Map */}
                        {locations.length > 0 && (
                            <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                    <MapPin className="text-emerald-600" size={24} />
                                    Localização
                                </h2>
                                <MapView locations={locations} height="400px" />
                            </section>
                        )}


                        {/* Lots Produced */}
                        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                <Package className="text-emerald-600" size={24} />
                                Lotes Produzidos
                            </h2>

                            {producer.lots.length > 0 ? (
                                <div className="space-y-4">
                                    {producer.lots.map((lot) => (
                                        <Link
                                            key={lot.id}
                                            href={`/trace/${lot.code}`}
                                            className="block bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                                        {lot.code}
                                                    </h3>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        {lot.cropType} • {lot.area} {lot.unit}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-500 flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(lot.harvestDate).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                                    Nenhum lote registrado ainda
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Right Column - Contact & Info */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                                Informações de Contato
                            </h3>

                            <div className="space-y-4">
                                {producer.phone && (
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                            <Phone className="text-blue-600 dark:text-blue-400" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Telefone</p>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                {producer.phone}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {producer.website && (
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                                            <Globe className="text-purple-600 dark:text-purple-400" size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Website</p>
                                            <a
                                                href={producer.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                                            >
                                                Visitar site
                                            </a>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Certifications */}
                        {producer.certifications && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                    <Award className="text-amber-600" size={20} />
                                    Certificações
                                </h3>
                                <div className="space-y-2">
                                    {producer.certifications.split(',').map((cert: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                        >
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                            {cert.trim()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 shadow-lg text-white">
                            <h3 className="font-bold mb-4">Estatísticas</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-emerald-100 text-sm mb-1">Total de Lotes</p>
                                    <p className="text-3xl font-bold">{producer.lots.length}</p>
                                </div>
                                <div>
                                    <p className="text-emerald-100 text-sm mb-1">Membro desde</p>
                                    <p className="text-lg font-semibold">
                                        {new Date(producer.createdAt).toLocaleDateString('pt-BR', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
