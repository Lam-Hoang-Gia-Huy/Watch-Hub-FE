import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, message } from "antd";
import useAuth from "./Hooks/useAuth";

const ChatStartButton = ({ productId, userId, staffId }) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const startChatSession = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/chat/start",
        {
          productId,
          userId,
          staffId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      navigate(`/chat`);
    } catch (error) {
      console.error("Error starting chat session:", error);
      if (error.response) {
        if (error.response.status === 400) {
          navigate(`/chat`);
        } else if (error.response.data) {
          message.error(error.response.data.message);
        } else {
          message.error("Failed to start chat session. Please choose staff!");
        }
      }
    }
  };

  return (
    <Button type="primary" onClick={startChatSession}>
      Chat with store
    </Button>
  );
};

export default ChatStartButton;
