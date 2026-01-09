import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const publicDir = path.join(process.cwd(), 'public');

// Default Highlights Data (3 items)
const defaultHighlights = [
    { title: "Handcrafted Sarees", image: "", link: "/gallery" },
    { title: "Custom Paintings", image: "", link: "/gallery" },
    { title: "Artistic Workshops", image: "", link: "/blog" }
];

export async function GET() {
    try {
        const highlights = await prisma.highlight.findMany();
        if (highlights.length > 0) {
            return NextResponse.json(highlights);
        }
        return NextResponse.json(defaultHighlights);
    } catch (error) {
        console.error('Highlights GET error:', error);
        return NextResponse.json(defaultHighlights);
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const currentData = await prisma.highlight.findMany();
        const items = currentData.length > 0 ? currentData : defaultHighlights.map(d => ({ ...d, id: undefined }));

        // Process up to 3 items
        for (let i = 0; i < 3; i++) {
            const title = formData.get(`title_${i}`) as string;
            const link = formData.get(`link_${i}`) as string;
            const imageFile = formData.get(`image_${i}`) as File | null;

            const updateData: any = {};
            if (title !== null) updateData.title = title;
            if (link !== null) updateData.link = link;

            if (imageFile && imageFile.size > 0) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Save to public folder with valid filename
                const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `highlight_${i}_${Date.now()}_${safeName}`;
                const filepath = path.join(publicDir, filename);
                await writeFile(filepath, buffer);

                updateData.image = `/${filename}`;
            }

            if (currentData[i]) {
                await prisma.highlight.update({
                    where: { id: currentData[i].id },
                    data: updateData
                });
            } else {
                await prisma.highlight.create({
                    data: {
                        title: updateData.title || defaultHighlights[i].title,
                        link: updateData.link || defaultHighlights[i].link,
                        image: updateData.image || defaultHighlights[i].image
                    }
                });
            }
        }

        const updatedItems = await prisma.highlight.findMany();
        return NextResponse.json({ success: true, items: updatedItems });
    } catch (error) {
        console.error('Highlights update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
