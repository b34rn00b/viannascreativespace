import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/posts';
import BlogList from '@/components/BlogList';

import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default function BlogPage() {
    const posts = getPosts();

    return (
        <main style={{ padding: '2rem' }}>
            <ScrollReveal>
                <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem' }}>Blog</h1>
                <BlogList posts={posts} />
            </ScrollReveal>
        </main>
    );
}
