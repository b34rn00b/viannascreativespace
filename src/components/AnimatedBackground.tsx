"use client";

import styles from "./AnimatedBackground.module.css";

export default function AnimatedBackground() {
    return (
        <div className={styles.background}>
            <div className={styles.noise} />
            <div className={`${styles.blob} ${styles.blob1}`} />
            <div className={`${styles.blob} ${styles.blob2}`} />
            <div className={`${styles.blob} ${styles.blob3}`} />
        </div>
    );
}
