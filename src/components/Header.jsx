import React from "react";
import { Row, Col } from "react-bootstrap";

const Header = () => {
  return (
    <>
      <Row className="my-5">
        <Col md={12} sm={12}>
          <h1 className="header-title">
            <span>Crypto</span>
            <span style={{ color: "#EEBC1D" }}>Radar</span>
          </h1>
        </Col>

        <Col md={12} sm={12}>
          <p id="header-tagline">
            "Crypto Radar: Your Ultimate Guide to Real-Time Crypto Insights"
          </p>
        </Col>
      </Row>
    </>
  );
};

export default Header;
