import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import { FaKey,FaGoogle,FaFingerprint,FaIdCardAlt } from "react-icons/fa";
import { FaFaceGrin } from "react-icons/fa6";
import { useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; 

const Home = () => {

  const [toggleMethods, setToggleMethods] = useState(true);
  const selectContainerRef = useRef();
  const [selectedMethods,setSelectedMethods] = useState({});
  const [methods, setMethods] = useState([
    {
      name : "Login with Email and Password",
      icon : <FaKey />,
      path : "/manualauth",
    },
    {
      name : "Login with Google Authentication",
      icon : <FaGoogle />,
      path : "/googleauth",
    },
    {
      name : "Login with Finger Print Authentication",
      icon : <FaFingerprint />,
      path : "/fingerauth",
    },
    {
      name : "Login with Scan ID Authentication",
      icon : <FaIdCardAlt />,
      path : "/scanidauth",
    },
     {
      name : "Login with Face Authentication",
      icon : <FaFaceGrin />,
      path : "/faceauth",
    },  

  ]);
  const handleOpenToggle = () => {
    setToggleMethods(!toggleMethods);
  };

  useEffect(() => {
    const handleEvent = (event) => {
      if (selectContainerRef && !selectContainerRef.current.contains(event.target)) {
        setToggleMethods(true);
      }
    };
  
    document.addEventListener("mousedown", handleEvent);
  
    return () => {
      document.removeEventListener("mousedown", handleEvent);
    };
  }, []);
  const handleSelectMethods = (temp) => {
    setSelectedMethods(temp);
  }
  const navigate = useNavigate();
  const handleNavigate = () => {
    if(!selectedMethods) return;
    const { path } = selectedMethods;
    navigate(path);
  }

  function clearAllQueryParameters() {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split('?')[0];
    window.history.replaceState({}, document.title, baseUrl);
  }
  function getQueryParameters(hash) {
    const queryString = hash.split('?')[1];
    console.log(queryString);
    const params = {};  
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }
  
    return params;
  }
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const  lengthOfQueryParams = Object.keys(queryParams).length === 0;

  useEffect(() => {
      if (id) {
        sessionStorage.setItem('EncryptedUser',JSON.stringify(id));
    }
    clearAllQueryParameters();
  }, [id]);
  return (
      <div className="page-view dp-flex-vc home">
          <div className="page-container dp-flex-fc">
              <div className="page-semi-container">
                <div className="login-options-header">
            <h1 className='login-header-name big captial'>{id ? id : "EMUNA"}</h1> 
                    <p className='login-header-para' >Powered By <span className='special-tag'>Emuna Enterprises</span></p>
                </div>
                 <div className="login-options-content">
          <h1 className='login-header-text'>Unified Multi-factor Authentication Portal</h1>
            <div className="new-select-container" onClick={handleOpenToggle} >
           <>
           <span className='select-down-icon mx-4'>{selectedMethods.icon}</span>
           <input type="text" value={selectedMethods.name || "Select Authentication"} readOnly />
           </>
           <span className='select-down-icon'><IoIosArrowDown /></span>
           <div hidden={toggleMethods} ref={selectContainerRef} className="select-option-container">
             {methods.map((meth,index) => {
               return(
                 <div onClick={() => handleSelectMethods(meth)} key={index} className="options-object">
                   <span className="options-icon">{meth.icon}</span>
                   <span className="options-text">{meth.name}</span>
                 </div>
               )    
             })}
           </div>
          </div>
          <div className='login-btn-group'>
          <button className='new-login-btn' onClick={() => handleNavigate()}>Continue</button>
          </div>
          </div>
              </div>
          </div>
    </div>
  )
}

export default Home;