import React, { useEffect, useState,useRef } from "react";
import { Avatar, Button, Input, Tooltip, message } from "antd";
import {
  CloseCircleOutlined,
  UploadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../config";

interface Admin {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedAdmin = localStorage.getItem("admin");
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const [admin, setAdmin] = useState<Admin | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load admin data on mount
  useEffect(() => {
    if (!storedAdmin) {
      message.error("Admin data missing. Please login again.");
      navigate("/admin/login");
      return;
    }

    const parsed: Admin = JSON.parse(storedAdmin);
    setAdmin(parsed);
    setName(parsed.name || "");
    setEmail(parsed.email || "");
    setImage(parsed.profileImage || null);
  }, [storedAdmin, navigate]);

  // ✅ Handle image select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile)); // preview
    }
  };

  // ✅ Save profile
  const handleSave = async () => {
    if (!admin || !token) {
      message.error("Authentication error. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("profileImage", file);
      }

      const res = await axios.put(
        `${baseURL}/api/admin/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update localStorage with new admin data
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      setAdmin(res.data.admin);

      if (res.data.admin.profileImage) {
       setImage(res.data.admin.profileImage);
       console.log("IMAGE PATH FROM API:", res.data.admin.profileImage);

}

      message.success("Profile updated successfully");
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-8">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>

        <Button type="primary" loading={loading} onClick={handleSave} className="text-black hover:font-semibold hover:text-white">
          Save Changes
        </Button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Admin Profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <Avatar
          size={96}
          src={
            image
              ? image.startsWith("blob:")
                ? image
                : `${baseURL}/${image}`
              : undefined
          }
        />


        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleImageChange}
        />

        <Button onClick={() => fileInputRef.current?.click()}>
          Change Photo
        </Button>
      </div>

      {/* FORM */}
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Full Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="large"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Email Address
          </label>
          <div className="relative group">
            <Input value={email} disabled size="large" />
            <Tooltip title="Email cannot be changed">
              <CloseCircleOutlined
                className="absolute right-3 top-1/2 -translate-y-1/2
                text-red-500 opacity-0 group-hover:opacity-100 transition"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
