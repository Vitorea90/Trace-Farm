"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <div className="flex min-h-screen bg-background">
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <Link href="/admin" className="block">
                        <Image
                            src="/tracefarm-logo.png"
                            alt="TraceFarm Admin"
                            width={320}
                            height={80}
                            className="w-auto h-24 invert dark:invert-0"
                            priority
                        />
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') && pathname === '/admin' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Visão Geral</span>
                    </Link>
                    <Link href="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/10 dark:text-purple-400' : 'text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                        <Users size={20} />
                        <span className="font-medium">Usuários</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </Link>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
