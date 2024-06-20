import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Button, Typography, Row, Col, theme } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import CheckoutButton from "./CheckOutButton";
import useAuth from "./Hooks/useAuth";

const { Text, Title } = Typography;

const Cart = () => {
  const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/cart/${auth.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
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
    fetchCart();
  }, [auth.id, auth.accessToken]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/cart/${auth.id}/${cartItemId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
          },
        }
      );
      setCart((prevCart) => ({
        ...prevCart,
        cartItems: prevCart.cartItems.filter((item) => item.id !== cartItemId),
        totalPrice:
          prevCart.totalPrice -
          prevCart.cartItems.find((item) => item.id === cartItemId).watch.price,
      }));
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary, colorError },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: "20px 20px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          padding: 24,
          flexGrow: 1,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title
          className="formTitle"
          type="success"
          level={2}
          style={{ textAlign: "center" }}
        >
          YOUR CART <FontAwesomeIcon size="lg" icon={faCartShopping} />
        </Title>
        <List
          split="true"
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "10px",
          }}
          itemLayout="horizontal"
          dataSource={cart.cartItems}
          renderItem={(cartItem) => (
            <List.Item
              style={{
                padding: "10px",
                borderBottom: "1px solid #e8e8e8",
                transition: "background-color 0.3s",
              }}
              actions={[
                <Button
                  type="link"
                  onClick={() => handleRemoveFromCart(cartItem.id)}
                  style={{ color: colorError }}
                >
                  Remove
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <img
                    src={cartItem.watch.imageUrl[0]}
                    alt={cartItem.watch.name}
                    style={{ width: "70px", borderRadius: "8px" }}
                  />
                }
                title={"Title: " + cartItem.watch.name}
                description={
                  <div>
                    <Text style={{ color: "black" }}>
                      <b>Brand: </b> {cartItem.watch.brand}
                      <br></br>
                    </Text>
                    <Text style={{ color: "black" }}>
                      <b>Price: </b> {cartItem.watch.price?.toLocaleString()} đ
                      <br></br>
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <Row style={{ marginTop: "20px" }}>
          <Col span={12}>
            <Text strong style={{ fontSize: "16px" }}>
              Total:
            </Text>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <Text strong style={{ fontSize: "16px" }}>
              {cart.totalPrice?.toLocaleString()} đ
            </Text>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }} justify="center">
          <Col>
            <CheckoutButton />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Cart;
