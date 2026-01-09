"use client";

import Hero from '@/components/Hero';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [highlights, setHighlights] = useState<any[]>([]);

  useEffect(() => {
    // Fetch highlights but fallback to placeholders if empty/loading initially
    fetch('/api/highlights')
      .then(res => res.json())
      .then(data => setHighlights(data))
      .catch(err => console.error("Failed to load highlights", err));
  }, []);

  const itemsToDisplay = highlights.length > 0 ? highlights : [1, 2, 3]; // Fallback while loading or if empty

  return (
    <main>
      <Hero />
      <section style={{ padding: '4rem 2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem', fontWeight: 700 }}>Recent Creations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {itemsToDisplay.map((item, i) => {
              const isPlaceholder = typeof item === 'number';
              const title = isPlaceholder ? `Placeholder Item ${item}` : item.title;
              const image = isPlaceholder ? null : item.image;
              const link = isPlaceholder ? '#' : item.link;

              return (
                <Link key={i} href={link} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <motion.div
                    className="glass"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    style={{
                      height: '350px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ flex: 1, position: 'relative', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {image ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <Image
                            src={image}
                            alt={title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>No Image</span>
                      )}
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
