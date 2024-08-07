import React from "react";
import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";

const CoinCarousel = ({ currency }) => {
  const [trendingCoin, setTrendingCoin] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
      )
      .then((response) => setTrendingCoin(response.data))
      .catch((error) => console.log(error));
  }, [currency]);

  return (
    <div className="my-5 coin-carousel" style={{ fontSize: 25 }}>
      <Carousel slide pause="hover" touch>
        {trendingCoin.map((coin) => (
          <Carousel.Item key={coin.id}>
            <div className="d-flex flex-column align-items-center">
              <img
                src={coin.image}
                alt={coin.name}
                className="coin-image my-3"
              />
              <h3 className="coin-symbol my-2">{coin.symbol.toUpperCase()}</h3>
              <p className="coin-price pb-5">
                {currency === "inr" ? "₹" : "$"}
                {coin.current_price.toLocaleString()} |{" "}
                {coin.price_change_percentage_24h < 0 ? (
                  <span style={{ color: "red" }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                ) : (
                  <span style={{ color: "#00ff00" }}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                )}
              </p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CoinCarousel;
