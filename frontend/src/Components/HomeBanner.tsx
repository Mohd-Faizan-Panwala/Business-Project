import React, { useState } from 'react';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import baseURL from "../config";

interface BannerProps {
    banner: any[];
    loading: boolean;
}

const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div
            onClick={onClick}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-gray-800 shadow-md hover:bg-white transition-all cursor-pointer"
        >
            <FaChevronLeft size={18} />
        </div>
    );
};

const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <div
            onClick={onClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-md rounded-full text-gray-800 shadow-md hover:bg-white transition-all cursor-pointer"
        >
            <FaChevronRight size={18} />
        </div>
    );
};

const BannerImage = ({ src, alt }: { src: string; alt: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className="relative w-full h-48 lg:h-72 bg-gray-200 overflow-hidden">
            {/* Loading Skeleton/Spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-[#7C3AED] rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};

const HomeBanner: React.FC<BannerProps> = ({ banner, loading }) => {
    if (loading) {
        return (
            <div className="mt-6 w-full h-48 lg:h-72 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                <p className="text-gray-400">Loading banner...</p>
            </div>
        );
    }

    if (!banner || banner.length === 0) return null;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        // fade: true, // Smooth transition
    };

    return (
        <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden relative group">
            <Slider {...settings}>
                {banner.map((b: any) => (
                    <div key={b._id} className="outline-none">
                        <BannerImage src={`${baseURL}/${b.image}`} alt={b.title} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HomeBanner;
