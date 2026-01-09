import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const galleryDir = path.join(process.cwd(), 'public', 'gallery');

// Ensure directory exists
if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true });
}

export async function GET() {
    try {
        let images = await (prisma as any).galleryImage.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Auto-migration: if DB is empty, check filesystem
        if (images.length === 0) {
            const files = fs.readdirSync(galleryDir);
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

            if (imageFiles.length > 0) {
                const data = imageFiles.map(file => ({
                    url: `/gallery/${file}`,
                    name: file
                }));

                await (prisma as any).galleryImage.createMany({ data });
                images = await (prisma as any).galleryImage.findMany({
                    orderBy: { createdAt: 'desc' }
                });
            }
        }

        return NextResponse.json(images.map((img: any) => img.url));
    } catch (error) {
        console.error('Gallery GET error:', error);
        return NextResponse.json({ error: 'Failed to read gallery' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = path.join(galleryDir, filename);

        await writeFile(filepath, buffer);

        const newImage = await (prisma as any).galleryImage.create({
            data: {
                url: `/gallery/${filename}`,
                name: filename
            }
        });

        return NextResponse.json({ success: true, filename, id: newImage.id });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { filename } = await request.json();

        if (!filename) {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // Security check: prevent directory traversal
        const safeFilename = path.basename(filename);
        const filepath = path.join(galleryDir, safeFilename);

        // Delete from DB first
        await (prisma as any).galleryImage.deleteMany({
            where: {
                OR: [
                    { name: safeFilename },
                    { url: `/gallery/${safeFilename}` }
                ]
            }
        });

        // Delete from filesystem if it exists
        if (fs.existsSync(filepath)) {
            await unlink(filepath);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
