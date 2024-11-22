import { GoogleLogin } from '@leecheuk/react-google-login';
import { BrowserRouter,Routes,Route , useNavigate} from 'react-router-dom';
import axios from '../api/axios';
import { useRef, useState, useEffect } from "react";

const clientId = "1074180487968-jg0sbt8361t36bsf0ladqi4hd7tti3mv.apps.googleusercontent.com";
function Login(props){
  const navigate = useNavigate();
  const handleRoles= () =>{
    if(props.role == "Investor")
        navigate('/investor'); 
    else if(props.role == "Lead Investor")
        navigate('/investor'); 
    else if(props.role == "Trustee")
        navigate('/trustee'); 
    else if(props.role == "Company")
        navigate('/company'); 
  }; 
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState('');

    const onSuccess = async (e) =>{
      const {wallet_addr,role} = props
      var email =  e.profileObj.email;
      var name =  e.profileObj.name;
      const REGISTER_URL="http://localhost:5000/web2/login/postLoginData";
      try {
        const response = await axios.post(REGISTER_URL,
          JSON.stringify({name,email,wallet_addr,role}),
          {
              headers: { 'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' },
          }
      );
      const res=JSON.stringify(response?.data.msg);
      setSuccess(res);
      console.log(res);
      handleRoles()
      } catch (err) {
        
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
            setErrMsg('Failed');
        } else {
            setErrMsg('Failed')
        }
        errRef.current.focus()
        }
    }
    const onFailure = (res) =>{
        console.log("login failed!", res);
      }
    return(
      <div>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <p ref={errRef} className={success ? "success" : "offscreen"} aria-live="assertive">{success}</p>
      
      <div id="signInButton">
        <GoogleLogin
        clientId={clientId}
        buttonText = "Sign in with Google"
        onSuccess = {onSuccess}
        onFailure = {onFailure}
        cookiePolicy = {'single_host_origin'}
        isSignedIn = {false}
        />
        </div>
      </div>
    )
}
 export default Login;