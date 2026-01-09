'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ slug }: { slug: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const res = await fetch(`/api/posts?slug=${slug}`, { method: 'DELETE' });
        if (res.ok) {
            router.refresh();
        } else {
            alert('Failed to delete');
        }
    };

    return (
        <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
            Delete
        </button>
    );
}
