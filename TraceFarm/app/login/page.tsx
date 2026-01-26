"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Leaf } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock authentication - just check if fields are not empty
        if (email.trim() && password.trim()) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-black p-6">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 mb-4">
                        <Leaf className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">AgroTrace</h1>
                    <p className="text-primary-100">Acesso Produtor</p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <LogIn size={20} />
                            Entrar
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
                            ← Voltar para página inicial
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
