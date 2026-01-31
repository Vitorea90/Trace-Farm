"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Monitor, Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-2"
            >
                <Sun className="h-4 w-4" />
                <span className="hidden sm:inline">Claro</span>
            </Button>
            <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-2"
            >
                <Moon className="h-4 w-4" />
                <span className="hidden sm:inline">Escuro</span>
            </Button>
            <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="gap-2"
            >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Sistema</span>
            </Button>
        </div>
    )
}
