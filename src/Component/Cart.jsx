import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  Button,
  Typography,
  Row,
  Col,
  theme,
  InputNumber,
  Select,
  message,
  Card,
  Empty,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import useAuth from "./Hooks/useAuth";
import CheckoutButton from "./CheckOutButton";

const { Text, Title } = Typography;
const { Option } = Select;

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });
  const [voucherCode, setVoucherCode] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/cart/${auth.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          setCart(response.data);
        } else if (response.status === 404) {
          console.log("User not found or cart is empty");
        }
      } catch (error) {
        console.error("Error fetching cart data", error);
      }
    };

    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/voucher/available`, // Updated endpoint for available vouchers
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        if (response.status === 200) {
          setVouchers(response.data);
        }
      } catch (error) {
        console.error("Error fetching vouchers", error);
      }
    };

    fetchCart();
    fetchVouchers();
  }, [auth.id, auth.accessToken]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/cart/${auth.id}/${cartItemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      // Fetch updated cart data
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/${auth.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  // const handleQuantityChange = async (cartItemId, newQuantity) => {
  //   try {
  //     await axios.put(
  //       `http://localhost:8080/api/v1/cart/${auth.id}/${cartItemId}`,
  //       { quantity: newQuantity },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${auth.accessToken}`,
  //         },
  //       }
  //     );
  //     setCart((prevCart) => {
  //       const updatedCartItems = prevCart.cartItems.map((item) => {
  //         if (item.id === cartItemId) {
  //           return { ...item, quantity: newQuantity };
  //         }
  //         return item;
  //       });
  //       const updatedTotalPrice = updatedCartItems.reduce(
  //         (total, item) => total + item.product.price * item.quantity,
  //         0
  //       );
  //       return {
  //         ...prevCart,
  //         cartItems: updatedCartItems,
  //         totalPrice: updatedTotalPrice,
  //       };
  //     });
  //   } catch (error) {
  //     console.error("Error updating item quantity in cart", error);
  //   }
  // };

  const handleApplyVoucher = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/cart/${auth.id}/apply-voucher`,
        null,
        {
          params: { voucherCode },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setCart(response.data);
        message.success("Voucher applied successfully!");
      } else {
        message.error("Failed to apply voucher.");
      }
    } catch (error) {
      console.error("Error applying voucher", error);
      message.error("Invalid voucher code.");
    }
  };

  const {
    token: {
      colorBgContainer,
      borderRadiusLG,
      colorPrimary,
      colorText,
      colorTextSecondary,
      fontSize,
      fontSizeLG,
      fontSizeXL,
      fontSizeHeading,
      lineHeight,
    },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: colorBgContainer,
        borderRadius: borderRadiusLG,
        color: colorText,
      }}
    >
      <Title level={2} style={{ color: colorPrimary }}>
        <FontAwesomeIcon icon={faCartShopping} /> Your Shopping Cart
      </Title>
      {cart.cartItems.length > 0 ? (
        <>
          <List
            itemLayout="horizontal"
            dataSource={cart.cartItems}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remove
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.product.name}
                  description={`Price: ${item.product.price}đ | Quantity: ${item.quantity}`}
                />
                {/* <InputNumber
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(value) => handleQuantityChange(item.id, value)}
                /> */}
              </List.Item>
            )}
          />
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3}>Total: {cart.totalPrice}đ</Title>
              </Col>
              <Col span={24}>
                <Select
                  placeholder="Select a voucher"
                  style={{ width: "100%", marginBottom: "16px" }}
                  onChange={setVoucherCode}
                >
                  {vouchers.map((voucher) => (
                    <Option key={voucher.code} value={voucher.code}>
                      {voucher.code} - Discount: {voucher.discountValue}đ, Min.
                      Purchase: {voucher.minimumPurchase}đ, Usage left:{" "}
                      {voucher.maxUsage - voucher.currentUsage} times
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={handleApplyVoucher}>
                  Apply Voucher
                </Button>
              </Col>
              <Col span={24}>
                <CheckoutButton
                  totalPrice={cart.totalPrice}
                  voucherCode={voucherCode}
                />
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <Empty description="Your cart is empty" />
      )}
    </div>
  );
};

export default Cart;
