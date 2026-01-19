import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import UserLayout from "../DesignLayout/UserLayout";
import { Business } from "../Components/types";
import baseURL from "../config";

const MyBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const userPhone = localStorage.getItem("userPhone");
  const navigate = useNavigate();

  const fetchBusinesses = async () => {
    if (!userPhone) {
      setLoading(false);
      return;
    }

    try {
      // Ensure mobile has correct 91 prefix if backend expects it, or send as is strictly based on what is stored
      // Assuming backend query matches exactly what's in 'mobile' field of Business
      // Usually format stored is just 10 digits or sometimes 91+10 digits.
      // Let's pass what we have.
      const res = await axios.get(`${baseURL}/api/user/my-businesses/${userPhone}`);
      console.log("Businesses fetched:", res.data);
      setBusinesses(res.data.businesses || []);
    } catch (err: any) {
      console.error("Failed to load businesses:", err);
      if (err.response && err.response.status === 404) {
        setBusinesses([]); // No businesses found is fine
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [userPhone]);

  // UI Helper for Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            <FaCheckCircle /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
            <FaExclamationCircle /> Rejected
          </span>
        );
      default: // pending
        return (
          <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
            <FaClock /> Pending Approval
          </span>
        );
    }
  };


  return (
    <UserLayout>
      <div className="p-4 sm:p-6 min-h-screen bg-gray-50 pb-24">

        {/* 🏷️ HEADER SECTION */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">My Business Listings</h2>
            <p className="text-indigo-100 text-sm mb-4">Manage your businesses and check approval status.</p>

            <button
              onClick={() => navigate("/user/add-business")}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition shadow-md"
            >
              <FaPlus /> Add New Business
            </button>
          </div>
          {/* Decorative Background Icon */}
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2V9h-2V7h8v12zm-4-8h-2v2h2V7zm0 4h-2v2h2v-2z" />
            </svg>
          </div>
        </div>


        {/* 📋 BUSINESS LIST */}
        {loading ? (
          <div className="flex justify-center p-10"><span className="loader"></span> Loading...</div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Empty" className="w-40 mx-auto opacity-50 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">No Businesses Found</h3>
            <p className="text-sm text-gray-500 mb-4">You haven't listed any business yet.</p>
            <button
              onClick={() => navigate("/user/add-business")}
              className="text-violet-600 font-semibold hover:underline"
            >
              + Add your first business
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {businesses.map((biz) => (
              <div
                key={biz._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row gap-4 justify-between"
              >
                <div className="flex gap-4">
                  {/* Valid Image Check */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {biz.images && biz.images.length > 0 ? (
                      <img
                        src={`${baseURL}/uploads/business/${biz.images[0]}`}
                        alt={biz.businessName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">{biz.businessName}</h3>
                    <p className="text-xs text-gray-500 mb-2">{biz.city} • {biz.category?.name || "Uncategorized"}</p>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {getStatusBadge(biz.approvalStatus || 'pending')}
                    </div>

                    {/* Show Rejection Reason if Rejected */}
                    {biz.approvalStatus === 'rejected' && biz.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1 bg-red-50 p-1 rounded px-2 border border-red-100">
                        Reason: {biz.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0">
                  <button className="text-gray-400 hover:text-violet-600 transition p-2">
                    <IoArrowForward size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </UserLayout>
  );
};

export default MyBusinesses;
