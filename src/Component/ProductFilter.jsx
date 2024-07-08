import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Slider, Input, Select, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import Loading from "./Loading";
import { theme } from "antd";
import useAuth from "./Hooks/useAuth"; // Import the useAuth hook

const { Option } = Select;

const ProductFilter = () => {
  const { type } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("ascending");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState(query.get("name") || "");
  const [category, setCategory] = useState(query.get("category") || "");
  const [filterApplied, setFilterApplied] = useState(false);

  // Temporary state for holding the input values
  const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);
  const [tempCategory, setTempCategory] = useState(category);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);

  const marks = {
    0: "0",
    1000000: "1,000,000",
    2000000: "2,000,000",
    3000000: "3,000,000",
    4000000: "4,000,000",
    5000000: {
      style: { color: "#f50" },
      label: <strong>5,000,000</strong>,
    },
  };

  const navigate = useNavigate();
  const { auth } = useAuth(); // Get the auth object

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/product/search`,
          {
            params: {
              name: searchTerm,
              category: category,
              minPrice: priceRange[0],
              maxPrice: priceRange[1],
            },
          }
        );
        const filteredProducts =
          auth?.role === "ADMIN" || auth?.role === "STAFF"
            ? response.data
            : response.data.filter(
                (product) =>
                  (!type || product.category === type) &&
                  product.status === true
              );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching product details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, searchTerm, category, priceRange, auth]);

  const sortItems = (sortBy) => {
    const sortedItems = [...products];
    if (sortBy === "ascending") {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortBy === "descending") {
      sortedItems.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedItems);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    sortItems(value);
  };

  const handleItemClick = (id) => {
    navigate(`/product/${id}`);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleTempPriceRangeChange = (value) => {
    setTempPriceRange(value);
  };

  const handleFilterClick = () => {
    setSearchTerm(tempSearchTerm);
    setCategory(tempCategory);
    setPriceRange(tempPriceRange);
    setFilterApplied(true);
    navigate(
      `/filter?name=${tempSearchTerm}&category=${tempCategory}&minPrice=${tempPriceRange[0]}&maxPrice=${tempPriceRange[1]}`
    );
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
      <b style={{ marginBottom: "5px" }}>Name: </b>
      <Input
        placeholder="Search Product name"
        value={tempSearchTerm}
        onChange={(e) => setTempSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "60%" }}
      />
      <b style={{ marginBottom: "5px" }}>Category: </b>
      <Select
        placeholder="Filter by brand"
        value={tempCategory}
        onChange={(value) => setTempCategory(value)}
        style={{ marginBottom: 20, width: "60%" }}
      >
        <Option value="Sweetened">Sweetened</Option>
        <Option value="Powdered milk">Powdered milk</Option>
        <Option value="Condensed milk">Condensed milk</Option>
        <Option value="Fresh milk">Fresh milk</Option>
        <Option value="UHT Milk">UHT Milk</Option>
      </Select>
      <b style={{ marginBottom: "5px" }}>Price range: </b>
      <Slider
        range
        value={tempPriceRange}
        marks={marks}
        step={50000}
        min={0}
        max={5000000}
        onChange={handleTempPriceRangeChange}
        style={{ marginBottom: 40, width: 650 }}
      />
      <Button
        type="primary"
        onClick={handleFilterClick}
        style={{ width: "20%", marginBottom: "15px" }}
      >
        Filter
      </Button>
      <Select
        defaultValue="Sort by price"
        style={{ width: 170, marginBottom: 20 }}
        onChange={handleSortChange}
        options={[
          { value: "ascending", label: "Lowest to highest" },
          { value: "descending", label: "Highest to lowest" },
        ]}
      />
      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <h1>{type} Products</h1>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product.id} span={24}>
              <Card
                style={{ backgroundColor: "#e3cbcb" }}
                hoverable
                onClick={() => handleItemClick(product.id)}
              >
                <Row gutter={16} align="middle">
                  <Col span={8}>
                    <img
                      alt={product?.name}
                      src={product?.imageUrl[0]}
                      style={{
                        width: "100%",
                        maxHeight: "130px",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col span={16}>
                    <Card.Meta
                      title={product.name}
                      description={
                        <>
                          <p>{product.description}</p>
                          <p className="item-price">
                            Price: {product.price.toLocaleString()} đ
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

export default ProductFilter;
