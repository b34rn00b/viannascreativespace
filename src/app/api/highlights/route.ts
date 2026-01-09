import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

const dataDir = path.join(process.cwd(), 'data');
const highlightsFile = path.join(dataDir, 'highlights.json');
const publicDir = path.join(process.cwd(), 'public');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Default Highlights Data (3 items)
const defaultHighlights = [
    { title: "Handcrafted Sarees", image: "", link: "/gallery" },
    { title: "Custom Paintings", image: "", link: "/gallery" },
    { title: "Artistic Workshops", image: "", link: "/blog" }
];

export async function GET() {
    try {
        if (fs.existsSync(highlightsFile)) {
            const fileContent = fs.readFileSync(highlightsFile, 'utf-8');
            return NextResponse.json(JSON.parse(fileContent));
        }
        return NextResponse.json(defaultHighlights);
    } catch (error) {
        return NextResponse.json(defaultHighlights);
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        let currentData = defaultHighlights;
        if (fs.existsSync(highlightsFile)) {
            currentData = JSON.parse(fs.readFileSync(highlightsFile, 'utf-8'));
        }

        const newItems = [...currentData];

        // Process up to 3 items
        for (let i = 0; i < 3; i++) {
            const title = formData.get(`title_${i}`);
            const link = formData.get(`link_${i}`);
            const imageFile = formData.get(`image_${i}`) as File | null;

            if (title !== null) newItems[i].title = title as string;
            if (link !== null) newItems[i].link = link as string;

            if (imageFile && imageFile.size > 0) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Save to public folder with valid filename
                const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `highlight_${i}_${Date.now()}_${safeName}`;
                const filepath = path.join(publicDir, filename);
                await writeFile(filepath, buffer);

                newItems[i].image = `/${filename}`;
            }
        }

        // Save config
        await writeFile(highlightsFile, JSON.stringify(newItems, null, 2));

        return NextResponse.json({ success: true, items: newItems });
    } catch (error) {
        console.error('Highlights update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
