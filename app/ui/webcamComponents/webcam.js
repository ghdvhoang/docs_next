"use client";

import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  // Hàm chụp ảnh từ webcam
  const capture = useCallback(() => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  }, [webcamRef]);

  return (
    <div>
      <h2>Webcam trong Next.js</h2>
      <div style={{ marginBottom: "20px" }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: "100%", maxWidth: "500px" }}
        />
      </div>
      <button onClick={capture}>Chụp ảnh</button>
      {imageSrc && (
        <div>
          <h3>Ảnh đã chụp:</h3>
          <img src={imageSrc} alt="Chụp từ webcam" />
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;
