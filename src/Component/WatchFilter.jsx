import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Slider } from "antd"; // Import Slider component
import { Content } from "antd/es/layout/layout";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import WatchTypeList from "./WatchTypeList";
import { theme } from "antd";
import { Select } from "antd";

const WatchFilter = () => {
  const { type } = useParams();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("ascending");
  const [priceRange, setPriceRange] = useState([0, 5000000]); // State for price range
  const marks = {
    0: "0",
    1000000: "1,000,000",
    2000000: "2,000,000",
    3000000: "3,000,000",
    4000000: "4,000,000",
    5000000: {
      style: {
        color: "#f50",
      },
      label: <strong>5,000,000</strong>,
    },
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/watch`);
        const filteredWatches = response.data.filter(
          (watch) => (!type || watch.brand === type) && watch.appraisalId
        );
        setWatches(filteredWatches);
      } catch (error) {
        console.error("Error fetching watch details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  const sortItems = (sortBy) => {
    const sortedItems = [...watches];
    if (sortBy === "ascending") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === "descending") {
      sortedItems.sort((a, b) => b.price - a.price);
    }
    setWatches(sortedItems);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    sortItems(value);
  };

  const handleItemClick = (id) => {
    navigate(`/watch/${id}`);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const filterWatchesByPriceRange = (watch) => {
    const price = watch.price;
    return price >= priceRange[0] && price <= priceRange[1];
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
      <WatchTypeList />
      <Select
        defaultValue="Sort by price"
        style={{ width: 170, marginBottom: 20 }}
        onChange={handleSortChange}
        options={[
          { value: "ascending", label: "Lowest to highest" },
          { value: "descending", label: "Highest to lowest" },
        ]}
      />
      <span>Price range :</span>
      <Slider
        range
        defaultValue={[0, 5000000]}
        marks={marks}
        step={50000}
        min={0}
        max={5000000}
        onChange={handlePriceRangeChange}
        style={{ marginBottom: 40, width: 650 }}
      />

      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <h1>{type} Watches</h1>
        <Row gutter={[16, 16]}>
          {watches.filter(filterWatchesByPriceRange).map((watch) => (
            <Col key={watch.id} span={24}>
              <Card
                style={{ backgroundColor: "#e3cbcb" }}
                hoverable
                onClick={() => handleItemClick(watch.id)}
              >
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <img
                      alt={watch?.name}
                      src={watch?.imageUrl[0]}
                      style={{
                        width: "100%",
                        maxHeight: "130px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col span={16}>
                    <Card.Meta
                      title={watch.name}
                      description={
                        <>
                          <p>{watch.description}</p>
                          <p className="item-price">
                            Price: {watch.price.toLocaleString()} đ
                          </p>
                        </>
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Content>
  );
};

export default WatchFilter;
