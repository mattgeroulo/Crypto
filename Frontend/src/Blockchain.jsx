import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tile from "./components/Tile.jsx";
import "./Blockchain.css";
export default function Blockchain() {
  const [backgroundcolor, setBackgroundColor] = useState("white");
  const [blocks, setBlocks] = useState([]);
  const [address, setAddress] = useState([
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/wallet/${address}`)
      .then((res) => res.json())
      .then((json) => {
        setBlocks(json);
        console.log(blocks);
      });
  }, [address]);

  function handleTileClick(props) {
    console.log(props.txid)
  }
  return (
    <div className="Layout" style={{ backgroundColor: backgroundcolor }}>
      <div className="Header">
        Header
        <div className="Header Button">
          <button
            onClick={() =>
              backgroundcolor == "white"
                ? setBackgroundColor("black")
                : setBackgroundColor("white")
            }
          >
            Change Mode
          </button>
          <button onClick={() => navigate("/Blockchain")}>Blockchain</button>
        </div>
      </div>
      <div className="Content" style={{ backgroundColor: backgroundcolor }}>
        {blocks.length > 0 ? "hello" : "empty"}
        <input
          className="Address Input"
          type="text"
          placeholder="enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => console.log("tile change")}
      >
        <motion.div key={blocks.length}>
          {blocks
            ? blocks.map((tile, index) => (
                <Tile
                  key={tile.txid}
                  text={tile.txid}
                  isVisible={tile.isVisible ?? true}
                  onClick={() => handleTileClick(tile)}
                />
              ))
            : console.log("error")}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
