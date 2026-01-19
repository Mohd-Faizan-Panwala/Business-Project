
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseURL from "../config";

interface SignUpPopupProps {
    onClose: () => void;
    onSignUpSuccess: () => void;
}

const SignUpPopup: React.FC<SignUpPopupProps> = ({ onClose, onSignUpSuccess }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
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
            // Using the specific signup send-otp which checks duplicates
            const res = await axios.post(`${baseURL}/api/user/signup/send-otp`, { phoneNumber });
            if (res.data.success) {
                setStep(2);
            } else {
                setError(res.data.message || 'Error sending OTP.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error connecting to server.');
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
                // OTP Verified, now ask for Name
                localStorage.setItem('token', res.data.token);
                setStep(3);
            } else {
                setError('Invalid OTP.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (name.trim().length < 2) {
            setError('Please enter a valid name.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${baseURL}/api/user/register`, { phoneNumber, name });
            if (res.data.success) {
                localStorage.setItem('userName', name);
                localStorage.setItem('userPhone', phoneNumber);
                if (res.data.userId) {
                    localStorage.setItem('userId', res.data.userId);
                }

                onSignUpSuccess();
                onClose();
            } else {
                setError(res.data.message || 'Registration failed.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>

                {error && <div className="bg-red-50 text-red-500 p-2 rounded mb-4 text-sm text-center">{error}</div>}

                {step === 1 && (
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-[#7C3AED] focus-within:border-[#7C3AED]">
                            <span className="bg-gray-100 px-3 py-2 text-gray-500 border-r border-gray-300">+91</span>
                            <input
                                type="tel"
                                id="phone"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter mobile number"
                                className="w-full px-3 py-2 outline-none"
                                maxLength={10}
                            />
                        </div>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full mt-6 px-4 py-2.5 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-opacity-70 transition-all shadow-md active:scale-95"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-sm">We've sent a 6-digit OTP to</p>
                            <p className="font-semibold text-gray-800">+91 {phoneNumber} <button onClick={() => setStep(1)} className="text-[#7C3AED] text-xs underline ml-1">Edit</button></p>
                        </div>

                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">One Time Password (OTP)</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] text-center text-lg tracking-widest"
                            maxLength={6}
                        />

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full mt-6 px-4 py-2.5 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-opacity-70 transition-all shadow-md active:scale-95"
                        >
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]"
                        />

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full mt-6 px-4 py-2.5 bg-[#7C3AED] text-white font-medium rounded-md hover:bg-[#6D28D9] disabled:bg-opacity-70 transition-all shadow-md active:scale-95"
                        >
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpPopup;
