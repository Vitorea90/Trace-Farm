"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function TraceInput() {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim()) {
            router.push(`/trace/${code.trim()}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Digite o código de rastreamento"
                    className="w-full px-6 py-4 pr-12 rounded-full text-zinc-900 dark:text-zinc-100 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm border-2 border-zinc-200 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none shadow-lg transition-all"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-500 text-white rounded-full p-3 transition-all shadow-md hover:shadow-lg"
                >
                    <Search size={20} />
                </button>
            </div>
        </form>
    );
}
