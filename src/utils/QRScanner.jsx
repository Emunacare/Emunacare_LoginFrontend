import React, { useState, useEffect } from 'react';
import QrScan from 'react-qr-reader';
import { IoIosArrowBack } from 'react-icons/io';

function QRScanner({ onScan}) {
  const [qrScan, setQrScan] = useState('');

  const handleScan = data => {
    if (data) {
      setQrScan(data);
      onScan(data);
    }
  };

  const handleError = err => {
    console.error(err);
  };

  useEffect(() => {
    console.log(qrScan);
  }, [qrScan]);

  return (
    <div>
      {/* <Link to="/">
        <span style={{ marginRight: 10 }}>
          <IoIosArrowBack />
        </span>
      </Link> */}
      <span>QR Scanner</span>

      <center>
        <div style={{ marginTop: 30 }}>
          <QrScan
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ height: 240, width: 320 }}
          />
        </div>
      </center>
    </div>
  );
}

export default QRScanner;
