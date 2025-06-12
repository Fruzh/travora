import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 drop-shadow-sm">Bali Tour Adventures</h3>
                        <p className="text-gray-400">
                            Pengalaman wisata premium di Bali dengan pemandu profesional dan destinasi terbaik.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-400 hover:text-teal-400 transition-all duration-300">Beranda</Link></li>
                            <li><Link href="/#tour-explore-section" className="text-gray-400 hover:text-teal-400 transition-all duration-300">Paket Tur</Link></li>
                            <li><Link href="/#contact" className="text-gray-400 hover:text-teal-400 transition-all duration-300">Kontak</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                        <p className="text-gray-400">Email: info@balitouradventures.com</p>
                        <p className="text-gray-400">Telp: +62 123 456 7890</p>
                        <p className="text-gray-400">Alamat: Jl. Raya Ubud, Bali, Indonesia</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Sosial Media</h4>
                        <div className="flex space-x-4">
                            {['instagram', 'facebook', 'twitter'].map((social, index) => (
                                <a key={index} href="#" className="text-gray-400 hover:text-teal-400 transform transition-all duration-300 hover:scale-110">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social === 'instagram' ? "M12 2.04c-5.5..." : social === 'facebook' ? "M22 12c0-5.52..." : "M23 3a10.9..."} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-400">
                    <p>© 2025 Bali Tour Adventures. Hak cipta dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}