import React from "react";

export default function SectionSlider({ title, items }) {
    return (
        <div className="mt-6">
            {/* Title */}
            <h2 className="text-lg font-bold mb-2">{title}</h2>

            {/* Slider */}
            <div className="w-full overflow-x-auto">
                <div className="flex gap-4">
                    {items.map((item, index) => (
                        <div key={index} className="min-w-[110px]">
                            <img
                                src={item.image}
                                className="w-full h-24 rounded-lg object-cover shadow"
                                alt={item.label}
                            />
                            <p className="text-sm font-semibold mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
