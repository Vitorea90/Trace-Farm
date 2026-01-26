import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Bem-vindo, Produtor</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Aqui está o resumo da sua produção hoje.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Lotes Ativos</CardTitle>
                        <Sprout className="h-4 w-4 text-primary-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 iniciados esta semana</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Próximas Colheitas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Lotes #A12, #B04, #C01</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Tudo certo por aqui.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Ações Rápidas</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/dashboard/lots/new">
                    <Button size="lg" className="w-full h-24 text-lg bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-primary-400 shadow-sm">
                        + Novo Lote
                    </Button>
                </Link>
                <Link href="/dashboard/lots">
                    <Button size="lg" variant="outline" className="w-full h-24 text-lg">
                        Ver Todos os Lotes
                    </Button>
                </Link>
            </div>
        </div>
    );
}
