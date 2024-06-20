import React from "react";
import { Row, Col, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import {
  faClock,
  faStopwatch,
  faTachometerAlt,
  faCompass,
  faGear,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const watchTypes = [
  { name: "Rolex", icon: faGear },
  { name: "Omega", icon: faTachometerAlt },
  { name: "Seiko", icon: faClock },
  { name: "Cartier", icon: faCompass },
  { name: "IWC", icon: faStopwatch },
  { name: "Zenith", icon: faStar },
];

const WatchTypeList = () => {
  const navigate = useNavigate();

  const handleTypeClick = (type) => {
    navigate(`/filter/${type.name}`);
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
