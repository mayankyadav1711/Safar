import React, { useEffect,useState,useContext } from 'react'
import signinStyle from './signin.module.css'
import {Link,useNavigate} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reset = () =>{
    
        
   
        const navigate=useNavigate();


        const[email,setEmail] = useState("")
    
           
      
    
        const GetData = () =>{
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
             
              toast.error('Enter Valid Email!!');
              return 
            }
            fetch("/reset-password",{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    
                    email
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
               if(data.error){
                toast.error(data.error);
               }
               else{
             
                toast.success(data.message);
                navigate('/');
               }
            }).catch(err=>{
                console.log(err)
            })
    
        }
        return(
    
            
            
    <div className={signinStyle.containersjd} id="container">

    
          <div className={`${signinStyle['form-containersjd']} ${signinStyle['sign-in-containersjd1']}`}>
            <h1 className={signinStyle.h1sjd}>Forgot Password</h1>
         
            
            <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          
       
            <button onClick={() => GetData()} >Reset Password</button>
          </div>
    
         
        </div>
        )
    }
export default Reset