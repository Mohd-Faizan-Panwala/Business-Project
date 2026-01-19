import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaBell, FaUserCircle, FaMicrophone } from "react-icons/fa";
import UserLayout from "../DesignLayout/UserLayout";
import SidebarMenu from "../Components/SidebarMenu";
import BusinessListCard from "../Components/BusinessListCard";
import axios from "axios";
import logo from '../Assets/new-logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import FreeListingPopup from '../Components/FreeListingPopup';
import LoginPopup from '../Components/LoginPopup';
import SignUpPopup from '../Components/SignUpPopup';
import HomeBanner from '../Components/HomeBanner';
import baseURL from "../config";


interface User {
  id?: string;
  name?: string;
  mobile?: string;
}



const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🔍 SEARCH STATES */
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  /* 📂 CATEGORY STATES */
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);

  /* 🖼️ BANNER STATE */
  const [banner, setBanner] = useState<any[]>([]);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFreeListingPopupOpen, setIsFreeListingPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignUpPopupOpen, setIsSignUpPopupOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        const userName = localStorage.getItem('userName');
        const userPhone = localStorage.getItem('userPhone');
        if (userName || userPhone) {
          setCurrentUser({ name: userName || undefined, mobile: userPhone || undefined });
        } else {
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    // Check auth on mount
    checkAuth();

    // Re-check auth when the window gains focus
    window.addEventListener('focus', checkAuth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/user/category/list`);
        setDynamicCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* 🔍 SEARCH API (DEBOUNCE) */
  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/api/user/search`, {
          params: { q: searchText },
        });
        setSearchResults(res.data.businesses || []);
      } catch (err) {
        console.log("Search error", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [searchText]);

  /* 🖼️ FETCH BANNER */
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setBannerLoading(true);
        const res = await axios.get(`${baseURL}/api/user/banners`);
        setBanner(res.data || []);
      } catch (err) {
        console.log("Banner fetch error", err);
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBanner();
  }, []);



  /* 🎤 VOICE SEARCH FUNCTION */
  const handleVoiceSearch = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };
    recognition.onresult = (event: any) => {
      console.log('Voice result:', event);
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      setSearchText(transcript);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access and try again.');
      } else {
        alert('Voice recognition error: ' + event.error);
      }
    };
    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      alert('Error starting voice recognition.');
    }
  };

  return (
    <UserLayout>
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={currentUser} />

      <div className="w-full min-h-screen bg-[#f7f7f7] p-3 pb-20">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between mb-3 px-2">
          {isLoggedIn ? (
            <>
              <img
                src={logo}
                alt="Logo"
                className="w-15 h-10 cursor-pointer"
                onClick={() => setSidebarOpen(true)}
              />
              <div className="flex items-center gap-4">
                <FaBell size={22} className="text-gray-700" />
                <FaUserCircle
                  size={40}
                  className="text-gray-600 cursor-pointer"
                  onClick={() => setSidebarOpen(true)}
                />
              </div>
            </>
          ) : (
            <>
              <img
                src={logo}
                alt="Logo"
                className="w-15 h-10 cursor-pointer"
              />
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <div className="flex flex-col items-center justify-end h-full">
                  <p className="text-red-500 text-xs font-medium mb-1">For Business</p>
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        navigate('/user/add-business');
                      } else {
                        setIsFreeListingPopupOpen(true);
                      }
                    }}
                    className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-[#7C3AED] border border-[#7C3AED] rounded-md hover:bg-[#7C3AED] hover:text-white transition-colors"
                  >
                    Free Listing
                  </button>
                </div>
                <button
                  onClick={() => setIsLoginPopupOpen(true)}
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignUpPopupOpen(true)}
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-[#7C3AED] rounded-md hover:bg-[#6D28D9] transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-md border border-gray-300 focus-within:border-[#7C3AED] focus-within:shadow-lg transition">
          <FiSearch size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search services, business or location..."
            className="w-full bg-transparent outline-none text-sm text-gray-700"
          />
          <FaMicrophone
            size={18}
            className={`cursor-pointer ${isListening ? 'text-red-500' : 'text-gray-400'} hover:text-gray-600`}
            onClick={handleVoiceSearch}
          />
        </div>

        {/* 🔍 SEARCH RESULTS */}
        {searchText && (
          <div className="mt-4">
            {loading && (
              <p className="text-center text-sm text-gray-500">Searching...</p>
            )}

            {!loading && searchResults.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                No results found
              </p>
            )}

            {!loading &&
              searchResults.map((biz) => (
                <BusinessListCard key={biz._id} business={biz} />
              ))}
          </div>
        )}

        {/* 👇 HOME CONTENT (HIDDEN DURING SEARCH) */}
        {!searchText && (
          <>
            {/* 🖼️ BANNER CAROUSEL */}
            {/* 🖼️ BANNER CAROUSEL */}
            <HomeBanner banner={banner} loading={bannerLoading} />

            {/* 📂 CATEGORY GRID */}
            <div className="grid grid-cols-4 lg:grid-cols-10 gap-5 mt-6">
              {dynamicCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => navigate(`/category/${cat._id}`)}
                >
                  <div className="w-12 h-12 bg-white shadow rounded-xl flex items-center justify-center text-2xl">
                    {cat.icon ? (
                      <span>{cat.icon}</span>
                    ) : (
                      <img src={`${baseURL}/uploads/category/${cat.image}`} alt={cat.name} className="w-8 h-8 object-cover rounded" />
                    )}
                  </div>
                  <p className="text-xs mt-1 text-gray-700 text-center">
                    {cat.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isFreeListingPopupOpen && (
        <FreeListingPopup onClose={() => setIsFreeListingPopupOpen(false)} />
      )}

      {isLoginPopupOpen && (
        <LoginPopup
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={() => {
            // Manually trigger auth check logic that is inside the useEffect or duplicated here
            const token = localStorage.getItem('token');
            if (token) {
              setIsLoggedIn(true);
              const userName = localStorage.getItem('userName');
              const userPhone = localStorage.getItem('userPhone');
              if (userName || userPhone) {
                setCurrentUser({ name: userName || undefined, mobile: userPhone || undefined });
              }
            }
          }}
        />
      )}
      {isSignUpPopupOpen && (
        <SignUpPopup
          onClose={() => setIsSignUpPopupOpen(false)}
          onSignUpSuccess={() => {
            const token = localStorage.getItem('token');
            if (token) {
              setIsLoggedIn(true);
              const userName = localStorage.getItem('userName');
              const userPhone = localStorage.getItem('userPhone');
              if (userName || userPhone) {
                setCurrentUser({ name: userName || undefined, mobile: userPhone || undefined });
              }
            }
          }}
        />
      )}
    </UserLayout>
  );
}

export default HomePage;
