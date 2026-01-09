'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RichEditor from '@/components/RichEditor';

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const slugParam = searchParams.get('slug');

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: ''
    });

    useEffect(() => {
        if (slugParam) {
            setIsLoading(true);
            fetch('/api/posts')
                .then(res => res.json())
                .then(posts => {
                    const post = posts.find((p: any) => p.slug === slugParam);
                    if (post) setFormData(post);
                    setIsLoading(false);
                });
        }
    }, [slugParam]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/admin/dashboard');
            router.refresh();
        } else {
            alert('Failed to save');
        }
    };

    if (isLoading) return <p className="text-center p-10">Loading...</p>;

    return (
        <form onSubmit={handleSubmit} className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{slugParam ? 'Edit Post' : 'New Post'}</h1>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Slug (optional)</label>
                <input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Leave empty to auto-generate from title"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Excerpt</label>
                <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', fontFamily: 'inherit' }}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content</label>
                <RichEditor
                    content={formData.content}
                    onChange={(html) => setFormData({ ...formData, content: html })}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image URL</label>
                <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="/gallery/demo1.png"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                    type="submit"
                    style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', flex: 1 }}
                >
                    Save Post
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    style={{ padding: '1rem 2rem', background: 'transparent', border: '1px solid var(--muted)', borderRadius: '8px', cursor: 'pointer', flex: 0.3 }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default function AdminEditorPage() {
    return (
        <main style={{ padding: '2rem' }}>
            <Suspense fallback={<p>Loading editor...</p>}>
                <EditorContent />
            </Suspense>
        </main>
    );
}
