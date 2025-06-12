import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TourPackages({ tours, variants }) {
    const openWhatsApp = (tour) => {
        const message = encodeURIComponent(`Halo, saya tertarik dengan tur: ${tour.name} (${tour.price}). Bisakah saya dapatkan detail lebih lanjut?`);
        window.open(`https://wa.me/+621234567890?text=${message}`, '_blank');
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour) => (
                <motion.div
                    key={tour.id}
                    className="bg-white rounded-2xl shadow-xl p-6 bg-white/95 backdrop-blur-sm flex flex-col transition-all duration-300 hover:shadow-neon hover:scale-105"
                    variants={variants}
                >
                    <Image
                        src={tour.image}
                        alt={tour.name}
                        width={600}
                        height={300}
                        className="w-full h-56 object-cover rounded-t-2xl"
                        onError={() => console.error(`Gambar ${tour.image} tidak ditemukan`)}
                    />
                    <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{tour.name}</h2>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{tour.description}</p>
                        <p className="text-teal-600 font-semibold mb-4">{tour.price}</p>
                        <div className="flex space-x-3 mt-auto">
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