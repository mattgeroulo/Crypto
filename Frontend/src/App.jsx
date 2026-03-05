import "./App.css";
import { useState,useEffect } from "react";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const[data,setData] = useState(null)
    useEffect(()=>{
        fetch("http://127.0.0.1:8000").then(res=>res.json()).then(json=>{console.log(json);setData(json);})
    },[])
   
  return (
    <div className="Layout">
      <div
        className={isOpen ? "Docked-Nav Open" : "Docked-Nav Closed"}
        onClick={() => setIsOpen(!isOpen)}
      >
        Nav
      </div>
      <div className= "Main-Window">
        <div className="Main-Window">temp</div>
        <div className="Main-Window">testing</div>
        <div>{JSON.stringify(data)}</div>
      </div>
    </div>
  );
}
