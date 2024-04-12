import React, { useEffect, useState } from "react";
import uimge from "../assets/show_id.jpg";
import { FaUser } from "react-icons/fa";
import QRScanner from '../utils/QRScanner';  
import { scanIdLoginService } from "../service/service";

const ScanIDLogin = () => {
  const [scanning, setScanning] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
    scannedQRCode: "", 
  });
  const [toast, setToast] = useState({ message: '', color: '', textColor: '' });

  const handleScan = async (data) => {
    if (data) {
      try {
        const updateDetails = {
          email: userDetails.email,
          scannedQRCode: data
        }
        const response = await scanIdLoginService(updateDetails);
        if (response && response.user) {
          setToast({ message: "Login Successfully", color: "#CCffCC", textColor: "#060" });
          setScanning(false);
        } else {
          setToast({ message: "Wrong credentials", color: "#FFCCCC", textColor: "#C00" });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onChangeUser = (name, value) => {
    setUserDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const loginValidation = () => {
    let isFormValid = true;
    let textExp = /^[a-zA-Z0-9._]+@[a-z]+\.[a-z]{2,}$/;
    const email = userDetails.email.trim();
    if (!email) {
      isFormValid = false;
      setToast({ message: "Email is required", color: "#FFCCCC", textColor: "#C00" });
    } else if (!textExp.test(email)) {
      isFormValid = false;
      setToast({ message: "Enter a valid email", color: "#FFCCCC", textColor: "#C00" });
    } else {
      setScanning(true); // Start scanning if email is valid
    }
    return isFormValid;
  };

  const onSubmit = () => {
    loginValidation();
  };

  const handleClickAway = () => {
    setToast({ message: '', color: '', textColor: '' });
  };

  return (
    <div className="page-view manual dp-flex-end ">
      {toast.message && (
        <div className="toast-error-message" onClick={handleClickAway} style={{ background: toast.color, color: toast.textColor }}>
          {toast.message}
        </div>
      )}
      <div className="Login-box">
        <div className="Login-head-text-container">
          <h1 className="login-text head">Welcome Back!</h1>
          <h1 className="login-text subhead">Login to Continue</h1>
        </div>
        <div className="img big-img">
          {scanning ?
            <QRScanner onScan={handleScan} />
            : <img src={uimge} alt="Login image" />
          }
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
        <button className="manual-login-btn" onClick={onSubmit}>Login</button>
      </div>
    </div>
  );
};

export default ScanIDLogin;
