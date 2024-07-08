import React, { useRef, useState, useEffect } from "react";
import {
  Layout,
  ConfigProvider,
  Button,
  Form,
  Input,
  Checkbox,
  Typography,
  message,
  theme,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const LOGIN_URL = "http://localhost:8080/api/v1/auth/authenticate"; // Change this to your actual login endpoint URL

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(LOGIN_URL, values); // Send login request to the backend
      const { user, token, refreshToken } = response.data; // Extract user information and token from the response

      // Store user information and token in the frontend
      setAuth({
        id: user.id,
        usertName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        createdDate: user.createdDate,
        accessToken: token,
        refreshToken: refreshToken,
      });

      message.success("Logged in successfully!");
      if (user.role === "APPRAISER") {
        navigate("/unappraised-watches");
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Incorrect Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorBgContainer, borderRadiusLG } }}>
      <Content
        style={{
          padding: "50px 300px 150px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 24,
            flexGrow: 1,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Title className="formTitle" type="success" level={2}>
            Login
          </Title>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input ref={userRef} />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
              <Link style={{ marginLeft: "90px" }} to="/register">
                Don't have an account? Register here!
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </ConfigProvider>
  );
};

export default LoginPage;
