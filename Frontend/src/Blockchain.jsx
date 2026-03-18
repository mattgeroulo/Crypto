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
  const [maxBlockHeight, setMaxBlockHeight] = useState(941064);
  const [txids, setTxids] = useState([]);
  const [hash, setHash] = useState(
    "0000000067a97a2a37b8f190a17f0221e9c3f4fa824ddffdc2e205eae834c8d7",
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/wallet/${address}`)
      .then((res) => res.json())
      .then((json) => {
        const normalized = normalizeData(json);
        setBlocks(normalized);
        console.log(normalized);
      });
  }, [address]);
  //we want this to update the blocks list with a list of transactions on this hash value
  useEffect(() => {
    fetch(`http://localhost:8000/transactions/${hash}`)
      .then((res) => res.json())
      .then((json) => {
        const normalized = normalizeData(json);

        console.log(`json transactions: ${JSON.stringify(json)}`);
        console.log(`Normalized data setting to block: ${JSON.stringify(normalized,2,null)}`);
        setBlocks(normalized);
        console.log("Sending fetch request")
        console.log(`txid block structure: ${JSON.stringify({"txids":blocks})}`);
        //loadTransactions();
      });
  }, [hash]);
  //Change this to a post request
  async function loadTransactions() {
    const transactions=[]
  
    const res = await fetch(
      `http://localhost:8000/transactionInfo`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({"txids":blocks})
      }
    );
    const txjson = await res.json();
    transactions.push(txjson);

    console.log(transactions);
    setBlocks(transactions);
  }
  function normalizeData(json) {
    return json.map((item) => {
      if (typeof item === "string") {
        return {
          txid: item,
          incoming: null,
          outgoing: null,
          net: null,
          status: null,
          isVisible: true,
        };
      }

      return {
        txid: item.txid ?? item.hash ?? item.id ?? "",
        incoming: item.incoming ?? null,
        outgoing: item.outgoing ?? null,
        net: item.net ?? null,
        status: item.status ?? null,
        isVisible: item.isVisible ?? true,
      };
    });
  }
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
          console.log("Starting tile change in setBlockHeight");

          console.log(`json here: ${JSON.stringify(json)}`);

          setBitcoinBlock([json]);
          setHash(json["id"]);
        });
      //Here on 3/15, need to update blocks to be changed on this request, need to take out update on address logic because its wrong
      //we are seeing transactions id's of a single bitcoin address, changing it to show block hash + transactions on that block
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
          max={maxBlockHeight}
          placeholder="Get blocks at height:"
          value={blockHeight}
          onChange={(e) => setHeight(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = Number(e.target.value);
              if (value <= maxBlockHeight && value >= 0) {
                setBlockHeight(e.target.value);
              }
            }
          }}
        />
        <span className="Address Height"> Max Height: {maxBlockHeight}</span>
      </div>
      {bitcoinBlock
        ? bitcoinBlock.map((tile, index) => (
            <Tile
              key={tile.id || index}
              text={`Hash: ${tile.id}`}
              isVisible={true}
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
                  key={tile.txid || index}
                  text={`TXID: ${tile.txid}`}
                  isVisible={tile.isVisible}
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
