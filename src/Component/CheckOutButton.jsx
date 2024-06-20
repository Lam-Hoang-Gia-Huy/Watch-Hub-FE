import React, { useState } from "react";
import axios from "axios";
import { Button, message } from "antd";
import useAuth from "./Hooks/useAuth";

const CheckoutButton = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // Fetch the latest cart items from the server
      const response = await axios.get(
        `http://localhost:8080/api/v1/cart/${auth.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      const cartItems = response.data.cartItems;
      const totalPrice = response.data.totalPrice;

      // Proceed to create payment URL
      const amount = totalPrice;
      const orderInfo = `Payment for order at My Watch Shop`;

      const paymentResponse = await axios.post(
        "http://localhost:8080/api/v1/payment/create-payment-url",
        {
          amount,
          orderInfo,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      console.log("Payment URL response: ", paymentResponse.data);

      // Redirect to the payment URL returned by the server
      if (paymentResponse.data.paymentUrl) {
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        message.error("Failed to create payment URL.");
      }
    } catch (error) {
      console.error("Error processing checkout: ", error);
      message.error("An error occurred during the checkout process.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="primary" onClick={handleCheckout} loading={loading}>
      Proceed to Checkout
    </Button>
  );
};

export default CheckoutButton;
