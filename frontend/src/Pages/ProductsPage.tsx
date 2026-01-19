import React, { useState } from "react";
import { Table, Button, Input, Modal, Typography, Card, Row, Col, Spin } from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProductsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 50000, createdAt: "2024-02-01" },
    { id: 2, name: "Smartphone", price: 30000, createdAt: "2024-01-15" },
    { id: 3, name: "Tablet", price: 20000, createdAt: "2023-12-10" },
    { id: 4, name: "Smartwatch", price: 10000, createdAt: "2023-11-25" },
    { id: 5, name: "Camera", price: 40000, createdAt: "2023-10-05" },
    { id: 6, name: "Headphones", price: 15000, createdAt: "2023-09-20" },
    { id: 7, name: "Earphones", price: 8000, createdAt: "2023-08-15" },
    { id: 8, name: "Mouse", price: 5000, createdAt: "2023-07-10" },
    { id: 9, name: "Keyboard", price: 2000, createdAt: "2023-06-05" },
    { id: 10, name: "Monitor", price: 8000, createdAt: "2023-05-20" },  
  ]);
  const [deleteId, setDeleteId] = useState(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = () => {
    setProducts(products.filter((product) => product.id !== deleteId));
    setDeleteId(null);
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id", width: 100 },
    { title: "Product Name", dataIndex: "name", key: "name", width: 150 },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price : any) => `₹${price.toFixed(2)}`,
      width: 100,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt : any) => new Date(createdAt).toLocaleDateString("en-US"),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_ : any, record : any) => (
        <div className="flex gap-3">
          <Button type="link" className="p-0 m-0">
            <EditOutlined style={{ color: "#001529", fontSize: "20px" }} />
          </Button>
          <Button type="link" danger onClick={() => setDeleteId(record.id)} className="p-0 m-0">
            <DeleteOutlined style={{ color: "#FF4D4F", fontSize: "20px" }} />
          </Button>
        </div>
      ),
      width: 150,
    },
  ];

  return (
    <div>
      <Row className="m-2" align="middle" justify="space-between">
        <Col md={9} xl={6} className="font-bold">
          <Title level={4}>Product List</Title>
        </Col>
        <Col md={24} xl={12}>
          <Input
            prefix={<SearchOutlined style={{ color: "#a6a6a6" }} />}
            size="large"
            placeholder="Search..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Card className="w-full">
          <Col xl={24}>
            <Spin spinning={false}>
              <Table columns={columns} dataSource={filteredProducts} rowKey="id" pagination={{ pageSize: 4 }} />
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
    okButtonProps={{ danger: true }}
>
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default ProductsPage;
