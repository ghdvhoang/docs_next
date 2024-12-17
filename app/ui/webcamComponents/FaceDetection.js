"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

const FaceDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tải mô hình nhận diện khuôn mặt
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsLoading(false);
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models", error);
      }
    };

    loadModels();
  }, []);

  // Hàm xử lý nhận diện khuôn mặt
  const handleFaceDetection = async () => {
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    // Cập nhật nhận diện khuôn mặt mỗi frame
    const updateFaceDetection = async () => {
      // Sử dụng TinyFaceDetectorOptions với inputSize phù hợp
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 160, // Thử thay đổi inputSize thành 160 thay vì 128
          scoreThreshold: 0.3
        })
      );

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height); // Làm sạch canvas
      faceapi.draw.drawDetections(canvas, resizedDetections); // Vẽ khung nhận diện khuôn mặt

      resizedDetections.forEach((detection) => {
        const { x, y, width, height } = detection.box;
        context.strokeStyle = "green";
        context.lineWidth = 3;
        context.strokeRect(x, y, width, height); // Vẽ khung quanh khuôn mặt
      });

      // Tiếp tục nhận diện khuôn mặt mỗi frame
      requestAnimationFrame(updateFaceDetection);
    };

    updateFaceDetection(); // Bắt đầu nhận diện khuôn mặt
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      {isLoading ? (
        <div>Loading models...</div>
      ) : (
        <div style={{ position: "relative", width: "80%", maxWidth: "800px" }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            onUserMedia={handleFaceDetection} // Khi video đã sẵn sàng, gọi handleFaceDetection
            style={{ width: "100%", height: "auto" }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
