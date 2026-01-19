import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseURL from "../config";

interface FreeListingPopupProps {
  onClose: () => void;
}

const FreeListingPopup: React.FC<FreeListingPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseURL}/api/user/send-otp`, { phoneNumber });
      console.log('OTP sent to', phoneNumber);
      if (res.data.success) {
        setStep(2);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error('Send OTP error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseURL}/api/user/verify-otp`, { phoneNumber, otp });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        if (res.data.name) { // Assuming API returns name if user already has one
          localStorage.setItem('userPhone', phoneNumber);
          localStorage.setItem('userName', res.data.name);
          onClose();
          navigate('/user/add-business');
        } else {
          setStep(3);
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('Verify OTP error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (userName.trim().length < 3) {
      setError('Please enter a valid name (at least 3 characters).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${baseURL}/api/user/register`, { phoneNumber, name: userName });
      if (res.data.success) {
        console.log('User registered:', { phoneNumber, userName });
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userId', res.data.userId); // Store User ID
        onClose();
        navigate('/user/add-business');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Free Business Listing</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {step === 1 && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Enter your mobile number</label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <p className="text-xs text-gray-500 mb-2">An OTP has been sent to {phoneNumber}</p>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Enter your name</label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-4 px-4 py-2 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeListingPopup;
