import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { useMemo } from 'react';

// Data konfigurasi
const footerConfig = {
    brand: 'Bali Explore',
    description: 'Pengalaman wisata premium di Bali dengan pemandu profesional dan destinasi terbaik.',
    contact: {
        email: 'info@baliexplore.com',
        phone: '+62 123 456 7890',
        address: 'Jl. Raya Ubud, Bali, Indonesia',
        whatsapp: {
            number: '6281234567890',
            message: 'Halo! Saya ingin bertanya tentang Bali Explore.',
        },
    },
    socials: [
        {
            name: 'Instagram',
            href: 'https://instagram.com/baliexplore',
            icon: FaInstagram,
            ariaLabel: 'Ikuti kami di Instagram',
        },
        {
            name: 'Facebook',
            href: 'https://facebook.com/baliexplore',
            icon: FaFacebookF,
            ariaLabel: 'Ikuti kami di Facebook',
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/baliexplore',
            icon: FaTwitter,
            ariaLabel: 'Ikuti kami di Twitter',
        },
    ],
};

// Animasi varian
const footerVariants = {
    hidden: { opacity: 0},
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer() {
    // Memoize schema.org untuk SEO
    const schemaOrg = useMemo(
        () => ({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: footerConfig.brand,
            description: footerConfig.description,
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: footerConfig.contact.phone,
                email: footerConfig.contact.email,
                contactType: 'Customer Service',
            },
            address: {
                '@type': 'PostalAddress',
                streetAddress: footerConfig.contact.address,
                addressLocality: 'Bali',
                addressCountry: 'ID',
            },
            sameAs: footerConfig.socials.map((social) => social.href),
            geo: {
                '@type': 'GeoCoordinates',
                latitude: -8.505613750513108,
                longitude: 115.25989366594209,
            },
        }),
        []
    );

    return (
        <motion.footer
            className="bg-gray-900 text-white py-8 sm:py-12 font-poppins"
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Schema.org untuk SEO */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {/* Kolom 1: Branding */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-4">
                            {footerConfig.brand}
                        </h3>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                            {footerConfig.description}
                        </p>
                    </motion.div>

                    {/* Kolom 2: Peta */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-gray-200 mb-4">Lokasi Kami</h4>
                        <div
                            role="region"
                            aria-label="Peta lokasi Bali Explore di Jl. Raya Ubud"
                            className="w-full h-38 rounded-lg shadow-md overflow-hidden bg-gray-800"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3318.1232780620326!2d115.25989366594209!3d-8.505613750513108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1749736113259!5m2!1sen!2sid"
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Bali Explore di Jl. Raya Ubud, Bali"
                            />
                        </div>
                    </motion.div>

                    {/* Kolom 3: Kontak */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-gray-200 mb-4">Kontak</h4>
                        <address className="not-italic text-gray-400 text-sm sm:text-base space-y-1">
                            <p>
                                Email:{' '}
                                <a href={`mailto:${footerConfig.contact.email}`} className="hover:text-teal-400 transition-colors">
                                    {footerConfig.contact.email}
                                </a>
                            </p>
                            <p>
                                Telp:{' '}
                                <a href={`tel:${footerConfig.contact.phone}`} className="hover:text-teal-400 transition-colors">
                                    {footerConfig.contact.phone}
                                </a>
                            </p>
                            <p>{footerConfig.contact.address}</p>
                        </address>
                        <a
                            href={`https://wa.me/${footerConfig.contact.whatsapp.number}?text=${encodeURIComponent(footerConfig.contact.whatsapp.message)}`}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="inline-flex items-center gap-2 mt-4 text-gray-400 hover:text-teal-400 transition-all duration-300 transform hover:scale-105"
                            aria-label="Hubungi via WhatsApp"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Hubungi via WhatsApp
                        </a>
                    </motion.div>

                    {/* Kolom 4: Sosial Media */}
                    <motion.div variants={itemVariants}>
                        <h4 className="text-lg font-semibold text-gray-200 mb-4">Ikuti Kami</h4>
                        <div className="flex space-x-4">
                            {footerConfig.socials.map((social, index) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="text-gray-400 hover:text-teal-400 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                                        aria-label={social.ariaLabel}
                                        title={social.name}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm"
                    variants={itemVariants}
                >
                    <p>© {new Date().getFullYear()} {footerConfig.brand}. All rights reserved.</p>
                </motion.div>
            </div>
        </motion.footer>
    );
}