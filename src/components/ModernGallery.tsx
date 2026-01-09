"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ModernGalleryProps {
    images: string[];
}

export default function ModernGallery({ images }: ModernGalleryProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <>
            <motion.div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    padding: "1rem"
                }}
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
            >
                {images.map((src, index) => (
                    <motion.div
                        key={index}
                        layoutId={`image-${src}`}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            show: { opacity: 1, y: 0 },
                        }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="glass"
                        style={{
                            position: "relative",
                            aspectRatio: "1 / 1",
                            overflow: "hidden",
                            borderRadius: "12px",
                            cursor: "zoom-in"
                        }}
                        onClick={() => setSelectedId(src)}
                        whileHover={{ y: -5 }}
                    >
                        <Image
                            src={src}
                            alt={`Gallery Item ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.5)", // Lighter, glassy background
                            backdropFilter: "blur(20px)", // Stronger blur
                            WebkitBackdropFilter: "blur(20px)",
                            zIndex: 2000,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "2rem",
                            cursor: "zoom-out"
                        }}
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            layoutId={`image-${selectedId}`}
                            style={{
                                position: "relative",
                                width: "auto",
                                height: "auto",
                                maxWidth: "95vw",
                                maxHeight: "95vh",
                                borderRadius: "4px",
                                overflow: "hidden",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedId}
                                alt="Full View"
                                width={1200}
                                height={1200}
                                style={{
                                    objectFit: "contain",
                                    width: "auto",
                                    height: "auto",
                                    maxWidth: "100%",
                                    maxHeight: "90vh"
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
