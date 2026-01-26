import Link from "next/link";
import { Leaf, ShieldCheck, QrCode } from "lucide-react";
import { TraceInput } from "@/components/ui/trace-input";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-primary-900 to-black text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    AgroTrace &nbsp;
                    <code className="font-mono font-bold">v1.0</code>
                </p>
            </div>

            <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-primary-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-to-t after:from-green-900 after:via-green-800 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-green-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
                <div className="text-center">
                    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-emerald-200 mb-6">
                        Rastreabilidade <br /> Inteligente
                    </h1>
                    <p className="text-xl text-emerald-100/80 mb-8 max-w-2xl mx-auto">
                        Conectando o produtor ao consumidor final com transparência e tecnologia.
                    </p>

                    {/* Trace Input */}
                    <div className="mb-8 flex justify-center">
                        <TraceInput />
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link href="/login" className="px-8 py-3 bg-primary-600 hover:bg-primary-500 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary-500/30 flex items-center gap-2">
                            <Leaf size={20} />
                            Acesso Produtor
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left mt-20 gap-8">
                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
                    <h2 className={`mb-3 text-2xl font-semibold flex items-center gap-2`}>
                        Setup Rápido
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Cadastre seus lotes em segundos e gere QR Codes automaticamente.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
                    <h2 className={`mb-3 text-2xl font-semibold flex items-center gap-2`}>
                        <QrCode />
                        QR Code Dinâmico
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        O mesmo código atualiza informações conforme o lote avança.
                    </p>
                </div>

                <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
                    <h2 className={`mb-3 text-2xl font-semibold flex items-center gap-2`}>
                        <ShieldCheck />
                        Transparência
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Histórico imutável de eventos para garantir a origem.
                    </p>
                </div>
            </div>
        </main>
    );
}
