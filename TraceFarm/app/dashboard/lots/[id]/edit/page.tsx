import prisma from '@/lib/prisma';
import { LotForm } from '@/components/forms/lot-form';
import { notFound } from 'next/navigation';

import { cookies } from 'next/headers';

export default async function EditLotPage({ params }: { params: { id: string } }) {
    const lot = await prisma.lot.findUnique({
        where: { id: params.id },
        include: { producers: true }
    });

    if (!lot) {
        notFound();
    }

    const cookieStore = cookies();
    const userId = cookieStore.get('auth_user')?.value;
    const role = cookieStore.get('auth_role')?.value;

    if (role !== 'admin' && userId && lot.createdById !== userId) {
        notFound();
    }

    return <LotForm initialData={lot as any} isEdit={true} />;
}
