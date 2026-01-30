'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/ui/image-upload';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

interface ProducerFormProps {
    initialData?: {
        id?: string;
        name: string | null;
        email: string;
        farmName: string | null;
        farmLatitude: number | null;
        farmLongitude: number | null;
        farmImage: string | null;
        farmImages: string | null;
        profileImage: string | null;
        bio: string | null;
        phone: string | null;
        certifications: string | null;
        website: string | null;
    };
    isEdit?: boolean;
}

export function ProducerForm({ initialData, isEdit = false }: ProducerFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(
        initialData?.farmLatitude && initialData?.farmLongitude
            ? { lat: initialData.farmLatitude, lng: initialData.farmLongitude }
            : null
    );

    // Parse farm images from JSON
    let initialFarmImages: string[] = [];
    try {
        if (initialData?.farmImages) {
            initialFarmImages = JSON.parse(initialData.farmImages);
        }
    } catch (e) {
        console.error('Error parsing farm images:', e);
    }

    const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profileImage || '');
    const [farmImageUrls, setFarmImageUrls] = useState<string[]>(initialFarmImages);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            farmName: formData.get('farmName'),
            farmLatitude: coords?.lat || 0,
            farmLongitude: coords?.lng || 0,
            farmImage: farmImageUrls[0] || '', // First farm image as primary
            farmImages: JSON.stringify(farmImageUrls),
            profileImage: profileImageUrl,
            bio: formData.get('bio'),
            phone: formData.get('phone'),
            certifications: formData.get('certifications'),
            website: formData.get('website'),
        };

        if (!coords) {
            alert("Por favor, selecione a localização no mapa.");
            setLoading(false);
            return;
        }

        try {
            const url = isEdit ? `/api/producers/${initialData?.id}` : '/api/producers';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                router.push('/dashboard/producers');
                router.refresh();
            } else {
                alert('Erro ao salvar produtor');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao conectar ao servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/dashboard/producers" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Editar Produtor' : 'Novo Produtor'}</h1>
                <p className="text-zinc-500">{isEdit ? 'Atualize os dados do produtor.' : 'Cadastre o produtor e os dados geográficos da fazenda.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome Completo *</label>
                                <Input name="name" defaultValue={initialData?.name || ''} placeholder="Ex: João da Silva" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email *</label>
                                <Input name="email" type="email" defaultValue={initialData?.email || ''} placeholder="contato@fazenda.com" required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Telefone</label>
                                <Input name="phone" type="tel" defaultValue={initialData?.phone || ''} placeholder="(00) 00000-0000" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Website</label>
                                <Input name="website" type="url" defaultValue={initialData?.website || ''} placeholder="https://www.fazenda.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Biografia / História</label>
                            <Textarea
                                name="bio"
                                defaultValue={initialData?.bio || ''}
                                placeholder="Conte a história do produtor e da fazenda..."
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Certificações</label>
                            <Input
                                name="certifications"
                                defaultValue={initialData?.certifications || ''}
                                placeholder="Ex: Orgânico, Fair Trade, Rainforest Alliance (separados por vírgula)"
                            />
                            <p className="text-xs text-zinc-500">Separe múltiplas certificações com vírgula</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Foto de Perfil</label>
                            <p className="text-xs text-zinc-500 mb-2">Foto que aparecerá no perfil do produtor</p>
                            <ImageUpload value={profileImageUrl} onChange={setProfileImageUrl} />
                        </div>
                    </CardContent>
                </Card>

                {/* Farm Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dados da Propriedade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome da Fazenda / Apiário *</label>
                            <Input name="farmName" defaultValue={initialData?.farmName || ''} placeholder="Ex: Fazenda Santa Clara" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Localização (Mapa) *</label>
                            <p className="text-xs text-zinc-500 mb-2">Clique no mapa para marcar a localização exata.</p>
                            <MapPicker
                                onChange={(lat, lng) => setCoords({ lat, lng })}
                                lat={coords?.lat}
                                lng={coords?.lng}
                            />
                        </div>

                        <div className="space-y-2">
                            <MultiImageUpload
                                value={farmImageUrls}
                                onChange={setFarmImageUrls}
                                maxImages={6}
                                label="Fotos da Fazenda (máximo 6)"
                            />
                            <p className="text-xs text-zinc-500">
                                Adicione fotos da fazenda, apiário, produção de mel, etc. A primeira foto será usada como imagem principal.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                    <Button type="submit" disabled={loading} className="w-32">
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Salvar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
