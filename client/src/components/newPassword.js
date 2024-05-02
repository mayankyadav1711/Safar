import React, { useEffect,useState,useContext } from 'react'
import signinStyle from './signin.module.css'
import {Link,useNavigate,useParams} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const NewPass = () =>{
    
    const navigate=useNavigate();
    const[name,setName] = useState("")
    const[password,setPassword] = useState("")
    const[email,setEmail] = useState("")
    const {token} = useParams()


    const PostData = () =>{

       
        fetch("https://safarnamaaa-backend.vercel.app/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
                
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
            toast.error(data.error);
           }
           else{
            toast.success(data.message);
           
           }
        }).catch(err=>{
            console.log(err)
        })
    
    }


    return(

        
        
        <div className={signinStyle.containersjd} id="container">

    
        <div className={`${signinStyle['form-containersjd']} ${signinStyle['sign-in-containersjd1']}`}>
          <h1 className={signinStyle.h1sjd}>Change Password</h1>
       
          
          <input type="password" placeholder="New Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
     
          <button onClick={()=>PostData()}>Update Password</button>
          <Link to="/"> <a  className={signinStyle.asjd}>Click here to Login</a> </Link>
        </div>
  
       
      </div>
    )
}

export default NewPass