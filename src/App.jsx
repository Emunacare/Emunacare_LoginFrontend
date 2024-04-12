import { BrowserRouter as Router, Route   , Routes } from 'react-router-dom';
// import "./App.css"
import "./App.css"
import Home from './page/Home';
import ManualLogin from './page/ManualLogin';
import GoogleLogin from './page/GoogleLogin';
import ScanIDLogin from './page/ScanIDLogin';
import FingerprintLogin from './page/FingerprintLogin';
import FaceDetectionComponent from './page/FaceLogin';
// import MatchingPage from './pages/Face/MatchingFace';
// import StoreFaceData from './pages/Face/StoreFace';
// import FaceDetectionComponent from './pages/FaceAuthPage';
// import NewHome from './pages/newHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/manualauth" element={<ManualLogin />} />
        <Route exact path="/googleauth" element={<GoogleLogin />} />
        <Route exact path="/scanidauth" element={<ScanIDLogin />} /> 
        <Route exact path="/faceauth" element={<FaceDetectionComponent />} />
        <Route exact path="/fingerauth" element={<FingerprintLogin />} />
        {/* <Route exact path="/test" element={<StoreFingerPrint />} /> */}
        {/* <Route exact path="/testfacestore" element={<StoreFaceData />} /> */}
        {/* <Route exact path="/testfacescan" element={<MatchingPage />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
