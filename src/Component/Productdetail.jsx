import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel, message } from "antd";
import axios from "axios";
import { Layout, Col, Row, Button, Typography } from "antd";
import moment from "moment";
import Loading from "./Loading";
import Rating from "./Rating";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import useAuth from "./Hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const { Text } = Typography;
const { Content } = Layout;

const thumbnailStyle = {
  height: "100px",
  width: "100px",
  margin: "5px",
  cursor: "pointer",
  objectFit: "cover",
};

const ProductDetail = () => {
  let { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/product/${id}`
        );
        setProductData(response.data);
      } catch (error) {
        console.error("Error fetching product details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, productData?.appraisalId]);

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

  const addToCart = async () => {
    if (auth) {
      try {
        const cartItem = {
          product: {
            id: productData.id,
          },
        };
        const response = await axios.post(
          `http://localhost:8080/api/v1/cart/${auth.id}`,
          cartItem,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        message.success("Added to cart successfully!");
      } catch (error) {
        if (error.response && error.response.data.message) {
          message.error(error.response.data.message);
        } else {
          message.error("Failed to add to cart.");
        }
      }
    } else {
      message.info("You have to log in first!");
      navigate("/login");
    }
  };

  if (loading) {
    return <Loading />;
  }

  const showAddToCartButton = productData.status === true;

  return (
    <Content
      style={{
        padding: "20px 400px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row style={{ backgroundColor: "#eee" }}>
        <Col span={12}>
          <Carousel
            ref={carouselRef}
            afterChange={(current) => setCurrentSlide(current)}
            arrows
            initialSlide={currentSlide}
          >
            {productData.imageUrl.map((imageUrl) => (
              <div key={imageUrl}>
                <PhotoProvider>
                  <PhotoView src={imageUrl}>
                    <img
                      key={imageUrl}
                      src={imageUrl}
                      alt={productData.name}
                      className="contentStyle"
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
            ))}
          </Carousel>
          <div className="thumbnails">
            {productData.imageUrl.map((imageUrl, index) => (
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
          <h1>{productData.name}</h1>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Price:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
              {productData.price?.toLocaleString()} đ
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Category:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{productData.category}</Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Quantity:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>
              {productData.stockQuantity}
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Posted since:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>
              {getTimeSincePost(productData.createdDate)}
            </Text>
          </div>

          {showAddToCartButton && (
            <Button type="primary" onClick={addToCart}>
              Add to Cart <FontAwesomeIcon size="lg" icon={faCartShopping} />
            </Button>
          )}
        </Col>
      </Row>
      <div className="watch-description">
        <h2>Description</h2>
        {productData.description}
      </div>
    </Content>
  );
};

export default ProductDetail;
