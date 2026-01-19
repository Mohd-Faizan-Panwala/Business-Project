import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import baseURL from "../../../config";

interface Category {
    _id: string;
    name: string;
}

const AddSubCategory: React.FC = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [parentCategory, setParentCategory] = useState("");
    const [parentList, setParentList] = useState<Category[]>([]);

    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [orderPriority, setOrderPriority] = useState(0);

    const [loading, setLoading] = useState(false);

    // Fetch Parent Categories
    useEffect(() => {
        const fetchParents = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/admin/parent-category`);
                if (res.data.success) {
                    setParentList(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching parent categories:", error);
            }
        };
        fetchParents();
    }, [baseURL]);

    // Auto-generate slug
    useEffect(() => {
        if (name) {
            const generatedSlug = name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            setSlug(generatedSlug);
        } else {
            setSlug("");
        }
    }, [name]);

    const handleImageChange = (e: any) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!name.trim()) return alert("Subcategory name is required");
        if (!parentCategory) return alert("Please select a parent category");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("parentCategory", parentCategory);
        formData.append("slug", slug);
        formData.append("description", description);
        formData.append("status", status);
        formData.append("orderPriority", orderPriority.toString());
        if (image) formData.append("image", image);

        try {
            setLoading(true);
            await axios.post(
                `${baseURL}/api/admin/add-subcategory`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("Subcategory added successfully");
            navigate("/admin/subcategory-list"); // Redirect to list
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to add subcategory");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "30px auto" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontWeight: 600, fontSize: '24px' }}>Add Sub Category</h2>
                <Link to="/admin/subcategory-list" style={{ padding: '8px 16px', background: '#64748b', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                    Back to List
                </Link>
            </div>

            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
                }}
            >
                <form onSubmit={handleSubmit}>

                    {/* Parent Category */}
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                            Select Parent Category <span style={{ color: 'red' }}>*</span>
                        </label>
                        <select
                            value={parentCategory}
                            onChange={(e) => setParentCategory(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "6px",
                            }}
                            required
                        >
                            <option value="">-- Select Parent --</option>
                            {parentList.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sub Category Name */}
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                            Sub Category Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter subcategory name"
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    {/* Slug */}
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                            Slug (Auto)
                        </label>
                        <input
                            type="text"
                            value={slug}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "6px",
                                backgroundColor: "#f0f0f0",
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description..."
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d0d0d0",
                                borderRadius: "6px",
                            }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Status */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d0d0d0",
                                    borderRadius: "6px",
                                }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Order */}
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                                Order Priority
                            </label>
                            <input
                                type="number"
                                value={orderPriority}
                                onChange={(e) => setOrderPriority(Number(e.target.value))}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    border: "1px solid #d0d0d0",
                                    borderRadius: "6px",
                                }}
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                            Image
                        </label>
                        <input type="file" onChange={handleImageChange} accept="image/*" />

                        {preview && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={preview}
                                    alt="preview"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "6px",
                                        objectFit: "cover",
                                        border: "1px solid #ddd",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "12px 20px",
                            background: "#7C3AED",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            width: "100%",
                            marginTop: '10px'
                        }}
                    >
                        {loading ? "Saving..." : "Create Sub Category"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddSubCategory;
