import React from "react";
import { Business } from "../Components/types";
import { FiPhone } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { MdDirections } from "react-icons/md";
import baseURL from "../config";

interface Props {
  business: Business;
}

const RestaurantCard: React.FC<Props> = ({ business }) => {
  const imgBaseURL = `${baseURL}/uploads/business/`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6 w-full">

      {/* Images */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {business.images && business.images.length > 0 ? (
          business.images.slice(0, 3).map((img, index) => (
            <img
              key={index}
              src={imgBaseURL + img}
              className="w-full h-24 rounded-lg object-cover"
            />
          ))
        ) : (
          <>
            <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          </>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3 text-xs font-semibold mb-1">
        {business.isPaid && <span className="text-blue-600">✔ verified</span>}
      </div>

      {/* Business Name */}
      <h2 className="text-lg font-bold leading-tight">{business.businessName}</h2>

      {/* Address */}
      <p className="text-sm text-gray-600 leading-tight">{business.address}</p>

      {/* City */}
      <p className="text-sm text-gray-500 capitalize">{business.city}</p>

      {/* Timing */}
      <p className="text-sm text-green-600 font-semibold mt-1">
        {business.timings?.monday?.closed ? "Closed Today" : "Open Today"}
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mt-4">

        {/* Call (Primary) */}
        <a href={`tel:${business.mobile}`}>
          <button
            className="w-full h-11 flex items-center justify-center gap-2
      bg-[#0077EE] text-white
      rounded-xl text-sm font-semibold
      shadow-md
      hover:bg-[#005FCC] hover:shadow-lg
      active:scale-95 transition-all duration-200"
          >
            <FiPhone className="text-lg" />
            Call
          </button>
        </a>

        {/* WhatsApp (Icon Only) */}
        <a
          href={`https://wa.me/${business.mobile}?text=Hi%20I%20want%20information%20about%20your%20business`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="w-full h-11 flex items-center justify-center
      bg-white text-green-600
      border border-green-500
      rounded-xl
      shadow-sm
      hover:bg-green-50 hover:shadow-md
      active:scale-95 transition-all duration-200"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="text-xl" />
          </button>
        </a>

        {/* Direction (Icon Only) */}
        <a
          href={business.locationUrl ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="w-full h-11 flex items-center justify-center
      bg-white text-blue-600
      border border-blue-500
      rounded-xl
      shadow-sm
      hover:bg-blue-50 hover:shadow-md
      active:scale-95 transition-all duration-200"
            aria-label="Directions"
          >
            <MdDirections className="text-2xl" />
          </button>
        </a>

      </div>

    </div>
  );
};

export default RestaurantCard;
