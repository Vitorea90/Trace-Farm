import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, Image as ImageIcon, Mail } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CooperativeProfilePage({ params }: { params: { id: string } }) {
    const cooperative = await prisma.user.findUnique({
        where: {
            id: params.id,
            role: 'COOP'
        },
        select: {
            id: true,
            name: true,
            email: true,
            cooperativeImage: true,
            profile: true,
            cooperativeGallery: true
        }
    });

    if (!cooperative) {
        notFound();
    }

    // Parse gallery images
    let galleryImages: string[] = [];
    if (cooperative.cooperativeGallery) {
        try {
            galleryImages = JSON.parse(cooperative.cooperativeGallery);
        } catch (e) {
            console.error('Error parsing gallery images:', e);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
            {/* Hero Section */}
            <div className="relative h-64 bg-gradient-to-br from-primary-900 to-emerald-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent" />
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 pb-16 -mt-32 relative z-10">
                {/* Profile Card */}
                <Card className="shadow-xl">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                {cooperative.cooperativeImage ? (
                                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-lg">
                                        <Image
                                            src={cooperative.cooperativeImage}
                                            alt={cooperative.name || 'Cooperativa'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-primary-100 to-emerald-100 dark:from-primary-900 dark:to-emerald-900 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-lg">
                                        <Building2 className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {cooperative.name || 'Cooperativa'}
                                </h1>

                                {cooperative.email && (
                                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mb-4">
                                        <Mail size={16} />
                                        <a href={`mailto:${cooperative.email}`} className="hover:text-primary-600 transition-colors">
                                            {cooperative.email}
                                        </a>
                                    </div>
                                )}

                                {cooperative.profile ? (
                                    <div className="mt-4">
                                        <h2 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                            Sobre Nós
                                        </h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">
                                            {cooperative.profile}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-zinc-500 italic mt-4">
                                        Nenhuma descrição disponível.
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Photo Gallery */}
                {galleryImages.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Galeria de Fotos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {galleryImages.map((imageUrl, index) => (
                                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
                                        <Image
                                            src={imageUrl}
                                            alt={`Foto ${index + 1}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center pt-12 opacity-50">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Perfil público da cooperativa
                    </p>
                </div>
            </div>
        </div>
    );
}
