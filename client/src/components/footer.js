import React from "react";
import "../components/footerstyle.css";


const Footer = () => {
  return (
    <footer className="footer-distributed">
    <div className="footer-left">
      <h3>Welcome to Safarnamaaa<span>.com</span></h3>
      <p className="footer-links">
        <a href="#" className="link-1">Home</a>
        <a href="#">About Us</a>
        <a href="#">Contact Us</a>
        <a href="#">Sfarnamaaa.AI</a>
      </p>
      <p className="footer-company-name">Safarnamaaa © 2023 All Rights Reserved</p>
    </div>
    <div className="footer-center">
      <div>
        <i className="fa fa-map-marker" />
        <p><span>Swati Crimson </span>Ahmedabad , India</p>
      </div>
      <div>
        <i className="fa fa-phone" />
        <p>+91 74908 46387</p>
      </div>
      <div>
        <i className="fa fa-envelope" />
        <p><a href="mailto:support@company.com">support@Safarnamaaa.com</a></p>
      </div>
    </div>
    <div className="footer-right">
      <p className="footer-company-about">
        <span>About Safarnamaaa</span>
        We have released the initial version of Safarnamaaa, featuring essential functions. Our plan is to enhance it further and introduce additional features in the coming updates.
      </p>
      <div className="footer-icons">
        <a href="# "><i className="fa fa-instagram" /></a>
        <a href="#"><i className="fa fa-twitter" /></a>
        <a href="#"><i className="fa fa-linkedin" /></a>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
