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

  // Debounce function to limit the rate at which a function can fire
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  // Handle payment return with debouncing
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

        // Fetch cart items after successful payment
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

        const createOrderResponse = await axios.post(
          "http://localhost:8080/api/v1/orders",
          {
            userId: auth.id,
            orderItems: cartItems.map((item) => ({
              watchId: item.watch.id,
              price: item.watch.price,
            })),
            totalAmount: totalPrice,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );

        // Log the entire response to debug
        console.log("Order creation response: ", createOrderResponse.data);

        // Check if the response has an 'id' property
        if (createOrderResponse.data && createOrderResponse.data.id) {
          // Clear cart after order creation
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

          paymentProcessed.current = true; // Set flag after successful processing
          navigate("/"); // Navigate only once after all actions are completed
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
  }, 500); // Debounce with 500ms delay

  useEffect(() => {
    console.log("PaymentReturn component mounted");

    handlePaymentReturn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to ensure it only runs once on mount

  return <div>Processing payment...</div>;
};

export default PaymentReturn;
