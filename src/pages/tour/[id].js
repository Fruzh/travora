import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiSend } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import tourData from '@/data/tours';

// Debug log untuk cek impor
console.log('Imported Navbar:', Navbar);
console.log('Imported Footer:', Footer);
console.log('Imported tourData:', tourData);

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
    console.log('Rendering TourDetail');
    const router = useRouter();
    const { id } = router.query;

    // State untuk carousel dan loading gambar
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Memoize tur berdasarkan ID
    const tour = useMemo(() => {
        if (!id) return null;
        return tourData.find((t) => t.id === parseInt(id));
    }, [id]);

    // Memoize daftar gambar (image utama + gallery)
    const imageList = useMemo(() => {
        if (!tour) return [];
        return [tour.image, ...(tour.gallery || [])];
    }, [tour]);

    // Schema.org untuk SEO
    const schemaOrg = useMemo(
        () =>
            tour
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: tour.name,
                    description: tour.description,
                    image: imageList,
                    offers: {
                        '@type': 'Offer',
                        price: tour.price.replace(/[^0-9]/g, ''),
                        priceCurrency: 'IDR',
                        availability: 'https://schema.org/InStock',
                    },
                    additionalProperty: [
                        { '@type': 'PropertyValue', name: 'Duration', value: `${tour.duration} days` },
                        { '@type': 'PropertyValue', name: 'Category', value: tour.category },
                    ],
                }
                : null,
        [tour, imageList]
    );

    // Handler WhatsApp
    const openWhatsApp = () => {
        if (!tour) return;
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan tur: ${tour.name} (${tour.price}). Bisakah saya dapatkan detail lebih lanjut?`
        );
        window.open(`https://wa.me/+621234567890?text=${message}`, '_blank');
    };

    // Handler carousel
    const nextImage = () => {
        if (imageList.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
            setIsImageLoading(true);
        }
    };

    const prevImage = () => {
        if (imageList.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
            setIsImageLoading(true);
        }
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
                    className="mt-6 bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 backdrop-blur-sm mb-12"
                    variants={itemVariants}
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Carousel Gambar */}
                        <motion.div className="lg:w-1/2" variants={itemVariants}>
                            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
                                {isImageLoading && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                                )}
                                {imageList.length > 0 ? (
                                    <motion.div
                                        animate={{ opacity: isImageLoading ? 0 : 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Image
                                            src={imageList[currentImageIndex]}
                                            alt={`${tour.name} - Gambar ${currentImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            loading="lazy"
                                            quality={85}
                                            onLoad={() => setIsImageLoading(false)}
                                            onError={() => {
                                                console.error(`Gambar ${imageList[currentImageIndex]} tidak ditemukan`);
                                                setIsImageLoading(false);
                                            }}
                                        />
                                        {/* Tombol Navigasi Carousel */}
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            aria-label="Gambar sebelumnya"
                                        >
                                            <FiChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            aria-label="Gambar berikutnya"
                                        >
                                            <FiChevronRight className="w-5 h-5" />
                                        </button>
                                        {/* Indikator Carousel */}
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                            {imageList.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-teal-500 scale-125' : 'bg-white/50'
                                                        }`}
                                                    onClick={() => {
                                                        setCurrentImageIndex(index);
                                                        setIsImageLoading(true);
                                                    }}
                                                    aria-label={`Lihat gambar ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
                                        Tidak ada gambar tersedia
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Teks */}
                        <motion.div className="lg:w-1/2" variants={itemVariants}>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{tour.name}</h1>
                                <p className="text-gray-600 text-sm sm:text-base font-light mb-2">{tour.description}</p>
                                <p className="text-teal-600 font-semibold text-lg sm:text-xl mb-2">{tour.price}</p>
                                <p className="text-gray-600 text-sm sm:text-base font-light mb-4">
                                    Durasi: {tour.duration} hari
                                </p>

                                {/* Inclusions */}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" id="tour-inclusions">
                                    Termasuk:
                                </h3>
                                <ul
                                    className="list-disc pl-6 mb-6 text-gray-600 text-sm sm:text-base font-light"
                                    aria-labelledby="tour-inclusions"
                                >
                                    {tour.inclusions && tour.inclusions.length > 0 ? (
                                        tour.inclusions.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    ) : (
                                        <li>Tidak ada informasi tambahan.</li>
                                    )}
                                </ul>

                                {/* Highlights */}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" id="tour-highlights">
                                    Destinasi:
                                </h3>
                                <ul
                                    className="list-disc pl-6 mb-6 text-gray-600 text-sm sm:text-base font-light"
                                    aria-labelledby="tour-highlights"
                                >
                                    {tour.highlights && tour.highlights.length > 0 ? (
                                        tour.highlights.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    ) : (
                                        <li>Tidak ada highlight tersedia.</li>
                                    )}
                                </ul>

                                {/* Activities */}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" id="tour-activities">
                                    Aktivitas:
                                </h3>
                                <ul
                                    className="list-disc pl-6 text-gray-600 text-sm sm:text-base font-light"
                                    aria-labelledby="tour-activities"
                                >
                                    {tour.activities && tour.activities.length > 0 ? (
                                        tour.activities.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))
                                    ) : (
                                        <li>-</li>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Divider */}
                    <motion.div
                        className="my-8 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                        variants={itemVariants}
                    />

                    {/* Layout Itinerary dan Flights/Price Details */}
                    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
                        {/* Itinerary */}
                        <motion.section className="lg:col-span-1" variants={itemVariants}>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4" id="tour-itinerary">
                                Rangkaian Perjalanan
                            </h2>
                            <div className="relative pl-10" aria-labelledby="tour-itinerary">
                                {tour.itinerary && tour.itinerary.length > 0 ? (
                                    tour.itinerary.map((day, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative mb-6 last:mb-0"
                                            variants={itemVariants}
                                        >
                                            {/* Garis Penghubung */}
                                            {index < tour.itinerary.length - 1 && (
                                                <div className="absolute left-[-16px] top-13 h-[calc(100%-30px)] w-0.5 border-l-2 border-dashed border-teal-300" />
                                            )}
                                            {/* Nomor Hari */}
                                            <div className="absolute left-[-40px] top-0">
                                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md">
                                                    {day.day}
                                                </div>
                                            </div>
                                            {/* Konten Hari */}
                                            <div className="bg-white rounded-lg shadow-sm p-4">
                                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                                                    Hari {day.day}
                                                </h4>
                                                <p className="text-gray-600 text-sm sm:text-base font-light">
                                                    {day.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-600 font-light">Tidak ada itinerary tersedia.</p>
                                )}
                            </div>
                        </motion.section>

                        {/* Flights dan Price Details */}
                        <div className="flex flex-col gap-6 lg:col-span-1">
                            {/* Flights */}
                            <motion.section variants={itemVariants}>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4" id="tour-flights">
                                    Opsi Penerbangan
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4" aria-labelledby="tour-flights">
                                    {tour.flights && tour.flights.length > 0 ? (
                                        tour.flights.map((flight, index) => (
                                            <motion.div
                                                key={index}
                                                className="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:bg-teal-100 border-l-4 border-teal-500"
                                                variants={itemVariants}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FiSend className="w-5 h-5 text-teal-500" />
                                                    <h4 className="text-base font-semibold text-gray-900">{flight.airline}</h4>
                                                </div>
                                                <p className="text-sm text-gray-600 font-light">Kelas: {flight.class}</p>
                                                <p className="text-sm text-gray-900 font-semibold">Harga: {flight.price}</p>
                                                <p className="text-sm text-gray-600 font-light">Dari: {flight.from}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 font-light col-span-full">Tidak ada opsi penerbangan tersedia.</p>
                                    )}
                                </div>
                            </motion.section>

                            {/* Price Details */}
                            <motion.section variants={itemVariants}>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                                    Detail Harga
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <p className="text-gray-600 text-sm sm:text-base font-light">
                                        {tour.priceDetails || 'Informasi detail harga tidak tersedia.'}
                                    </p>
                                </div>
                            </motion.section>

                            {/* CTA Section */}
                            <motion.section variants={itemVariants}>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                                    Siap Berpetualang?
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base font-light mb-4">
                                    Bergabunglah bersama kami untuk petualangan tak terlupakan di Bali! Hubungi kami sekarang untuk memesan tour Anda.
                                </p>
                                <motion.button
                                    onClick={openWhatsApp}
                                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-teal-500 w-full sm:w-auto"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={`Hubungi via WhatsApp untuk paket tour ${tour.name}`}
                                >
                                    Hubungi via WhatsApp
                                </motion.button>
                            </motion.section>
                        </div>
                    </div>
                </motion.article>
            </motion.div>
            <Footer />
        </div>
    );
}