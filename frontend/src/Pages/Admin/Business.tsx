import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Typography, Card, Row, Col, Spin, Tag, Select, Checkbox, message } from "antd";
import { SearchOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../../config";

const { Option } = Select;
const { Title } = Typography;

const BusinessListPage = () => {
  const [searchText, setSearchText] = useState("");
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paidFilter, setPaidFilter] = useState<boolean | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Modal state for approval/rejection
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);

  const navigate = useNavigate();

  // Fetch business list
  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/admin/all-business`);
      // Sort client-side if needed to prioritize 'pending'
      let sorted = res.data.sort((a: any, b: any) => {
        if (a.approvalStatus === 'pending' && b.approvalStatus !== 'pending') return -1;
        if (a.approvalStatus !== 'pending' && b.approvalStatus === 'pending') return 1;
        return 0;
      });
      setBusinessList(sorted || []);
    } catch (err) {
      console.log("Error while fetching business");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  // Filter based on search
  const filteredBusinesses = businessList.filter((b: any) =>
    (paidFilter === null || b.isPaid === paidFilter) &&
    (b.businessName.toLowerCase().includes(searchText.toLowerCase()) ||
      b.city.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Open Modal
  const handleStatusClick = (record: any) => {
    setCurrentBusiness(record);
    setRejectReason(record.rejectionReason || "");
    setSelectedAction(null); // reset
    setStatusModalOpen(true);
  };

  const submitStatusChange = async () => {
    if (!selectedAction) {
      message.error("Please select an action (Approve or Reject)");
      return;
    }

    if (selectedAction === 'reject' && !rejectReason.trim()) {
      message.error("Please provide a reason for rejection.");
      return;
    }

    const newStatus = selectedAction === 'approve' ? 'approved' : 'rejected';

    try {
      await axios.put(`${baseURL}/api/admin/business/toggle-status/${currentBusiness._id}`, {
        status: newStatus,
        reason: newStatus === 'rejected' ? rejectReason : ""
      });

      message.success(`Business ${newStatus} successfully!`);
      setStatusModalOpen(false);
      fetchBusiness(); // Refresh list
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };


  const columns = [
    { title: "No", key: "no", render: (_: any, __: any, index: number) => index + 1, width: 60 },

    { title: "Business Name", dataIndex: "businessName", key: "businessName", width: 180 },

    {
      title: "Sub Category",
      dataIndex: "subcategories",
      key: "subcategories",
      width: 180,
      render: (subcats: any[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {subcats && subcats.length > 0 ? (
            subcats.map((sub: any) => (
              <Tag color="cyan" key={sub._id}>
                {sub.name}
              </Tag>
            ))
          ) : (
            <span style={{ color: '#ccc' }}>-</span>
          )}
        </div>
      ),
    },

    { title: "Owner", dataIndex: "ownerName", key: "ownerName", width: 130 },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", width: 120 },
    { title: "City", dataIndex: "city", key: "city", width: 100 },

    // STATUS COLUMN WITH CLICKABLE BADGE
    {
      title: "Approval Status",
      key: "approvalStatus",
      width: 140,
      render: (record: any) => {
        let color = "orange";
        let text = "Pending";

        if (record.approvalStatus === "approved") {
          color = "green";
          text = "Approved";
        } else if (record.approvalStatus === "rejected") {
          color = "red";
          text = "Rejected";
        }

        return (
          <Tag
            color={color}
            style={{ cursor: "pointer", fontSize: "12px", padding: "4px 10px" }}
            onClick={() => handleStatusClick(record)}
          >
            {text}
          </Tag>
        );
      },
    },

    {
      title: "Paid",
      key: "isPaid",
      width: 90,
      render: (record: any) =>
        record.isPaid ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="red">Un-paid</Tag>
        ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Button
          type="link"
          className="p-0 m-0"
          onClick={() => navigate(`/admin/business-list/update/${record._id}`)}
        >
          <EditOutlined style={{ color: "#7C3AED", fontSize: 20 }} />
        </Button>
      ),
      width: 80,
    },
  ];


  return (
    <div>
      <Row gutter={[16, 16]} align="middle" className="m-2">
        <Col xs={24} md={6} xl={5}>
          <Title level={4} className="mb-0">Business List</Title>
        </Col>

        <Col xs={24} md={10} xl={9}>
          <Input
            prefix={<SearchOutlined style={{ color: "#a6a6a6" }} />}
            size="large"
            placeholder="Search Business..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col xs={24} md={4} xl={4}>
          <Select
            size="large"
            value={paidFilter}
            onChange={(value) => setPaidFilter(value)}
            style={{ width: "100%" }}
            placeholder="Filter"
          >
            <Option value={null}>All</Option>
            <Option value={true}>Paid</Option>
            <Option value={false}>Unpaid</Option>
          </Select>
        </Col>

        <Col xs={24} md={4} xl={6} className="flex md:justify-end">
          <Button
            size="large"
            onClick={() => navigate("/admin/business-list/add")}
            style={{ background: "#7C3AED", color: "#fff", fontWeight: 600, borderRadius: "6px", border: "none", width: "100%", maxWidth: "200px" }}
          >
            + Add Business
          </Button>
        </Col>
      </Row>


      <Row>
        <Card className="w-full">
          <Col xl={24}>
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={filteredBusinesses}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
              />
            </Spin>
          </Col>
        </Card>
      </Row>

      {/* STATUS UPDATE MODAL */}
      <Modal
        title={`Update Status: ${currentBusiness?.businessName}`}
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setStatusModalOpen(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={submitStatusChange} style={{ background: '#7C3AED' }}>Update Status</Button>
        ]}
      >
        <div className="flex flex-col gap-4 py-4">
          <p className="text-gray-500">Please review the business details and select an action.</p>

          <div className="flex gap-4">
            <div
              className={`border-2 p-4 rounded-lg cursor-pointer flex-1 text-center ${selectedAction === 'approve' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              onClick={() => setSelectedAction('approve')}
            >
              <h4 className="font-bold text-green-600">Approve</h4>
              <p className="text-xs text-gray-400">Publicly Visible</p>
            </div>

            <div
              className={`border-2 p-4 rounded-lg cursor-pointer flex-1 text-center ${selectedAction === 'reject' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
              onClick={() => setSelectedAction('reject')}
            >
              <h4 className="font-bold text-red-600">Reject</h4>
              <p className="text-xs text-gray-400">Hidden & Notify</p>
            </div>
          </div>

          {selectedAction === 'reject' && (
            <div>
              <label className="text-sm font-semibold">Rejection Reason:</label>
              <Checkbox.Group
                className="flex flex-col gap-2 mt-2"
                onChange={(checkedValues) => setRejectReason(checkedValues.join(", "))}
              >
                <Checkbox value="Invalid Images">Invalid or Low Quality Images</Checkbox>
                <Checkbox value="Incomplete Details">Incomplete Business Details</Checkbox>
                <Checkbox value="Duplicate Listing">Duplicate Listing</Checkbox>
                <Checkbox value="Policy Violation">Violation of Terms</Checkbox>
              </Checkbox.Group>
              <Input.TextArea
                className="mt-3"
                rows={2}
                placeholder="Other reason (optional)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BusinessListPage;
