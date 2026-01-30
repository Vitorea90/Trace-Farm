import Link from 'next/link';
import { User, Home, Search } from 'lucide-react';

export default function ProducerNotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        <User className="text-zinc-400 dark:text-zinc-600" size={48} />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                    Produtor Não Encontrado
                </h1>

                {/* Description */}
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    O perfil do produtor que você está procurando não foi encontrado em nosso sistema.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/trace"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        <Search size={20} />
                        Rastrear Lote
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
                    >
                        <Home size={20} />
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        </div>
    );
}
