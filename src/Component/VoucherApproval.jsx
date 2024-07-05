import React, { useState, useEffect } from "react";
import { List, Button, message } from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";

const VoucherApproval = () => {
  const { auth } = useAuth();
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/voucher",
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    fetchVouchers();
  }, [auth.accessToken]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/voucher/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Voucher approved successfully!");
      setVouchers(vouchers.filter((voucher) => voucher.id !== id));
    } catch (error) {
      console.error("Error approving voucher:", error);
      message.error("Failed to approve voucher.");
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={vouchers.filter((voucher) => !voucher.status)}
      renderItem={(voucher) => (
        <List.Item
          actions={[
            <Button type="primary" onClick={() => handleApprove(voucher.id)}>
              Approve
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={`Voucher Code: ${voucher.code}`}
            description={`Discount: ${voucher.discountValue}, Minimum Purchase: ${voucher.minimumPurchase}, Start Date: ${voucher.startDate}, End Date: ${voucher.endDate}`}
          />
        </List.Item>
      )}
    />
  );
};

export default VoucherApproval;
