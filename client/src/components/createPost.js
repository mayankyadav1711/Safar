import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../App'
import "./createPost.css";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaInstagram } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import createPostStyles from './createPost.css'

// import 'jquery-ui/ui/widgets/datepicker';

const CreatePost = () => {
  const { state, dispatch } = useContext(UserContext)

  const navigate = useNavigate();
  const [source, setsource] = useState("");
  const [destination, setdestination] = useState("");
  const [itstop1, setitstop1] = useState("");
  const [itstop2, setitstop2] = useState("");
  const [itstop3, setitstop3] = useState("");
  const [itstop4, setitstop4] = useState("");
  const [itstop5, setitstop5] = useState("");
  const [itstop6, setitstop6] = useState("");
  const [datefrom, setdatefrom] = useState(null);
  const [dateto, setdateto] = useState(null);
  const [traveltype, settraveltype] = useState("");
  const [accomodationpref, setaccomodationpref] = useState("");
  const [budget, setbudget] = useState(0);
  const [needhelp, setneedhelp] = useState("");
  const [tags, settags] = useState("");
  const [instahandle, setinstahandle] = useState("");
  const [profile, setProfile] = useState(null);
  const [instaHandleError, setInstaHandleError] = useState('');

  //extra
  const [inputErrors, setInputErrors] = useState({
    source: "",
    destination: "",
    itstop1: "",
    itstop2: "",
    itstop3: "",
    itstop4: "",
    itstop5: "",
    itstop6: "",
    datefrom: "",
    dateto: "",
    traveltype: "",
    accomodationpref: "",
    budget: "",
    needhelp: "",
    tags: "",
    instahandle: "",
  });

  //extra end





  useEffect(() => {
    // Fetch user profile details
    fetch("https://safarnamaaa-backend.vercel.app/myprofile", {
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

  const handleDateFromChange = (date) => {
    setdatefrom(date);
  };

  const handleDateToChange = (date) => {
    setdateto(date);
  };
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleInstaHandle = (e) => {
    const handle = e.target.value;
    setinstahandle(handle);
    const regex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/;
    if (regex.test(handle)) {
      setInstaHandleError("");
    } else {
      setInstaHandleError("Please enter a valid Instagram handle link");
    }
  };
  
  

  const [rangeValue, setRangeValue] = useState(0);

  const handleRangeSlide = (event) => {
    const value = event.target.value;
    setRangeValue(value);
  };

  const postDetails = () => {
    const errors = {};
    let hasErrors = false;

    if (!source) {
      errors.source = "Source is required";
      hasErrors = true;
    }
    if (!datefrom) {
      errors.datefrom = "Date From is required";
      hasErrors = true;
    }
    if (!dateto) {
      errors.dateto = "Date To is required";
      hasErrors = true;
    }
    if (!traveltype) {
      errors.traveltype = "Travel Type is required";
      hasErrors = true;
    }
    if (!accomodationpref) {
      errors.accomodationpref = "Accomodation Preference is required";
      hasErrors = true;
    }
    if (!budget) {
      errors.budget = "Budget is required";
      hasErrors = true;
    }
    if (!needhelp) {
      errors.needhelp = "This is required";
      hasErrors = true;
    }
    if (!tags) {
      errors.tags = "Tags is required";
      hasErrors = true;
    }
    if (!instahandle) {
      errors.instahandle = "Insta Handle is required";
      hasErrors = true;
    }
    let instatoast = false;
    // Repeat the above pattern for each input field
    if (instaHandleError) {
      errors.instahandle = "Please enter a valid Instagram handle link";
      instatoast = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setInputErrors(errors);
      if(instatoast){
        toast.error("Please enter valid Instagram handle link");
      }
      else{
        toast.error("Please fill in all the required fields");
      }
      
      return;
    }





    fetch("https://safarnamaaa-backend.vercel.app/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        source,
        destination,
        itstop1,
        itstop2,
        itstop3,
        itstop4,
        itstop5,
        itstop6,
        datefrom,
        dateto,
        traveltype,
        accomodationpref,
        budget,
        needhelp,
        tags,
        instahandle,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {

          toast.success('Post Created Succesfully');
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const profilePicUrl =
    "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars.png";
  return (
    <div >
      <section className="sec867">
     
       
      </section>

      <section>
        <div className="courses-container ">
          <div className="course">
            <div className="course-preview">
              <img src={profile?.profilepic || profilePicUrl} className="img12" />
              {/* <h3>{state?state.name:"loading"}</h3> */}
              <h3>{profile?.name || "User"}</h3>

              <Link to="/editProfile">
                <a href="#">
                  Edit Profile <i className="fas fa-chevron-right"></i>
                </a>
              </Link>

            </div>

            {/* <form className="center"> */}
            <div className="course-info center">
              <h6><i className="fas fa-map-pin"></i> {profile?.currlocation} </h6>

              <div className="inputbox">
                <input
                  type="text"
                  required="required"
                  placeholder="From"
                  value={source}
                  onChange={(e) => setsource(e.target.value)}
                />
                {inputErrors.source && <span className="error">{inputErrors.source}</span>}
              </div>

              <div className="inputbox">
                <input
                  type="text"
                  required="required"
                  placeholder="To"
                  value={destination}
                  onChange={(e) => setdestination(e.target.value)}
                />
                {inputErrors.destination && <span className="error">{inputErrors.destination}</span>}
              </div>

              {/* <div>
                   <input type="number" required="required" placeholder="Age" />
               
                </div> */}
              <h6 className="itnerary"> ITNERARY: (optional)</h6>
              <div className="stops">
                <input
                  type="text"
                  id="Stop-1"
                  name="Stop-1"
                  placeholder="Stop-1"
                  value={itstop1}
                  onChange={(e) => setitstop1(e.target.value)}
                />
                <input
                  type="text"
                  id="Stop-2"
                  name="Stop-2"
                  placeholder="Stop-2"
                  value={itstop2}
                  onChange={(e) => setitstop2(e.target.value)}
                />
                <input
                  type="text"
                  id="Stop-3"
                  name="Stop-3"
                  placeholder="Stop-3"
                  value={itstop3}
                  onChange={(e) => setitstop3(e.target.value)}
                />
                <input
                  type="text"
                  id="Stop-4"
                  name="Stop-4"
                  placeholder="Stop-4"
                  value={itstop4}
                  onChange={(e) => setitstop4(e.target.value)}
                />
                <input
                  type="text"
                  id="Stop-5"
                  name="Stop-5"
                  placeholder="Stop-5"
                  value={itstop5}
                  onChange={(e) => setitstop5(e.target.value)}
                />
                <input
                  type="text"
                  id="Stop-6"
                  name="Stop-6"
                  placeholder="Stop-6"
                  value={itstop6}
                  onChange={(e) => setitstop6(e.target.value)}
                />
              </div>

              {/* <div>
                  <tr>
                    <td>
                    <div className="picker">
                            <label htmlFor="fromperiod">From</label>
                            <input type="text" id="fromperiod" name="from" value={datefrom}
                  onChange={(e)=>setdatefrom(e.target.value)} />

                            <label htmlFor="toperiod">To</label>
                            <input type="text" id="toperiod" name="to" value={dateto}
                  onChange={(e)=>setdateto(e.target.value)} />
                    </div>
                    </td>
                  </tr>
                </div> */}

              <div className="dateform">
                <h3>Tentative Dates </h3>
                <label htmlFor="datefrom"> From:</label>
                <DatePicker
                  selected={datefrom}
                  onChange={handleDateFromChange}
                  selectsStart
                  startDate={datefrom}
                  endDate={dateto}
                  dateFormat="dd/MM/yyyy"

                />
                {inputErrors.datefrom && <span className="error">{inputErrors.datefrom}</span>}
                <label htmlFor="dateto"> To:</label>
                <DatePicker
                  selected={dateto}
                  onChange={handleDateToChange}
                  selectsEnd
                  startDate={datefrom}
                  endDate={dateto}
                  dateFormat="dd/MM/yyyy"

                />
                {inputErrors.dateto && <span className="error">{inputErrors.dateto}</span>}
              </div>

              <div>
                <label for="lang" className="lang">
                  Travel Type
                </label>
                <select
                  name="languages"
                  id="tt"
                  value={traveltype}
                  onChange={(e) => settraveltype(e.target.value)}
                >
                  <option value="">Select Travel Type</option>
                  <option value="Pocket Friendly">High-End Travel </option>
                  <option value="Lavish Travel">Low-End Travel </option>
                </select>
                {inputErrors.traveltype && <span className="error">{inputErrors.traveltype}</span>}
              </div>

              <div>
                <label for="lang" className="lang">
                  Accomodation preference
                </label>
                <select
                  name="languages"
                  id="ap"
                  value={accomodationpref}
                  onChange={(e) => setaccomodationpref(e.target.value)}
                >
                  <option value="">Select Accomodation Preference</option>
                  <option value="Dormitory">Dormitory</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Homestay">Homestay</option>
                  <option value="GuestHouse">GuestHouse</option>
                  <option value="Villas">Villas</option>
                </select>
                {inputErrors.accomodationpref && <span className="error">{inputErrors.accomodationpref}</span>}
              </div>

              <div >

                <span id="rangeValue"> BUDGET : <i className="fas fa-rupee"></i>{rangeValue} </span>
                <input

                  className="range"
                  step="1000"
                  type="range"
                  name=""
                  required=""
                  value={budget}
                  min="0"
                  max="50000"
                  onChange={(e) => {
                    handleRangeSlide(e);
                    setbudget(e.target.value);
                  }}
                  onMouseMove={handleRangeSlide}
                />
                {inputErrors.budget && <span className="error">{inputErrors.budget}</span>}
              </div>

              <div>
                <label for="lang" className="lang">
                  Do Safarnamaaa help you to plan your trip?
                </label>
                <select
                  name="languages"
                  id="lang"
                  value={needhelp}
                  onChange={(e) => setneedhelp(e.target.value)}
                >
                  <option value="">Choose</option>
                  <option value="yes">YES!</option>
                  <option value="maybe">MAY BE</option>
                  <option value="nope">NAHH</option>
                </select>
                {inputErrors.needhelp && <span className="error">{inputErrors.needhelp}</span>}
              </div>

              <div><h6> Add Tags : </h6>
                <input className="input1"
                  type="text "
                  placeholder="#Adventure   #Exploring   #Solo "
                  value={tags}
                  onChange={(e) => settags(e.target.value)}
                />
                {inputErrors.tags && <span className="error">{inputErrors.tags}</span>}
              </div>
              <div>
                <h6> Add Insta handle: </h6>
                <input
                  className="input1"
                  type="text"
                  required
                  placeholder="Add your Instagram Handle Link"
                  value={profile?.instahandle || instahandle}
                  onChange={handleInstaHandle}
                  title="Please enter a valid Instagram handle link"
                />
                {instaHandleError && <span className="error">{instaHandleError}</span>}
              </div>



              <ul>
                <li>
                  {/* <a className="instagram" href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <i className="fa fa-instagram" aria-hidden="true"></i>
          </a>  */}
                  {/* <input
                      type="text"
                      placeholder="add your insta handle link for connection"
                    /> */}
                </li>
              </ul>

              <button className="btn111" onClick={() => postDetails()}>
                POST
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatePost;
