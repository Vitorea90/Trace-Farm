import prisma from '@/lib/prisma';
import { ProducerForm } from '@/components/forms/producer-form';
import { notFound } from 'next/navigation';

import { cookies } from 'next/headers';

export default async function EditProducerPage({ params }: { params: { id: string } }) {
    const producer = await prisma.user.findUnique({
        where: { id: params.id, role: 'PRODUCER' }
    });

    if (!producer) {
        notFound();
    }

    const cookieStore = cookies();
    const userId = cookieStore.get('auth_user')?.value;
    const role = cookieStore.get('auth_role')?.value;

    if (role !== 'admin' && userId && producer.createdById !== userId) {
        notFound();
    }

    // Convert to plain object for client component if needed, though prisma returns Date objects which might warn in client props.
    // Usually Prisma objects are fine unless they have weird types. Dates need serialization if passed to client components in some versions.
    // The ProducerForm expects certain fields.

    return <ProducerForm initialData={producer as any} isEdit={true} />;
}
