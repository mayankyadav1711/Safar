import React,{useEffect,createContext,useReducer, useContext} from 'react';
import Navbar from './components/Navbar'
import Footer from './components/footer'
import './App.css'
import { BrowserRouter,Route,Routes,useNavigate } from 'react-router-dom';
import Signin  from './components/SignIn';
import CreatePost from './components/createPost'
import Home from './components/homepage'
import ViewProfile from './components/viewProfile'
import EditProfile from './components/editProfile'
import UserProfile from './components/userProfile'
import Notification from './components/notification'
import {reducer,initialState} from './reducers/userReducer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reset from './components/reset';
import NewPass from './components/newPassword';
import AboutUs from './components/aboutUs';
import Contactus from './components/contactUs';
import BackgroundPage from './components/safarnamaAI';


export const UserContext = createContext()

const Routing = ()=>{
  const navigate = useNavigate()
  const{state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
    else{
      if (!window.location.pathname.startsWith('/reset'))   
         navigate('/')
    }
  },[])
  return(
    <>
            <Routes>
                <Route exact path="/" element={<Signin />} />
                <Route path="/home" element={<Home />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/viewProfile" element={<ViewProfile />} />
                <Route path="/editProfile" element={<EditProfile />} />
                <Route path="/userProfile/:userid" element={<UserProfile />} />
                <Route path="/notification" element={<Notification />} />
                <Route exact path="/reset" element={<Reset />} />
                <Route exact path="/aboutus" element={<AboutUs />} />
                <Route exact path="/contactus" element={<Contactus />} />
                <Route exact path="/safarnamai" element={<BackgroundPage />} />
                <Route path="/reset/:token" element={<NewPass />} />
            </Routes>
    </>      
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
      <Footer/>
      <ToastContainer />
   </BrowserRouter>
   </UserContext.Provider>
   
  );
}

export default App;
