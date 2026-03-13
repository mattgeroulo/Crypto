import "./Tile.css";
import { motion, AnimatePresence } from "framer-motion";

export default function Tile(props) {
  return (
    props.isVisible && (
      <motion.div
        className="Tile"
        onClick={props.onClick}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="Tile Header">{props.text}</div>
      </motion.div>
    )
  );
}
