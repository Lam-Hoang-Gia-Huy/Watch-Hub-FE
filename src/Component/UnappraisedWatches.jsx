import React, { useEffect, useState } from "react";
import { List, Card, Spin, Typography, Image, Alert, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import useAuth from "./Hooks/useAuth";

const { Title, Text } = Typography;

const UnappraisedWatches = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchWatches = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/watch", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.accessToken}`, // Include authentication token in request headers
          },
        });
        const unappraisedWatches = response.data.filter(
          (watch) => watch.appraisalId == null
        );
        setWatches(unappraisedWatches);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchWatches();
  }, [auth.accessToken]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={1}
        className="formTitle"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        Unappraised Watches
      </Title>
      {watches.length === 0 ? (
        <Alert
          message="No unappraised watches available."
          type="info"
          showIcon
          style={{ textAlign: "center", margin: "20px" }}
        />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={watches}
          renderItem={(watch) => (
            <List.Item>
              <Card
                hoverable
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                cover={
                  watch.imageUrl && watch.imageUrl.length > 0 ? (
                    <Image
                      src={watch.imageUrl[0]}
                      alt={watch.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>No Image</Text>
                    </div>
                  )
                }
              >
                <Card.Meta
                  title={"Title: " + watch.name}
                  description={
                    <>
                      <Text>Brand: {watch.brand}</Text>
                      <br />
                      <Text>Description: {watch.description}</Text>
                      <br />
                      <b>Unappraised</b>
                      <br />
                      <Link to={`/appraise-watch/${watch.id}`}>
                        <Button type="primary" style={{ marginTop: "10px" }}>
                          Appraise
                        </Button>
                      </Link>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default UnappraisedWatches;
