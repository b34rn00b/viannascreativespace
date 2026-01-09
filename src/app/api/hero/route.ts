import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export const dynamic = 'force-dynamic';

const dataDir = path.join(process.cwd(), 'data');
const heroFile = path.join(dataDir, 'hero.json');
const publicDir = path.join(process.cwd(), 'public');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Default Hero Data
const defaultHero = {
    title: "Vianna's Creative Space",
    subtitle: "Discover handcrafted sarees, unique paintings, and artistic masterpieces tailored just for you.",
    backgroundImage: "/hero_background.png"
};

export async function GET() {
    try {
        if (fs.existsSync(heroFile)) {
            const fileContent = fs.readFileSync(heroFile, 'utf-8');
            return NextResponse.json(JSON.parse(fileContent));
        }
        return NextResponse.json(defaultHero);
    } catch (error) {
        return NextResponse.json(defaultHero);
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const imageFile = formData.get('image') as File | null;

        let config = defaultHero;
        if (fs.existsSync(heroFile)) {
            config = JSON.parse(fs.readFileSync(heroFile, 'utf-8'));
        }

        config.title = title || config.title;
        config.subtitle = subtitle || config.subtitle;

        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Save to public folder
            const filename = `hero_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filepath = path.join(publicDir, filename);
            await writeFile(filepath, buffer);

            config.backgroundImage = `/${filename}`;
        }

        // Save config
        await writeFile(heroFile, JSON.stringify(config, null, 2));

        return NextResponse.json({ success: true, config });
    } catch (error) {
        console.error('Hero update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
