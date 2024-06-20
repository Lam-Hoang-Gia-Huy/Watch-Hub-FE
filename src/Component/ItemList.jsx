import React, { useEffect, useState } from "react";
import { Card, Col, Row, Alert } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import moment from "moment";
import useAuth from "./Hooks/useAuth";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/watch");
        const appraisedWatches = response.data.filter(
          (watch) => watch.appraisalId !== null && watch.status == true
        );
        setItems(appraisedWatches);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchWatches();
  }, []);

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

  const handleItemClick = (id) => {
    navigate(`/watch/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <Row gutter={16}>
      {items.map((item) => (
        <Col key={item.id} span={6}>
          <Card
            hoverable
            title={"Title: " + item.name}
            bordered={true}
            onClick={() => handleItemClick(item.id)}
            cover={
              <img
                alt={item.name}
                src={item.imageUrl[0]}
                className="item-cover-image"
              />
            }
          >
            <div>
              <span className="item-price">
                Price: {item.price?.toLocaleString()} đ
              </span>
            </div>
            <div className="item-details">
              <b>Brand: {item.brand} </b>
            </div>
            <div className="item-details">
              <span className="item-post-date">
                {getTimeSincePost(item?.postDate)}
              </span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ItemList;
