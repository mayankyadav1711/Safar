import React, { useEffect, useState, useContext } from "react";
import "./viewProfile.css";
import { FaInstagram } from "react-icons/fa";

import homeStyles from "../components/home.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import "./userprofile.css";

const UserProfile=()=>{
  const {userid} = useParams()
  const [userProfile,setuserProfile] = useState(null)
  console.log(userid)

  useEffect(() => {
    fetch(`https://safarnamaaa-backend.vercel.app/userProfile/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setuserProfile(result)
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
  
    const profilePicUrl =
    "https://wallpapers.com/images/hd/aesthetic-boy-pictures-9t4nlikwk6kn19vu.jpg";
    
  return (
    <div className="bg88">
    <div className="userp">
      <div className="container-xl px-4 mt-4">
        <hr className="mt-0 mb-4" />
        <div className="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
            
              <div className="card-body text-center">
              {userProfile && userProfile.user && (
                <img
                  className="img-account-profile rounded-circle mb-2"

src={userProfile.user.profilepic || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"}                  alt=""
                />)}
                {/* <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div> */}
              </div>
             
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">User Details</div>
              <div className="card-body">
                <div className="mb-3">
                <div>
      {userProfile && userProfile.user && (
        <h6> <b>Name: </b>{userProfile.user.name}</h6>
      )}
    </div>
                </div>

                <div className="row gx-3 mb-3"></div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                  <div>
      {userProfile && userProfile.user && (
        <h6><b>Current City: </b>{userProfile.user.currlocation}</h6>
      )}
    </div>
                  </div>
                </div>
                <div className="mb-3">
                <div>
      {userProfile && userProfile.user && (
        <h6><b>Email: </b>{userProfile.user.email}</h6>
      )}
    </div>
                </div>

                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                  <div>
      {userProfile && userProfile.user && (
        <h6> <b>About Me: </b>{userProfile.user.aboutme}</h6>
      )}
    </div>
                  </div>
                  <div className="col-md-6">
                  <div>
      {userProfile && userProfile.user && (
       <h6><b>Birthdate: </b>{new Date(userProfile.user.birthdate).toLocaleDateString()}</h6>

      )}
    </div>
                  </div>
                  <div className="col-md-6 insta">
                  {/* <div>
      {userProfile && userProfile.user && (
        <h6>Instagram Handle:{userProfile.user.instahandle}</h6>
      )}
    </div> */}
                        <div className="icon">
                        {userProfile && userProfile.user && (
                          <Link to={userProfile.user.instahandle}>
                          <FaInstagram size={30}/>

                          </Link>
                          )}
                        </div>
                  </div>
                </div>
              
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
            
          />
          <label htmlFor="tab1" className="tab">
            POSTED
          </label>

       
         

          <span className="selector"></span>
        </div>
      </div>
      {/* Post Code */}

        <div className="spacingforpost">
        {userProfile && userProfile.posts && userProfile.posts.map(post => (    <div className={homeStyles["course"]} key={post._id}>
      <div className={homeStyles["course-preview"]}>
        <img
src={userProfile.user.profilepic || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"}            
className={homeStyles.img12}
          alt="Profile"
        />
        <h3>{post.postedBy.name} </h3>
    
      </div>
      <div className={homeStyles["course-info"]}>
        <div className={homeStyles["progress-container"]}>
          <h8>{post.tags}</h8>
        </div>
        <h6>
          <i className="fas fa-map-pin"></i> {userProfile.currlocation}
        </h6>
        <h2>
          {post.source} <i className="fas fa-exchange-alt"></i> {post.destination}
        </h2>
        <div>
        <h6> <b>AGE:</b> {userProfile && userProfile.birthdate ? calculateAge(userProfile.birthdate) : 'N/A'}</h6>
          <h6>
          
          <b> DATE:</b> {format(
                        new Date(post.datefrom),
                        "dd/MM/yyyy"
                      )} --- {format(new Date(post.dateto), "dd/MM/yyyy")}
           </h6>

          <h6><b>ITINERARY: </b></h6>
          <h6><b>ACCOMMODATION PREFERENCE: </b>{post.accommodationpref}</h6>
          <h6><b>TRAVEL TYPE: </b>{post.traveltype}</h6>
          <h6> <b>BUDGET:</b> {post.budget}</h6>
          <div className={homeStyles.insta}>
            <ul>
              <li>
                <a className={homeStyles.instagram} href="#">
                  <div className="icon">
                    <Link to={post.instahandle}>
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





             
              
              </div>
              </div>
  )
}

export default UserProfile