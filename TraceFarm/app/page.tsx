import Link from "next/link";
import { ArrowRight, QrCode, Menu, Tractor } from "lucide-react";

export default function Home() {
    return (
        <main className="relative min-h-screen flex flex-col text-white font-sans overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1625246333195-24d2050f87cd?q=80&w=2670&auto=format&fit=crop"
                    alt="Farm Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/80 to-zinc-900/40" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center text-black">
                        <Tractor size={20} />
                    </div>
                    <span>Trace Farm</span>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Menu size={24} />
                </button>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 pb-20 max-w-7xl mx-auto w-full">
                <div className="max-w-2xl space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-400 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Web3 Agrotech
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                        Rastreabilidade agrícola que gera <span className="text-green-500">confiança</span>,<br className="hidden md:block" /> transparência e valor.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-zinc-300 max-w-xl leading-relaxed">
                        A plataforma Web3 que conecta o campo ao consumidor final com dados imutáveis, garantindo a origem de cada produto.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/dashboard">
                            <button className="w-full sm:w-auto h-12 md:h-14 px-8 rounded-lg bg-green-500 hover:bg-green-400 text-black font-semibold text-base transition-all flex items-center justify-center gap-2">
                                Acessar Dashboard
                                <ArrowRight size={20} />
                            </button>
                        </Link>

                        <Link href="/trace">
                            <button className="w-full sm:w-auto h-12 md:h-14 px-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                                <QrCode size={20} className="text-green-500" />
                                Rastrear um Lote
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
