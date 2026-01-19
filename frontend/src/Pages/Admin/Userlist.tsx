import React, { useEffect, useState } from "react";
import { Table, Avatar, Tag, Button, Modal, Form, Input, Upload, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import baseURL from "../../config";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/admin/all-users`);
      let userdata = Array.isArray(res.data) ? res.data.reverse() : [];
      setUsers(userdata);
    } catch (err) {
      console.error("Failed to fetch users", err);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${baseURL}/api/admin/delete-user/${deleteId}`);
      message.success("User deleted successfully");
      setUsers(prev => prev.filter(u => u._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete error", error);
      message.error("Failed to delete user");
    }
  };

  const handleEdit = (record: any) => {
    setEditingUser(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      pincode: record.pincode
    });

    if (record.profileImage) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${baseURL}/${record.profileImage}`
      }]);
    } else {
      setFileList([]);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("address", values.address || "");
      formData.append("pincode", values.pincode || "");

      const currentFile = fileList[0];
      if (currentFile && !currentFile.url) {
        formData.append("profileImage", currentFile.originFileObj || currentFile);
      }

      if (!editingUser) return;

      setLoading(true);
      // Assuming userController.update handles profileImage in req.file
      await axios.put(`${baseURL}/api/admin/update-user/${editingUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Update error", error);
      message.error("Failed to update user");
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
      title: "Profile",
      dataIndex: "profileImage",
      render: (img: string) => <Avatar src={img ? `${baseURL}/${img}` : undefined}>U</Avatar>
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || <Tag color="orange">Not Updated</Tag>,
    },
    {
      title: "Mobile",
      dataIndex: "mobileno",
      key: "mobileno",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text: string) => text || "-",
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
      render: (text: string) => text || "-",
    },
    {
      title: "Joined On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        moment(date).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
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
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Users</h2>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
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
        <p>Are you sure you want to delete this user?</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Update"
        okButtonProps={{ style: { backgroundColor: '#7C3AED', color: 'white', borderColor: '#7C3AED' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="pincode" label="Pincode">
            <Input />
          </Form.Item>
          <Form.Item label="Profile Image">
            <Upload {...uploadProps} listType="picture" maxCount={1}>
              <Button icon={<UploadOutlined />}>Select New Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
