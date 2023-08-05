import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import "./editProfile.css";
import M from "materialize-css";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const [name, setname] = useState(state?.name || "");
  const [email, setemail] = useState(state?.email || "");

  const [profilepic, setprofilepic] = useState("");
  const [currlocation, setcurrlocation] = useState("");
  const [aboutme, setaboutme] = useState("");
  const [birthdate, setbirthdate] = useState(null);
  const [instahandle, setinstahandle] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [instagramUrl, setInstagramUrl] = useState("");
  const [isValidInstagramUrl, setIsValidInstagramUrl] = useState(true);
  const [profile, setProfile] = useState(null);

  const [nameError, setNameError] = useState(false);
  const [currlocationError, setCurrLocationError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [aboutmeError, setAboutMeError] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);
  const [instahandleError, setInstahandleError] = useState(false);

  useEffect(() => {
    fetch("/myprofile", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const profile = data.profile;
        const birthdate = parseISO(new Date(profile.birthdate).toISOString());

        const profileImageUrl = profile.profilepic;
        setImageUrl(profileImageUrl);
        setname(profile.name);
        setemail(profile.email);
        setprofilepic(profile.profilepic);
        setcurrlocation(profile.currlocation);
        setaboutme(profile.aboutme);
        setbirthdate(birthdate);
        setinstahandle(profile.instahandle);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleUploadClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.addEventListener("change", handleFileSelected);
    fileInput.click();
  };

  const handleFileSelected = (event) => {
    const selectedFile = event.target.files[0];
    setprofilepic(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setImageUrl(imageUrl);
  };
  useEffect(() => {
    if (state) {
      setname(state.name);
      setemail(state.email);
      const storedImageUrl = localStorage.getItem("profileImageUrl");
      if (storedImageUrl) {
        setImageUrl(storedImageUrl);
      }
    }
  }, [state]);
  useEffect(() => {
    // Retrieve the previously uploaded photo from local storage or any other data source
    const previouslyUploadedPhoto = localStorage.getItem("profilePhoto");

    // Set the imageUrl state variable with the retrieved value
    if (previouslyUploadedPhoto) {
      setImageUrl(previouslyUploadedPhoto);
    }
  }, []);

  const handleBirthdayChange = (date) => {
    const parsedDate = parseISO(date.toISOString());
    setbirthdate(parsedDate);
    setBirthdateError(false);
  };
  const handleAboutChange = (event) => {
    const { value } = event.target;
    setaboutme(value);
    setAboutMeError(false);
  };
  const handleInstagramUrlChange = (event) => {
    const { value } = event.target;
    setinstahandle(value);
    validateInstagramUrl(value);
    setInstahandleError(false);
  };

  const validateInstagramUrl = (url) => {
    // Regular expression to match the Instagram profile URL format
    const regex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/;
    const isValid = regex.test(url);
    setIsValidInstagramUrl(isValid);
  };

  const editProfile = () => {
    setNameError(false);
    setCurrLocationError(false);
    setEmailError(false);
    setAboutMeError(false);
    setBirthdateError(false);
    setInstahandleError(false);
    if (state) {
      if (!name) {
        setNameError(true);
        return;
      }
      if (!currlocation) {
        setCurrLocationError(true);
        return;
      }
      if (!email) {
        setEmailError(true);
        return;
      }
      if (!aboutme) {
        setAboutMeError(true);
        return;
      }
      if (!birthdate) {
        setBirthdateError(true);
        return;
      }
      if (!instahandle) {
        setInstahandleError(true);
        return;
      }
    }

    const data = new FormData();
    data.append("file", profilepic);
    data.append("upload_preset", "safarnaama");
    data.append("cloud_name", "dbsefjja3");

    fetch("https://api.cloudinary.com/v1_1/dbsefjja3/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        const imageUrl = data.url;
        const updatedUserData = { ...state, profilepic: imageUrl };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        dispatch({ type: "UPDATEPIC", payload: imageUrl });
        localStorage.setItem("profileImageUrl", imageUrl);

        setImageUrl(imageUrl);
        fetch("/editprofile", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            _id: state._id,
            name,
            email,
            profilepic: imageUrl,
            currlocation,
            aboutme,
            birthdate,
            instahandle,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              toast.error(data.error);
            } else {
              toast.success('Profile Updated Sucessfully!');
              setname(data.name); // Update name using server response
              setemail(data.email);
              navigate("/home");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="xbox">
      <div className="container-xl px-4 mt-4">
        <hr className="mt-0 mb-4" />
        <div className="row">
          <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
              <div className="card-header">Profile Picture</div>
              <div className="card-body text-center">
                <img
                  className="img-account-profile rounded-circle mb-2"
                  src={imageUrl || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png"}
                  alt="Profile"
                />
                <div className="small font-italic text-muted mb-4">
                  JPG or PNG no larger than 5 MB
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUploadClick}
                >
                  Upload new image
                </button>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <div className="card mb-4">
              <div className="card-header">Account Details</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="small mb-1" for="inputUsername">
                    Username (how your name will appear to other users on the
                    site)
                  </label>
                  <input
                    className={`form-control ${nameError ? "is-invalid" : ""}`}
                    id="inputUsername"
                    type="text"
                    placeholder="Enter the Name"
                    value={name}
                    required
                    onChange={(e) => {
                      setname(e.target.value);
                      setNameError(false);
                    }}
                  />
                  {nameError && (
                    <div className="invalid-feedback">Name is required</div>
                  )}{" "}
                </div>
                <div className="row gx-3 mb-3"></div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" for="inputLocation">
                      {" "}
                      Current City
                    </label>
                    <input
                      className={`form-control ${
                        currlocationError ? "is-invalid" : ""
                      }`}
                      id="inputLocation"
                      type="text"
                      placeholder="Enter your current location"
                      value={currlocation}
                      onChange={(e) => {
                        setcurrlocation(e.target.value);
                        setCurrLocationError(false);
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="small mb-1" for="inputEmailAddress">
                    Email address
                  </label>
                  <input
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    id="inputEmailAddress"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => {
                      setemail(e.target.value);
                      setEmailError(false);
                    }}
                  />
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputAbout">
                      About Yourself
                    </label>
                    <input
                      className={`form-control ${
                        aboutmeError ? "is-invalid" : ""
                      }`}
                      id="inputAbout"
                      type="text"
                      placeholder="Write some words about yourself"
                      maxLength={150} // Set the maximum character limit to 150
                      value={aboutme}
                      onChange={handleAboutChange}
                    />
                    <small className="text-muted">
                      {aboutme && `${aboutme.length}/150 characters`}
                    </small>
                  </div>
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputBirthday">
                      Birthday
                    </label>
                    <DatePicker
                      className={`form-control ${
                        birthdateError ? "is-invalid" : ""
                      }`}
                      id="inputBirthday"
                      selected={birthdate}
                      onChange={handleBirthdayChange}
                      placeholderText="Enter your birthday"
                      dateFormat="dd/MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={10} // Number of years to show in the year dropdown
                      minDate={new Date(1900, 0, 1)} // Minimum selectable date
                      maxDate={new Date()}
                    />
                  </div>
                  <div className="col-md-6 insta">
                    <label className="small mb-1" htmlFor="inputLastName">
                      <i className="fa fa-instagram" aria-hidden="true"></i>
                    </label>
                    <input
                      className={`form-control ${
                        !isValidInstagramUrl ? "is-invalid" : ""
                      }`}
                      id="inputLastName"
                      type="text"
                      placeholder="Enter your Instagram profile URL"
                      value={instahandle}
                      onChange={handleInstagramUrlChange}
                    />
                    {!isValidInstagramUrl && (
                      <div className="invalid-feedback">
                        Please enter a valid Instagram profile URL.
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => editProfile()}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
