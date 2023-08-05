import React, { useEffect, useState ,useContext} from "react";
import { UserContext } from '../App'
import { useNavigate } from "react-router-dom";
import './contactUs.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contactus = () => {
    const { state, dispatch } = useContext(UserContext)
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch user profile details
    fetch("/myprofile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched profile data:", data);
        setProfile(data.profile);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Send the form data to the server
    fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // Add this line to inspect the response data
        if (data.success) {
          // Reset the form fields on successful submission
          setName("");
          setEmail("");
          setMessage("");
          // Show success message or redirect to a success page
          toast.success('Will get in touch with you shortly!');
          navigate("/home");
        } else {
          // Show error message or handle error case
          toast.error('Error Occurredabcd');
        }
      })
      .catch((error) => {
        // Show error message or handle error case
        console.error(error);
        toast.error('Error Occurred');
      });
  };
  

  return (
    
    <>
    
    <div className="div101">
      <div className="container6">
        <div className="content6">
          <div className="left-side">
            <div className="address details">
              <i className="fas fa-map-marker-alt"></i>
              <div className="topic">Address</div>
              <div className="text-one">Swati Crimson </div>
              <div className="text-two">Ahmedabad, India</div>
            </div>
            <div className="phone details">
              <i className="fas fa-phone-alt"></i>
              <div className="topic">Phone</div>
              <div className="text-one">+91 74908 46387</div>
           
            </div>
            <div className="email details">
              <i className="fas fa-envelope"></i>
              <div className="topic">Email</div>
              <div className="text-one">hellosafarnamaaa@gmail.com</div>
              <div className="text-one">support@safarnamaaa.com</div>
            </div>
          </div>
          <div className="right-side">
            <div className="topic-text">Send us a message</div>
            <p>If you have any inquiries, concerns, or ideas, please feel free to get in touch with us.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input type="text" placeholder={profile?.name || "User"} value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-box">
                <input type="email" placeholder={profile?.email || "User"} value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-box message-box">
                <textarea placeholder="Enter your message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
              </div>
              <div className="btn">
                <input type="submit" value="Send Now" />
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Contactus;
