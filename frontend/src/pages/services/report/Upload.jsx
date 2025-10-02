import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import api from "../../../utils/axiosConfig";

export default function Upload() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [remarks, setRemarks] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
  };

  // Upload Filee
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Helper for Uploading to backend
  function dataURLtoBlob(dataURL) {
    const [metadata, base64Data] = dataURL.split(",");
    const mimeType = metadata.match(/:(.*?);/)[1];
    const binaryString = atob(base64Data);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }
  // Yolo Validation
  const validateImageWithYolo = async (imageUrl) => {
    try {
      let blob;
      if (imageUrl.startsWith("data:")) {
        blob = dataURLtoBlob(imageUrl);
      } else if (imageUrl.startsWith("blob:") || imageUrl.startsWith("http")) {
        blob = await fetch(imageUrl).then(res => res.blob());
      } else if (imageUrl instanceof File || imageUrl instanceof Blob) {
        blob = imageUrl;
      } else {
        throw new Error("Unsupported image URL format");
      }
      const formData = new FormData();
      formData.append("file", blob, "captured-image.jpeg");
  
      const response = await axios.post("http://localhost:8000/scan", formData);
  
      if (response.data && response.data.image_url) {
        return response.data.image_url; 
      } else {
        console.warn("Image URL not returned by YOLO scan.");
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please capture or select an image first!");
      return;
    }
    const modifiedImageUrl = await validateImageWithYolo(image);
    if (!modifiedImageUrl) {
      alert("Garbage not detected or failed to process image.");
      return;
    }
    try {
      const ogImageResponse = await fetch(image);
      const imageResponse = await fetch(modifiedImageUrl);
      const ogBlob = await ogImageResponse.blob();
      const blob = await imageResponse.blob();

      const formData = new FormData();
      formData.append("image", ogBlob, "capture.png");
      formData.append("image2", blob, "capture-2.png");
      formData.append("remarks", remarks);

      const response = await api.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Image uploaded successfully!");
        setImage(null);
        setRemarks("");
      }
      navigate("/");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
          padding: 32,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 24 }}>
          Upload Image
        </h2>

        {/* Camera Section */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxWidth: "400px",
              display: stream ? "block" : "none",
              margin: "0 auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={startCamera}
              style={{
                padding: "8px 16px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                marginRight: 8,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Start Camera
            </button>
            <button
              onClick={capturePhoto}
              disabled={!stream}
              style={{
                padding: "8px 16px",
                background: stream ? "#388e3c" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                marginRight: 8,
                cursor: stream ? "pointer" : "not-allowed",
                fontWeight: "bold",
              }}
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              disabled={!stream}
              style={{
                padding: "8px 16px",
                background: stream ? "#d32f2f" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: stream ? "pointer" : "not-allowed",
                fontWeight: "bold",
              }}
            >
              Stop Camera
            </button>
          </div>
        </div>

        <hr style={{ margin: "24px 0" }} />

        {/* File Upload Section */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: "8px",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Preview Section */}
        {image && (
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h4 style={{ marginBottom: 8 }}>Preview:</h4>
            <img
              src={image}
              alt="preview"
              style={{
                width: "100%",
                maxWidth: "400px",
                display: "block",
                margin: "0 auto",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </div>
        )}

        {/* Remarks Section */}
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              style={{
                width: "80%",
                height: "80px",
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            ></textarea>
          </div>
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button
              type="submit"
              style={{
                padding: "10px 32px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
