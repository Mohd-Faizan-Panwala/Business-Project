import { useEffect, useState } from "react";
import { Form, Input, Button, Select, Upload, Card, message, Row, Col, Checkbox, Divider } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import UserLayout from "../../DesignLayout/UserLayout";
import baseURL from "../../config";

/* ================= UI STYLES ================= */
const inputStyle = { height: 44, borderRadius: 8 };
const textareaStyle = { borderRadius: 8 };
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const UserAddBusiness = () => {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            message.error("Please login first to add a business");
            navigate("/");
            return;
        }

        // Fetch ALL subcategories on mount
        axios
            .get(`${baseURL}/api/admin/all-subcategory`)
            .then((res) => setSubcategories(res.data))
            .catch(() => message.error("Failed to load subcategories"));
    }, []);

    const onFinish = async (values: any) => {
        setLoading(true);

        const userId = localStorage.getItem("userId");
        // const storedOwnerName = localStorage.getItem("userName"); // Optional: Auto-fill
        // const storedMobile = localStorage.getItem("userPhone"); // Optional: Auto-fill

        if (!userId) {
            message.error("User session invalid. Please login again.");
            setLoading(false);
            return;
        }

        // Infer Category from the first selected Subcategory
        let derivedCategoryId = null;
        let selectedSubIds = values.subcategories || [];
        // Ensure array
        if (!Array.isArray(selectedSubIds)) selectedSubIds = [selectedSubIds];

        if (selectedSubIds.length > 0) {
            const firstSubId = selectedSubIds[0];
            const selectedSubObj = subcategories.find((s) => s._id === firstSubId);
            if (selectedSubObj && selectedSubObj.parentCategory) {
                derivedCategoryId = selectedSubObj.parentCategory._id;
            }
        }

        if (!derivedCategoryId) {
            message.error("Please select a subcategory to determine the main category.");
            setLoading(false);
            return;
        }

        // Prepare Timings
        const timings: any = {};
        days.forEach((day) => {
            const val = values[day];
            timings[day] = {
                open: val?.open || null,
                close: val?.close || null,
                closed: val?.closed || false,
            };
        });

        const formData = new FormData();

        // Basic fields
        formData.append("businessName", values.businessName);
        formData.append("ownerName", values.ownerName);
        formData.append("mobile", values.mobile);
        formData.append("city", values.city);
        formData.append("pincode", values.pincode);
        formData.append("address", values.address);
        formData.append("locationUrl", values.locationUrl || "");
        formData.append("description", values.description || "");

        // Category & Subcategories
        formData.append("category", derivedCategoryId);
        selectedSubIds.forEach((id: string) => formData.append("subcategories", id));

        // Services
        (values.services || []).forEach((service: string) => formData.append("services", service));

        // Timings
        formData.append("timings", JSON.stringify(timings));

        // User ID
        formData.append("userId", userId);

        // Images
        fileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append("images", file.originFileObj as File);
            }
        });

        try {
            await axios.post(`${baseURL}/api/admin/add-business`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            message.success("Business added successfully!");
            navigate("/user/my-businesses");
        } catch (error) {
            console.error(error);
            message.error("Failed to add business");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
            <UserLayout>
                <div className="flex items-center gap-2 mb-4">
                    <IoChevronBack
                        size={24}
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h2 className="text-xl font-bold">Add Your Business</h2>
                </div>

                <Card bordered={false} className="shadow-sm rounded-xl">
                    <Form layout="vertical" onFinish={onFinish} initialValues={{
                        ownerName: localStorage.getItem("userName"),
                        mobile: localStorage.getItem("userPhone")
                    }}>

                        {/* Business Details Section */}
                        <h3 className="font-semibold text-gray-700 mb-3 text-lg border-b pb-2">🧾 Business Details</h3>

                        <Row gutter={16}>
                            <Col span={24} md={12}>
                                <Form.Item label="Business Name" name="businessName" rules={[{ required: true }]}>
                                    <Input style={inputStyle} placeholder="Enter Business Name" />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item label="Owner Name" name="ownerName" rules={[{ required: true }]}>
                                    <Input style={inputStyle} placeholder="Enter Owner Name" />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item label="Mobile Number" name="mobile" rules={[{ required: true }]}>
                                    <Input style={inputStyle} placeholder="Enter Mobile Number" />
                                </Form.Item>
                            </Col>

                            {/* Sub Categories */}
                            <Col span={24} md={12}>
                                <Form.Item label="Category" name="subcategories" rules={[{ required: true, message: 'Please select at least one category' }]}>
                                    <Select
                                        mode="multiple"
                                        size="large"
                                        placeholder="Select Categories"
                                        style={{ borderRadius: 8 }}
                                        options={subcategories.map((s) => ({ label: s.name, value: s._id }))}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item label="City" name="city" rules={[{ required: true }]}>
                                    <Input style={inputStyle} placeholder="Enter City" />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
                                    <Input style={inputStyle} placeholder="Enter Pincode" />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={12}>
                                <Form.Item label="Location URL" name="locationUrl">
                                    <Input style={inputStyle} placeholder="Google Map Link" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                                    <Input.TextArea rows={3} style={textareaStyle} placeholder="Complete Business Address" />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Description" name="description">
                                    <Input.TextArea rows={4} style={textareaStyle} placeholder="Describe your business..." />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item label="Business Images">
                                    <Upload
                                        listType="picture-card"
                                        multiple
                                        fileList={fileList}
                                        beforeUpload={(file) => {
                                            const newFile: UploadFile = {
                                                uid: file.uid,
                                                name: file.name,
                                                originFileObj: file,
                                                url: URL.createObjectURL(file as unknown as Blob),
                                            };
                                            setFileList((prev) => [...prev, newFile]);
                                            return false;
                                        }}
                                        onRemove={(file) => {
                                            setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                                        }}
                                    >
                                        + Upload
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        {/* Services */}
                        <h3 className="font-semibold text-gray-700 mb-3 text-lg border-b pb-2">🔧 Services</h3>
                        <Form.List name="services">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <Row key={field.key} gutter={12} className="mb-2">
                                            <Col span={20}>
                                                <Form.Item {...field} noStyle>
                                                    <Input style={inputStyle} placeholder="Service name" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Button danger block onClick={() => remove(field.name)}>X</Button>
                                            </Col>
                                        </Row>
                                    ))}
                                    <Button type="dashed" block onClick={() => add()} className="mt-2" style={{ borderRadius: 8, height: 40 }}>
                                        + Add Service
                                    </Button>
                                </>
                            )}
                        </Form.List>

                        <Divider />

                        {/* Timings */}
                        <h3 className="font-semibold text-gray-700 mb-3 text-lg border-b pb-2">⏳ Business Timings</h3>
                        <div className="space-y-2">
                            {days.map((day) => (
                                <Row key={day} gutter={8} align="middle">
                                    <Col span={6} className="capitalize font-medium text-gray-600">{day}</Col>
                                    <Col span={6}><Form.Item name={[day, "open"]} noStyle><Input type="time" style={{ borderRadius: 6 }} /></Form.Item></Col>
                                    <Col span={6}><Form.Item name={[day, "close"]} noStyle><Input type="time" style={{ borderRadius: 6 }} /></Form.Item></Col>
                                    <Col span={6}><Form.Item name={[day, "closed"]} valuePropName="checked" noStyle><Checkbox>Closed</Checkbox></Form.Item></Col>
                                </Row>
                            ))}
                        </div>

                        <Divider />

                        <Button
                            htmlType="submit"
                            type="primary"
                            block
                            size="large"
                            loading={loading}
                            style={{
                                backgroundColor: "#7C3AED",
                                borderRadius: 10,
                                height: 48,
                                fontWeight: 600,
                                border: "none"
                            }}
                        >
                            Submit Application
                        </Button>

                    </Form>
                </Card>
            </UserLayout>
        </div>
    );
};

export default UserAddBusiness;