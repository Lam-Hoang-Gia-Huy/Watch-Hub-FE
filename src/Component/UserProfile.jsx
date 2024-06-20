import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "./Rating";
import {
  Spin,
  Avatar,
  List,
  Card,
  Divider,
  Typography,
  Row,
  Col,
  Space,
} from "antd";

const { Title, Text } = Typography;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://6656dd4e9f970b3b36c6e348.mockapi.io/Seller/${id}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  const handleWatchClick = (watchId) => {
    navigate(`/watch/${watchId}`);
  };

  return (
    <div style={{ padding: "10px" }}>
      <Title className="formTitle" level={2}>
        User Detail
      </Title>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} md={6}>
          <Card
            bordered={false}
            style={{
              textAlign: "center",
              background: "#f0f2f5",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Avatar size={120} src={userData.avatarUrl} alt="Avatar" />
            <Title level={3} style={{ marginTop: "20px", marginBottom: "0" }}>
              {userData.name}
            </Title>
            <Space
              direction="vertical"
              size="small"
              style={{ textAlign: "left", width: "100%", marginTop: "20px" }}
            >
              <Text>
                <b>Phone:</b> {userData.phone}
              </Text>
              <Text>
                <b>Member since:</b> {formatDate(userData.createdDate)}
              </Text>
              <Text>
                <b>Rating:</b>
              </Text>
              <Rating score={userData.rating} />
            </Space>
          </Card>
        </Col>
        <Col
          xs={24}
          sm={16}
          md={18}
          style={{
            background: "rgb(213 216 230)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Title className="formTitle" level={3}>
            Watches Selling
          </Title>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={userData.watches}
            renderItem={(watch) => (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <div
                      style={{
                        background: "#f0f2f5",
                        height: "150px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        alt={watch.name}
                        src={watch.url[0]}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  }
                  onClick={() => handleWatchClick(watch.id)}
                >
                  <Card.Meta
                    title={watch.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>Type: {watch.type}</Text>
                        <Text>Price: {watch.price}</Text>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserDetail;
