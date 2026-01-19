import React, { useState, useEffect } from "react";
import axios from "axios";
import baseURL from "../../config";

const AddCategory: React.FC = () => {

    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Active"); // Default status
    const [orderPriority, setOrderPriority] = useState(0); // Default order/priority

    const [loading, setLoading] = useState(false);

    // Auto-generate slug from name
    useEffect(() => {
        if (name) {
            const generatedSlug = name
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-") // Replace spaces with hyphens
                .replace(/[^a-z0-9-]/g, ""); // Remove non-alphanumeric characters except hyphens
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

        if (!name.trim()) return alert("Category name is required");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug);
        formData.append("description", description);
        formData.append("status", status);
        formData.append("orderPriority", orderPriority.toString());
        if (image) formData.append("image", image);

        try {
            setLoading(true);

            const res = await axios.post(
                `${baseURL}/api/admin/add-category`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("Category added successfully");
            setName("");
            setImage(null);
            setPreview(null);
            setSlug("");
            setDescription("");
            setStatus("Active");
            setOrderPriority(0);
        } catch (err) {
            console.error(err);
            alert("Failed to add category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "30px auto",
                background: "#fff",
                padding: "25px",
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
            }}
        >
            <h2 style={{ marginBottom: "20px", fontWeight: 600 }}>Add New Category</h2>

            <form onSubmit={handleSubmit}>
                {/* Category Name */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                        Category Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #d0d0d0",
                            borderRadius: "6px",
                        }}
                    />
                </div>

                {/* Category Slug (auto) */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                        Category Slug (auto)
                    </label>
                    <input
                        type="text"
                        value={slug}
                        readOnly // Slug is auto-generated
                        placeholder="Auto-generated slug"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #d0d0d0",
                            borderRadius: "6px",
                            backgroundColor: "#f0f0f0", // Indicate read-only
                        }}
                    />
                </div>

                {/* Description (optional) */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                        Description (optional)
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter category description"
                        rows={3}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #d0d0d0",
                            borderRadius: "6px",
                            resize: "vertical",
                        }}
                    ></textarea>
                </div>

                {/* Status */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
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

                {/* Order / Priority */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                        Order / Priority
                    </label>
                    <input
                        type="number"
                        value={orderPriority}
                        onChange={(e) => setOrderPriority(Number(e.target.value))}
                        placeholder="Enter order or priority"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #d0d0d0",
                            borderRadius: "6px",
                        }}
                    />
                </div>

                {/* Category Icon */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "8px" }}>
                        Category Icon
                    </label>
                    <input type="file" onChange={handleImageChange} />

                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "6px",
                                marginTop: "10px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                            }}
                        />
                    )}
                </div>

                {/* Submit Button */}
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
                    }}
                >
                    {loading ? "Saving..." : "Add Category"}
                </button>
            </form>
        </div>
    );
};

export default AddCategory;