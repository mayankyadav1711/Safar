import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { UserContext } from "../App";
import { FaInstagram } from "react-icons/fa";

import homeStyles from "../components/home.module.css";
import { Link, useNavigate } from "react-router-dom";

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <div className={homeStyles.paginationbx}>
      <div className={homeStyles.pagibtn0}>
        <button1
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={homeStyles.butto}
        >
          PREVIOUS
        </button1>
        <span className={homeStyles.buttontxt}>{currentPage}</span>
        <button1
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={homeStyles.butto}
        >
          NEXT
        </button1>
      </div>
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [likedPosts, setLikedPosts] = useState([]);
  const [connectedPosts, setConnectedPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const navigate = useNavigate();

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

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  useEffect(() => {
    // Retrieve connectedPosts from local storage and update the state
    const storedConnectedPosts = JSON.parse(
      localStorage.getItem("connectedPosts")
    );
    if (storedConnectedPosts && storedConnectedPosts.length > 0) {
      setConnectedPosts(storedConnectedPosts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("connectedPosts", JSON.stringify(connectedPosts));
  }, [connectedPosts]);

  useEffect(() => {
    filterPosts();
  }, [searchInput, data]);

  const filterPosts = () => {
    const filtered = data.filter((item) => {
      const source = item.source.toLowerCase();
      const destination = item.destination.toLowerCase();
      const search = searchInput.toLowerCase();

      return source.includes(search) || destination.includes(search);
    });

    setFilteredPosts(filtered);
    setCurrentPage(1);
  };
  // Move the paginate function inside the Home component
  const paginate = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(reversedPosts.length / postsPerPage)
    ) {
      return; // Ignore invalid page numbers
    }
    setCurrentPage(pageNumber);
  };


  const handletop = () => {
    let mybutton = document.getElementById("myBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }


  const handleConnect = (postId, receiverEmail, currentPage) => {
    // Check if the post is already marked as connected
    if (connectedPosts.includes(postId)) {
      console.log(`Post ${postId} is already connected.`);
      return;
    }

    // Update the UI optimistically
    setConnectedPosts((prevConnectedPosts) => [...prevConnectedPosts, postId]);
    localStorage.setItem(
      "connectedPosts",
      JSON.stringify([...connectedPosts, postId])
    );
    setCurrentPage(currentPage);

    // Send data to the `/notifications` API to update the database
    const notification = {
      postId: postId,
      message: " connected with your post!",
      connectedBy: state._id, // Set the connectedBy field with the user who connected with the post
    };

    // Make the API call in the background
    fetch("/sendemail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);

        fetch("/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify(notification),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);

          })
          .catch((err) => {
            console.log(err);
            // Handle the error if needed
          });
      })
      .catch((err) => {
        console.log(err);
        // Handle the error if needed
        // Rollback the UI changes if required
        setConnectedPosts((prevConnectedPosts) =>
          prevConnectedPosts.filter((id) => id !== postId)
        );
        localStorage.setItem(
          "connectedPosts",
          JSON.stringify(connectedPosts.filter((id) => id !== postId))
        );
      });

    // Update the `item.connectedBy` array for the post
    setData((prevData) => {
      return prevData.map((item) =>
        item._id === postId ? { ...item, connectedBy: [...item.connectedBy, { _id: state._id }] } : item
      );
    });
  };

  const updatePostData = (postId, updatedPost) => {
    setData((prevData) => {
      const newData = prevData.map((item) =>
        item._id === postId ? { ...updatedPost } : item
      );
      return newData;
    });
  };

  const updateLikedPosts = (postId, isLiked) => {
    if (isLiked) {
      setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
    } else {
      setLikedPosts((prevLikedPosts) =>
        prevLikedPosts.filter((id) => id !== postId)
      );
    }
  };

  const removeNotification = (postId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.postId !== postId)
    );
  };

  const likePost = (id, currentPage) => {
    // Find the post in the currentPosts array
    const postIndex = currentPosts.findIndex((item) => item._id === id);
    if (postIndex === -1) {
      console.log("Post not found");
      return;
    }

    // Check if the post is already liked by the user
    if (currentPosts[postIndex].likes.some((user) => user._id === state._id)) {
      console.log("Post already liked by the user");
      return;
    }

    // Update the UI optimistically
    const updatedPosts = [...currentPosts];
    updatedPosts[postIndex].likes.push({ _id: state._id });
    updatePostData(id, { ...updatedPosts[postIndex] });
    updateLikedPosts(id, true);
    // setCurrentPage(currentPage); // Set the current page immediately

    // Find the user who liked the post
    const likedBy = state._id;

    const notification = {
      postId: id,
      message: " liked your post!",
      likedBy: likedBy,
    };

    // Make the API calls in the background
    Promise.all([
      fetch(`/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      }),
      fetch(`/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify(notification),
      }),
    ])
      .then(([likeRes, notificationRes]) => {
        if (!likeRes.ok) {
          throw new Error(likeRes.status);
        }
        if (!notificationRes.ok) {
          throw new Error(notificationRes.status);
        }
        return Promise.all([likeRes.json(), notificationRes.json()]);
      })
      .then(([likeResult, savedNotification]) => {
        console.log(likeResult); // Check the response from the server
        console.log(savedNotification); // Check the saved notification
        // No need to update the state here since it was already updated optimistically
        setCurrentPage(currentPage);
      })
      .catch((err) => {
        console.log(err);
        // Handle the error if needed
        // Rollback the UI changes if required
        updatePostData(id, { ...currentPosts[postIndex] });
        updateLikedPosts(id, false);
      });
  };

  const unlikePost = (id, currentPage) => {
    // Find the post in the currentPosts array
    const postIndex = currentPosts.findIndex((item) => item._id === id);
    if (postIndex === -1) {
      console.log("Post not found");
      return;
    }

    // Check if the post is already unliked by the user
    if (!currentPosts[postIndex].likes.some((user) => user._id === state._id)) {
      console.log("Post is not liked by the user");
      return;
    }

    // Update the UI optimistically
    const updatedPosts = [...currentPosts];
    const likeIndex = updatedPosts[postIndex].likes.findIndex(
      (user) => user._id === state._id
    );
    updatedPosts[postIndex].likes.splice(likeIndex, 1);
    updatePostData(id, { ...updatedPosts[postIndex] });
    updateLikedPosts(id, false);

    fetch(`/unlike`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((result) => {
        console.log(result); // Check the response from the server

        // Remove the notification from the notifications state
        removeNotification(id);
        setCurrentPage(currentPage);
      })
      .catch((err) => {
        console.log(err);
        // Handle the error if needed
        // Rollback the UI changes if required
        updatePostData(id, { ...currentPosts[postIndex] });
        updateLikedPosts(id, true);
      });
  };

  const reversedPosts = filteredPosts.slice().reverse();
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const profilePicUrl =
    "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png";

  return (
   
    <div >
      <section className={homeStyles.sec1}>
        <div
          className={`${homeStyles.bgimg}  ${homeStyles.sec2} w3-display-container w3-animate-opacity w3-text-white`}
        >
          <div className={homeStyles.navbtn}>
            <a href="#home" className={homeStyles.navbtn1}>
              Home
            </a>
            <Link to="/aboutus">
              <a href="" className={homeStyles.navbtn2}>
                About Us
              </a>
            </Link>

            <Link to="/contactus">
              <a href="" className={homeStyles.navbtn3}>
                Contact Us
              </a>
            </Link>


            <div className={homeStyles.wrapper}>
              {/*  <li className="sub-item">
              
      <section className={homeStyles.sec3}></section> 
                <span
                  className="material-icons-outlined"
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    navigate("/");
                  }}
                >
                  {" "}
                  logout{" "}
                </span>
                <p
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    navigate("/");
                  }}
                >
                  Logout
                </p>
                </li>*/}
              <Link to="/notification">
                <div className={homeStyles.container98}>
                  <i
                    className="item fas fa-bell"
                    style={{ fontSize: "40px", color: "black" }}
                  ></i>
                </div>
              </Link>
              <Link to="/viewProfile">
                <img
                  src={profile?.profilepic || profilePicUrl}
                  className={homeStyles["image--cover"]}
                />
              </Link>
            </div>
          </div>

          <div className={homeStyles.heading}>
            <p>Explore Safarnamaaa</p>
          </div>
          <div className="w3-display-middle miniheading">
            <h2 className="w3-animate-top ">
              Connect with like-minded people for your trip!
            </h2>
            
            <div className={homeStyles.bn40div}>
              <a
                href="#contact"
                className={`${homeStyles.btn} ${homeStyles.bn40}`}
                id="hovor1"
              ><Link to="/safarnamai">
                  {/*  <a>
                    <button className={homeStyles.buttono}>Safarnamaaa.AI</button>
                  </a>
                  */}

                  <button className={homeStyles.bqw}>
                    <span>Safarnamaaa.AI</span>
                  </button>
                </Link>
              </a>
            </div>
            <div className="w3-display-bottomleft w3-padding-large"></div>
          </div>
        </div>
      </section>

      <section>
        <div className={homeStyles.container}>
          <input
            type="text"
            placeholder="Search location or place..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className={homeStyles.search}></div>
        </div>
      </section>

      {/* 
      <section className={homeStyles.sec3}></section> */}

      <section className={homeStyles.sec4}>
        <p className={homeStyles.heading1}>
          "Explore the new era of Community Travel"
        </p>

        <div className={homeStyles["courses-container"]}>
          {currentPosts.length === 0 ? (
            <div>
              <h2>No Results Found</h2>
              <Link to="/createPost">
                {" "}
                <button> Create your own post </button>{" "}
              </Link>
            </div>
          ) : (
            currentPosts.map((item) => {
              const isPostLiked = likedPosts.includes(item._id);

              return (
                <div className={homeStyles["course"]}>
                  <div className={homeStyles["course-preview"]}>
                    <img
                      src={item.postedBy.profilepic || profilePicUrl}
                      className={homeStyles.img12}
                      alt="Profile"
                    />
                    {item.postedBy && (
                      <>
                        <h3>{item.postedBy.name}</h3>
                        <Link to={`/userProfile/${item.postedBy._id}`}>
                          <a>
                            View Profile{" "}
                            <i className="fas fa-chevron-right"></i>
                          </a>
                        </Link>
                      </>
                    )}
                  </div>
                  <div className={homeStyles["course-info"]}>
                    <div className={homeStyles["progress-container"]}>
                      <h8> {item.tags} </h8>
                    </div>
                    <h6>
                      <i className="fas fa-map-pin"></i> {item.postedBy.currlocation}
                    </h6>
                    <h2>
                      {item.source} <i className="fas fa-exchange-alt"></i>{" "}
                      {item.destination}
                    </h2>
                    <div>
                      <h6> <b>AGE: </b> 20</h6>
                      <h6>
                        {" "}
                        <b>  DATE: </b> {format(
                          new Date(item.datefrom),
                          "dd/MM/yyyy"
                        )}{" "}
                        --- {format(new Date(item.dateto), "dd/MM/yyyy")}
                      </h6>
                      {item.itstop1 ||
                        item.itstop2 ||
                        item.itstop3 ||
                        item.itstop4 ||
                        item.itstop5 ||
                        item.itstop6 ? (
                         <h6>
                        <b>  ITINERARY: </b>{" "}
                          {item.itstop1 && <span>{item.itstop1} -- </span>}
                          {item.itstop2 && <span>{item.itstop2} -- </span>}
                          {item.itstop3 && <span>{item.itstop3} -- </span>}
                          {item.itstop4 && <span>{item.itstop4} -- </span>}
                          {item.itstop5 && <span>{item.itstop5} -- </span>}
                          {item.itstop6 && <span>{item.itstop6} -- </span>}
                        </h6>
                      ) : null}

                      <h6> <b>ACCOMODATION PREFERENCE: </b> {item.accomodationpref}</h6>
                      <h6> <b>TRAVEL TYPE: </b>{item.traveltype}</h6>
                      <h6><b> BUDGET:</b> {item.budget}/-</h6>
                      <div className={`material-icons ${homeStyles.indiv0}`}>
                        <div className="indiv">
                          <div className={`material-icons ${homeStyles.like}`}>
                            {item.likes.some(
                              (user) =>
                                user._id.toString() === state._id.toString()
                            ) ? (
                              <i
                                className={`material-icons ${homeStyles.liked}`}
                                onClick={() =>
                                  unlikePost(item._id, currentPage)
                                }
                              >
                                favorite
                              </i>
                            ) : (
                              <i
                                className={`material-icons ${homeStyles.unliked}`}
                                onClick={() => likePost(item._id, currentPage)}
                              >
                                favorite_border
                              </i>
                            )}
                            <h1><b>LIKES: </b>{item.likes.length}</h1>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className={homeStyles.insta}>
                          {/* <a className={homeStyles.instagram} href="#"> */}
                          <div className={homeStyles.instaicon}>
                            <Link to={item.instahandle}>
                              <FaInstagram size={35} />
                            </Link>
                          </div>
                          {/* </a> */}
                        </div>
                        <button
                          className={`${homeStyles.btn111} ${connectedPosts.includes(item._id) || item.connectedBy.some(user => user._id === state._id)
                            ? homeStyles.connected
                            : ""
                            }`}
                          onClick={() => handleConnect(item._id, item.postedBy.email, currentPage)}
                        >
                          {item.connectedBy.some(user => user._id === state._id)
                            ? "Connected"
                            : "+ Connect"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
      <div className="pagination">
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={reversedPosts.length}
          currentPage={currentPage}
          paginate={paginate}
        />

      </div>

      <div className={homeStyles.paginationbx2}>
        <div className={homeStyles.paginationbx3}>
          <Link to="/createPost">
            <div className="item button-parrot">
              <button className={homeStyles.button70}>
                ADD POST!
                <div className={homeStyles.parrot}></div>
                <div className={homeStyles.parrot}></div>
                <div className={homeStyles.parrot}></div>
                <div className={homeStyles.parrot}></div>
                <div className={homeStyles.parrot}></div>
                <div className={homeStyles.parrot}></div>
              </button>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};
<div className="ypage">
  <button className="ypagwbutton">NEXT</button>
</div>;

export default Home;
