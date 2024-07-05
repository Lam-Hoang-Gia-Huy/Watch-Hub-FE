import React from "react";
import { Layout, Row, Col, Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const payload = {
      userName: values.userName,
      email: values.email,
      password: values.password,
      avatarUrl:
        "https://res.cloudinary.com/dfeuv0ynf/image/upload/v1718868313/ytqqm8d9pavipqjjyfwi.jpg",
    };

    try {
      await axios.post(`http://localhost:8080/api/v1/auth/register`, payload);
      message.success("Register successfully!");
      navigate("/");
      // Optionally, redirect to the profile page or show a success message
    } catch (error) {
      message.error("Failed!");
    }
  };

  return (
    <Content style={{ padding: "30px 300px 200px", flexGrow: 1 }}>
      <div style={{ padding: 24, background: "#f0f2f5", borderRadius: 16 }}>
        <Row justify="center">
          <Col span={12}>
            <h1 className="formTitle">REGISTER FORM</h1>
            <Form name="register" onFinish={onFinish}>
              <Form.Item
                label="Username"
                name="userName"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default Register;
