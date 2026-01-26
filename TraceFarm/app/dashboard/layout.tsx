import Link from "next/link";
import { LayoutDashboard, Sprout, Settings, LogOut, Users } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-earth-50 dark:bg-zinc-950">
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-emerald-600">
                        AgroTrace
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Visão Geral</span>
                    </Link>
                    <Link href="/dashboard/lots" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors">
                        <Sprout size={20} />
                        <span className="font-medium">Meus Lotes</span>
                    </Link>
                    <Link href="/dashboard/producers" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">Produtores</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <Settings size={20} />
                            <span className="font-medium">Configurações</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-sm">
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
