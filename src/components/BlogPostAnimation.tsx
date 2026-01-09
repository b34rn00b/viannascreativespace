"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function BlogPostAnimation({ children }: { children: ReactNode }) {
    return (
        <motion.article
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            {children}
        </motion.article>
    );
}

export function AnimatedElement({ children, className, style }: { children: ReactNode, className?: string, style?: any }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className={className}
            style={style}
        >
            {children}
        </motion.div>
    );
}
