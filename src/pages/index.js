import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourPackages from '@/components/TourPackages';
import tourData from '@/data/tours';
import highlightsData from '@/data/highlights';
import testimonialsData from '@/data/testimonials';
import LoadingSpinner from '@/components/LoadingSpinner';
import { normalizeString, getMatchScore } from '@/utils/levenshtein';
import { useRouter } from 'next/router';
import Head from 'next/head';
import React from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery } from 'react-responsive';

// Dynamic import FilterButtons
const FilterButtons = dynamic(() => import('../components/FilterButtons'), { ssr: false });

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const TOUR_SECTION = 'tour-explore-section';

export default function Home() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const [toursPerPage, setToursPerPage] = useState(6);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const prevToursPerPage = useRef(6);
    const router = useRouter();

    // Media queries untuk toursPerPage
    const isMobile = useMediaQuery({ maxWidth: 639 });
    const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });

    // Update toursPerPage
    useEffect(() => {
        const newToursPerPage = isMobile ? 3 : isTablet ? 4 : 6;
        if (newToursPerPage !== prevToursPerPage.current) {
            console.log('ToursPerPage changed:', prevToursPerPage.current, '->', newToursPerPage);
            setToursPerPage(newToursPerPage);
            setCurrentPage(1);
            prevToursPerPage.current = newToursPerPage;
        }
    }, [isMobile, isTablet]);

    // Scroll ke section berdasarkan hash
    useEffect(() => {
        const hash = router.asPath.split('#')[1];
        if (hash) {
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) {
                    const offset = 80;
                    const top = el.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }, 100);
        }
    }, [router.asPath]);

    // Simulasi loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Auto-slide carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % highlightsData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tutup dropdown saat scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsDropdownOpen(false);
            setHighlightedIndex(-1);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logika filter dan pencarian
    const filteredTours = useMemo(() => {
        let result = filter === 'all' ? [...tourData] : tourData.filter((tour) => tour.category === filter);

        if (!searchQuery) return result;

        const keywords = normalizeString(searchQuery).split(/\s+/).filter((k) => k.length >= 1);

        if (!keywords.length) return result;

        const scored = result.map((tour) => {
            const fields = [tour.name, tour.description];
            let score = 0;

            keywords.forEach((keyword) => {
                fields.forEach((field) => {
                    score += getMatchScore(keyword, field);
                });
            });

            return { tour, score };
        });

        return scored
            .filter((s) => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((s) => s.tour);
    }, [filter, searchQuery]);

    // Live suggestions
    const liveSuggestions = useMemo(() => {
        return searchQuery.length >= 1 ? filteredTours.slice(0, 5) : [];
    }, [searchQuery, filteredTours]);

    // Keyboard navigation untuk suggestions
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isDropdownOpen) return;

            const maxIndex = liveSuggestions.length - 1;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (highlightedIndex >= 0 && liveSuggestions[highlightedIndex]) {
                        setSearchQuery(liveSuggestions[highlightedIndex].name);
                        setIsDropdownOpen(false);
                        setHighlightedIndex(-1);
                        inputRef.current.focus();
                        console.log('Suggestion selected via Enter:', liveSuggestions[highlightedIndex].name);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    setIsDropdownOpen(false);
                    setHighlightedIndex(-1);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isDropdownOpen, highlightedIndex, liveSuggestions]);

    // Scroll suggestion ke dalam view
    useEffect(() => {
        if (highlightedIndex >= 0 && dropdownRef.current) {
            const highlightedElement = dropdownRef.current.children[highlightedIndex];
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [highlightedIndex]);

    // Pagination
    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    const startIndex = (currentPage - 1) * toursPerPage;
    const paginatedTours = filteredTours.slice(startIndex, startIndex + toursPerPage);

    // Animasi kartu
    const cardVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
    };

    // Scroll ke section tur
    const scrollToTourSection = () => {
        const tourSection = document.querySelector(`[data-tour-section="${TOUR_SECTION}"]`);
        if (tourSection) {
            const yOffset = -220;
            const y = tourSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const tour = {
        name: 'Travora',
        description: 'Temukan keajaiban Bali dengan tur eksklusif kami untuk pengalaman tak terlupakan.',
        category: 'Adventure Tour',
    };

    const schemaOrg = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.name,
        description: tour.description,
        tourCategory: tour.category,
        url: 'https://bali-explore.vercel.app',
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
            <Head>
                <title>{`${tour.name} | Explore Bali`}</title>
                <meta name="description" content={tour.description.slice(0, 160)} />
                <meta name="keywords" content={`Bali tour, ${tour.name}, ${tour.category}`} />
                <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
                {schemaOrg && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
                    />
                )}
            </Head>

            <Navbar />
            {/* Hero Section */}
            <div className="relative h-[80vh] sm:h-[90vh] overflow-hidden">
                <AnimatePresence>
                    <motion.div
                        key={currentSlide}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <Image
                            src={highlightsData[currentSlide].image}
                            alt={highlightsData[currentSlide].title}
                            fill
                            className="object-cover"
                            priority
                            quality={85}
                            onError={() =>
                                console.error(`Gambar ${highlightsData[currentSlide].image} tidak ditemukan`)
                            }
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20 flex items-center justify-center">
                    <motion.div
                        className="text-center text-white px-4 sm:px-6"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
                            Petualangan Impian Anda
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                            Temukan keajaiban Bali dengan tur eksklusif kami untuk pengalaman tak terlupakan.
                        </p>
                        <Link
                            href={`#${TOUR_SECTION}`}
                            onClick={scrollToTourSection}
                            className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-neon hover:from-teal-600 hover:to-cyan-600"
                        >
                            Jelajahi Sekarang
                        </Link>
                    </motion.div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {highlightsData.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                                index === currentSlide ? 'bg-teal-400 scale-125' : 'bg-white/50'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Search and Filter Section */}
            <motion.section
                className="container mx-auto py-12 px-4 sm:px-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-4 mb-8 items-start">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 drop-shadow-sm">
                        Pilih Petualangan Anda
                    </h2>
                    <div className="flex flex-col items-center xl:flex-row xl:justify-end gap-4 w-full">
                        <div className="relative w-full lg:w-120 xl:w-80">
                            <span className="absolute inset-y-0 left-3 flex items-center">
                                <svg
                                    className="w-5 h-5 text-teal-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Cari destinasi..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(e.target.value.length >= 1);
                                    setHighlightedIndex(-1);
                                }}
                                onFocus={() => searchQuery.length >= 1 && setIsDropdownOpen(true)}
                                className="pl-10 pr-10 py-2.5 rounded-full w-full bg-white/90 text-gray-800 border-2 border-teal-300 focus:border-teal-500 focus:ring-0 focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg"
                            />
                            {searchQuery.length > 0 && (
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsDropdownOpen(false);
                                        inputRef.current.focus();
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 hover:text-gray-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </span>
                            )}
                            {isDropdownOpen && liveSuggestions.length > 0 && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                                >
                                    {liveSuggestions.map((tour, index) => (
                                        <div
                                            key={tour.id}
                                            className={`px-4 py-2 text-gray-700 cursor-pointer transition-all duration-200 ${
                                                index === highlightedIndex ? 'bg-teal-100' : 'hover:bg-teal-50'
                                            }`}
                                            onPointerDown={() => {
                                                setSearchQuery(tour.name);
                                                setIsDropdownOpen(false);
                                                setHighlightedIndex(-1);
                                                inputRef.current.focus();
                                                console.log('Suggestion selected via Click or Tap:', tour.name);
                                            }}
                                        >
                                            {tour.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <FilterButtons filter={filter} setFilter={setFilter} setCurrentPage={setCurrentPage} />
                    </div>
                </div>
                <div data-tour-section={TOUR_SECTION}>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : paginatedTours.length === 0 ? (
                        <p className="text-center text-gray-600">
                            Tidak ada tur yang ditemukan. Coba kata kunci lain!
                        </p>
                    ) : (
                        <>
                            <motion.div
                                key={`${filter}-${searchQuery}-${currentPage}`}
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                                }}
                            >
                                <TourPackages tours={paginatedTours} variants={cardVariants} />
                            </motion.div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 flex-wrap items-center gap-x-6 gap-y-3">
                                    {/* Tombol Sebelumnya */}
                                    <div className="group-prev">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                                                currentPage === 1
                                                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                                    : 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50 hover:shadow-neon'
                                            }`}
                                        >
                                            <span className="hidden sm:inline">Sebelumnya</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 sm:hidden"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    {/* Tombol angka halaman */}
                                    <div className="group-pages flex items-center gap-[6px]">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((page) => {
                                                if (totalPages <= 5) return true;
                                                if (isMobile) {
                                                    return (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        Math.abs(page - currentPage) <= 1
                                                    );
                                                }
                                                return (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    Math.abs(page - currentPage) <= 1
                                                );
                                            })
                                            .map((page, i, arr) => {
                                                const prevPage = arr[i - 1];
                                                const showEllipsis = prevPage && page - prevPage > 1;

                                                return (
                                                    <React.Fragment key={page}>
                                                        {showEllipsis && (
                                                            <span className="text-gray-400 px-1 select-none">…</span>
                                                        )}
                                                        <button
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                                                                currentPage === page
                                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-teal-300 shadow-md'
                                                                    : 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50 hover:shadow-neon'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </div>
                                    {/* Tombol Selanjutnya */}
                                    <div className="group-next">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                                                currentPage === totalPages
                                                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                                    : 'bg-white text-teal-600 border-teal-300 hover:bg-teal-50 hover:shadow-neon'
                                            }`}
                                        >
                                            <span className="hidden sm:inline">Selanjutnya</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 sm:hidden"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.section>

            {/* Testimonial Section */}
            <motion.section
                className="bg-gradient-to-b from-gray-100 to-gray-50 py-12 sm:py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 drop-shadow-sm">
                        Cerita dari Pelanggan Kami
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        {testimonialsData.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/95 rounded-2xl shadow-lg p-6 text-center backdrop-blur-sm"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                            >
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full mx-auto mb-4 shadow-md aspect-square object-cover"
                                    onError={() =>
                                        console.error(`Gambar ${testimonial.image} tidak ditemukan`)
                                    }
                                />
                                <p className="text-gray-600 italic text-sm sm:text-base">
                                    "{testimonial.comment}"
                                </p>
                                <p className="mt-4 font-semibold text-gray-800 text-sm sm:text-base">
                                    {testimonial.name}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12 sm:py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 drop-shadow-lg">
                        Mulai Petualangan Anda di Bali!
                    </h2>
                    <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                        Pesan tur Anda sekarang dan wujudkan liburan impian bersama kami.
                    </p>
                    <Link
                        href={`#${TOUR_SECTION}`}
                        onClick={scrollToTourSection}
                        className="inline-block bg-white text-teal-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-neon hover:bg-teal-50"
                    >
                        Pesan Sekarang
                    </Link>
                </div>
            </motion.section>
            <Footer />
        </div>
    );
}