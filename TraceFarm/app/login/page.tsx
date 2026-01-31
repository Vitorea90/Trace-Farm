"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Leaf } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Set cookies based on role
                const isProd = process.env.NODE_ENV === "production";
                const secure = isProd ? "; Secure" : "";

                document.cookie = `auth_token=true; path=/; max-age=86400; SameSite=Strict${secure}`;
                // 'coop' is the manager role now
                const roleCookie = data.user.role === 'ADMIN' ? 'admin' : 'coop';
                document.cookie = `auth_role=${roleCookie}; path=/; max-age=86400; SameSite=Strict${secure}`;

                if (data.user.role === "ADMIN") {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
                router.refresh();
            } else {
                setError(data.error || "Erro ao fazer login");
            }
        } catch (err) {
            setError("Erro de conexão. Tente novamente.");
            console.error(err);
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
                    <h1 className="text-3xl font-bold text-white mb-2">TraceFarm</h1>
                    <p className="text-primary-100">Acesso Produtor/Cooperativa</p>
                </div>

                {/* Login Form */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Usuário
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                placeholder="Digite seu usuário"
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
