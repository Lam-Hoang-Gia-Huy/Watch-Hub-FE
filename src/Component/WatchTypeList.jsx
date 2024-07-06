import React from "react";
import { Row, Col, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faChild,
  faCarriageBaby,
  faHandsHoldingChild,
  faBaby,
  faChildReaching,
} from "@fortawesome/free-solid-svg-icons";

const watchTypes = [
  { name: "Sweetened", icon: faCarriageBaby },
  { name: "Powdered milk", icon: faHandsHoldingChild },
  { name: "Condensed milk", icon: faChild },
  { name: "Fresh milk", icon: faBaby },
  { name: "UHT Milk", icon: faChildReaching },
];

const WatchTypeList = () => {
  const navigate = useNavigate();

  const handleTypeClick = (type) => {
    navigate(`/filter?category=${type.name}`);
  };

  return (
    <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "24px" }}>
      {watchTypes.map((type) => (
        <Col key={type.name} span={4}>
          <Card
            hoverable
            onClick={() => handleTypeClick(type)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#e1a9a9",
              textAlign: "center",
              height: "100px",
            }}
          >
            <FontAwesomeIcon
              icon={type.icon}
              size="2x"
              style={{ marginBottom: "8px" }}
            />
            <span>{type.name}</span>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WatchTypeList;
