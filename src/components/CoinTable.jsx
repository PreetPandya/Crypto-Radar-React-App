import React, { useState, useEffect } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import CoinDetails from "./CoinDetails";

const CoinTable = ({ selectCurr }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [selectedCoinImage, setSelectedCoinImage] = useState(null); // New state for the selected coin image
  const [currency, setCurrency] = useState("inr");

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      )
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
    selectCurr(currency);
  }, [currency]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleCoinClick = (coinId, coinImage) => {
    setSelectedCoinId(coinId);
    setSelectedCoinImage(coinImage); // Set the selected coin image
    setShow(true);
  };

  const handleChange = (event) => {
    setCurrency(event.target.value.toLowerCase());
  };

  return (
    <>
      <Row className="my-3 d-flex justify-content-end">
        <Col md={2} sm={6}>
          <Form.Select
            className="bg-transparent text-white"
            size="lg"
            aria-label="Large select example"
            onChange={handleChange}
            value={currency.toUpperCase()}
          >
            <option className="text-dark" value="INR">
              INR
            </option>
            <option className="text-dark" value="USD">
              USD
            </option>
          </Form.Select>
        </Col>
      </Row>
      <Row
        className="text-center py-2"
        id="header-row"
        style={{
          background: "#EEBC1D",
          color: "#000",
        }}
      >
        <Col style={{ marginTop: "1rem" }} xs={3} md={3}>
          <p>Coin</p>
        </Col>
        <Col style={{ marginTop: "1rem" }} xs={3} md={3}>
          <p>Price</p>
        </Col>
        <Col style={{ marginTop: "1rem" }} xs={3} md={3}>
          <p>24h Change</p>
        </Col>
        <Col style={{ marginTop: "1rem" }} xs={3} md={3}>
          <p>Market Cap</p>
        </Col>
      </Row>

      {currentData.map((coin) => (
        <React.Fragment key={coin.id}>
          <Row className="text-center my-2" id="coin-row">
            <Col
              xs={3}
              md={3}
              className="d-flex align-items-center justify-content-left"
              style={{ cursor: "pointer" }}
              onClick={() => handleCoinClick(coin.id, coin.image)}
            >
              <img
                className="m-3"
                id="coin-img"
                src={coin.image}
                alt={coin.name}
              />
              <div className="d-flex flex-column text-start">
                <span>{coin.symbol.toUpperCase()}</span>
                <span style={{ opacity: 0.6 }}>{coin.name}</span>
              </div>
            </Col>
            <Col
              xs={3}
              md={3}
              className="d-flex align-items-center justify-content-center"
            >
              <p>
                {currency === "inr" ? "₹" : "$"}
                {coin.current_price.toLocaleString()}
              </p>
            </Col>
            <Col
              xs={2}
              md={3}
              className="d-flex align-items-center justify-content-center"
            >
              {coin.price_change_percentage_24h < 0 ? (
                <p style={{ color: "red" }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              ) : (
                <p style={{ color: "#00ff00" }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              )}
            </Col>
            <Col
              xs={4}
              md={3}
              className="d-flex align-items-center justify-content-center"
            >
              <p>
                {currency === "inr" ? "₹" : "$"}
                {coin.market_cap.toLocaleString().toString().slice(0, -6)}M
              </p>
            </Col>
          </Row>

          <hr />
        </React.Fragment>
      ))}

      <div className="d-flex justify-content-center align-items-center my-4">
        <Button
          style={{ background: "#EEBC1D", border: "none", color: "#000" }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          style={{ background: "#EEBC1D", border: "none", color: "#000" }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <CoinDetails
        coinImage={selectedCoinImage} // Pass the selected coin image
        currency={currency}
        show={show}
        hide={() => setShow(false)}
        coinId={selectedCoinId}
      />
    </>
  );
};

export default CoinTable;
