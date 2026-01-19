
import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaStar } from 'react-icons/fa'; // Changed icons to match style
import { MdVerified } from 'react-icons/md';
import baseURL from "../config";

interface Business {
    _id?: string;
    businessName?: string;
    address?: string;
    city?: string;
    mobile?: string;
    images?: string[];
    description?: string;
    category?: any;
    locationUrl?: string; // Map link
    isPaid?: boolean;
    rating?: number; // Assuming we might have this
    ratingCount?: number;
}

interface Props {
    business: Business;
}

const BusinessListCard: React.FC<Props> = ({ business }) => {
    const mainImage = business.images && business.images.length > 0
        ? `${baseURL}/uploads/business/${business.images[0]}`
        : "https://via.placeholder.com/300";

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4 flex flex-col md:flex-row">

            {/* LEFT: Image */}
            <div className="w-full md:w-[280px] h-48 md:h-auto relative flex-shrink-0 bg-gray-100">
                <img
                    src={mainImage}
                    alt={business.businessName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* RIGHT: Content */}
            <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                <div>
                    {/* Header: Name & Badges */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h2 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                                    {business.businessName}
                                </h2>
                                {/* Verified Badge */}
                                {business.isPaid && (
                                    <div className="flex items-center gap-1 text-[10px] bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-semibold border border-blue-100 whitespace-nowrap">
                                        <MdVerified />
                                        <span>Verified</span>
                                    </div>
                                )}
                            </div>

                            {/* Rating Row (Only show if data exists) */}
                            {(business.rating || business.ratingCount) && (
                                <div className="flex items-center gap-2 mb-2 flex-wrap text-xs md:text-sm">
                                    {business.rating && (
                                        <div className="bg-green-600 text-white font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                            {business.rating} <FaStar size={10} />
                                        </div>
                                    )}
                                    {business.ratingCount && (
                                        <span className="text-gray-500">{business.ratingCount} Ratings</span>
                                    )}
                                </div>
                            )}

                            {/* Location */}
                            <div className="flex items-start gap-1.5 text-gray-600 text-xs md:text-sm mb-3">
                                <FaMapMarkerAlt className="mt-0.5 text-gray-400 flex-shrink-0" />
                                <p className="line-clamp-1">{business.address}, {business.city}</p>
                            </div>

                            {/* Description (fallback for tags) */}
                            {business.description && (
                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                    {business.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-2">

                    {/* Call Button */}
                    <a href={`tel:${business.mobile}`} className="flex-1">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white px-2 md:px-4 py-2 rounded-md font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap">
                            <FaPhoneAlt size={12} />
                            Call Now
                        </button>
                    </a>

                    {/* WhatsApp Button */}
                    <a href={`https://wa.me/91${business.mobile}`} className="flex-1">
                        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 md:px-4 py-2 rounded-md font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap">
                            <FaWhatsapp size={14} className="text-green-500" />
                            WhatsApp
                        </button>
                    </a>

                    {/* Best Deal Button - Full width on very small screens if needed, otherwise share */}
                    <button className="w-full md:w-auto flex-none bg-[#0077EE] hover:bg-[#0066CC] text-white px-4 py-2 rounded-md font-semibold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                            <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                        </svg>
                        Get Best Deal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BusinessListCard;
