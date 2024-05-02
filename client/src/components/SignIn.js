import React, { useEffect, useState, useContext } from 'react';
import handlesignin from './handlesignin';
import signinStyle from './signin.module.css';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import video from '../components/images/aa.mp4';

const Signin = () => {
  const [showVideo, setShowVideo] = useState(true);

  

  useEffect(() => {
    const durationInSeconds = 5; // Set the duration in seconds
    const hideVideoTimeout = setTimeout(() => {
      setShowVideo(false);
    }, durationInSeconds * 1000);

    return () => clearTimeout(hideVideoTimeout);
  }, []);

  useEffect(() => {
    handlesignin();
  }, []);

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const PostData = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('emailllllllllllllllll');
      // M.toast({html: "Enter Valid Email!!",classes:"redtoast"})
      toast.error('Enter Valid Email!!');
      return;
    }
    fetch('https://safarnamaaa-backend.vercel.app/signup', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          navigate(handlesignin());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  const GetData = () => {
    fetch('https://safarnamaaa-backend.vercel.app/signin', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          toast.error(data.error);
        } else {
          localStorage.setItem('jwt', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: 'USER', payload: data.user });
          toast.success('Successfully SignedIn!!');
          navigate('/home');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
   
    <div className={signinStyle.maindiv}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <h5> Welcome to Safarnamaaa</h5>
    <div className={signinStyle.eyobg}>
      
        <div className={signinStyle.containersjd} id="container">
        <div
          className={`${signinStyle['form-containersjd']} ${signinStyle['sign-up-containersjd']}`}
         
        >
            <h1 className={signinStyle.h1sjd}>Create Account!</h1>
            <div
              className={`${signinStyle['social-containersjd']} ${signinStyle['asjd']}`}
            >
              <a href="#" className={signinStyle['social']}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className={`${signinStyle['social']} ${signinStyle['asjd']}`}
              >
                <i className="fab fa-google-plus-g"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button  onClick={() => PostData()}>Sign Up</button>
          </div>

          <div
            className={`${signinStyle['form-containersjd']} ${signinStyle['sign-in-containersjd']}`}
            
          >
            <h1 className={signinStyle.h1sjd}>Sign in</h1>
            <div className={signinStyle['social-containersjd']}>
              <a
                href="#"
                className={`${signinStyle['social']} ${signinStyle['asjd']}`}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className={`${signinStyle['social']} ${signinStyle['asjd']}`}
              >
                <i className="fab fa-google-plus-g"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link to="/reset">
              {' '}
              <a className={signinStyle.asjd}>Forgot your password?</a>
              <br />{' '}
            </Link>
            <button onClick={() => GetData()} >Sign In</button>

          </div>

          <div className={signinStyle['overlay-containersjd']}>
            <div className={signinStyle['overlay']}>
              <div
                className={`${signinStyle['overlay-panel']} ${signinStyle['overlay-left']}`}
              >
                <h1 className={signinStyle.h1sjd}>Welcome Back!</h1>
                <p className={signinStyle.psjd}>
                 You can now login directly right here, SIGN IN
                </p>
                <button className={signinStyle['ghost']}  id="signIn">
                  Sign In
                </button>
              </div>
              <div
                className={`${signinStyle['overlay-panel']} ${signinStyle['overlay-right']}`}
              >
                <h1 className={signinStyle.h1sjd}>Hey, Pal</h1>
                <p className={signinStyle.psjd}>
                  {' '}
                 You can now create your account within 30 seconds, Create now!
                
                  
                </p>
                <h6> Don't have an account?</h6>
                <button className={signinStyle['ghost']} id="signUp">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default Signin;