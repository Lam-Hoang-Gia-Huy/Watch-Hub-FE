import React, { useState } from "react";
import {
  Layout,
  theme,
  Typography,
  Col,
  Button,
  message,
  Row,
  Form,
  Input,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import ImageUpload from "./ImageUpload";
import useAuth from "./Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;
const { Content } = Layout;

const RegisterPost = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form] = Form.useForm();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleFilesSelected = (fileList) => {
    setSelectedFiles(fileList.map((file) => file.originFileObj));
  };

  const handleUpload = async (watchId) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/watch/${watchId}/images`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      if (response.ok) {
        message.success("Upload successful!");
        setSelectedFiles([]); // Clear selected files
      } else {
        message.error("Upload failed.");
      }
      navigate("/");
    } catch (error) {
      message.error("Upload error: " + error);
    }
  };

  const onFinish = async (values) => {
    try {
      // Include user ID in the request body
      const body = { ...values, userId: auth.id };

      const response = await fetch(
        "http://localhost:8080/api/v1/watch/user/" + auth.id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
          },
          body: JSON.stringify(body),
        }
      );
      if (response.ok) {
        const data = await response.json();
        message.success("Watch details submitted successfully!");
        if (selectedFiles.length > 0) {
          await handleUpload(data.id);
        }
      } else {
        message.error("Failed to submit watch details.");
      }
    } catch (error) {
      message.error("Submission error: " + error);
    }
  };
  const watchTypes = [
    { name: "Mechanical" },
    { name: "Automatic" },
    { name: "Hybrid" },
    { name: "Chronograph" },
    { name: "Classic" },
    { name: "Luxury" },
  ];

  return (
    <Content
      style={{
        padding: "30px 300px 0 300px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Title mark className="formTitle" color="#c57071" level={2}>
          UPLOAD WATCH FORM <FontAwesomeIcon size="lg" icon={faUpload} />
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Title className="formTitle" type="success" level={2}>
              Upload Image here
            </Title>
            <ImageUpload onFilesSelected={handleFilesSelected} imgNum={8} />
          </Col>
          <Col style={{ borderLeft: "solid 1px" }} span={16}>
            <Title className="formTitle" type="success" level={2}>
              Watch's information
            </Title>
            <Form
              form={form}
              name="register_post_form"
              onFinish={onFinish}
              style={{ marginTop: 16 }}
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the name",
                  },
                ]}
              >
                <Input placeholder="Enter name here" />
              </Form.Item>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[
                  {
                    required: true,
                    message: "Please enter the brand",
                  },
                ]}
              >
                <Input placeholder="Enter brand here" />
              </Form.Item>
              {/* <Form.Item
                name="watchtype"
                label="Watch type"
                rules={[
                  {
                    required: true,
                    message: "Please select a watch type",
                  },
                ]}
              >
                <Select placeholder="Choose watch type here">
                  {watchTypes.map((type, index) => (
                    <Option key={index} value={type.name}>
                      {type.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter the description",
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter description" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: 16 }}
                >
                  Submit Watch Details
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default RegisterPost;
