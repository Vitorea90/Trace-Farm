'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, QrCode, Loader2, Printer } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LotClientActions({ lotId, lotCode }: { lotId: string, lotCode: string }) {
    const router = useRouter();
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [isQRModalOpen, setQRModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Derive trace URL from current window location (client-side only)
    const [origin, setOrigin] = useState('');
    React.useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const traceUrl = `${origin}/trace/${lotId}`;

    async function handleAddEvent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            type: 'SOLD',
            title: `Venda para ${formData.get('buyerName')}`,
            description: formData.get('description'),
            date: formData.get('date'),
            buyerName: formData.get('buyerName'),
            buyerType: formData.get('buyerType'),
            quantitySold: parseFloat(formData.get('quantitySold') as string),
        };

        try {
            await fetch(`/api/lots/${lotId}/events`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            setEventModalOpen(false);
            router.refresh();
        } catch (err) {
            alert('Erro ao adicionar evento');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setQRModalOpen(true)} className="gap-2">
                    <QrCode size={18} />
                    QR Code
                </Button>
                <Button onClick={() => setEventModalOpen(true)} className="gap-2">
                    <Plus size={18} />
                    Registrar Venda
                </Button>
            </div>

            {/* Add Sale Event Modal */}
            <Modal isOpen={isEventModalOpen} onClose={() => setEventModalOpen(false)} title="Registrar Venda">
                <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Comprador</label>
                        <Input name="buyerName" placeholder="Ex: Distribuidora ABC Ltda" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo de Comprador</label>
                        <select name="buyerType" className="w-full h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm" required>
                            <option value="">Selecione...</option>
                            <option value="WHOLESALER">Atacadista</option>
                            <option value="DISTRIBUTOR">Distribuidor</option>
                            <option value="RETAILER">Varejista</option>
                            <option value="CONSUMER">Consumidor Final</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quantidade Vendida</label>
                        <Input name="quantitySold" type="number" step="0.01" placeholder="Ex: 500" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Observações (opcional)</label>
                        <textarea
                            name="description"
                            className="w-full min-h-[80px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                            placeholder="Informações adicionais sobre a venda..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Data da Venda</label>
                        <Input name="date" type="datetime-local" defaultValue={new Date().toISOString().slice(0, 16)} required />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setEventModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Registrar Venda'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* QR Code Modal */}
            <Modal isOpen={isQRModalOpen} onClose={() => setQRModalOpen(false)} title={`QR Code: ${lotCode}`}>
                <div className="flex flex-col items-center justify-center p-4 space-y-6">
                    <div className="bg-white p-4 rounded-xl shadow-inner border">
                        <QRCodeSVG value={traceUrl} size={200} />
                    </div>
                    <p className="text-center text-sm text-zinc-500 max-w-[80%]">
                        Escaneie este código para acessar a rastreabilidade completa deste lote.
                    </p>
                    <div className="flex w-full gap-2">
                        <Button className="w-full gap-2" variant="secondary" onClick={() => window.print()}>
                            <Printer size={16} /> Imprimir Etiqueta
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
