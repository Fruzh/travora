import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const linkVariants = {
        hover: { scale: 1.1, color: '#0ea5e9', transition: { duration: 0.3 } },
    };

    return (
        <motion.nav
            className="sticky top-0 bg-white/95 backdrop-blur-lg shadow-lg z-50 py-4"
            variants={navVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                    Bali Explore
                </Link>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-teal-600 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                        </svg>
                    </button>
                </div>
                <div className={`md:flex items-center space-x-8 ${isOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 w-full md:w-auto bg-white/95 md:bg-transparent p-4 md:p-0`}>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link href="/" className="block md:inline-block text-gray-700 font-medium py-2">Beranda</Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link href="#tour-explore-section" className="block md:inline-block text-gray-700 font-medium py-2">Tur</Link>
                    </motion.div>
                    <motion.div variants={linkVariants} whileHover="hover">
                        <Link href="#contact" className="block md:inline-block text-gray-700 font-medium py-2">Kontak</Link>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    );
}