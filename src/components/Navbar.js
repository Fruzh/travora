import Link from 'next/link';
import Image from 'next/image'; // Tambah impor Image
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent('Halo! Saya ingin bertanya tentang Bali Explore.');
        window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
        setIsOpen(false);
    };

    const navVariants = {
        hidden: { opacity: 0},
        visible: { opacity: 1, transition: { duration: 0.5 } },
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

    return (
        <motion.nav
            className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-md z-50 py-3"
            variants={navVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto px-4 flex justify-between items-center relative">
                <Link href="/" onClick={() => setIsOpen(false)}>
                    <Image
                        src="/logo/main-logo.png"
                        alt="Bali Explore Logo"
                        width={128} // Ukuran dasar untuk desktop
                        height={32} // Sesuaikan dengan rasio logo asli
                        className="w-24 sm:w-32 h-auto" // Responsif untuk mobile dan desktop
                        priority // Muat logo lebih cepat karena di navbar
                    />
                </Link>

                {/* Toggle Button (Mobile) */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        ref={toggleButtonRef}
                        className="text-teal-600 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
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
                        <button
                            onClick={handleWhatsAppClick}
                            className="flex-1 text-white bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-neon"
                        >
                            Hubungi Sekarang
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
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="flex-1 text-white bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-neon text-left"
                                >
                                    Hubungi Sekarang
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}