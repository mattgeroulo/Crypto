

import {useNavigate} from "react-router-dom";
export default function Login(){
    const navigate=useNavigate()
    function handleLogin(){
        
        navigate("/app")
    }




    return(<div>
        <button onClick={()=>handleLogin()}>login here</button>
    </div>)
}