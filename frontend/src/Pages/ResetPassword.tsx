import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Form, Input, Button, message } from "antd";
import baseURL from "../config";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            await axios.post(`${baseURL}/api/admin/reset-password`, {
                token,
                password: values.password,
            });

            message.success("Password reset successful!");
            navigate("/");
        } catch (err: any) {
            message.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#8c57ff]">
            <Card title="Reset Password" style={{ width: 380 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="New Password"
                        name="password"
                        rules={[{ required: true, message: "Enter new password" }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        size="large"
                        style={{ marginTop: 10, backgroundColor: "#8c57ff" }}
                    >
                        Reset Password
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
