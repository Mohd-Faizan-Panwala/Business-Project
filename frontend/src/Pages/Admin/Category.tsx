import { Card, Row, Table, Col, Input, message, Spin, Modal, Button, Tag, Form, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import baseURL from "../../config";

interface ParentCategory {
  _id: string;
  name: string;
  image: string | null;
}

export interface Category {
  _id: string;
  name: string;
  image: string | null;
  parentCategory: ParentCategory | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  orderPriority: number;
  slug: string;
  description: string;
}

export const CategoryTable = () => {
  const [dataSource, setDataSource] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);


  const [form] = Form.useForm();  // Use existing import
  const [fileList, setFileList] = useState<any[]>([]);

  const navigate = useNavigate();



  // ------------------ FETCH API --------------------
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Category[]>(`${baseURL}/api/admin/all-category`);
      setDataSource(res.data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ------------------ DELETE --------------------
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      await axios.delete(`${baseURL}/api/admin/delete-category/${deleteId}`);

      setDataSource((prev) => prev.filter((item) => item._id !== deleteId));
      message.success("Category deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      message.error("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ EDIT --------------------
  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    setIsEditModalOpen(true);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
      orderPriority: record.orderPriority
    });
    // Set file list if image exists
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

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingCategory(null);
    setFileList([]);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("status", values.status);
      formData.append("orderPriority", values.orderPriority);

      const currentFile = fileList[0];
      // If there is a file and it doesn't have a 'url' property (meaning it's a newly uploaded file)
      if (currentFile && !currentFile.url) {
        // Appending the file directly. Antd's beforeUpload gives the file itself.
        formData.append("image", currentFile.originFileObj || currentFile);
      }

      if (!editingCategory) return;

      setLoading(true);
      await axios.put(`${baseURL}/api/admin/update-category/${editingCategory._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Category updated successfully");
      setIsEditModalOpen(false);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Update error", error);
      message.error("Failed to update category");
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

  // ------------------ SEARCH --------------------
  const filteredCategories = dataSource.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // ------------------ TABLE COLUMNS --------------------
  const columns: ColumnsType<Category> = [
    {
      title: "Category Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => {
        if (text) {
          // Ensure correct path to uploads/category/
          const imageUrl = `${baseURL}/uploads/category/${text}`;
          return (
            <img
              src={imageUrl}
              alt="Category"
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80?text=Error";
              }}
            />
          );
        }
        return <span style={{ color: '#ccc' }}>No Image</span>;
      },
    },
    {
      title: "Slug",
      dataIndex: "slug",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status === "Active" ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Order",
      dataIndex: "orderPriority",
      render: (orderPriority: number) => (
        <Tag color="blue">{orderPriority}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
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
    },
  ];

  // ------------------ RETURN --------------------
  return (
    <div>
      {/* Header Row */}
      <Row className="m-2" align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Col xs={24} md={8} xl={6} className="font-bold">
          <h2 className="text-2xl">Category List</h2>
        </Col>

        <Col xs={24} md={12} xl={12}>
          <Input
            prefix={<SearchOutlined style={{ color: "#a6a6a6" }} />}
            size="large"
            placeholder="Search categories..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col xs={24} md={4} xl={6} className="flex justify-end">
          <Button
            size="large"
            onClick={() => navigate("/admin/categorys/add")}
            style={{
              background: "#7C3AED",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "6px",
              border: "none",
              marginLeft: '10px'
            }}
          >
            + Add Category
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Row>
        <Card className="w-full" bodyStyle={{ padding: 0 }}>
          <Col xl={24}>
            <Spin spinning={loading}>
              <Table<Category>
                columns={columns}
                dataSource={filteredCategories}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </Col>
        </Card>
      </Row>

      <Modal
        title="Confirmation"
        open={!!deleteId}
        onOk={handleDelete}
        onCancel={() => setDeleteId(null)}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ style: { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' } }} // Red for delete
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={handleEditCancel}
        okText="Update"
        okButtonProps={{ style: { backgroundColor: '#7C3AED', color: 'white', borderColor: '#7C3AED' } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="orderPriority" label="Order Priority">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Input />
            {/* Ideally this should be a Select but using Input for speed as per requested interface, or I can check Tag */}
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
