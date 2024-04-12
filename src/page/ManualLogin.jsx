import React, { useEffect, useState } from "react";
import uimge from "../assets/user.png";
import { FaLock,FaUnlock, FaUser } from "react-icons/fa";
import { manualLoginService } from "../service/service";
import baseUrl from "../service/service-config.json"

const ManualLogin = () => {
  const [togglePass, setTogglePass] = useState(false);
  const [error, setError] = useState('');
  const companyNameId = sessionStorage.getItem('EncryptedUser') && JSON.parse(sessionStorage.getItem('EncryptedUser'));
  const [typePassword, setTypePassword] = useState(true);
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const onChangeUser = (name, value) => {
    let onChangeDetails = { ...userDetails };
    onChangeDetails[name] = value;
    setUserDetails(onChangeDetails);
    if(name === "password" && !value) setTypePassword(true)
  };
  const [toast, setToast] = useState({message: '',color: '',textColor:"" });

  function handleClickAway() { setToast({ message: '',color: '',textColor:"" }) }
  useEffect(() => {
    if(!userDetails.password) setTypePassword(true);
  }, []);
  function loginValidation() {
        let errorMsg = {};
        let isFormValid = true;
        let textExp = /^[a-zA-Z0-9._]+@[a-z]+\.com$/
        let email = document.getElementById("email");
        if (email) {
          const emailValue = email.value.trim();
          if (!emailValue) {
            isFormValid = false;
            errorMsg.email = "Email is required";
          }
          else if (emailValue && !textExp.test(emailValue)) {
            isFormValid = false;
            errorMsg.email = "Enter a valid email";
          } 
          // if(emailValue && textExp.test(emailValue)) {
          //   setTogglePass(true);
          //   isFormValid = false
          // }
        }
        let password = document.getElementById("password");
        if (password) {
          const passwordValue = password.value;
          if (!passwordValue) {
            isFormValid = false;
            errorMsg.password = "Password is required"
          }
        }
        setError(errorMsg);
        return isFormValid;
  }
  const onSubmit = async () => {
  try {
    if (loginValidation()) {
      const tempDetails = {
        ...userDetails, 
        companyName : companyNameId
      }
      const response = await manualLoginService(tempDetails);
      if (response && response.user && response.webToken) {
        const findWebURL = baseUrl.clientWebsite[companyNameId];
        const webUrl = `${findWebURL}?token=${response.webToken}`;
        window.location.href  = webUrl;
        console.log(findWebURL,webUrl)
          setToast({ message: "Login Successfully", color: "#99ff99", textColor: "#060" });
      } else {
        setToast({ message: "Wrong credentials", color: "#FFCCCC", textColor: "#C00" });
      }
      }
    } catch (error) {
      console.error(error)
    } 

  };
  function errorMessage({ message , color,textColor}) {
    return(
      <div className="toast-error-message" onClick={handleClickAway} style={{background: color,color:textColor}}>{message}</div>
      )
  }
  return (
      <div className="page-view manual dp-flex-end ">
          
      {/* {errorMessage(toast)} */}
      <div className="Login-box">
        <div className="Login-head-text-container">
          <h1 className="login-text head">Welcome Back!</h1>
          <h1 className="login-text subhead">Login to Continue</h1>
        </div>
        <div className="img">
          <img src={uimge} alt="Login image" />
        </div>
        <div className="login-input-container">
          <span className="login-icons">
            <FaUser />
          </span>
          <input
            className="login-input"
            type="text"
            name="email"
            id="email"
            value={userDetails.email}
            onChange={(e) => onChangeUser(e.target.name, e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="red-error-message">{error.email}</div>
              <div className="login-input-container">
                <span className="login-icons password" onClick={() => setTypePassword(!typePassword)}>
                {typePassword ? <FaLock /> : <FaUnlock />}
                </span>
                <input
                className="login-input password"
                type={typePassword ? "password" : "text" }
                placeholder="Password"
                name="password"
                id="password"
                value={userDetails.password}
                onChange={(e) => onChangeUser(e.target.name, e.target.value)}
                />
          </div>
        <div className="red-error-message">{error.password}</div>

        <button className="manual-login-btn" onClick={onSubmit}>Login</button>
          </div>
          
        {/* <div className="page-view loader dp-flex-fc">
            
        </div> */}
    </div>
  );
};

export default ManualLogin;
