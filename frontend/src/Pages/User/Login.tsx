import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../../config";

const UserLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/user/send-otp`, { phoneNumber });
      navigate(`/user/verify-otp?mobile=${phoneNumber}`);
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-500 px-4">

      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 sm:p-8">

        {/* Title */}
        <h2 className="text-xl font-semibold border-b pb-3 mb-5">Login</h2>

        {/* Label */}
        <label className="font-medium text-sm">
          <span className="text-red-500">*</span> Mobile Number
        </label>

        {/* Input */}
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full border rounded-md p-2 mt-1 mb-6 focus:ring focus:ring-purple-300 outline-none"
          placeholder="Enter your mobile number"
        />

        {/* Button */}
        <button
          onClick={sendOtp}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
        >
          Send OTP
        </button>

        {/* Footer */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Need Help? <span className="text-blue-600 cursor-pointer">Contact Support</span>
        </p>

      </div>
    </div>
  );
};

export default UserLogin;
