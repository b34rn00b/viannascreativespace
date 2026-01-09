"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, ImageIcon } from 'lucide-react';

export default function AdminHero() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        backgroundImage: ''
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/hero')
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setPreviewImage(data.backgroundImage);
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url); // Show preview immediately
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const form = e.target as HTMLFormElement;
        const uploadData = new FormData(form);

        // We only append the file if it was selected, otherwise the API keeps the old one
        // The API logic handles extracting 'title', 'subtitle', and optional 'image'

        const res = await fetch('/api/hero', {
            method: 'POST',
            body: uploadData,
        });

        if (res.ok) {
            alert('Hero updated successfully!');
            const newData = await res.json();
            setFormData(newData.config);
        } else {
            alert('Failed to update hero.');
        }
        setSaving(false);
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Edit Hero Section</h1>

            <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Image Preview */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Background Image</label>
                    <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden', background: '#e0e0e0', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {previewImage ? (
                            <img src={previewImage} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                                <ImageIcon size={48} style={{ marginBottom: '0.5rem' }} />
                                <p>No image selected</p>
                            </div>
                        )}

                        {/* File Input Overlay */}
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        />
                        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', pointerEvents: 'none' }}>
                            <span className="glass" style={{ padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Upload size={16} /> Change Image
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Main Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subtitle</label>
                    <textarea
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        rows={3}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.5)', fontFamily: 'inherit', fontSize: '1rem' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="glass"
                    style={{
                        padding: '1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </main>
    );
}
