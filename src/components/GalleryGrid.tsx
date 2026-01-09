'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryGridProps {
    images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div style={{ columns: '3 300px', gap: '1rem' }}>
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="glass"
                        style={{ breakInside: 'avoid', marginBottom: '1rem', overflow: 'hidden', cursor: 'pointer' }}
                        onClick={() => setSelectedImage(src)}
                    >
                        <Image
                            src={src}
                            alt={`Gallery Item ${index + 1}`}
                            width={500}
                            height={500}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                        <Image
                            src={selectedImage}
                            alt="Full view"
                            width={1200}
                            height={800}
                            style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '90vh' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
