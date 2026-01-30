import Link from 'next/link';
import { Search, Home, Package } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Package className="text-amber-600 dark:text-amber-400" size={48} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Lote Não Encontrado
                </h1>

                {/* Description */}
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    O código do lote que você está procurando não foi encontrado em nosso sistema.
                    Verifique se digitou corretamente ou tente outro código.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/trace"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Search size={20} />
                        Buscar Outro Lote
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
                    >
                        <Home size={20} />
                        Voltar ao Início
                    </Link>
                </div>

                {/* Tips */}
                <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-left">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <Search size={18} />
                        Dicas de Busca
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                        <li>• Verifique se o código está correto (ex: LOT-9393-2026)</li>
                        <li>• Certifique-se de que não há espaços extras</li>
                        <li>• O código geralmente está na embalagem do produto</li>
                        <li>• Letras maiúsculas e minúsculas fazem diferença</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
