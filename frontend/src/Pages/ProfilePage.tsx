import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import baseURL from "../config";

interface UserData {
  name: string;
  mobileno: string;
  address: string;
  pincode: string;
  profileImage?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData>({
    name: "",
    mobileno: "",
    address: "",
    pincode: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    axios
      .get(`${baseURL}/api/user/profile/${userId}/edit`)
      .then((res) => {
        setUser(res.data);
        setImagePreview(`${baseURL}/${res.data.profileImage}`);
      })
      .catch((err) => console.error(err));
  }, [userId]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("address", user.address);
    formData.append("pincode", user.pincode);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      await axios.put(
        `${baseURL}/api/user/profile/${userId}/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaArrowLeft className="text-xl cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="text-2xl font-semibold">Edit Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={imagePreview || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border shadow"
            />
            <label className="absolute bottom-1 right-1 bg-purple-600 text-white p-2 rounded-full cursor-pointer shadow">
              <FaCamera />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">Tap camera icon to change</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        {/* Mobile Number (READONLY) */}
        <div>
          <label className="font-medium">Mobile Number</label>
          <input
            type="text"
            value={user.mobileno}
            readOnly
            className="w-full border p-2 rounded mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Address */}
        <div>
          <label className="font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="font-medium">Pincode</label>
          <input
            type="text"
            name="pincode"
            value={user.pincode}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
            pattern="\d{6}"
            maxLength={6}
            placeholder="6-digit pincode"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-md text-lg font-medium shadow hover:bg-purple-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
