import React, { useEffect, useState } from "react";
import {
  Descriptions,
  List,
  message,
  Card,
  Spin,
  Typography,
  Tag,
  Form,
  Input,
  Button,
  Rate,
  Collapse,
} from "antd";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import moment from "moment";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const [feedback, setFeedback] = useState({
    comments: "",
    rating: 0,
    targetId: null,
    targetType: "user",
  });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
        message.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, auth]);

  const handleFeedbackSubmit = async (watchId, sellerId, appraisalId) => {
    setFeedbackLoading(true);
    try {
      const appraisalResponse = await axios.get(
        `http://localhost:8080/api/v1/appraisal/${appraisalId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      await axios.post(
        `http://localhost:8080/api/v1/feedback`,
        {
          buyerId: auth.id,
          comments: feedback.comments,
          rating: feedback.rating,
          watchId: watchId,
          userId:
            feedback.targetType === "seller"
              ? sellerId
              : appraisalResponse.data.appraiserId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Feedback submitted successfully");
      setFeedback({
        comments: "",
        rating: 0,
        targetId: null,
        targetType: "user",
      });
    } catch (error) {
      console.error("Failed to submit feedback", error);
      message.error("Failed to submit feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading || !order) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={
          <Title level={3} style={{ color: "#1890ff" }}>
            Order Details
          </Title>
        }
        bordered
        style={{ marginBottom: "20px" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order ID">
            <Tag color="blue">{order.id}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            <Text strong>{formatCurrency(order.totalAmount)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            <Text>
              {moment(order.createdDate).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={<Title level={4}>Order Items</Title>} bordered>
        <List
          bordered
          dataSource={order.orderItems}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={`/watch/${item.watch.id}`}>
                    <Text strong>{item.watch.name}</Text>
                  </Link>
                }
                description={
                  <>
                    <p>
                      <strong>Brand:</strong> {item.watch.brand}
                    </p>
                    <p>
                      <strong>Description:</strong> {item.watch.description}
                    </p>
                    <p>
                      <strong>Price:</strong> {formatCurrency(item.watch.price)}
                    </p>
                    <Collapse>
                      <Panel
                        header="Click to leave feedback"
                        key={item.watch.appraisalId.toString()}
                      >
                        <Form
                          onFinish={() =>
                            handleFeedbackSubmit(
                              item.watch.id,
                              item.watch.sellerId,
                              item.watch.appraisalId
                            )
                          }
                        >
                          <Form.Item label="Comments">
                            <Input.TextArea
                              rows={4}
                              value={feedback.comments}
                              onChange={(e) =>
                                setFeedback({
                                  ...feedback,
                                  comments: e.target.value,
                                })
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Rating">
                            <Rate
                              value={feedback.rating}
                              onChange={(value) =>
                                setFeedback({ ...feedback, rating: value })
                              }
                            />
                          </Form.Item>
                          <Form.Item label="Feedback Type">
                            <select
                              value={feedback.targetType}
                              onChange={(e) =>
                                setFeedback({
                                  ...feedback,
                                  targetType: e.target.value,
                                })
                              }
                            >
                              <option value="seller">Seller</option>

                              <option value="appraiser">Appraiser</option>
                            </select>
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={feedbackLoading}
                            >
                              Submit Feedback
                            </Button>
                          </Form.Item>
                        </Form>
                      </Panel>
                    </Collapse>
                  </>
                }
              />
              <div>
                {item.watch.imageUrl && item.watch.imageUrl.length > 0 && (
                  <img
                    src={item.watch.imageUrl[0]}
                    alt={item.watch.name}
                    style={{
                      maxWidth: "100px",
                      marginLeft: "20px",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default OrderDetail;
