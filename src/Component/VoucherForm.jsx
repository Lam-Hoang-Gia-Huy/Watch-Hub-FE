import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  message,
  Switch,
} from "antd";
import axios from "axios";
import useAuth from "./Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const VoucherForm = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/voucher",
        {
          ...values,
          status: false, // Set the status to false when created
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      message.success("Voucher created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating voucher:", error);
      message.error("Failed to create voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="code"
        label="Voucher Code"
        rules={[{ required: true, message: "Please input the voucher code!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="discountValue"
        label="Discount Value"
        rules={[
          { required: true, message: "Please input the discount value!" },
        ]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="minimumPurchase"
        label="Minimum Purchase"
        rules={[
          { required: true, message: "Please input the minimum purchase!" },
        ]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="maxUsage"
        label="Maximum Usage"
        rules={[{ required: true, message: "Please input the maximum usage!" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: "Please input the start date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: "Please input the end date!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Voucher
        </Button>
      </Form.Item>
    </Form>
  );
};

export default VoucherForm;
