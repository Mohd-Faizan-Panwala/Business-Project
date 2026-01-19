import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseURL from "../config";

interface LoginProps {
  setToken: (t: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/admin/login`, values);

      message.success("Login Successful");

      localStorage.setItem("token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("user", res.data.user.name);
      } else if (res.data.admin) {
        localStorage.setItem("userId", res.data.admin._id);
        localStorage.setItem("user", res.data.admin.name);
      }

      setToken(res.data.token);
      navigate("/admin/home", { replace: true });

      // window.location.href = "/admin/home";
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card
        title="Admin Login"
        bordered={false}
        style={{
          width: 380,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: 12, // Slightly more rounded
        }}
      >
        <div className="flex justify-center mb-6">
          <img src={require('../Assets/logo.png')} alt="Logo" className="h-16 object-contain" />
        </div>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter valid email" },
            ]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            style={{ marginTop: 10, backgroundColor: "#6C25BD", borderColor: "#6C25BD" }}
          >
            Login
          </Button>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Forgot Password? <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Click Here
          </span>

        </p>
      </Card>
    </div>
  );
};

export default Login;