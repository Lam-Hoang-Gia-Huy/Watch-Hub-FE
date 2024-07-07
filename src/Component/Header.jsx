import React from "react";
import { Menu, Layout, Input, Col, Image, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import AvatarDropdown from "./Avatar";
import { useState } from "react";
import useAuth from "./Hooks/useAuth"; // Import useAuth hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faCircleInfo,
  faHome,
  faRightFromBracket,
  faUpload,
  faUser,
  faMessage,
  faMagnifyingGlass,
  faFolder,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";

const { Header } = Layout;
const { Search } = Input;

const HeaderBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth(); // Use the useAuth hook to get authentication status and setAuth function
  const [searchTerm, setSearchTerm] = useState("");
  const handleLogout = () => {
    setAuth(null);
    navigate("/");
  };

  const handleClick = (item) => {
    if (!item || !item.key) {
      return;
    }
    if (item.key !== "logout") {
      const path = item.key.toLowerCase();
      navigate(`/${path === "home" ? "" : path}`);
    }
  };
  const handleSearch = (value) => {
    if (value) {
      navigate(`/filter?name=${value}`);
    }
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Col span={3}>
        <Image
          src="https://placeholderlogo.com/img/placeholder-logo-1.png"
          height={60}
        />
      </Col>
      <Col span={12}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          onClick={handleClick}
          style={{ flex: 1, minWidth: 0 }}
        >
          {auth?.role !== "ADMIN" && (
            <Menu.Item key="home">
              <FontAwesomeIcon size="lg" icon={faHome} />
              Home
            </Menu.Item>
          )}
          {auth?.role === "ADMIN" && (
            <>
              <Menu.Item key="users">
                <FontAwesomeIcon size="lg" icon={faUserAlt} />
                User Management
              </Menu.Item>
              <Menu.Item key="revenue">
                <FontAwesomeIcon size="lg" icon={faUserAlt} />
                Revenue
              </Menu.Item>
              <Menu.Item key="upload">
                <FontAwesomeIcon size="lg" icon={faUpload} /> Upload Product
              </Menu.Item>
              <Menu.Item key="voucher-approve">
                <FontAwesomeIcon size="lg" icon={faUpload} /> Approve voucher
              </Menu.Item>
            </>
          )}

          {auth && auth?.role === "USER" && (
            <>
              <Menu.Item key="cart">
                <FontAwesomeIcon size="lg" icon={faCartShopping} /> My Cart{" "}
              </Menu.Item>
              <Menu.Item key="orders">
                <FontAwesomeIcon size="lg" icon={faFolder} /> My Orders{" "}
              </Menu.Item>
            </>
          )}
          {auth && auth?.role === "STAFF" && (
            <Menu.Item key="create-voucher">
              <FontAwesomeIcon size="lg" icon={faUpload} /> Create voucher
            </Menu.Item>
          )}
          {auth && (auth?.role === "STAFF" || auth?.role === "USER") && (
            <Menu.Item key="chat">
              <FontAwesomeIcon size="lg" icon={faMessage} /> Chat
            </Menu.Item>
          )}
          {!auth ? (
            <Menu.Item key="login">
              <FontAwesomeIcon size="lg" icon={faUser} />
              Login
            </Menu.Item>
          ) : (
            <Popconfirm
              title="Are you sure you want to logout?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <Menu.Item key="logout">
                {" "}
                <FontAwesomeIcon size="lg" icon={faRightFromBracket} /> Logout
              </Menu.Item>
            </Popconfirm>
          )}
        </Menu>
      </Col>
      <Col span={9} style={{ display: "flex", alignItems: "center" }}>
        {auth?.role !== "STAFF" && (
          <Search
            placeholder="Search products"
            onSearch={handleSearch}
            style={{ width: 200, marginRight: 16 }}
            enterButton={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        {auth ? (
          <div style={{ marginLeft: "auto", marginRight: "15px" }}>
            <AvatarDropdown />
          </div>
        ) : null}
      </Col>
    </Header>
  );
};

export default HeaderBar;
