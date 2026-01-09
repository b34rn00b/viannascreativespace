import { getPostBySlug } from '@/lib/posts';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import BlogPostAnimation, { AnimatedElement } from '@/components/BlogPostAnimation';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
            <BlogPostAnimation>
                {post.image && (
                    <AnimatedElement style={{ position: 'relative', height: '400px', marginBottom: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
                        <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
                    </AnimatedElement>
                )}
                <AnimatedElement>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{post.title}</h1>
                </AnimatedElement>
                <AnimatedElement>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', marginBottom: '2rem' }}>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>|</span>
                        <span>By {post.author}</span>
                    </div>
                </AnimatedElement>
                <AnimatedElement>
                    <div
                        className="prose"
                        style={{ fontSize: '1.2rem', lineHeight: '1.8' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </AnimatedElement>
            </BlogPostAnimation>
        </main>
    );
}
