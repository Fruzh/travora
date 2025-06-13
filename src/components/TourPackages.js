import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Map, Landmark, Waves, Leaf, Mountain, Clock } from 'lucide-react';

export default function TourPackages({ tours, variants }) {
    const router = useRouter();
    const activeFilter = router.query.filter || 'all';

    const openWhatsApp = (tour) => {
        const message = encodeURIComponent(
            `Halo, saya tertarik dengan tur: ${tour.name} (${tour.price}). Bisakah saya dapatkan detail lebih lanjut?`
        );
        window.open(`https://wa.me/+621234567890?text=${message}`, '_blank');
    };

    // Map kategori ke label, warna solid, dan ikon Lucide
    const categoryStyles = {
        all: {
            label: 'Semua',
            color: 'bg-teal-600',
            icon: <Map className="w-3 h-3 sm:w-4 sm:h-4" />,
        },
        cultural: {
            label: 'Cultural',
            color: 'bg-amber-600',
            icon: <Landmark className="w-3 h-3 sm:w-4 sm:h-4" />,
        },
        beach: {
            label: 'Beach',
            color: 'bg-sky-600',
            icon: <Waves className="w-3 h-3 sm:w-4 sm:h-4" />,
        },
        nature: {
            label: 'Nature',
            color: 'bg-green-600',
            icon: <Leaf className="w-3 h-3 sm:w-4 sm:h-4" />,
        },
        adventure: {
            label: 'Adventure',
            color: 'bg-red-500',
            icon: <Mountain className="w-3 h-3 sm:w-4 sm:h-4" />,
        },
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tours.map((tour) => (
                <motion.div
                    key={tour.id}
                    className="bg-white rounded-3xl shadow-xl p-4 sm:p-5 bg-white/95 backdrop-blur-sm flex flex-col transition-all duration-300 hover:shadow-neon hover:scale-102"
                    variants={variants}
                >
                    <div className="relative">
                        <Image
                            src={tour.image}
                            alt={tour.name}
                            width={600}
                            height={300}
                            className="w-full h-48 sm:h-56 object-cover rounded-t-2xl select-none"
                            onError={() => console.error(`Gambar ${tour.image} tidak ditemukan`)}
                        />
                        {/* Badge Kategori */}
                        <span
                            className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white border border-white/30 shadow-lg flex items-center gap-2 hover:bg-${
                                categoryStyles[tour.category]?.color.replace('bg-', '') || 'bg-teal-600'
                            }/90 transition-all duration-300 ${
                                activeFilter === tour.category
                                    ? 'bg-teal-500'
                                    : categoryStyles[tour.category]?.color || 'bg-teal-600'
                            }`}
                        >
                            {categoryStyles[tour.category]?.icon}
                            {categoryStyles[tour.category]?.label || tour.category.charAt(0).toUpperCase() + tour.category.slice(1)}
                        </span>
                        {/* Label Durasi */}
                        <span
                            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs sm:text-sm text-teal-700 border border-teal-500/30 font-semibold bg-white shadow-lg backdrop-blur-sm flex items-center gap-2"
                        >
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500" />
                            {tour.duration} Hari
                        </span>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{tour.name}</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-3">{tour.description}</p>
                        <p className="text-teal-600 font-semibold mb-4 text-sm sm:text-base">{tour.price}</p>
                        <div className="flex flex-row space-y-0 space-x-3 mt-auto">
                            <Link
                                href={`/tour/${tour.id}`}
                                className="flex-1 text-center bg-white text-teal-600 px-4 py-2 rounded-full font-semibold border border-teal-300 transition-all duration-300 hover:shadow-neon hover:bg-teal-50"
                            >
                                Detail
                            </Link>
                            <button
                                onClick={() => openWhatsApp(tour)}
                                className="flex-1 text-white bg-gradient-to-r from-green-500 to-teal-500 px-4 py-2 rounded-full font-semibold transition-all duration-300 hover:shadow-neon"
                            >
                                WhatsApp
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}