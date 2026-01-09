"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, ImageIcon, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

interface HighlightItem {
    title: string;
    image: string;
    link: string;
}

export default function AdminHighlights() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [items, setItems] = useState<HighlightItem[]>([
        { title: '', image: '', link: '' },
        { title: '', image: '', link: '' },
        { title: '', image: '', link: '' }
    ]);
    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);

    useEffect(() => {
        fetch('/api/highlights')
            .then(res => res.json())
            .then(data => {
                // Ensure we always have 3 items
                const loadedItems = [...data];
                while (loadedItems.length < 3) {
                    loadedItems.push({ title: '', image: '', link: '' });
                }
                setItems(loadedItems);
                setPreviews(loadedItems.map((item: HighlightItem) => item.image || null));
                setLoading(false);
            });
    }, []);

    const handleChange = (index: number, field: keyof HighlightItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newPreviews = [...previews];
            newPreviews[index] = url;
            setPreviews(newPreviews);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const form = e.target as HTMLFormElement;
        const uploadData = new FormData(form);

        // We need to map the form fields correctly is handled by the naming convention
        // title_0, image_0, etc.

        const res = await fetch('/api/highlights', {
            method: 'POST',
            body: uploadData,
        });

        if (res.ok) {
            alert('Highlights updated successfully!');
            const newData = await res.json();
            setItems(newData.items);
            setPreviews(newData.items.map((item: HighlightItem) => item.image));
        } else {
            alert('Failed to update highlights.');
        }
        setSaving(false);
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Link href="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Edit Highlights</h1>
                <button
                    form="highlights-form"
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: '1rem 2rem',
                        background: 'var(--primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form id="highlights-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {items.map((item, index) => (
                    <div key={index} className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                            Item #{index + 1}
                        </h3>

                        {/* Image Input */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Image</label>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', background: '#f0f0f0', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {previews[index] ? (
                                    <img src={previews[index]!} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                                        <ImageIcon size={32} style={{ marginBottom: '0.5rem' }} />
                                        <p style={{ fontSize: '0.8rem' }}>No image</p>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    name={`image_${index}`}
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(index, e)}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                />
                                <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', pointerEvents: 'none' }}>
                                    <span className="glass" style={{ padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Upload size={14} /> Upload
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Title Input */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Title</label>
                            <input
                                type="text"
                                name={`title_${index}`}
                                value={item.title}
                                onChange={(e) => handleChange(index, 'title', e.target.value)}
                                placeholder="e.g. Handmade Sarees"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)' }}
                            />
                        </div>

                        {/* Link Input */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                <LinkIcon size={14} /> Link URL
                            </label>
                            <input
                                type="text"
                                name={`link_${index}`}
                                value={item.link}
                                onChange={(e) => handleChange(index, 'link', e.target.value)}
                                placeholder="e.g. /gallery"
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)' }}
                            />
                        </div>
                    </div>
                ))}
            </form>
        </main>
    );
}
