import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaListAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import baseURL from "../../config";

const HomePageadmin: React.FC = () => {
  const [businessTotal, setBusinessTotal] = useState<number>(0);
  const [categoryTotal, setCategoryTotal] = useState<number>(0);
  const [userTotal, setUserTotal] = useState<number>(0);

  useEffect(() => {
    fetchTotal();
  }, []);

  const fetchTotal = async () => {
    try {
      const businessRes = await axios.get(`${baseURL}/api/admin/total-business`);
      setBusinessTotal(businessRes.data.total);

      const categoryRes = await axios.get(`${baseURL}/api/admin/total-category`);
      setCategoryTotal(categoryRes.data.total);

      // suggestion extra card (example)
      const userRes = await axios.get(`${baseURL}/api/admin/total-users`);
      setUserTotal(userRes.data.total);
    } catch (error) {
      console.log("API error:", error);
    }
  };

  return (
    <div className="mt-10 flex justify-center px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">

        {/* Total Business */}
        <Link to={"/admin/business-list"}>
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Total Business</p>
                <h2 className="text-4xl font-bold mt-2">{businessTotal}</h2>
              </div>
              <FaBuilding className="text-blue-600 text-5xl" />
            </div>
          </div>
        </Link>

        {/* Total Categories */}
        <Link to={"/admin/category-list"}>
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Total Categories</p>
                <h2 className="text-4xl font-bold mt-2">{categoryTotal}</h2>
              </div>
              <FaListAlt className="text-green-600 text-5xl" />
            </div>
          </div>
        </Link>

        {/* Total Users / Suggested card */}
        <Link to={"/admin/user-list"}>
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">Total Users</p>
                <h2 className="text-4xl font-bold mt-2">{userTotal}</h2>
              </div>
              <FaUsers className="text-purple-600 text-5xl" />
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
};

export default HomePageadmin;
