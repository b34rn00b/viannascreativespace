import fs from 'fs';
import path from 'path';
import ModernGallery from '@/components/ModernGallery';

import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic'; // To ensure it refreshes when files change

export default function GalleryPage() {
    const galleryDir = path.join(process.cwd(), 'public', 'gallery');
    let images: string[] = [];

    try {
        const files = fs.readdirSync(galleryDir);
        images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => `/gallery/${file}`);
    } catch (error) {
        console.error("Error reading gallery directory:", error);
        // Continue with empty array
    }

    return (
        <main style={{ padding: '2rem' }}>
            <ScrollReveal>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        marginBottom: '1rem',
                        color: 'var(--foreground)', // Solid color for clarity
                        textShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        Gallery
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                        Visual stories woven into fabric and canvas.
                    </p>
                </div>
            </ScrollReveal>

            {images.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No images found. Add images to the public/gallery folder.</p>
            ) : (
                <ModernGallery images={images} />
            )}
        </main>
    );
}
