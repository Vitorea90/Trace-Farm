import Link from "next/link";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, User, MapPin } from "lucide-react";
import { ActionButtons } from "@/components/ui/action-buttons";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        where: {
            role: {
                in: ['ADMIN', 'COOP']
            }
        },
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { lots: true } } }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Cooperativas & Admins</h1>
                    <p className="text-zinc-500">Gerencie cooperativas e administradores do sistema.</p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="gap-2">
                        <Plus size={16} /> Novo Usuário
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                    <Card key={user.id} className="group hover:shadow-lg transition-all relative">
                        <CardHeader className="space-y-0 p-4 flex flex-row gap-4 items-center justify-between">
                            <div className="flex gap-4 items-center overflow-hidden">
                                {user.profileImage ? (
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                                        <img src={user.profileImage} alt={user.name || 'User'} className="h-full w-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold shrink-0 border border-purple-200">
                                        {user.name ? user.name[0] : 'U'}
                                    </div>
                                )}
                                <div className="overflow-hidden">
                                    <CardTitle className="text-base truncate">{user.name}</CardTitle>
                                    <div className="text-xs text-zinc-500 font-medium px-2 py-0.5 rounded-full bg-zinc-100 inline-block mt-1">
                                        {user.role}
                                    </div>
                                </div>
                            </div>
                            <ActionButtons id={user.id} type="users" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                                {user.email}
                            </div>
                            {user.farmName && (
                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <MapPin size={16} />
                                    {user.farmName}
                                </div>
                            )}
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <span className="text-xs text-zinc-500">{user._count.lots} lotes</span>
                                <span className="text-xs text-zinc-400">Criado em: {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
