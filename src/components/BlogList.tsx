"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Post } from '@/lib/posts';

export default function BlogList({ posts }: { posts: Post[] }) {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}
        >
            {posts.map((post) => (
                <motion.div
                    key={post.id}
                    variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { opacity: 1, y: 0 }
                    }}
                >
                    <Link href={`/blog/${post.slug}`} className="glass" style={{ display: 'block', overflow: 'hidden', padding: '1rem', textDecoration: 'none', height: '100%', transition: 'transform 0.2s' }}>
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            {post.image && (
                                <div style={{ position: 'relative', height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                                    <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />
                                </div>
                            )}
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{post.title}</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>{new Date(post.date).toLocaleDateString()}</p>
                            <p>{post.excerpt}</p>
                        </motion.div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
