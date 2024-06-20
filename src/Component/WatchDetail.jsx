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

const WatchDetail = () => {
  let { id } = useParams();
  const [watchData, setWatchData] = useState(null);
  const [sellerName, setSellerName] = useState(null);
  const [appraiserName, setAppraiserName] = useState(null);
  const [appraisalData, setAppraisalData] = useState(null);
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
          `http://localhost:8080/api/v1/watch/${id}`
        );
        setWatchData(response.data);
        // Check if appraisalId exists and fetch appraisal data
        if (response.data.appraisalId) {
          const appraisalResponse = await axios.get(
            `http://localhost:8080/api/v1/appraisal/${response.data.appraisalId}`
          );
          // Update state with appraisal data
          setAppraisalData(appraisalResponse.data);

          const appraiserResponse = await axios.get(
            `http://localhost:8080/api/v1/user/${appraisalResponse.data.appraiserId}`
          );
          setAppraiserName(
            appraiserResponse.data.firstName +
              " " +
              appraiserResponse.data.lastName
          );
        }
        const sellerResponse = await axios.get(
          `http://localhost:8080/api/v1/user/${response.data.sellerId}`
        );
        setSellerName(
          sellerResponse.data.firstName + " " + sellerResponse.data.lastName
        );
      } catch (error) {
        console.error("Error fetching watch details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, watchData?.appraisalId]); // Include watchData.appraisalId in the dependency array

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
      const isCurrentUserSeller = auth.id === watchData.sellerId;
      if (isCurrentUserSeller) {
        return message.info("Cannot add your own item!");
      }
      try {
        const cartItem = {
          watch: {
            id: watchData.id, // Ensure only the watch ID is sent
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
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Price:{" "}
            </Text>
            <Text style={{ fontSize: "16px", color: "#ff4d4f" }}>
              {watchData.price?.toLocaleString()} đ
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Brand:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{watchData.brand}</Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Posted:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>
              {getTimeSincePost(watchData.postDate)}
            </Text>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "16px" }}>
              Seller:{" "}
              <Link to={`/user/${watchData.sellerId}`}>{sellerName}</Link>
            </Text>
            {" ("}
            <Rating score={watchData?.seller?.rating}></Rating>
            {")"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Appraised by:{" "}
            </Text>
            <Text style={{ fontSize: "16px" }}>{appraiserName}</Text>
          </div>
          <Button type="primary" onClick={addToCart}>
            Add to Cart <FontAwesomeIcon size="lg" icon={faCartShopping} />
          </Button>
        </Col>
      </Row>
      <div className="watch-description">
        <h2>Description</h2>
        {watchData.description}
      </div>
      <div className="watch-description">
        <h2>Appraisal report</h2>
        <div className="appraisal">
          <Row className="row">
            <Col span={8}>
              <span className="attribute">Price</span>
              <br></br>
              <span>{appraisalData.value?.toLocaleString() + "đ"}</span>
            </Col>

            <Col span={8}>
              <span className="attribute">Material: </span> <br></br>
              <span>{appraisalData.material}</span>
            </Col>
          </Row>
          <Col span={8}>
            <span className="attribute">Buckle</span>
            <br></br>
            <span>{appraisalData.buckle}</span>
          </Col>
          <Row className="row">
            <Col span={8}>
              <span className="attribute">Thickness </span> <br></br>
              <span>{appraisalData.thickness}</span>
            </Col>
            <Col span={8}>
              <span className="attribute">Dial </span> <br></br>
              <span>{appraisalData.dial}</span>
            </Col>
            <Col span={8}>
              <span className="attribute">Movement </span> <br></br>
              <span>{appraisalData.movement}</span>
            </Col>
          </Row>
          <Row className="row">
            <Col span={8}>
              <span className="attribute">Crystal </span> <br></br>
              <span>{appraisalData.crystal}</span>
            </Col>
            <Col span={8}>
              <span className="attribute">bracket </span> <br></br>
              <span>{appraisalData.bracket}</span>
            </Col>
          </Row>
          <Row className="row">
            <Col span={24}>
              <span className="attribute">Comment </span> <br></br>
              <span>{appraisalData.comments}</span>
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  );
};

export default WatchDetail;
