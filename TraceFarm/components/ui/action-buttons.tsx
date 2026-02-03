'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ActionButtonsProps {
    id: string;
    type: 'producers' | 'lots' | 'users';
}

export function ActionButtons({ id, type }: ActionButtonsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleDelete(e: React.MouseEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (!confirm('Tem certeza que deseja excluir? Esta ação não pode ser desfeita.')) return;

        setLoading(true);
        try {
            const apiPath = type === 'users' ? `/api/admin/${type}/${id}` : `/api/${type}/${id}`;
            const res = await fetch(apiPath, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Erro ao excluir');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao conectar ao servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <Link href={type === 'users' ? `/admin/users/${id}/edit` : `/dashboard/${type}/${id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-blue-600 hover:bg-blue-50">
                    <Edit size={16} />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={loading}
            >
                <Trash2 size={16} />
            </Button>
        </div>
    );
}
