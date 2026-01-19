import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import baseURL from "../../config";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [isResending, setIsResending] = useState(false);

  const inputsRef = useRef<any[]>([]);
  const [params] = useSearchParams();
  const phoneNumber = params.get("mobile");
  const navigate = useNavigate();

  // ---------------------------
  // TIMER COUNTDOWN
  // ---------------------------
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ---------------------------
  // HANDLE OTP INPUT
  // ---------------------------
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;

    const tempOtp = [...otp];
    tempOtp[index] = value;
    setOtp(tempOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // ---------------------------
  // VERIFY OTP
  // ---------------------------
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      alert("Enter valid 4-digit OTP");
      return;
    }

    try {
      const res = await axios.post(`${baseURL}/api/user/verify-otp`, {
        phoneNumber,
        otp: finalOtp,
      });

      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);


      navigate("/user/home");
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  // ---------------------------
  // RESEND OTP
  // ---------------------------
  const resendOtp = async () => {
    setIsResending(true);
    try {
      await axios.post(`${baseURL}/api/user/send-otp`, { phoneNumber });

      // Reset OTP input
      setOtp(["", "", "", ""]);

      // Restart timer
      setTimer(120);

      // Focus first box
      inputsRef.current[0].focus();
    } catch (error) {
      alert("Failed to resend OTP");
    }
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-500 px-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 sm:p-8">

        <h2 className="text-xl font-semibold border-b pb-3 mb-5">Verify OTP</h2>

        <p className="text-sm mb-6 text-gray-600">
          OTP sent to <span className="font-semibold">{phoneNumber}</span>
        </p>

        {/* OTP INPUT BOXES */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border rounded-lg text-center text-xl focus:ring focus:ring-purple-300 outline-none"
            />
          ))}
        </div>

        {/* TIMER */}
        {timer > 0 ? (
          <p className="text-center text-sm text-gray-700 mb-4">
            Resend OTP in <span className="font-semibold">{formatTime()}</span>
          </p>
        ) : (
          <p className="text-center text-sm text-gray-700 mb-4">
            Didn’t receive OTP?
          </p>
        )}

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
        >
          Verify & Login
        </button>

        {/* RESEND BUTTON */}
        <div className="text-center mt-4">
          {timer === 0 ? (
            <button
              disabled={isResending}
              onClick={resendOtp}
              className="text-blue-600 font-medium"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          ) : (
            <span className="text-gray-400">Resend OTP Disabled</span>
          )}
        </div>

      </div>
    </div>
  );
};

export default VerifyOtp;
