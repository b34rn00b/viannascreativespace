import fs from 'fs';
import path from 'path';

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    author: string;
    image?: string;
}

const postsDirectory = path.join(process.cwd(), 'data');

export function getPosts(): Post[] {
    const filePath = path.join(postsDirectory, 'posts.json');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const posts: Post[] = JSON.parse(fileContents);
        return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (error) {
        console.error("Error reading posts:", error);
        return [];
    }
}

export function getPostBySlug(slug: string): Post | undefined {
    const posts = getPosts();
    return posts.find((post) => post.slug === slug);
}
