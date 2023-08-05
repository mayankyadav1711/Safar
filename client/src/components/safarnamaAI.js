import React, { useEffect, useState, useContext } from 'react';
import handlesignin from './handlesignin';
import signinStyle from './signin.module.css';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import video from '../components/images/aa.mp4';



const styles = {
    container: {
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    },
    gif: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  };
  
  const BackgroundPage = () => {
    return (
      <div style={styles.container}>
        <img
          src="https://i.pinimg.com/originals/43/3b/6c/433b6c5336c72a21bcfd9db8d831562a.gif"
          alt="Background GIF"
          style={styles.gif}
        />
        {/* Add your content here */}
        
      </div>
    );
  };
  export default BackgroundPage; 