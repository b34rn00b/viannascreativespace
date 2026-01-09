"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Upload, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminGallery() {
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const res = await fetch('/api/gallery');
        if (res.ok) {
            const data = await res.json();
            setImages(data);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                await fetchImages();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error(error);
            alert('Upload error');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (imagePath: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        const filename = imagePath.split('/').pop();
        try {
            const res = await fetch('/api/gallery', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename }),
            });

            if (res.ok) {
                setImages(images.filter(img => img !== imagePath));
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error(error);
            alert('Delete error');
        }
    };

    return (
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: '2rem' }}>
                <Link href="/admin/dashboard" style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--foreground)' }}>
                    <ArrowLeft size={20} /> Back
                </Link>

                <h1 style={{ margin: 0, justifySelf: 'center' }}>Gallery Manager</h1>

                <div style={{ justifySelf: 'end', position: 'relative' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        disabled={uploading}
                    />
                    <button
                        className="glass"
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        {uploading ? 'Uploading...' : <><Upload size={18} /> Upload Image</>}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                    {images.map((src) => (
                        <motion.div
                            key={src}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="glass"
                            style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden' }}
                        >
                            <Image
                                src={src}
                                alt="Gallery Item"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '0.5rem',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <button
                                    onClick={() => handleDelete(src)}
                                    style={{
                                        background: '#ef4444',
                                        border: 'none',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete Image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {images.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
                    No images found. Upload some to get started!
                </div>
            )}
        </main>
    );
}
