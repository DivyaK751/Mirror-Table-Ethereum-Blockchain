import { GoogleLogin } from 'react-google-login';

const clientId = "1074180487968-jg0sbt8361t36bsf0ladqi4hd7tti3mv.apps.googleusercontent.com";

function O_Auth(){

    const onSuccess = (res) =>{
      console.log("login successful! current user: ", res.profileObj);
    }

    const onFailure = (res) =>{
        console.log("login failed!", res);
      }

    return(
        <div id="signInButton">
        <GoogleLogin
        clientId={clientId}
        buttonText = "Sign in with Google"
        onSuccess = {onSuccess}
        onFailure = {onFailure}
        cookiePolicy = {'single_host_origin'}
        // isSignedIn = {true}
        />
        </div>
    )
}

export default O_Auth;