import React, { useEffect, useState, useContext } from "react";
import "./viewProfile.css";
import { format } from "date-fns";
import { FaInstagram } from "react-icons/fa";

import homeStyles from "../components/home.module.css";
import { Link } from "react-router-dom";
const ViewProfile = () => {
  const [data, setData] = useState(null);
  const [myposts, setMyPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);



  useEffect(() => {
    fetch("https://safarnamaaa-backend.vercel.app/myprofile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.profile); // Update to result.profile
      });
  }, []);

  useEffect(() => {
    fetch('https://safarnamaaa-backend.vercel.app/likedPosts', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then(res => res.json())
      .then(data => {
        setLikedPosts(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);




  const calculateAge = (birthdate) => {
    const birthdateObj = new Date(birthdate);
    const now = new Date();

    let age = now.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = now.getMonth() - birthdateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthdateObj.getDate())
    ) {
      age--;
    }

    return age;
  };





  



    const [selectedTab, setSelectedTab] = useState('posted');
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
      };


      useEffect(() => {
        fetch("https://safarnamaaa-backend.vercel.app/mypost", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setMyPosts(data.mypost);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);



    const profilePicUrl =
    "https://wallpapers.com/images/hd/aesthetic-boy-pictures-9t4nlikwk6kn19vu.jpg";
    
  return (
    <div className="bg87">
      <div className="container-xl px-4 mt-4">
        <hr className="mt-0 mb-4" />
        <div className="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
              {data && data.profilepic ? (
  <img
    className="img-account-profile rounded-circle mb-2"
    src={data.profilepic}
    alt=""
  />
 
) : (
  <img
    className="img-account-profile rounded-circle mb-2"
    src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"
    alt=""
  />
  
)}
     <button className="bun1" 
                >
     logout
</button>

                {/* <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div> */}
              </div>
            </div>
       
          </div>
          <div className="col-xl-8">
  <div className="card mb-4">
    <div className="card-header">User Details</div>
    <div className="card-body">
      {data && (
        <React.Fragment>
          <div className="mb-3">
            <h6> <b>Username:  </b>{data.name}</h6>
          </div>
          <div className="row gx-3 mb-3"></div>
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <h6><b>Current City: </b> {data.currlocation}</h6>
            </div>
          </div>
          <div className="mb-3">
            <h6><b>Email Address: </b> {data.email}</h6>
          </div>
          <div className="row gx-3 mb-3">
            <div className="col-md-6">
              <h6><b>About Yourself:</b> {data.aboutme}</h6>
            </div>
            <div className="col-md-6">
              <h6> <b>Birthdate: </b> {data && data.birthdate ? new Date(data.birthdate).toLocaleDateString() : 'N/A'}</h6>
            </div>
            <div className="col-md-6">
  <h6><b>Age:</b> {data && data.birthdate ? calculateAge(data.birthdate) : 'N/A'}</h6>
</div>

            <div className="col-md-6 insta">
              {/* <h6>Instagram Handle:</h6> */}
              {/* <h6>Instagram Handle: {data.instahandle}</h6> */}
             <Link to={data.instahandle}> <FaInstagram style={{ fontSize: '40px' }} /></Link>
            </div>
          </div>
          <Link to="/editProfile">
            <button className="btn btn-primary" type="button">
              Edit Profile
            </button>
          </Link>
        </React.Fragment>
      )}
    </div>
  </div>
</div>




        </div>
      </div>
      <div className="menu">
        <div className="tabs">
          <input
            type="radio"
            name="tabs"
            id="tab1"
            checked={selectedTab === 'posted'}
            onChange={() => handleTabChange('posted')}
          />
          <label htmlFor="tab1" className="tab">
            POSTED
          </label>

          <input
            type="radio"
            name="tabs"
            id="tab2"
            checked={selectedTab === 'liked'}
            onChange={() => handleTabChange('liked')}
          />
          <label htmlFor="tab2" className="tab">
            LIKED
          </label>

          <span className="selector"></span>
        </div>
      </div>
      {/* Post Code */}



      <div className="spacingforpost">
      {selectedTab === 'posted' && (
        <div>

        {myposts && myposts.length > 0 ? (
            myposts.map(item => (
          <div className={homeStyles["course"]} key={item._id}>
            <div className={homeStyles["course-preview"]}>
              <img
                src={data.profilepic || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"}
                className={homeStyles.img12}
                alt="Profile"
              />
              <h3>{data.name} </h3>
              {/* <a href="#">
                View Profile <i className="fas fa-chevron-right"></i>
              </a> */}
            </div>
            <div className={homeStyles["course-info"]}>
              <div className={homeStyles["progress-container"]}>
                <h8>{item.tags}</h8>
              </div>
              <h6>
                <i className="fas fa-map-pin"></i> {data.currlocation}
              </h6>
              <h2>
                  {item.source}<i className="fas fa-exchange-alt"></i>
                 {item.destination}
              </h2>
              <div>
                <h6> <b>AGE: </b> {data && data.birthdate ? calculateAge(data.birthdate) : 'N/A'}</h6>
                <h6>
                      {" "}
                      <b>  DATE:</b>  {format(
                        new Date(item.datefrom),
                        "dd/MM/yyyy"
                      )} --- {format(new Date(item.dateto), "dd/MM/yyyy")}
                    </h6>
                    {item.itstop1 ||
                      item.itstop2 ||
                      item.itstop3 ||
                      item.itstop4 ||
                      item.itstop5 ||
                      item.itstop6 ? (
                        <h6>
                         <b> ITINERARY: </b> {" "}
                          {item.itstop1 && <span>{item.itstop1} -- </span>}
                          {item.itstop2 && <span>{item.itstop2} -- </span>}
                          {item.itstop3 && <span>{item.itstop3} -- </span>}
                          {item.itstop4 && <span>{item.itstop4} -- </span>}
                          {item.itstop5 && <span>{item.itstop5} -- </span>}
                          {item.itstop6 && <span>{item.itstop6} -- </span>}
                        </h6>
                      ) : null}
                <h6> <b>ACCOMMODATION PREFERENCE: </b> {item.accomodationpref}</h6>
                <h6> <b>TRAVEL TYPE:</b>  {item.traveltype}</h6>
                <h6><b>BUDGET:</b>  {item.budget}</h6>
                <div className={homeStyles.insta}>
                  <ul>
                    <li>
                      <a className={homeStyles.instagram} href="#">
                        <div className="icon">
                          <Link to={item.instahandle}>
                            <i className="fa fa-instagram"></i>
                          </Link>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                
              </div>
            </div>
          </div>
        ))
        ):(
          <p>No posts found.</p>
        )}
        </div>
      )}
      
  
    




             
              {selectedTab === 'liked' && (
                <div>
                  {likedPosts.map(post => (

              <div className={homeStyles["course"]}>
                <div className={homeStyles["course-preview"]}>
                  <img
                    src={post.postedBy.profilepic || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"}
                    className={homeStyles.img12}
                    alt="Profile"
                  />
                  <h3>{post.postedBy.name}</h3>
                  <Link to={`/userProfile/${post.postedBy._id}`}>
                          <a>
                            View Profile{" "}
                            <i className="fas fa-chevron-right"></i>
                          </a>
                        </Link>
                </div>
                <div className={homeStyles["course-info"]}>
                  <div className={homeStyles["progress-container"]}>
                  <h8>{post.tags}</h8>
                  </div>
                  <h6>
                    <i className="fas fa-map-pin"></i> {post.postedBy.currlocation}
                  </h6>
                  <h2>
                  {post.source} <i className="fas fa-route"></i>{" "}
                  {post.destination}
                  </h2>
                  <div>
                  <h6>AGE: {data && data.birthdate ? calculateAge(data.birthdate) : 'N/A'}</h6>
                  <h6>
                      {" "}
                      DATE: {format(
                        new Date(post.datefrom),
                        "dd/MM/yyyy"
                      )} --- {format(new Date(post.dateto), "dd/MM/yyyy")}
                    </h6>
                    {post.itstop1 ||
                      post.itstop2 ||
                      post.itstop3 ||
                      post.itstop4 ||
                      post.itstop5 ||
                      post.itstop6 ? (
                        <h6>
                          ITINERARY:{" "}
                          {post.itstop1 && <span>{post.itstop1} -- </span>}
                          {post.itstop2 && <span>{post.itstop2} -- </span>}
                          {post.itstop3 && <span>{post.itstop3} -- </span>}
                          {post.itstop4 && <span>{post.itstop4} -- </span>}
                          {post.itstop5 && <span>{post.itstop5} -- </span>}
                          {post.itstop6 && <span>{post.itstop6} -- </span>}
                        </h6>
                      ) : null}
                    <h6>ACCOMMODATION PREFERENCE: {post.accomodationpref}</h6>
                <h6>TRAVEL TYPE: {post.traveltype}</h6>
                <h6>BUDGET: {post.budget}</h6>
                    <div className={homeStyles.insta}>
                      <ul>
                        <li>
                          <a className={homeStyles.instagram} href="#">
                            <div className="icon">
                              <Link to={"item.instahandle"}>
                                <i className="fa fa-instagram"></i>
                              </Link>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                
                    {/* <button className={homeStyles.btn111}>+ Connect</button> */}
                  </div>
                </div>
              </div>
                  ))}
              
              </div>
              
              )}
             
           
            
             </div>
       
       
        
    </div>
  );
};
export default ViewProfile;
