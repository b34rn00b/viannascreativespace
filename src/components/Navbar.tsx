import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={`${styles.navbar} glass`}>
            <Link href="/" className={styles.logo}>
                Vianna's Creative Space
            </Link>
            <div className={styles.links}>
                <Link href="/" className={styles.link}>Home</Link>
                <Link href="/gallery" className={styles.link}>Gallery</Link>
                <Link href="/blog" className={styles.link}>Blog</Link>
            </div>
        </nav>
    );
}
