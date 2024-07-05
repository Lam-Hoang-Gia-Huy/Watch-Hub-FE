import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./Hooks/useAuth";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { Content } from "antd/es/layout/layout";

const UserManagement = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/user", {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    setUsers(response.data);
  };

  const deactivateUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/deactivate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      fetchUsers(); // Refresh user data after deactivation
      message.success("User deactivated successfully");
    } catch (error) {
      message.error("Failed to deactivate user");
    }
  };

  const activateUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/user/activate/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      fetchUsers(); // Refresh user data after activation
      message.success("User activated successfully");
    } catch (error) {
      message.error("Failed to activate user");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="orange">Inactive</Tag>
        ), // Use Ant Design tags for visual distinction
    },
    {
      title: "Actions",
      key: "actions",
      render: (user) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/user/${user.id}`)}
          >
            Detail
          </Button>
          {user.status ? (
            <Popconfirm
              title="Are you sure you want to deactivate this user?"
              onConfirm={() => deactivateUser(user.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger" ghost size="small">
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to activate this user?"
              onConfirm={() => activateUser(user.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" ghost size="small">
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Content
      style={{
        padding: "0 200px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <h1>User Management</h1>
        <Table
          dataSource={users}
          columns={columns}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.id}
        />{" "}
      </div>
    </Content>
  );
};

export default UserManagement;
