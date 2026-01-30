'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface MultiImageUploadProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    label?: string;
}

export function MultiImageUpload({ value = [], onChange, maxImages = 6, label }: MultiImageUploadProps) {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Check if adding these files would exceed the limit
        if (value.length + files.length > maxImages) {
            alert(`Você pode adicionar no máximo ${maxImages} imagens`);
            return;
        }

        setLoading(true);
        const newUrls: string[] = [];

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (data.url) {
                    newUrls.push(data.url);
                }
            }

            onChange([...value, ...newUrls]);
        } catch (error) {
            alert('Falha no upload de uma ou mais imagens');
        } finally {
            setLoading(false);
            // Reset input
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        }
    }

    function removeImage(index: number) {
        const newUrls = value.filter((_, i) => i !== index);
        onChange(newUrls);
    }

    const canAddMore = value.length < maxImages;

    return (
        <div className="space-y-4">
            {label && (
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{label}</label>
                    <span className="text-xs text-zinc-500">
                        {value.length} / {maxImages} imagens
                    </span>
                </div>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {value.map((url, index) => (
                        <div key={index} className="relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200 group">
                            <Image src={url} alt={`Upload ${index + 1}`} fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {canAddMore && (
                <div
                    onClick={() => !loading && inputRef.current?.click()}
                    className={`w-full h-32 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 hover:border-emerald-400 transition-all group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin text-emerald-500 mb-2" size={28} />
                            <p className="text-sm text-zinc-600">Enviando imagens...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-2 bg-zinc-100 rounded-full mb-2 group-hover:bg-emerald-50 transition-colors">
                                <Upload size={20} className="text-zinc-500 group-hover:text-emerald-600" />
                            </div>
                            <p className="text-sm font-medium text-zinc-600">Adicionar imagens</p>
                            <p className="text-xs text-zinc-400 mt-1">
                                {value.length === 0 ? 'Clique ou arraste imagens' : `Adicionar mais (${maxImages - value.length} restantes)`}
                            </p>
                        </>
                    )}
                </div>
            )}

            {!canAddMore && (
                <p className="text-sm text-zinc-500 text-center py-2">
                    Limite de {maxImages} imagens atingido
                </p>
            )}
        </div>
    );
}
