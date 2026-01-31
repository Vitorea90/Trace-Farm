'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5MB.");
            e.target.value = ""; // Reset input
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            alert('Falha no upload da imagem');
        } finally {
            setLoading(false);
        }
    }

    if (value) {
        return (
            <div className="relative w-full h-48 bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
                <Image src={value} alt="Upload" fill className="object-cover" />
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        )
    }

    return (
        <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-primary-400 transition-all group"
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            {loading ? (
                <Loader2 className="animate-spin text-primary-500" size={32} />
            ) : (
                <>
                    <div className="p-3 bg-zinc-100 rounded-full mb-3 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Upload size={24} className="text-zinc-500 group-hover:text-primary-600" />
                    </div>
                    <p className="text-sm font-medium text-zinc-600">Clique para enviar imagem</p>
                    <p className="text-xs text-zinc-400 mt-1">JPG, PNG (Max 5MB)</p>
                </>
            )}
        </div>
    );
}
