"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    const [heroData, setHeroData] = useState({
        title: "Vianna's Creative Space",
        subtitle: "Discover handcrafted sarees, unique paintings, and artistic masterpieces tailored just for you.",
        backgroundImage: "/hero_background.png"
    });

    useEffect(() => {
        fetch('/api/hero')
            .then(res => res.json())
            .then(data => setHeroData(data))
            .catch(err => console.error("Failed to load hero data", err));
    }, []);

    return (
        <section className={styles.hero}>
            {/* Dynamic Background Image */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <motion.div
                    key={heroData.backgroundImage} // Trigger re-render on change
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
                    style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                    <Image
                        src={heroData.backgroundImage}
                        alt="Artistic Background"
                        fill
                        className={styles.background}
                        priority
                    />
                </motion.div>
            </div>

            <div className={styles.content}>
                <motion.h1
                    className={styles.title}
                    key={heroData.title}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {heroData.title}
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    key={heroData.subtitle}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    {heroData.subtitle}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link href="/gallery" className={styles.cta}>
                        View Gallery
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
