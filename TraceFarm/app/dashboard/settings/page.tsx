import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Configurações</h1>
                <p className="text-zinc-500">Gerencie suas preferências e dados da conta.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Perfil do Produtor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nome da Fazenda / Produtor</label>
                            <Input defaultValue="Produtor Exemplo" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input defaultValue="produtor@exemplo.com" />
                        </div>
                    </div>
                    <Button>Salvar Alterações</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Preferências do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Modo Escuro</p>
                            <p className="text-sm text-zinc-500">Ajustar a aparência do sistema.</p>
                        </div>
                        <Button variant="outline">Automático</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
