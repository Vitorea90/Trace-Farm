'use client';

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle2, Truck, Sprout, Factory, ClipboardList, ShoppingCart } from "lucide-react";

const icons = {
    PLANTING: Sprout,
    MANAGEMENT: ClipboardList,
    HARVEST: CheckCircle2,
    TRANSPORT: Truck,
    PROCESSING: Factory,
    SOLD: ShoppingCart,
};

type EventType = keyof typeof icons;

interface Event {
    id: string;
    type: string;
    title: string;
    description?: string | null;
    date: string | Date;
}

interface TimelineProps {
    events: Event[];
}

export function Timeline({ events }: TimelineProps) {
    return (
        <div className="relative space-y-4 my-6">
            {events.map((event, index) => {
                const Icon = icons[event.type as EventType] || CheckCircle2;
                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-12 border-l-2 border-primary-200/50 dark:border-primary-800/50 pb-4 last:pb-0"
                    >
                        <span className="absolute left-0 top-1 -translate-x-1/2 p-2.5 rounded-full bg-white dark:bg-zinc-900 border-2 border-primary-500 text-primary-600 shadow-md">
                            <Icon size={18} />
                        </span>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{event.title}</h4>
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                    {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                </span>
                            </div>
                            {event.description && (
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}
