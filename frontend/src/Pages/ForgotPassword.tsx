import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../config";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/admin/forgot-password`, {
        email: values.email,
      });
      message.success(res.data.message || "Reset link sent to your email");
      navigate("/"); // back to login
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#8c57ff]">
      <Card
        title="Forgot Password"
        bordered={false}
        style={{
          width: 380,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: 10,
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Registered Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="Enter your registered email" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ marginTop: 10, backgroundColor: "#8c57ff" }}
          >
            Send Reset Link
          </Button>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Back to Login?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer"
          >
            Click Here
          </span>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
