import React from "react";
import { FiHome, FiPlusSquare, FiBookOpen, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-20 bg-white">
      {/* Page content */}
      {children}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around py-3 z-50 border-t">

        {/* HOME */}
        <div
          onClick={() => navigate("/")}
          className="flex flex-col items-center text-gray-700 cursor-pointer"
        >
          <FiHome size={22} />
          <p className="text-xs">Home</p>
        </div>

        {/* ADD */}
        <div
          onClick={() => navigate("/user/add-business")}
          className="flex flex-col items-center text-gray-700 cursor-pointer"
        >
          <FiPlusSquare size={22} />
          <p className="text-xs">Add</p>
        </div>

        {/* LEARN */}
        <div
          onClick={() => navigate("")}
          className="flex flex-col items-center text-gray-700 cursor-pointer"
        >
          <FiBookOpen size={22} />
          <p className="text-xs">Learn</p>
        </div>

        {/* MORE */}
        <div
          onClick={() => navigate("")}
          className="flex flex-col items-center text-gray-700 cursor-pointer"
        >
          <FiMenu size={22} />
          <p className="text-xs">More</p>
        </div>
      </div>
    </div>
  );
}
