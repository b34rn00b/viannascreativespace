import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const publicDir = path.join(process.cwd(), 'public');

// Default Hero Data
const defaultHero = {
    title: "Vianna's Creative Space",
    subtitle: "Discover handcrafted sarees, unique paintings, and artistic masterpieces tailored just for you.",
    backgroundImage: "/hero_background.png"
};

export async function GET() {
    try {
        const hero = await prisma.hero.findFirst();
        return NextResponse.json(hero || defaultHero);
    } catch (error) {
        console.error('Hero GET error:', error);
        return NextResponse.json(defaultHero);
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const subtitle = formData.get('subtitle') as string;
        const imageFile = formData.get('image') as File | null;

        let existingHero = await prisma.hero.findFirst();

        const data: any = {
            title: title || (existingHero?.title || defaultHero.title),
            subtitle: subtitle || (existingHero?.subtitle || defaultHero.subtitle),
            backgroundImage: existingHero?.backgroundImage || defaultHero.backgroundImage
        };

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Save to public folder
            const filename = `hero_${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const filepath = path.join(publicDir, filename);
            await writeFile(filepath, buffer);

            data.backgroundImage = `/${filename}`;
        }

        let updatedHero;
        if (existingHero) {
            updatedHero = await prisma.hero.update({
                where: { id: existingHero.id },
                data
            });
        } else {
            updatedHero = await prisma.hero.create({
                data
            });
        }

        return NextResponse.json({ success: true, config: updatedHero });
    } catch (error) {
        console.error('Hero update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
