import { useMediaQuery } from 'react-responsive';
import dynamic from 'next/dynamic';
import { SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';

// Dynamic import Swiper
const Swiper = dynamic(() => import('swiper/react').then((mod) => mod.Swiper), {
    ssr: false,
});

const FilterButton = ({ category, filter, setFilter, setCurrentPage }) => (
    <button
        onClick={() => {
            setFilter(category);
            setCurrentPage(1);
        }}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-102 hover:shadow-neon border-2 border-teal-300 ${
            filter === category
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                : 'bg-white text-teal-600 hover:bg-teal-50'
        }`}
        aria-label={`Filter by ${category === 'all' ? 'Semua' : category}`}
    >
        {category === 'all' ? 'Semua' : category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
);

export default function FilterButtons({ filter, setFilter, setCurrentPage }) {
    const isMobile = useMediaQuery({ maxWidth: 639 });

    // CSS untuk hide scrollbar
    const styles = `
        .swiper-container-no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .swiper-container-no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    `;

    return (
        <>
            <style>{styles}</style>
            {isMobile ? (
                <Swiper
                    slidesPerView="auto"
                    spaceBetween={8}
                    freeMode={true}
                    modules={[FreeMode]}
                    className="swiper-container-no-scrollbar w-full"
                    style={{ padding: '0 16px' }}
                >
                    {['all', 'cultural', 'beach', 'nature', 'adventure'].map((category) => (
                        <SwiperSlide key={category} style={{ width: 'auto' }}>
                            <FilterButton
                                category={category}
                                filter={filter}
                                setFilter={setFilter}
                                setCurrentPage={setCurrentPage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {['all', 'cultural', 'beach', 'nature', 'adventure'].map((category) => (
                        <FilterButton
                            key={category}
                            category={category}
                            filter={filter}
                            setFilter={setFilter}
                            setCurrentPage={setCurrentPage}
                        />
                    ))}
                </div>
            )}
        </>
    );
}