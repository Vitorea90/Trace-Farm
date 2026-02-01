'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Image as ImageIcon, Building2 } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [cooperativeImage, setCooperativeImage] = useState('');
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const logoInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data.profile || '');
                setUserName(data.name || '');
                setUserRole(data.role || '');
                setCooperativeImage(data.cooperativeImage || '');

                if (data.cooperativeGallery) {
                    try {
                        setGalleryImages(JSON.parse(data.cooperativeGallery));
                    } catch (e) {
                        setGalleryImages([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (file: File, type: 'logo' | 'gallery') => {
        if (!file.type.startsWith('image/')) {
            setMessage('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage('A imagem deve ter no máximo 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type === 'logo') {
                setCooperativeImage(base64String);
            } else {
                if (galleryImages.length < 6) {
                    setGalleryImages([...galleryImages, base64String]);
                } else {
                    setMessage('Você pode adicionar no máximo 6 fotos na galeria.');
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(galleryImages.filter((_, i) => i !== index));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile,
                    cooperativeImage,
                    cooperativeGallery: JSON.stringify(galleryImages)
                })
            });

            if (response.ok) {
                setMessage('Perfil atualizado com sucesso!');
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setMessage('Erro ao salvar perfil.');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Erro ao salvar perfil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-zinc-500">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Perfil da Cooperativa
                </h1>
                <p className="text-zinc-500">Gerencie as informações públicas da sua cooperativa</p>
            </div>

            {/* Logo Upload */}
            <Card>
                <CardHeader>
                    <CardTitle>Logo da Cooperativa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        {cooperativeImage ? (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary-200">
                                <Image
                                    src={cooperativeImage}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    onClick={() => setCooperativeImage('')}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                                <Building2 className="h-12 w-12 text-zinc-400" />
                            </div>
                        )}

                        <div className="flex-1">
                            <p className="text-sm text-zinc-500 mb-3">
                                Adicione o logo ou foto de perfil da sua cooperativa. Tamanho máximo: 5MB.
                            </p>
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, 'logo');
                                }}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => logoInputRef.current?.click()}
                                disabled={loading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {cooperativeImage ? 'Alterar Logo' : 'Upload Logo'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Descrição da Cooperativa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-zinc-500 mb-2">
                            Adicione informações sobre sua cooperativa, missão, valores e história.
                        </p>
                        <Textarea
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                            placeholder="Ex: Somos uma cooperativa dedicada à produção sustentável de mel de alta qualidade..."
                            className="min-h-[150px]"
                            disabled={loading}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Upload */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Galeria de Fotos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-zinc-500">
                        Adicione até 6 fotos da sua cooperativa, instalações ou produtos.
                    </p>

                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {galleryImages.map((img, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                    <Image
                                        src={img}
                                        alt={`Foto ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    <button
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {galleryImages.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
                            <ImageIcon className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-sm text-zinc-500">
                                Nenhuma foto na galeria ainda.
                            </p>
                        </div>
                    )}

                    {galleryImages.length < 6 && (
                        <>
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, 'gallery');
                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => galleryInputRef.current?.click()}
                                disabled={loading}
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Adicionar Foto ({galleryImages.length}/6)
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
                <CardContent className="pt-6">
                    {message && (
                        <p className={`text-sm mb-4 ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}

                    <Button
                        onClick={handleSaveProfile}
                        disabled={saving || loading}
                        className="w-full sm:w-auto"
                        size="lg"
                    >
                        {saving ? 'Salvando...' : 'Salvar Todas as Alterações'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
