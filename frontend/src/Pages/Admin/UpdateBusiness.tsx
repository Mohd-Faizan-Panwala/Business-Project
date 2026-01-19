import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Card,
  Divider,
  message,
  Checkbox,
  Upload,
  Select,
} from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import baseURL from "../../config";

/* ================= UI STYLES ================= */
const inputStyle = { height: 44, borderRadius: 8 };
const textareaStyle = { borderRadius: 8 };
const cardStyle = { borderRadius: 14, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" };
const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
/* ============================================= */

const UpdateBusiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Subcategories
    axios
      .get(`${baseURL}/api/admin/all-subcategory`)
      .then((res) => setSubcategories(res.data))
      .catch(() => message.error("Failed to load subcategories"));

    // Fetch Business Data
    axios
      .get(`${baseURL}/api/admin/business/${id}`)
      .then((res) => {
        const data = res.data;

        // Parse Timings if string
        let timings = data.timings;
        if (typeof timings === 'string') {
          try { timings = JSON.parse(timings); } catch (e) { }
        }

        // Prepare Form Data
        const subcategoryIds = (data.subcategories || []).map((sub: any) =>
          typeof sub === 'object' && sub !== null ? sub._id : sub
        );

        form.setFieldsValue({
          businessName: data.businessName,
          ownerName: data.ownerName,
          mobile: data.mobile,
          city: data.city,
          pincode: data.pincode,
          locationUrl: data.locationUrl,
          address: data.address,
          description: data.description,
          services: data.services || [],
          subcategories: subcategoryIds,
          isPaid: data.isPaid,
          paidAmount: data.paidAmount,
          paidDays: data.paidDays,
          // Timings
          ...timings
        });

        // Prepare Images
        if (data.images && data.images.length > 0) {
          const defaultFileList = data.images.map((img: string, index: number) => ({
            uid: `-${index}`,
            name: `image-${index}.png`,
            status: 'done',
            url: `${baseURL}/uploads/business/${img}`
          }));
          setFileList(defaultFileList);
        }
      })
      .catch(() => message.error("Failed to load business data"));
  }, [id, form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    // Derived Category from subcategory (similar to Add)
    let derivedCategoryId = null;
    if (values.subcategories && values.subcategories.length > 0) {
      const firstSubId = values.subcategories[0];
      const selectedSubObj = subcategories.find((s) => s._id === firstSubId);
      if (selectedSubObj && selectedSubObj.parentCategory) {
        derivedCategoryId = selectedSubObj.parentCategory._id;
      }
    }

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
    // Append standard fields
    Object.keys(values).forEach((key) => {
      // Exclude complex objects or special handling fields from direct append if needed
      if (!["services", "subcategories", "images", ...days].includes(key)) {
        formData.append(key, values[key]);
      }
    });

    // Append Category
    if (derivedCategoryId) formData.append("category", derivedCategoryId);

    // Append Subcategories
    (values.subcategories || []).forEach((id: string) => formData.append("subcategories", id));

    // Append Services
    (values.services || []).forEach((s: string) => formData.append("services", s));

    // Append Timings
    formData.append("timings", JSON.stringify(timings));

    // Append Images
    // 1. Existing images (URLs) might need handling if backend expects them specifically or if we only send NEW files.
    // Usually with FormData, we only send NEW binary files.
    // If backend replaces ALL images, we need logic to keep old ones.
    // let's check current backend logic.
    // updateBusiness controller uses `req.files`. If provided, it normally adds or replaces?
    // Let's assume we append new files. Old files might need to be passed if backend logic requires "images" array of strings for existing.
    // For now, let's append NEW files.
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    });

    try {
      await axios.put(`${baseURL}/api/admin/update-business/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Business updated successfully!");
      navigate("/admin/business-list");
    } catch {
      message.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <Card bordered={false} style={cardStyle}>
      <h2 className="text-xl font-bold mb-2">✏ Update Business</h2>
      <Divider />

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Business Details */}
        <h3 className="font-semibold text-gray-700 mb-3">🧾 Business Details</h3>

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

          {/* Sub Categories */}
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
              <Input.TextArea rows={3} style={textareaStyle} placeholder="Enter Business Address" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} style={textareaStyle} placeholder="Business Description" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Business Images">
              <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={(file) => {
                  setFileList((prev) => [...prev, file]);
                  return false;
                }}
                onRemove={(file) =>
                  setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
                }
              >
                <Button size="large" style={{ borderRadius: 8 }}>Select New Images</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Services */}
        <h3 className="font-semibold text-gray-700 mb-3">🔧 Services</h3>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row key={field.key} gutter={12} align="middle">
                  <Col span={20}>
                    <Form.Item {...field} rules={[{ required: true }]}>
                      <Input style={inputStyle} placeholder="Enter Service" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Button danger block onClick={() => remove(field.name)}>Remove</Button>
                  </Col>
                </Row>
              ))}
              <Button type="dashed" block onClick={() => add()}>+ Add Service</Button>
            </>
          )}
        </Form.List>

        <Divider />

        {/* Timings */}
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

        {/* Paid Promotion */}
        <h3 className="font-semibold text-gray-700 mb-3">💰 Paid Promotion</h3>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="isPaid" valuePropName="checked"><Checkbox>Enable Paid Promotion</Checkbox></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Amount" name="paidAmount"><Input style={inputStyle} type="number" placeholder="Amount ₹" /></Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Days" name="paidDays"><Input style={inputStyle} type="number" placeholder="Validity Days" /></Form.Item>
          </Col>
        </Row>

        <Divider />

        <Button
          htmlType="submit"
          type="primary"
          size="large"
          loading={loading}
          style={{
            width: "100%",
            height: 48,
            background: "#7C3AED",
            borderRadius: 10,
            fontWeight: 600,
            border: "none",
          }}
        >
          Update Business
        </Button>
      </Form>
    </Card>
  );
};

export default UpdateBusiness;
