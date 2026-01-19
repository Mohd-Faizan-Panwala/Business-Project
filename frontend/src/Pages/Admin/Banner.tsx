import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload, message, Switch, Popconfirm, Image } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import baseURL from "../../config";

interface BannerType {
    _id: string;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
}

const Banner: React.FC = () => {
    const [banners, setBanners] = useState<BannerType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<BannerType | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}/api/admin/all-banners`);
            setBanners(response.data);
        } catch (error) {
            console.error("Fetch banners error:", error);
            message.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingBanner(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: BannerType) => {
        setEditingBanner(record);
        setFileList([
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: `${baseURL}/${record.image}`,
            },
        ]);
        form.setFieldsValue({
            title: record.title,
            description: record.description,
            isActive: record.isActive,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${baseURL}/api/admin/delete-banner/${id}`);
            message.success("Banner deleted successfully");
            fetchBanners();
        } catch (error) {
            console.error("Delete banner error:", error);
            message.error("Failed to delete banner");
        }
    };

    const handleToggleActive = async (id: string, checked: boolean) => {
        try {
            await axios.put(`${baseURL}/api/admin/update-banner/${id}`, { isActive: checked });
            message.success(`Banner ${checked ? "activated" : "deactivated"}`);
            fetchBanners();
        } catch (error) {
            console.error("Toggle active error:", error);
            message.error("Failed to update status");
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description || "");
            formData.append("isActive", values.isActive !== undefined ? values.isActive : true);

            const currentFile = fileList[0];

            // If there is a file and it doesn't have a 'url' property, it means it's a newly uploaded file
            if (currentFile && !currentFile.url) {
                // Use originFileObj if it exists (standard Antd), otherwise use the file object itself (from beforeUpload)
                formData.append("image", currentFile.originFileObj || currentFile);
            } else if (!editingBanner) {
                // If creating a new banner and no new file is selected, show error
                return message.error("Please upload an image");
            }

            if (editingBanner) {
                await axios.put(`${baseURL}/api/admin/update-banner/${editingBanner._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Banner updated successfully");
            } else {
                await axios.post(`${baseURL}/api/admin/add-banner`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                message.success("Banner created successfully");
            }

            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error("Save banner error:", error);
            message.error("Failed to save banner");
        }
    };

    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image: string) => (
                <Image
                    width={100}
                    src={`${baseURL}/${image}`}
                    alt="banner"
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                />
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean, record: BannerType) => (
                <Switch
                    checked={isActive}
                    onChange={(checked) => handleToggleActive(record._id, checked)}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: BannerType) => (
                <div className="flex gap-2">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this banner?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ style: { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' } }} // Red for delete
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const uploadProps = {
        onRemove: (file: any) => {
            setFileList([]);
        },
        beforeUpload: (file: any) => {
            setFileList([file]);
            return false; // Prevent auto upload
        },
        fileList,
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Banner Management</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', color: 'white' }}
                >
                    Add New Banner
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={banners}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingBanner ? "Edit Banner" : "Add New Banner"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Save"
                okButtonProps={{ style: { backgroundColor: '#7C3AED', color: 'white', borderColor: '#7C3AED' } }} // Theme purple
            >
                <Form form={form} layout="vertical" initialValues={{ isActive: true }}>
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter title" }]}
                    >
                        <Input placeholder="Enter banner title" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} placeholder="Enter banner description (optional)" />
                    </Form.Item>

                    <Form.Item label="Banner Image" required>
                        <Upload {...uploadProps} listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select Image</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="isActive" label="Active Status" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Banner;
