import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "./Hooks/useAuth";

const AvatarDropdown = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const menu = (
    <Menu
      onClick={(e) => {
        if (e.key === "profile") {
          navigate("/profile"); // navigate to profile page
        } else if (e.key === "mypost") {
          navigate("/My-Post"); // navigate to my post page
        }
      }}
    >
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="mypost">My Post</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Avatar size="large" src={auth.avatarUrl} style={{ cursor: "pointer" }} />
    </Dropdown>
  );
};

export default AvatarDropdown;
