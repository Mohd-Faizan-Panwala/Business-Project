import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Checkbox,
  Row,
  Col,
  Card,
  Divider,
  message,
  Upload,
} from "antd";
import axios from "axios";
import baseURL from "../../config";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

/* ================= UI STYLES ================= */
const inputStyle = {
  height: 44,
  borderRadius: 8,
};

const textareaStyle = {
  borderRadius: 8,
};

const cardStyle = {
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};
/* ============================================= */

const AddBusiness = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch ALL subcategories on mount
    axios
      .get(`${baseURL}/api/admin/all-subcategory`)
      .then((res) => setSubcategories(res.data))
      .catch(() => message.error("Failed to load subcategories"));
  }, []);

  useEffect(() => {
    axios
      .get(`${baseURL}/api/admin/all-users`)
      .then((res) => setUsers(res.data))
      .catch(() => message.error("Failed to load users"));
  }, []);

  const onFinish = async (values) => {
    setLoading(true);

    // Infer Category from the first selected Subcategory
    let derivedCategoryId = null;
    if (values.subcategories && values.subcategories.length > 0) {
      const firstSubId = values.subcategories[0];
      const selectedSubObj = subcategories.find((s) => s._id === firstSubId);
      if (selectedSubObj && selectedSubObj.parentCategory) {
        // parentCategory is populated object based on previous controller logic
        derivedCategoryId = selectedSubObj.parentCategory._id;
      }
    }

    if (!derivedCategoryId) {
      message.error("Please select a subcategory to determine the main category.");
      setLoading(false);
      return;
    }

    const timings = {};
    days.forEach((day) => {
      const val = values[day];
      timings[day] = {
        open: val?.open || null,
        close: val?.close || null,
        closed: val?.closed || false,
      };
    });

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (!["services", "subcategories"].includes(key)) {
        formData.append(key, values[key]);
      }
    });

    // Add derived category
    formData.append("category", derivedCategoryId);

    (values.subcategories || []).forEach((id) => formData.append("subcategories", id));
    (values.services || []).forEach((s) => formData.append("services", s));

    formData.append("timings", JSON.stringify(timings));
    fileList.forEach((file) => formData.append("images", file));

    try {
      await axios.post(`${baseURL}/api/admin/add-business`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Business added successfully!");
      navigate("/admin/business-list");
    } catch (err) {
      console.error(err);
      message.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <Card bordered={false} style={cardStyle}>
      <h2 className="text-xl font-bold mb-2">➕ Add New Business</h2>
      <Divider />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h3 className="font-semibold text-gray-700 mb-3">🧾 Business Details</h3>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Select User"
              name="userId"
              rules={[{ required: true }]}
            >
              <Select
                size="large"
                placeholder="Select User"
                showSearch
                optionFilterProp="label"
                style={{ borderRadius: 8 }}
                options={users.map((u) => ({
                  label: `${u.name || "No Name"} (${u.mobileno})`,
                  value: u._id,
                }))}
                onChange={(value) => {
                  const selectedUser = users.find((u) => u._id === value);
                  if (selectedUser) {
                    form.setFieldsValue({
                      ownerName: selectedUser.name,
                      mobile: selectedUser.mobileno,
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Business Name" name="businessName" rules={[{ required: true }]}>
              <Input style={inputStyle} placeholder="Enter Business Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Owner Name" name="ownerName" rules={[{ required: true }]}>
              <Input style={inputStyle} placeholder="Enter Owner Name" />
            </Form.Item>
          </Col>

          {/* Sub Categories Only */}
          <Col span={12}>
            <Form.Item label="Sub Category" name="subcategories" rules={[{ required: true, message: 'Please select at least one subcategory' }]}>
              <Select
                mode="multiple"
                size="large"
                placeholder="Select Sub Categories"
                style={{ borderRadius: 8 }}
                options={subcategories.map((s) => ({ label: s.name, value: s._id }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Mobile Number" name="mobile" rules={[{ required: true }]}>
              <Input style={inputStyle} placeholder="Enter Mobile Number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Input style={inputStyle} placeholder="Enter City Name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Pincode" name="pincode">
              <Input style={inputStyle} placeholder="Enter Pincode" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Location URL" name="locationUrl">
              <Input style={inputStyle} placeholder="Google Map Link" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input.TextArea rows={3} style={textareaStyle} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} style={textareaStyle} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Business Images">
              <Upload
                listType="picture"
                beforeUpload={(file) => {
                  setFileList((prev) => [...prev, file]);
                  return false;
                }}
                onRemove={(file) =>
                  setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
                }
              >
                <Button size="large" style={{ borderRadius: 8 }}>
                  Select Images
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <h3 className="font-semibold text-gray-700 mb-3">🔧 Services</h3>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row key={field.key} gutter={12}>
                  <Col span={20}>
                    <Form.Item {...field} rules={[{ required: true }]}>
                      <Input style={inputStyle} placeholder="Enter Service" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button danger block onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button type="dashed" block onClick={() => add()}>
                + Add Service
              </Button>
            </>
          )}
        </Form.List>

        <Divider />

        <h3 className="font-semibold text-gray-700 mb-3">⏳ Business Timings</h3>
        {days.map((day) => (
          <Row key={day} gutter={12} align="middle">
            <Col span={6} className="capitalize font-medium">{day}</Col>
            <Col span={6}><Form.Item name={[day, "open"]}><Input type="time" /></Form.Item></Col>
            <Col span={6}><Form.Item name={[day, "close"]}><Input type="time" /></Form.Item></Col>
            <Col span={6}><Form.Item name={[day, "closed"]} valuePropName="checked"><Checkbox>Closed</Checkbox></Form.Item></Col>
          </Row>
        ))}

        <Divider />

        <h3 className="font-semibold text-gray-700 mb-3">💰 Paid Promotion</h3>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="isPaid" valuePropName="checked"><Checkbox>Enable Paid</Checkbox></Form.Item></Col>
          <Col span={8}><Form.Item name="paidAmount"><Input style={inputStyle} type="number" placeholder="Amount ₹" /></Form.Item></Col>
          <Col span={8}><Form.Item name="paidDays"><Input style={inputStyle} type="number" placeholder="Days" /></Form.Item></Col>
        </Row>

        <Divider />

        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          size="large"
          style={{
            width: "100%",
            height: 48,
            background: "#7C3AED",
            borderRadius: 10,
            fontWeight: 600,
            border: "none",
          }}
        >
          Add Business
        </Button>
      </Form>
    </Card>
  );
};

export default AddBusiness;
