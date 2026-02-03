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
        <div className="relative space-y-0 my-6">
            {events.map((event, index) => {
                const Icon = icons[event.type as EventType] || CheckCircle2;
                const isLast = index === events.length - 1;

                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative pl-20 ${!isLast ? 'border-l-2 border-[rgb(var(--neon-green))]/30 pb-8' : 'pb-0'}`}
                    >
                        {/* Icon Circle */}
                        <div className="absolute left-0 top-0 -translate-x-1/2 p-3.5 rounded-full bg-[rgb(var(--charcoal-card))] border-2 border-[rgb(var(--neon-green))] text-[rgb(var(--neon-green))] shadow-lg">
                            <Icon size={22} strokeWidth={2} />
                        </div>

                        {/* Event Content */}
                        <div className="flex flex-col gap-3">
                            {/* Title */}
                            <h4 className="text-xl font-semibold text-white leading-tight">
                                {event.title}
                            </h4>

                            {/* Date */}
                            <div className="text-sm font-medium text-white/50">
                                {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </div>

                            {/* Description */}
                            {event.description && (
                                <p className="text-base text-white/70 leading-relaxed max-w-2xl">
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
