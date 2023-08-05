import React from 'react'
import NavLogo from "../components/images/s4.jpg";
import navStyle from './navBar.css';
import { Link , useNavigate} from "react-router-dom";

const Navbar=()=>{
    return(
        <nav>   
        <div className="logo">
        <img src={NavLogo} alt="Logo" className="navimg"/> 
        </div>
      </nav>
    );
}

export default  Navbar