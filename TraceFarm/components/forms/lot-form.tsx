'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[250px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

interface Producer {
    id: string;
    name: string;
    farmName: string;
}

const CERTIFICATIONS = [
    { value: 'Organic', label: 'Orgânico' },
    { value: 'Fair Trade', label: 'Fair Trade' },
    { value: 'Rainforest Alliance', label: 'Rainforest Alliance' },
    { value: 'Non-GMO', label: 'Não-OGM' },
];

interface LotFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export function LotForm({ initialData, isEdit = false }: LotFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [producers, setProducers] = useState<Producer[]>([]);

    // Initialize state (careful with nulls)
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(
        initialData?.latitude && initialData?.longitude
            ? { lat: initialData.latitude, lng: initialData.longitude }
            : null
    );
    const [selectedCerts, setSelectedCerts] = useState<string[]>(
        initialData?.certifications ? initialData.certifications.split(',') : []
    );
    const [selectedProducerId, setSelectedProducerId] = useState<string>(
        initialData?.producers && initialData.producers.length > 0
            ? initialData.producers[0].id
            : ''
    );

    // Fetch producers
    useEffect(() => {
        fetch('/api/producers').then(res => res.json()).then(data => {
            if (Array.isArray(data)) setProducers(data);
        });
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const harvestDateStr = formData.get('harvestDate') as string;

        // Validação mínima
        if (!selectedProducerId) {
            alert('Selecione um produtor responsável.');
            setLoading(false);
            return;
        }

        if (!harvestDateStr) {
            alert('A data de colheita é obrigatória.');
            setLoading(false);
            return;
        }

        // Calcular data de "plantio" automaticamente (6 meses antes da colheita)
        const harvestDate = new Date(harvestDateStr);
        const plantingDate = new Date(harvestDate);
        plantingDate.setMonth(plantingDate.getMonth() - 6);

        const data = {
            cropType: 'Mel',
            latitude: coords?.lat || null,
            longitude: coords?.lng || null,
            area: parseFloat(formData.get('quantity') as string) || 0,
            unit: formData.get('unit'),
            plantingDate: plantingDate.toISOString(),
            harvestDate: harvestDate.toISOString(),
            harvestWeight: parseFloat(formData.get('quantity') as string) || null,
            quality: formData.get('quality') || null,
            certifications: selectedCerts.join(',') || null,
            storageLocation: formData.get('storageLocation') || null,
            producerIds: [selectedProducerId]
        };

        try {
            const url = isEdit ? `/api/lots/${initialData.id}` : '/api/lots';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                router.push('/dashboard/lots');
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao salvar lote');
            }
        } catch (err) {
            console.error(err);
            alert('Erro ao conectar ao servidor');
        } finally {
            setLoading(false);
        }
    }

    const toggleCertification = (cert: string) => {
        setSelectedCerts(prev =>
            prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
        );
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            <Link href="/dashboard/lots" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Voltar
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Registrar Lote de Mel</h1>
                <p className="text-zinc-500">
                    Cadastro rápido e simples. Preencha apenas as informações básicas.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Identificação do Lote */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">1. Identificação do Lote</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Produto</label>
                                <div className="flex h-10 w-full items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm font-medium text-zinc-600">
                                    🍯 Mel
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Unidade</label>
                                <select
                                    name="unit"
                                    defaultValue={initialData?.unit || "KG"}
                                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    required
                                >
                                    <option value="KG">Quilos (kg)</option>
                                    <option value="LITERS">Litros (L)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Quantidade <span className="text-red-500">*</span></label>
                                <Input
                                    name="quantity"
                                    type="number"
                                    step="0.01"
                                    defaultValue={initialData?.area || ''}
                                    placeholder="Ex: 150"
                                    required
                                    className="focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Produção */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">2. Produção</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Data da Colheita <span className="text-red-500">*</span></label>
                                <Input
                                    name="harvestDate"
                                    type="date"
                                    defaultValue={initialData?.harvestDate ? new Date(initialData.harvestDate).toISOString().split('T')[0] : ''}
                                    max={new Date().toISOString().split("T")[0]}
                                    required
                                    className="focus:ring-2 focus:ring-primary-500"
                                />
                                <p className="text-xs text-zinc-500">Quando o mel foi coletado</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">Período de Produção (opcional)</label>
                                <Input
                                    name="productionPeriod"
                                    type="month"
                                    placeholder="Mês/Ano"
                                    className="focus:ring-2 focus:ring-primary-500"
                                />
                                <p className="text-xs text-zinc-500">Quando as abelhas produziram</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Qualidade */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">3. Qualidade (opcional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Classificação</label>
                            <select
                                name="quality"
                                defaultValue={initialData?.quality || ""}
                                className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Não classificado</option>
                                <option value="Alta">Alta</option>
                                <option value="Média">Média</option>
                                <option value="Baixa">Baixa</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Armazenamento */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">4. Armazenamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Local de Armazenamento</label>
                            <Input
                                name="storageLocation"
                                type="text"
                                defaultValue={initialData?.storageLocation || ""}
                                placeholder="Ex: Galpão 2, Sala de Estoque, Casa de Mel"
                                className="focus:ring-2 focus:ring-primary-500"
                            />
                            <p className="text-xs text-zinc-500">Onde o mel está guardado atualmente</p>
                        </div>
                    </CardContent>
                </Card>

                {/* 5. Certificações */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">5. Certificações (opcional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {CERTIFICATIONS.map(cert => (
                                <label
                                    key={cert.value}
                                    className="flex items-center space-x-3 p-3 border border-zinc-200 rounded-lg hover:bg-zinc-50 cursor-pointer transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCerts.includes(cert.value)}
                                        onChange={() => toggleCertification(cert.value)}
                                        className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium">{cert.label}</span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-500 mt-3">Marque as certificações que o lote possui</p>
                    </CardContent>
                </Card>

                {/* 6. Origem do Lote */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin size={18} />
                            6. Origem do Lote (opcional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-zinc-600">Marque um ponto aproximado no mapa onde o mel foi produzido</p>
                        <MapPicker
                            onChange={(lat, lng) => setCoords({ lat, lng })}
                            lat={coords?.lat}
                            lng={coords?.lng}
                        />
                        {coords && (
                            <p className="text-xs text-zinc-500">
                                📍 Localização marcada: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* 7. Produtor Responsável */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">7. Produtor Responsável <span className="text-red-500">*</span></CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {producers.length === 0 ? (
                            <div className="text-center py-8 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
                                <p className="text-sm text-zinc-600 mb-3">Nenhum produtor cadastrado ainda</p>
                                <Link href="/dashboard/producers/new">
                                    <Button type="button" variant="outline" size="sm">
                                        + Cadastrar Primeiro Produtor
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <select
                                        value={selectedProducerId}
                                        onChange={(e) => setSelectedProducerId(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    >
                                        <option value="">Selecione um produtor...</option>
                                        {producers.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} - {p.farmName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-right">
                                    <Link href="/dashboard/producers/new" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                                        + Cadastrar novo produtor
                                    </Link>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="min-w-[160px] h-11 text-base font-semibold"
                        size="lg"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : '✓ Registrar Lote'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
