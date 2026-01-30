'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Leaf, ShieldCheck } from 'lucide-react';

export default function TrackLotPage() {
    const [lotCode, setLotCode] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!lotCode.trim()) {
            return;
        }

        setIsSearching(true);

        // Navigate to the lot detail page
        router.push(`/trace/${lotCode.trim()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-emerald-950">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5" />

                <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-32">
                    {/* Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck size={16} />
                            Rastreabilidade Verificada
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
                            Rastrear Lote
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Digite o código do lote para visualizar toda a jornada do produto, desde a produção até você
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />

                            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                                <div className="flex items-center gap-4 p-6">
                                    <div className="flex-shrink-0">
                                        <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <Package className="text-emerald-600 dark:text-emerald-400" size={24} />
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={lotCode}
                                        onChange={(e) => setLotCode(e.target.value)}
                                        placeholder="Digite o código do lote (ex: MEL-2024-001)"
                                        className="flex-1 text-lg bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
                                        autoFocus
                                    />

                                    <button
                                        type="submit"
                                        disabled={!lotCode.trim() || isSearching}
                                        className="flex-shrink-0 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-zinc-300 disabled:to-zinc-400 dark:disabled:from-zinc-700 dark:disabled:to-zinc-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                    >
                                        <Search size={20} />
                                        {isSearching ? 'Buscando...' : 'Buscar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mt-16">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                                <Leaf className="text-emerald-600 dark:text-emerald-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Origem Verificada
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Conheça os produtores e a origem exata do seu produto
                            </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Transparência Total
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Veja toda a jornada do produto, da colheita ao armazenamento
                            </p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
                            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                                <Package className="text-amber-600 dark:text-amber-400" size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Qualidade Garantida
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Certificações e padrões de qualidade documentados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <div className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-12">
                        Como Funciona
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-2xl mb-4">
                                1
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Digite o Código
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Encontre o código do lote na embalagem do produto
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-2xl mb-4">
                                2
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Busque o Lote
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Nosso sistema localiza todas as informações do lote
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-2xl mb-4">
                                3
                            </div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                                Veja a Jornada
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Explore toda a história e origem do seu produto
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
