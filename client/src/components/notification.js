import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { UserContext } from "../App";
import "./notification.css";
import { Link } from "react-router-dom";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState(null);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/myprofile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.profile);
      });
  }, []);

  useEffect(() => {
    // Fetch all notifications
    fetch("/notifications", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setNotifications(data.notifications ?? []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log("Notifications state:", notifications);
  const profilePicUrl =
    "https://wallpapers.com/images/hd/aesthetic-boy-pictures-9t4nlikwk6kn19vu.jpg";

  // Filter out notifications where the current logged-in user is the 'likedBy' user
  const filteredNotifications = notifications.filter(
    (notification) =>
      !notification.likedBy || notification.likedBy._id !== (data?.user?._id || data?._id)
  );

  return (
    <div className="background91">
      <Link to="/home">
        <div class="homebutton">
          <a href="/">Home</a>
        </div>
      </Link>

      <section className="section-50">
        <div className="container">
          <h3 className="m-b-50 heading-line">
            Notifications <i className="fa fa-bell text-muted"></i>
          </h3>

          <div className="notification-ui_dd-content">
            {filteredNotifications.map((notification) => (
              <div
                className={`notification-list ${!notification.isRead ? "notification-list--unread" : ""
                  }`}
                key={notification._id}
              >
                <div className="notification-list_content">
                  <div className="notification-list_img">
                    {notification.likedBy ? (
                      <Link to={`/userProfile/${notification.likedBy._id}`}>
                        <img
                          src={notification.likedBy?.profilepic || profilePicUrl}
                          alt="user"
                        />
                      </Link>
                    ) : (
                      <Link to={`/userProfile/${notification.post.postedBy._id}`}>
                        <img
                          src={notification.post?.postedBy?.profilepic || profilePicUrl}
                          alt="user"
                        />
                      </Link>

                    )}
                  </div>
                  <div className="notification-list_detail">
                    <p>
                      <b>
                        {notification.likedBy
                          ? notification.likedBy.name
                          : "Looks like you've totally liked someone's post!"}
                      </b>{" "}
                      {/* {notification.message} */}
                      {notification.likedBy
                        ? notification.message
                        : null}
                    </p>
                    <p className="text-muted">
                      <small>
                        {format(
                          new Date(notification.createdAt),
                          "hh:mm a"
                        )}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notification;
