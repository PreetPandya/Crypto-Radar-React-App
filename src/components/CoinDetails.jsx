import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinDetails = ({ show, hide, coinId, currency, coinImage }) => {
  const [coinDetail, setCoinDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], prices: [] });

  useEffect(() => {
    const fetchData = () => {
      if (coinId) {
        setLoading(true);

        // Fetch coin details
        axios
          .get(`https://api.coincap.io/v2/assets/${coinId}`)
          .then((response) => {
            setCoinDetail(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });

        // Get today's start and end timestamps
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

        // Fetch coin price history
        axios
          .get(
            `https://api.coincap.io/v2/assets/${coinId}/history?interval=h1&start=${startOfDay}&end=${endOfDay}`
          )
          .then((response) => {
            const prices = response.data.data.map((price) => ({
              x: new Date(price.time).toLocaleString(),
              y: price.priceUsd,
            }));
            setChartData({
              labels: prices.map((price) => price.x),
              prices: prices.map((price) => price.y),
            });
          })
          .catch((error) => console.log(error));
      }
    };

    if (show) {
      fetchData();
    }
  }, [coinId, show, currency]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Price (${currency.toUpperCase()})`,
        data: chartData.prices,
        fill: true,
        borderColor: "#EEBC1D",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#4B9CD3",
        pointHoverBackgroundColor: "#EEBC1D",
        pointHoverBorderColor: "#fff",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Live Price Data",
        color: "#fff",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.7)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += context.parsed.y;
            return label;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        grid: {
          color: "#e0e0e0",
        },
        ticks: {
          color: "#666",
        },
      },
    },
    animation: {
      duration: 500,
      easing: "easeOut",
    },
  };

  return (
    <Modal fullscreen show={show} onHide={hide} backdrop="static">
      <div className="m-5 text-light">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Coin Details
          </Modal.Title>
        </Modal.Header>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" variant="primary" />
          </div>
        ) : (
          coinDetail && (
            <Modal.Body className="scrollable text-start">
              <Row>
                <Col md={3} sm={12} className="text-start">
                  <div className="d-flex justify-content-center my-4">
                    <img
                      src={coinImage}
                      alt={coinDetail.name}
                      className="img-fluid"
                    />
                  </div>
                  <h2>{coinDetail.name}</h2>
                  <h5 style={{ opacity: 0.6 }}>
                    {coinDetail.symbol.toUpperCase()}
                  </h5>
                  <p className="text-break truncated">
                    {coinDetail.description}
                  </p>
                  <p>
                    Price Change (24h):{" "}
                    {parseFloat(coinDetail.changePercent24Hr).toFixed(2)}%
                  </p>
                  <p>
                    Current Price: {currency === "inr" ? "₹" : "$"}
                    {parseFloat(coinDetail.priceUsd).toLocaleString()}
                  </p>
                  <p>
                    Market Cap: {currency === "inr" ? "₹" : "$"}
                    {parseFloat(coinDetail.marketCapUsd).toLocaleString()}
                  </p>
                  <p>Market Cap Rank: {coinDetail.rank}</p>
                  <ul>
                    <li>
                      Website:{" "}
                      <a href={`https://coincap.io/assets/${coinId}`}>
                        CoinCap.io
                      </a>
                    </li>
                    {/* Add other links if available */}
                  </ul>
                </Col>
                <Col md={9} sm={12}>
                  <Line data={data} options={options} />
                </Col>
              </Row>
            </Modal.Body>
          )
        )}
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#EEBC1D",
              border: "none",
              color: "#000",
            }}
            onClick={hide}
          >
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CoinDetails;
