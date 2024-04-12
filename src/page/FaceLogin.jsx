import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import uimge from "../assets/user.png";
import { FaLock,FaUnlock, FaUser } from "react-icons/fa";
import { getUserDetails, manualLoginService } from "../service/service";
import baseUrl from "../service/service-config.json"
import useUpdateEffect from '../hooks/useUpdateEffect';

const FaceDetectionComponent = () => {
  const videoRef = useRef(null);
  const [isFaceMatched, setIsFaceMatched] = useState(false);
  // Login Toast 
const [scanning, setScanning] = useState(false);
  const [userDetails, setUserDetails] = useState({
    email: "",
  });
  const companyNameId = sessionStorage.getItem('EncryptedUser') && JSON.parse(sessionStorage.getItem('EncryptedUser'));
  const [matchImg, setMatchImg] = useState('');
  const [retriveUserDetailsDB, setRetriveUserDetailsDB] = useState({});
  const [toast, setToast] = useState({ message: '', color: '', textColor: '' });

  // const handleScan = async (data) => {
  //   if (data) {
  //     try {
  //       const updateDetails = {
  //         email: userDetails.email,
  //         scannedQRCode: data
  //       }
  //       const response = await scanIdLoginService(updateDetails);
  //       if (response && response.user) {
  //         setToast({ message: "Login Successfully", color: "#CCffCC", textColor: "#060" });
  //         setScanning(false);
  //       } else {
  //         setToast({ message: "Wrong credentials", color: "#FFCCCC", textColor: "#C00" });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

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
  const fetchData = async () => {
    const { email } = userDetails;
    try {
      const res = await getUserDetails(email, companyNameId);
      const data = res.userData;
      console.log(data);

      if (data) {
        const imgName = data.RegId && data.fullname ? `${data.RegId}-${data.fullname}` : "";
        setRetriveUserDetailsDB(data);
        setMatchImg(imgName);
        if(imgName) setScanning(true);
        return imgName;
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  const onSubmit = () => {
    if (loginValidation()) {
        fetchData();
        setToast({})
    }
    else {
      setScanning(false);
    }
  
  };

  const handleClickAway = () => {
    setToast({ message: '', color: '', textColor: '' });
  };

  // Face Detaction Functions

  
  // useUpdateEffect(() => {
  //   const loadModelsAndStartWebcam = async () => {
  //     await Promise.all([
  //       faceapi.nets.ssdMobilenetv1.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
  //       faceapi.nets.faceRecognitionNet.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
  //       faceapi.nets.faceLandmark68Net.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
  //     ]);

  //     const startWebcam = async () => {
  //      try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //       } else {
  //         console.error('Video element reference not found.');
  //       }
  //     } catch (error) {
  //         console.error('Error accessing camera:', error);
  //       }
  //     };

  //     if(scanning) startWebcam();
  //   };

  //   loadModelsAndStartWebcam();
  // }, [scanning]);
useEffect(() => {
  const loadModelsAndStartWebcam = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
      faceapi.nets.faceRecognitionNet.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
      faceapi.nets.faceLandmark68Net.loadFromUri("https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"),
    ]);

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise(resolve => videoRef.current.onloadedmetadata = resolve);
          startFaceDetection();
        } else {
          setToast({ message: "Video element reference not found.", color: "#FFCCCC", textColor: "#C00" });
           console.error('Video element reference not found.');
        }
      } catch (error) {
        setToast({ message: "Can not Accessing camera", color: "#FFCCCC", textColor: "#C00" });
        console.error('Error accessing camera:', error);
      }
    };

      if (scanning) {
    setToast({})
    startWebcam();
      }
        
  };

  loadModelsAndStartWebcam();
}, [scanning,matchImg]);

  const startFaceDetection = async () => {
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    document.body.append(canvas);
    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvas, displaySize);

    let isFaceMatchedLocal = false;

    const detectFaces = async () => {
      const labeledFaceDescriptors = await getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box);
          drawBox.draw(canvas);
          if (result._label !== "unknown" && !isFaceMatchedLocal) {
            isFaceMatchedLocal = true;
            setToast({ message: "Face Matched Login Success", color: "#CCFFCC", textColor: "#0C0" });
            setIsFaceMatched(true);
            stopWebcam();
          }
        });
      }, 100);
    };

    detectFaces();

    return () => {
      canvas.remove();
    };
  };

  const getLabeledFaceDescriptions = async () => {
    const labels = [retriveUserDetailsDB.fullname];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const imgName = await fetchData();
          const img = await faceapi.fetchImage(`http://localhost:4003/picture/${imgName}.png`);
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };
  // const getLabeledFaceDescriptions = async () => {
  //   const labels = ["sam"];
  //   return Promise.all(
  //     labels.map(async (label) => {
  //       const descriptions = [];
  //       for (let i = 1; i <= 2; i++) {
  //         const img = await faceapi.fetchImage(`http://localhost:4003/picture/${i}.png`);
  //         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  //         descriptions.push(detections.descriptor);
  //       }
  //       return new faceapi.LabeledFaceDescriptors(label, descriptions);
  //     })
  //   );
  // };

  const stopWebcam = () => {
    setScanning(false);
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    setToast({})
  };

  return (
    <div className="page-view manual dp-flex-end">
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
                    <div className="face-auth-video">
                            <video id="video" ref={videoRef} autoPlay></video>
                    </div>
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
        <button className="manual-login-btn" onClick={onSubmit}>Detect Face</button>
      </div>
    </div>
  );
};

export default FaceDetectionComponent;
