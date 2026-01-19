import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import baseURL from "../../../config";
import { Table, Button, Modal, Form, Input, Upload, message, Select, Tag, Popconfirm } from "antd";
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface SubCategory {
    _id: string;
    name: string;
    image?: string;
    parentCategory: {
        name: string;
        _id: string;
    } | null;
    status: string;
    orderPriority: number;
    description?: string;
}

const SubCategoryList: React.FC = () => {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [parents, setParents] = useState<any[]>([]);

    const fetchSubCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/api/admin/all-subcategory`);
            setSubCategories(res.data);
        } catch (error) {
            console.error(error);
            message.error("Failed to load subcategories");
        } finally {
            setLoading(false);
        }
    };

    const fetchParents = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/parent-category`);
            setParents(res.data.data);
        } catch (err) {
            console.error("Failed to fetch parents", err);
        }
    };

    useEffect(() => {
        fetchSubCategories();
        fetchParents();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${baseURL}/api/admin/delete-subcategory/${deleteId}`);
            message.success("Subcategory deleted successfully");
            setSubCategories(prev => prev.filter(item => item._id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            message.error("Failed to delete subcategory");
        }
    };

    const handleEdit = (record: SubCategory) => {
        setEditingSubCategory(record);
        setIsEditModalOpen(true);
        form.setFieldsValue({
            name: record.name,
            description: record.description,
            status: record.status,
            orderPriority: record.orderPriority,
            parentCategory: record.parentCategory?._id
        });

        if (record.image) {
            setFileList([{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: `${baseURL}/uploads/category/${record.image}`
            }]);
        } else {
            setFileList([]);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("status", values.status);
            formData.append("orderPriority", values.orderPriority);
            // formData.append("parentCategory", values.parentCategory); 
            // Note: subCategories usually can change parent, but backend updateSubCategory allows req.body spreads so it might work.
            // Let's assume we want to allow changing parent too.

            const currentFile = fileList[0];
            if (currentFile && !currentFile.url) {
                formData.append("image", currentFile.originFileObj || currentFile);
            }

            if (!editingSubCategory) return;

            setLoading(true);
            await axios.put(`${baseURL}/api/admin/update-subcategory/${editingSubCategory._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            message.success("Subcategory updated successfully");
            setIsEditModalOpen(false);
            fetchSubCategories();
        } catch (error) {
            console.error("Update error", error);
            message.error("Failed to update subcategory");
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        onRemove: (file: any) => {
            setFileList([]);
        },
        beforeUpload: (file: any) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    const columns = [
        {
            title: "#",
            render: (_: any, __: any, index: number) => index + 1,
            width: 50,
        },
        {
            title: "Image",
            dataIndex: "image",
            render: (image: string) => {
                if (!image) return <span className="text-gray-400">No Img</span>;
                return (
                    <img
                        src={`${baseURL}/uploads/category/${image}`}
                        alt="SubCategory"
                        className="w-12 h-12 rounded object-cover border"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/50?text=Error")}
                    />
                );
            }
        },
        {
            title: "Name",
            dataIndex: "name",
            render: (text: string) => <span className="font-semibold">{text}</span>
        },
        {
            title: "Parent Category",
            dataIndex: ["parentCategory", "name"],
            render: (text: string) => text || <span className="text-red-500">Deleted Parent</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: string) => (
                <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
            )
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: SubCategory) => (
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => setDeleteId(record._id)}
                    />
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Sub Categories</h2>
                <Link to="/admin/subcategory-add">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ backgroundColor: "#7C3AED", borderColor: "#7C3AED" }}
                    >
                        Add New Sub Category
                    </Button>
                </Link>
            </div>

            <Table
                dataSource={subCategories}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                className="bg-white rounded-lg shadow-sm"
            />

            {/* Delete Confirmation Modal */}
            <Modal
                title="Confirmation"
                open={!!deleteId}
                onOk={handleDelete}
                onCancel={() => setDeleteId(null)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ style: { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' } }}
            >
                <p>Are you sure you want to delete this subcategory?</p>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="Edit Subcategory"
                open={isEditModalOpen}
                onOk={handleEditSubmit}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Update"
                okButtonProps={{ style: { backgroundColor: '#7C3AED', color: 'white', borderColor: '#7C3AED' } }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Subcategory Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="orderPriority" label="Order Priority">
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Image">
                        <Upload {...uploadProps} listType="picture" maxCount={1}>
                            <Button icon={<UploadOutlined />}>Select New Image</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubCategoryList;
