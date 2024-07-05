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
  Collapse,
} from "antd";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [watches, setWatches] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(
          `http://localhost:8080/api/v1/user/${id}`
        );
        const watchesResponse = await axios.get(
          `http://localhost:8080/api/v1/watch/user/${id}`
        );
        const feedbackResponse = await axios.get(
          `http://localhost:8080/api/v1/feedback/user/${id}`
        );
        setUserData(userResponse.data);
        setWatches(
          watchesResponse.data.filter((watch) => watch.status === true)
        );
        setFeedbacks(feedbackResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
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
                <b>Name:</b> {userData.name}
              </Text>

              <Text>
                <b>Member since:</b> {formatDate(userData.createdDate)}
              </Text>
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
          }}
        >
          <Divider />
          <Title className="formTitle" level={3}>
            Watches in sell
          </Title>
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={watches}
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
                        src={watch.imageUrl[0]}
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
                        <Text>Brand: {watch.brand}</Text>
                        <Text>Price: {watch.price}</Text>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </Col>
        <Collapse>
          <Panel header="Feedback of the user" key="1">
            <List
              dataSource={feedbacks}
              renderItem={(feedback) => (
                <List.Item>
                  <Card
                    style={{
                      background: "rgb(176 188 206)",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <Card.Meta
                      avatar={<Avatar src={feedback.avatarUrl} />}
                      title={feedback.userName}
                      description={
                        <Space direction="vertical">
                          <b>To product: {feedback.watchName}</b>
                          <b>Comment: </b>
                          <Text>{feedback.comments}</Text>
                          <Rating score={feedback.rating} />
                          <Text type="secondary">
                            {formatDate(feedback.createdDate)}
                          </Text>
                        </Space>
                      }
                    />
                  </Card>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </Row>
    </div>
  );
};

export default UserDetail;
