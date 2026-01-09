import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Posts GET error:', error);
        return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, slug, title, excerpt, content, image } = body;

        const postData = {
            slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            title,
            excerpt,
            content,
            image,
            author: 'Admin',
            date: new Date()
        };

        const post = await prisma.post.upsert({
            where: { slug: postData.slug },
            update: postData,
            create: postData
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error('Post save error:', error);
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

        await prisma.post.delete({
            where: { slug }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Post delete error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
