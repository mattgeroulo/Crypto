import "./App.css";
import Tile from "./components/Tile.jsx";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [tiles, setTiles] = useState([]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setData(json);
      });
  }, []);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/getTiles")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setTiles(json);
      });
  }, []);

  function handleTileClick(tile) {
    console.log("clicking tile");
    fetch("http://127.0.0.1:8000/tile_click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: tile.text }),
    })
      .then((res) => res.json())
      .then((json) => {
        setTiles(json);
        console.log(tiles);
      });
  }
  const resetTiles = () => {
    fetch("http://127.0.0.1:8000/getTiles")
      .then((res) => res.json())
      .then((json) => setTiles(json));
  };

  return (
    <div className="Layout">
      <div
        className={isOpen ? "Docked-Nav Open" : "Docked-Nav Closed"}
        onClick={() => setIsOpen(!isOpen)}
      >
        Nav
      </div>
      <div className="Main-Window">
        <div>
          <button onClick={() => resetTiles()}>Return</button>
        </div>
        <AnimatePresence mode="wait" onExitComplete={()=>console.log("tile change")} >
          <motion.div key={tiles.length}>
          {tiles
            ? tiles.map((tile, index) => (
                <Tile
                  key={tile.text}
                  text={tile.text}
                  isVisible={tile.isVisible ?? true}
                  onClick={() => handleTileClick(tile)}
                />
              ))
            : console.log("error")}
            </motion.div>
        </AnimatePresence>
        
      </div>
    </div>
  );
}
