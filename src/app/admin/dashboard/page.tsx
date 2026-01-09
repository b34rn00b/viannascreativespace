import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import DeleteButton from './DeleteButton'; // Client component for delete interaction

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
    const posts = await getPosts();

    return (
        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link
                        href="/admin/hero"
                        className="glass"
                        style={{ padding: '0.8rem 1.5rem', color: 'var(--foreground)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Edit Hero
                    </Link>
                    <Link
                        href="/admin/highlights"
                        className="glass"
                        style={{ padding: '0.8rem 1.5rem', color: 'var(--foreground)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Highlights
                    </Link>
                    <Link
                        href="/admin/gallery"
                        className="glass"
                        style={{ padding: '0.8rem 1.5rem', color: 'var(--foreground)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        Manage Gallery
                    </Link>
                    <Link
                        href="/admin/editor"
                        style={{ padding: '0.8rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}
                    >
                        + New Post
                    </Link>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Manage Posts</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{post.title}</td>
                                <td style={{ padding: '1rem' }}>{new Date(post.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                    <Link href={`/admin/editor?slug=${post.slug}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Edit</Link>
                                    <DeleteButton slug={post.slug} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {posts.length === 0 && <p style={{ textAlign: 'center', marginTop: '1rem' }}>No posts found.</p>}
            </div>
        </main>
    );
}
