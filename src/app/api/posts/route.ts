import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Post } from '@/lib/posts';

const postsDirectory = path.join(process.cwd(), 'data');
const postsFile = path.join(postsDirectory, 'posts.json');

// Helper to write
function writePosts(posts: Post[]) {
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

export async function GET() {
    try {
        const fileContents = fs.readFileSync(postsFile, 'utf8');
        const posts: Post[] = JSON.parse(fileContents);
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, slug, title, excerpt, content, image } = body;

        // Read existing
        const fileContents = fs.readFileSync(postsFile, 'utf8');
        let posts: Post[] = JSON.parse(fileContents);

        // Check if updating
        const existingIndex = posts.findIndex(p => p.slug === slug || p.id === id);

        const newPost: Post = {
            id: id || Date.now().toString(),
            slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            title,
            excerpt,
            content,
            date: new Date().toISOString(),
            author: 'Admin', // hardcoded for now
            image
        };

        if (existingIndex > -1) {
            // Update (merge to keep date if needed, but usually update date too?)
            // Let's keep original date but update content
            newPost.date = posts[existingIndex].date;
            posts[existingIndex] = { ...posts[existingIndex], ...newPost, date: new Date().toISOString() }; // Update modified date
        } else {
            posts.push(newPost);
        }

        writePosts(posts);

        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

        const fileContents = fs.readFileSync(postsFile, 'utf8');
        let posts: Post[] = JSON.parse(fileContents);

        posts = posts.filter(p => p.slug !== slug);
        writePosts(posts);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
