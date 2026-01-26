'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/ui/image-upload';
import dynamic from 'next/dynamic';

// Dynamically import MapPicker to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

export default function NewProducerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Manual overrides from state
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            farmName: formData.get('farmName'),
            farmLatitude: coords?.lat || 0,
            farmLongitude: coords?.lng || 0,
            farmImage: imageUrl,
        };

        if (!coords) {
            alert("Por favor, selecione a localização no mapa.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/producers', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                router.push('/dashboard/producers');
                router.refresh();
            } else {
                alert('Erro ao criar produtor');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao conectar ao servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/dashboard/producers" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Novo Produtor</h1>
                <p className="text-zinc-500">Cadastre o produtor e os dados geográficos da fazenda.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Produtor & Fazenda</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome Completo</label>
                            <Input name="name" placeholder="Ex: João da Silva" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" placeholder="contato@fazenda.com" required />
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                            <h3 className="text-base font-semibold">Dados da Propriedade</h3>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nome da Fazenda / Apiário</label>
                                <Input name="farmName" placeholder="Ex: Fazenda Santa Clara" required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Localização (Mapa)</label>
                                <p className="text-xs text-zinc-500 mb-2">Clique no mapa para marcar a localização exata.</p>
                                <MapPicker
                                    onChange={(lat, lng) => setCoords({ lat, lng })}
                                    lat={coords?.lat}
                                    lng={coords?.lng}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imagem da Fazenda</label>
                                <ImageUpload value={imageUrl} onChange={setImageUrl} />
                            </div>
                        </div>

                        <div className="pt-6 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                            <Button type="submit" disabled={loading} className="w-32">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
