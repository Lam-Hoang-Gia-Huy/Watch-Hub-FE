import React, { useEffect, useState } from "react";
import { Table, Button, message, Card, Typography, Input, Space } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;
const { Search } = Input;

const MyOrders = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  // const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/user/${auth.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        message.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth]);

  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   const filteredData = orders.filter(
  //     (order) =>
  //       order.id.toString().includes(value) ||
  //       order.totalAmount.toString().includes(value) ||
  //       moment(order.createdDate).format("YYYY-MM-DD HH:mm:ss").includes(value)
  //   );
  //   setFilteredOrders(filteredData);
  // };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) =>
        moment(a.createdDate).unix() - moment(b.createdDate).unix(),
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/orders/${record.id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ margin: "20px", padding: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={3}>My Orders</Title>
        {/* <Text>View and manage your orders below</Text>
        <Search
          placeholder="Search Orders"
          enterButton
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: "20px" }}
        /> */}
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Space>
    </Card>
  );
};

export default MyOrders;
