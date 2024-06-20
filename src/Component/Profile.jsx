import React, { useEffect, useState } from "react";
import { Layout, Col, Row, Typography, Avatar, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import axios from "axios";
import Rating from "./Rating";
import Loading from "./Loading";
import useAuth from "./Hooks/useAuth";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/user/${auth.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        message.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  const {
    firstName,
    lastName,
    phone,
    email,
    avatarUrl,
    createdDate,
    rating,
    gender,
  } = user;

  return (
    <Content
      style={{
        padding: "30px 300px 200px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: "#f0f2f5",
          borderRadius: 16,
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <PhotoProvider>
              <PhotoView src={avatarUrl}>
                <Avatar src={avatarUrl} size={250}></Avatar>
              </PhotoView>
            </PhotoProvider>
          </Col>
          <Col
            style={{ borderLeft: "solid 1px #e8e8e8", paddingLeft: 24 }}
            span={16}
          >
            <Title className="formTitle" level={2}>
              User Information
            </Title>
            <Paragraph>
              <strong>User Name:</strong> {firstName + " " + lastName}
            </Paragraph>
            <Paragraph>
              <strong>Phone:</strong> {phone}
            </Paragraph>
            <Paragraph>
              <strong>Email:</strong> {email}
            </Paragraph>
            <Paragraph>
              <strong>Gender:</strong> {gender}
            </Paragraph>
            <Paragraph>
              <strong>Is a member since:</strong> {formatDate(createdDate)}
            </Paragraph>
            <Paragraph>
              <strong>Rating:</strong> <Rating score={rating} />
            </Paragraph>
            <Button type="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default Profile;
