import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import tourData from '@/data/tours';

// Animasi varian
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TourDetail() {
    const router = useRouter();
    const { id } = router.query;

    // Memoize tur berdasarkan ID
    const tour = useMemo(() => {
        if (!id) return null;
        return tourData.find((t) => t.id === parseInt(id));
    }, [id]);

    // Schema.org untuk SEO
    const schemaOrg = useMemo(
        () =>
            tour
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: tour.name,
                    description: tour.description,
                    image: tour.image,
                    offers: {
                        '@type': 'Offer',
                        price: tour.price.replace(/[^0-9]/g, ''),
                        priceCurrency: 'IDR',
                        availability: 'https://schema.org/InStock',
                    },
                }
                : null,
        [tour]
    );

    // Handler WhatsApp
    const openWhatsApp = () => {
        if (!tour) return;
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan tur: ${tour.name} (${tour.price}). Bisakah saya dapatkan detail lebih lanjut?`
        );
        window.open(`https://wa.me/+621234567890?text=${message}`, '_blank');
    };

    // Loading state
    if (!router.isReady || !tour) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
                <Navbar />
                <div className="container mx-auto py-12 text-center text-gray-600">Tur tidak ditemukan atau sedang dimuat...</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
            <Head>
                <title>{`${tour.name} | Bali Explore`}</title>
                <meta name="description" content={tour.description.slice(0, 160)} />
                <meta name="keywords" content={`Bali tour, ${tour.name}, ${tour.category}`} />
                {schemaOrg && (
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
                )}
            </Head>

            <Navbar />
            <motion.div
                className="container mx-auto py-12 px-4 sm:px-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Tombol Kembali */}
                <motion.div variants={itemVariants}>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base shadow-md transition-all duration-300 hover:shadow-neon hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        aria-label="Kembali ke Beranda"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                {/* Konten Tur */}
                <motion.article
                    className="mt-6 bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 backdrop-blur-sm"
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Gambar */}
                        <motion.div className="lg:w-1/2" variants={itemVariants}>
                            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                                <Image
                                    src={tour.image}
                                    alt={tour.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    loading="lazy"
                                    quality={85}
                                    onError={() => console.error(`Gambar ${tour.image} tidak ditemukan`)}
                                />
                            </div>
                        </motion.div>

                        {/* Teks */}
                        <motion.div className="lg:w-1/2 flex flex-col justify-between" variants={itemVariants}>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{tour.name}</h1>
                                <p className="text-gray-600 text-sm sm:text-base mb-4">{tour.description}</p>
                                <p className="text-teal-600 font-semibold text-lg sm:text-xl mb-6">{tour.price}</p>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" id="tour-features">
                                    Fitur Tur:
                                </h3>
                                <ul
                                    className="list-disc pl-6 mb-6 text-gray-900 text-sm sm:text-base"
                                    aria-labelledby="tour-features"
                                >
                                    {tour.features && tour.features.length > 0 ? (
                                        tour.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))
                                    ) : (
                                        <li>Tidak ada fitur tambahan.</li>
                                    )}
                                </ul>
                            </div>
                            <motion.button
                                onClick={openWhatsApp}
                                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-teal-500"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`Hubungi via WhatsApp untuk tur ${tour.name}`}
                            >
                                Hubungi via WhatsApp
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.article>
            </motion.div>
            <Footer />
        </div>
    );
}