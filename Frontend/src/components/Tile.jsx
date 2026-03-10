
import "./Tile.css"
import {useState} from 'react'
export default function Tile(props){
    
    return(
        props.isVisible?
        <div className="Tile">
            <div className="Header">
                {props.text}
            </div>
        </div>
        :
        <div>default</div>
    )
}