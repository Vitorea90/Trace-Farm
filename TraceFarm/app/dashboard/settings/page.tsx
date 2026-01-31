import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
                <p className="text-zinc-500">Gerencie suas preferências e dados da conta.</p>
            </div>



            <Card>
                <CardHeader>
                    <CardTitle>Preferências do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Aparência</p>
                            <p className="text-sm text-zinc-500">Escolha o tema de sua preferência.</p>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
