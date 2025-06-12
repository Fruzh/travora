import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const navVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const menuVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: {
            opacity: 1,
            height: 'auto',
            transition: { duration: 0.3, ease: 'easeInOut' },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: { duration: 0.2, ease: 'easeOut' },
        },
    };

    const linkVariants = {
        hover: { scale: 1.05, color: '#0ea5e9', transition: { duration: 0.2 } },
    };

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('Halo! Saya ingin bertanya tentang Bali Explore.');
        window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    };

    return (
        <motion.nav
            className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-md z-50 py-3"
            variants={navVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto px-4 flex justify-between items-center relative">
                <Link
                    href="/"
                    className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500"
                >
                    Bali Explore
                </Link>

                {/* Toggle button mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        ref={toggleButtonRef}
                        className="text-teal-600 focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isOpen
                                        ? 'M6 18L18 6M6 6l12 12'
                                        : 'M4 6h16M4 12h16M4 18h16'
                                }
                            />
                        </svg>
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex md:items-center md:space-x-8">
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                            href="/"
                            className="text-base text-gray-700 font-medium hover:text-teal-500 transition"
                        >
                            Beranda
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                            href="/#tour-explore-section"
                            className="text-base text-gray-700 font-medium hover:text-teal-500 transition"
                        >
                            Tur
                        </Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <button
                            onClick={handleWhatsAppClick}
                            className="text-base text-gray-700 font-medium hover:text-teal-500 transition"
                        >
                            Kontak
                        </button>
                    </motion.div>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={menuRef}
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute top-full left-0 w-full bg-white/95 shadow-md rounded-b-lg p-4 pt-8 flex flex-col gap-3 md:hidden"
                        >
                            <motion.div variants={linkVariants} whileHover="hover">
                                <Link
                                    href="/"
                                    className="text-base font-medium text-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Beranda
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} whileHover="hover">
                                <Link
                                    href="/#tour-explore-section"
                                    className="text-base font-medium text-gray-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Tour
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} whileHover="hover">
                                <button
                                    onClick={() => {
                                        handleWhatsAppClick();
                                        setIsOpen(false);
                                    }}
                                    className="text-base font-medium text-gray-700"
                                >
                                    Kontak
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
