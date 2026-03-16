import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Tile from "./components/Tile.jsx";
import "./Blockchain.css";
export default function Blockchain() {
  const [backgroundcolor, setBackgroundColor] = useState("white");
  const [blocks, setBlocks] = useState([]);
  const [bitcoinBlock, setBitcoinBlock] = useState([]);
  const [blockHeight, setHeight] = useState(0);
  const [address, setAddress] = useState([
    "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  ]);
  const navigate = useNavigate();
  const [blockUpdater,setBlockUpdater]=useState(true)
  useEffect(() => {
    fetch(`http://localhost:8000/wallet/${address}`)
      .then((res) => res.json())
      .then((json) => {
        setBlocks(json);
        console.log(blocks);
      });
  }, [address,blockUpdater]);

  function setBlockHeight(height) {
    try {
      const parsed = parseInt(height, 10);
      if (Number.isNaN(parsed)) {
        throw new Error("Invalid block height");
      }
      setHeight(parsed);
      console.log(`Setting new height as : ${parsed}`);
      //get TXIDs from new height a
      fetch(`http://localhost:8000/block/${blockHeight}`)
        .then((res) => res.json())
        .then((json) => {
          console.log(
            `Here are the transactions on block height of ${blockHeight}: ${JSON.stringify(blocks, null, 2)}`,
          );
         
          console.log("Starting tile change in setBlockHeight")
         
              
          console.log(`json here: ${JSON.stringify(json)}`)
          
          setBitcoinBlock([json]);
          //setBlocks([]);
        });
        //Here on 3/15, need to update blocks to be changed on this request, need to take out update on address logic because its wrong
        //we are seeing transactions id's of a single bitcoin address, changing it to show block hash + transactions on that block
        fetch(`http://localhost:8000/transactions/${json['hash']}`).then(res=>res.json()).then(json=>{setBlocks[json];setBlockUpdater(!blockUpdater)})
    } catch (err) {
      console.error(err);
    }
  }
  function handleTileClick(props) {
    console.log(props.txid);
  }
  return (
    <div className="Layout" style={{ backgroundColor: backgroundcolor }}>
      <div className="Header NavBar">
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
        <input
          className="Address Input"
          type="number"
          step="1"
          min="0"
          placeholder="Get blocks at height:"
          value={blockHeight}
          onChange={(e) => setHeight(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setBlockHeight(e.target.value);
            }
          }}
        />
      </div>
      {bitcoinBlock
            ? bitcoinBlock.map((tile, index) => (
                <Tile
                  key={tile.hash}
                  text={tile.hash}
                  isVisible={tile.isVisible ?? true}
                  onClick={() => handleTileClick(tile)}
                  className="Tile Block"
                />
              ))
            : console.log("error")}
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
                  className="Tile"
                />
              ))
            : console.log("error")}
        </motion.div>
        
      </AnimatePresence>
      
    </div>
  );
}
