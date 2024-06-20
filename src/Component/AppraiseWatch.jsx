import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Col,
  Row,
  Carousel,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./Hooks/useAuth";
import moment from "moment";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Link } from "react-router-dom";
import ChatStartButton from "./ChatStartButton";

const { Title, Text } = Typography;
const { TextArea } = Input;

const thumbnailStyle = {
  height: "100px",
  width: "100px",
  margin: "5px",
  cursor: "pointer",
  objectFit: "cover",
};

const AppraiseWatch = () => {
  const { id } = useParams(); // Get watch id from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const [watchData, setWatchData] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/watch/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
            },
          }
        );
        setWatchData(response.data);

        // Fetch seller's name
        const sellerResponse = await axios.get(
          `http://localhost:8080/api/v1/user/${response.data.sellerId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
            },
          }
        );
        setSellerName(
          sellerResponse.data.firstName + " " + sellerResponse.data.lastName
        ); // Assuming your seller object has a 'firstName' field
      } catch (error) {
        console.error("Error fetching watch details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const appraisalData = {
        ...values,
        appraiserId: auth.id,
        watchId: id, // assuming you have the logged-in user's id in auth.user
      };
      await axios.post(
        `http://localhost:8080/api/v1/appraisal/watch`,
        appraisalData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
          },
        }
      );
      message.success("Appraisal submitted successfully!");
      navigate("/unappraised-watches");
    } catch (error) {
      message.error("Failed to submit appraisal. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (loading || !watchData) {
    return <loading />;
  }

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    carouselRef.current.goTo(index);
  };

  const getTimeSincePost = (postDate) => {
    const now = moment();
    const postDateMoment = moment(postDate);
    const duration = moment.duration(now.diff(postDateMoment));

    if (duration.asMinutes() < 60) {
      return `${Math.floor(duration.asMinutes())} minutes ago`;
    } else if (duration.asHours() < 24) {
      return `${Math.floor(duration.asHours())} hours ago`;
    } else {
      return `${Math.floor(duration.asDays())} days ago`;
    }
  };

  return (
    <Card style={{ width: "700px", margin: "0 auto" }}>
      <Row style={{ backgroundColor: "#eee" }}>
        <Col span={12}>
          <Carousel
            ref={carouselRef}
            afterChange={(current) => setCurrentSlide(current)}
            arrows
            initialSlide={currentSlide}
          >
            {watchData.imageUrl.map((imageUrl) => (
              <div key={imageUrl}>
                <PhotoProvider>
                  <PhotoView src={imageUrl}>
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={watchData.name}
                      className="contentStyle"
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
            ))}
          </Carousel>
          <div className="thumbnails">
            {watchData.imageUrl.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Thumbnail ${index}`}
                style={{
                  ...thumbnailStyle,
                  border: index === currentSlide ? "2px solid #1890ff" : "none",
                }}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </Col>

        <Col style={{ marginLeft: "20px" }} span={11}>
          <h1>{watchData.name}</h1>
          {/* <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Price:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
              {watchData.price.toLocaleString()} đ
            </Text>
          </div> */}
          {/* <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Posted:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>
              {getTimeSincePost(watchData.postDate)}
            </Text>
          </div> */}
          {/* <div style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px" }}>
              Seller:{" "}
              <Link to={`/user/${watchData.seller.id}`}>
                {watchData?.seller.name}
              </Link>
            </Text>
          </div> */}
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Brand:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{watchData?.brand}</Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Description:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{watchData?.description}</Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Seller:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{sellerName}</Text>
          </div>
          <ChatStartButton
            watchId={id}
            userId={watchData.sellerId}
            appraiserId={auth.id}
          />
        </Col>
      </Row>

      <Title level={2} className="formTitle">
        Appraise Watch
      </Title>
      <Form name="appraise_watch" layout="vertical" onFinish={onFinish}>
        {/* Comments (single column) */}
        <Form.Item
          label="Comments"
          name="comments"
          rules={[{ required: true, message: "Please input your comments!" }]}
          style={{ width: "100%" }}
        >
          <TextArea rows={4} />
        </Form.Item>

        {/* Two-column layout for remaining attributes */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Value"
              name="value"
              rules={[{ required: true, message: "Please input the value!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Material"
              name="material"
              rules={[
                { required: true, message: "Please input the material!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Thickness"
              name="thickness"
              rules={[
                { required: true, message: "Please input the thickness!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Crystal"
              name="crystal"
              rules={[{ required: true, message: "Please input the crystal!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Dial"
              name="dial"
              rules={[{ required: true, message: "Please input the dial!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Movement"
              name="movement"
              rules={[
                { required: true, message: "Please input the movement!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Bracket"
              name="bracket"
              rules={[{ required: true, message: "Please input the bracket!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Buckle"
              name="buckle"
              rules={[{ required: true, message: "Please input the buckle!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit button (single column) */}
        <Form.Item style={{ width: "100%" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Appraisal
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppraiseWatch;
