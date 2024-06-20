import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Form, Input, Button, message } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth"; // Import useAuth hook
import ImageUpload from "./ImageUpload";

const { Content } = Layout;

const EditProfile = () => {
  const { auth } = useAuth(); // Use the useAuth hook
  const { name, phone, avatarUrl } = auth;
  const [userData, setUserData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const handleFilesSelected = (fileList) => {
    setSelectedFiles(fileList.map((file) => file.originFileObj));
  };

  const onFinish = async (values) => {
    try {
      await axios.put(
        `https://6656dd4e9f970b3b36c6e348.mockapi.io/Login/1`,
        values
      );
      message.success("Changed successfully!");
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
            <ImageUpload
              onFilesSelected={handleFilesSelected}
              imgNum={1}
            ></ImageUpload>
          </Col>
          <Col span={12}>
            <h1>Edit Profile</h1>
            <Form
              name="editProfile"
              initialValues={{ name, phone }} // Set initial values for the form fields
              onFinish={onFinish}
            >
              <Form.Item
                label="User Name"
                name="name"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your phone!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default EditProfile;
