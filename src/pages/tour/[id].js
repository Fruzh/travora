import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import tourData from '@/data/tours';

export default function TourDetail() {
    const router = useRouter();
    const { id } = router.query;

    const tour = tourData.find((t) => t.id === parseInt(id));

    if (!tour) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
                <Navbar />
                <div className="container mx-auto py-12 text-center">Tur tidak ditemukan.</div>
                <Footer />
            </div>
        );
    }

    const openWhatsApp = () => {
        const message = encodeURIComponent(`Halo, saya tertarik dengan tur: ${tour.name} (${tour.price}). Bisakah saya dapatkan detail lebih lanjut?`);
        window.open(`https://wa.me/+621234567890?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
            <Navbar />
            <div className="container mx-auto py-12 px-4">
                <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
                    ← Kembali ke Beranda
                </Link>
                <div className="bg-white/95 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
                    <Image
                        src={tour.image}
                        alt={tour.name}
                        width={800}
                        height={450}
                        className="w-full h-96 object-cover rounded-t-2xl mb-6"
                        onError={() => console.error(`Gambar ${tour.image} tidak ditemukan`)}
                    />
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{tour.name}</h1>
                    <p className="text-gray-600 mb-4">{tour.description}</p>
                    <p className="text-teal-600 font-semibold text-xl mb-6">{tour.price}</p>
                    <h3 className="text-xl font-semibold mb-2">Fitur Tur:</h3>
                    <ul className="list-disc pl-6 mb-6 text-gray-600">
                        {tour.features && tour.features.length > 0 ? (
                            tour.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))
                        ) : (
                            <li>Tidak ada fitur tambahan.</li>
                        )}
                    </ul>
                    <button
                        onClick={openWhatsApp}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-neon hover:scale-105"
                    >
                        Hubungi via WhatsApp
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}