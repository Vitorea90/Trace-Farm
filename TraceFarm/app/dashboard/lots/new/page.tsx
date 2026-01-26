'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import MapPicker
const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-100 animate-pulse rounded-lg" />
});

interface Producer {
    id: string;
    name: string;
    farmName: string;
}

const CERTIFICATIONS = [
    { value: 'Organic', label: 'Orgânico (USDA/EU)' },
    { value: 'Rainforest Alliance', label: 'Rainforest Alliance' },
    { value: 'Fair Trade', label: 'Fair Trade' },
    { value: 'Non-GMO', label: 'Não-OGM' },
];

export default function NewLotPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [producers, setProducers] = useState<Producer[]>([]);
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

    // UseEffect to fetch producers
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

        // Validation
        const selectedProducers = formData.getAll('producers');
        if (selectedProducers.length === 0) {
            alert('Selecione pelo menos um produtor responsável.');
            setLoading(false);
            return;
        }

        if (!harvestDateStr) {
            alert('A data de colheita é obrigatória.');
            setLoading(false);
            return;
        }

        const harvestDate = new Date(harvestDateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (harvestDate > today) {
            alert('Data de colheita não pode ser futura.');
            setLoading(false);
            return;
        }

        const data = {
            cropType: formData.get('cropType'),
            latitude: coords?.lat || null,
            longitude: coords?.lng || null,
            area: formData.get('area'),
            unit: formData.get('unit'),
            plantingDate: formData.get('plantingDate'),
            harvestDate: harvestDateStr,
            harvestWeight: formData.get('harvestWeight') || null,
            quality: formData.get('quality') || null,
            certifications: selectedCerts.join(',') || null,
            storageLocation: formData.get('storageLocation') || null,
            producerIds: selectedProducers
        };

        try {
            const res = await fetch('/api/lots', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                router.push('/dashboard/lots');
                router.refresh();
            } else {
                alert('Erro ao criar lote');
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
        <div className="max-w-2xl mx-auto space-y-6">
            <Link href="/dashboard/lots" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
            </Link>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Registrar Lote (Produto Colhido)</h1>
                <p className="text-zinc-500">Cadastre um lote já colhido com todas as informações de produção e qualidade.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados do Lote</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* 1. Basic Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Informações do Produto</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cultura</label>
                                    <select
                                        name="cropType"
                                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="Mel">Mel</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Unidade de Medida</label>
                                    <select
                                        name="unit"
                                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="KG">Quilos (kg)</option>
                                        <option value="LITERS">Litros (L)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantidade Total do Lote</label>
                                <Input name="area" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                        </div>

                        {/* 2. Harvest Information */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Informações da Colheita</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Data de Plantio</label>
                                    <Input name="plantingDate" type="date" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Data da Colheita</label>
                                    <Input name="harvestDate" type="date" required max={new Date().toISOString().split("T")[0]} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Peso Total Colhido (opcional)</label>
                                    <Input name="harvestWeight" type="number" step="0.01" placeholder="Ex: 1500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Classificação de Qualidade</label>
                                    <select
                                        name="quality"
                                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Premium">Premium</option>
                                        <option value="A">Classe A</option>
                                        <option value="B">Classe B</option>
                                        <option value="C">Classe C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Local de Armazenamento</label>
                                <Input name="storageLocation" type="text" placeholder="Ex: Armazém Central, Câmara Fria #3" />
                            </div>
                        </div>

                        {/* 3. Certifications */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Certificações</h3>
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
                        </div>

                        {/* 4. Geolocation */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                                <MapPin size={16} /> Georreferenciação do Lote (Opcional)
                            </h3>
                            <p className="text-xs text-zinc-500">Local de processamento ou armazenamento do lote.</p>
                            <MapPicker
                                onChange={(lat, lng) => setCoords({ lat, lng })}
                                lat={coords?.lat}
                                lng={coords?.lng}
                            />
                        </div>

                        {/* 5. Producers */}
                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-zinc-500">Produtores Responsáveis</h3>
                            <div className="grid grid-cols-1 gap-2 bg-zinc-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                                {producers.length === 0 && <p className="text-sm text-zinc-400">Nenhum produtor cadastrado. Cadastre um produtor antes.</p>}
                                {producers.map(p => (
                                    <label key={p.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer border border-transparent hover:border-zinc-200 transition-all">
                                        <input type="checkbox" name="producers" value={p.id} className="h-4 w-4 rounded border-zinc-300 text-primary-600 focus:ring-primary-500" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-zinc-900">{p.name}</span>
                                            <span className="text-xs text-zinc-500">{p.farmName}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="text-right">
                                <Link href="/dashboard/producers/new" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                    + Cadastrar novo produtor
                                </Link>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                            <Button type="submit" disabled={loading} className="w-32">
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Registrar Lote'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
