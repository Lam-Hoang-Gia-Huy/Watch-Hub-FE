import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { message } from "antd";
import useAuth from "./Hooks/useAuth";

const PaymentReturn = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const paymentProcessed = useRef(false);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  const handlePaymentReturn = debounce(async () => {
    if (paymentProcessed.current) {
      console.log("Payment already processed, skipping...");
      return;
    }

    console.log("Starting payment verification process...");

    const query = queryString.parse(location.search);
    const secureHash = query["vnp_SecureHash"];
    delete query["vnp_SecureHash"];

    try {
      console.log("Sending verification request with payload: ", {
        ...query,
        vnp_SecureHash: secureHash,
      });

      const verifyResponse = await axios.post(
        `http://localhost:8080/api/v1/payment/verify-payment/${auth.id}`,
        {
          ...query,
          vnp_SecureHash: secureHash,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );

      console.log("Verification response: ", verifyResponse.data);

      if (verifyResponse.data.success) {
        message.success("Payment was successful!");

        const cartResponse = await axios.get(
          `http://localhost:8080/api/v1/cart/${auth.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );

        const cartItems = cartResponse.data.cartItems;
        const totalPrice = cartResponse.data.totalPrice;
        const orderItems = cartItems.map((item) => ({
          product: item.product, // Assuming item.product is already a ProductDTO
          price: item.price,
          quantity: item.quantity, // Include quantity
        }));

        const createOrderResponse = await axios.post(
          "http://localhost:8080/api/v1/orders",
          {
            userId: auth.id,
            orderItems: orderItems,
            totalAmount: totalPrice,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );

        console.log("Order creation response: ", createOrderResponse.data);

        if (createOrderResponse.data && createOrderResponse.data.id) {
          await axios.post(
            `http://localhost:8080/api/v1/cart/clear/${auth.id}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );

          paymentProcessed.current = true;
          navigate("/");
        } else {
          message.error(
            "Failed to create order. Response did not indicate success."
          );
          navigate("/");
        }
      } else {
        message.error("Payment failed!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying payment: ", error);
      message.error("An error occurred while verifying the payment.");
      navigate("/");
    }
  }, 500);

  useEffect(() => {
    console.log("PaymentReturn component mounted");

    handlePaymentReturn();
  }, []);

  return <div>Processing payment...</div>;
};

export default PaymentReturn;
