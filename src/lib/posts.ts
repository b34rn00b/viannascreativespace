import { prisma } from './prisma';

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string | Date;
    author: string;
    image?: string | null;
}

export async function getPosts(): Promise<Post[]> {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { date: 'desc' }
        });
        return posts as unknown as Post[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const post = await prisma.post.findUnique({
            where: { slug }
        });
        return post as unknown as Post;
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}
