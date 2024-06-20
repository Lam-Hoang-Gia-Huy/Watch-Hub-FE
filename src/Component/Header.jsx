import React from "react";
import { Menu, Layout, Input, Col, Image, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import AvatarDropdown from "./Avatar";
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
} from "@fortawesome/free-solid-svg-icons";

const { Header } = Layout;
const { Search } = Input;

const onSearch = (value) => console.log(value);

const HeaderBar = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth(); // Use the useAuth hook to get authentication status and setAuth function

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
          {auth?.role !== "APPRAISER" && (
            <Menu.Item key="home">
              <FontAwesomeIcon size="lg" icon={faHome} />
              Home
            </Menu.Item>
          )}
          <Menu.Item key="about">
            <FontAwesomeIcon size="lg" icon={faCircleInfo} />
            About us
          </Menu.Item>
          {auth && auth?.role === "USER" && (
            <>
              <Menu.Item key="upload">
                <FontAwesomeIcon size="lg" icon={faUpload} /> Upload post
              </Menu.Item>
              <Menu.Item key="cart">
                <FontAwesomeIcon size="lg" icon={faCartShopping} /> Your Cart{" "}
              </Menu.Item>
              <Menu.Item key="orders">
                <FontAwesomeIcon size="lg" icon={faFolder} /> My Orders{" "}
              </Menu.Item>
            </>
          )}
          {auth && auth?.role === "APPRAISER" && (
            <Menu.Item key="unappraised-watches">
              <FontAwesomeIcon size="lg" icon={faMagnifyingGlass} />{" "}
              unappraised-watches{" "}
            </Menu.Item>
          )}
          {auth && (auth?.role === "APPRAISER" || auth?.role === "USER") && (
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
        {auth?.role !== "APPRAISER" && (
          <Search
            placeholder="Input watch name here"
            onSearch={onSearch}
            enterButton
            style={{ width: "60%" }}
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
