
import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import uimge from "../assets/user.png";
import { FcGoogle } from "react-icons/fc";
import { getComapanyUserEmails } from '../service/service';
import useUpdateEffect from '../hooks/useUpdateEffect';


function GoogleLogin() {
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState([]);
    const [allowedEmails, setAllowedEmails] = useState([]);
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
    const handleError = (error) => {
        setProfile('');
        setUser('');
        logOut();
        console.error(error);
    }
    useUpdateEffect(() => {
        const companyNameId = sessionStorage.getItem('EncryptedUser') && JSON.parse(sessionStorage.getItem('EncryptedUser'));
        const fetchData = async () => {
            try {
                const res = await getComapanyUserEmails(companyNameId);
                setAllowedEmails(res.emails);
                console.log(res.emails);
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        try {

            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        const userData = res.data;
                        const userEmail = userData.email;
                        if (allowedEmails.length === 0 && !allowedEmails) {
                            handleError({ message: 'Unauthorized: You are not authorized to login.' });
                            setToast({ message: "Please try again", color: "#FFCCCC", textColor: "#C00" });
                            return;
                        }
                        if (allowedEmails.includes(userEmail)) {
                            setToast({ message: "Login Successfully", color: "#99ff99", textColor: "#060" });
                            setProfile(userData);
                        } else {
                            handleError({ message: 'Unauthorized: You are not authorized to login.' });
                            setToast({ message: "Wrong credentials", color: "#FFCCCC", textColor: "#C00" });
                            return;
                        }
                    })
                    .catch((err) => handleError(err));
            }
        } catch (error) {
            handleError(error)
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        handleClickAway();
        setProfile(null);
    };
  const [toast, setToast] = useState({message: '',color: '',textColor:"" });

    function handleClickAway() { setToast({ message: '', color: '', textColor: "" }) }
      function errorMessage({ message , color,textColor}) {
    return(
      <div className="toast-error-message" onClick={handleClickAway} style={{background: color,color:textColor}}>{message}</div>
      )
  }
    return (
        <div className="page-view manual dp-flex-end ">
      {errorMessage(toast)}

            <div className="Login-box">
                <div className="Login-head-text-container">
                    <h1 className="login-text head">Welcome Back!</h1>
                    <h1 className="login-text subhead">Login to Continue</h1>
                </div>
                {profile ? (
                    <>
                        {profile.picture &&
                            <div className="img">
                                <img id="google-profile" onError={(e) => e.target.style.display = 'none'} src={profile.picture} alt="Login image" />
                            </div>
                        }

                        <h1 className="login-text head">{profile.name}</h1>
                        <h1 className="login-text subhead bold">{profile.email}</h1>
                        <br />
                        <button className="manual-login-btn" onClick={logOut}>Logout</button>
                    </>
                ) : (
                    <>
                        <div className="img">
                            <img src={uimge} alt="Login image" />
                        </div>
                        <button className="manual-login-btn" onClick={login}>Sign in with Google <span className='google-icon'><FcGoogle /></span> </button>
                    </>
                )}
            </div>
        </div>
    );
}
export default GoogleLogin;