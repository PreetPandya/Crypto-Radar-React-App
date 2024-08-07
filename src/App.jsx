import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Header from "./components/Header";
import CoinTable from "./components/CoinTable";
import CoinCarousel from "./components/CoinCarousel";

function App() {
  const [currency, setCurrency] = useState();

  return (
    <>
      <Header />
      <CoinCarousel currency={currency} />
      <CoinTable selectCurr={setCurrency} />
    </>
  );
}

export default App;
