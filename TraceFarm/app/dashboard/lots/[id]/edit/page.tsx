import prisma from '@/lib/prisma';
import { LotForm } from '@/components/forms/lot-form';
import { notFound } from 'next/navigation';

export default async function EditLotPage({ params }: { params: { id: string } }) {
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: { producers: true }
    });

    if (!lot) {
        notFound();
    }

    return <LotForm initialData={lot as any} isEdit={true} />;
}
