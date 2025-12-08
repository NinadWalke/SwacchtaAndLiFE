import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../../utils/axiosConfig";
// Import the new stylesheet for this component
import "./Upload.css";

export default function Upload() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [activeTab, setActiveTab] = useState("camera"); // State for tabs
  const [location, setLocation] = useState({ latitude: null, longitude: null }); // state for user location
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // --- Camera Logic ---
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
      alert("Could not access the camera. Please check permissions.");
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
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    stopCamera(); // Stop camera after capture for better UX
  };

  // --- File Upload Logic ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      stopCamera(); // Ensure camera is off if user uploads
    }
  };

  // (handleSubmit and helper functions remain the same)
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

  const validateImageWithYolo = async (imageUrl) => {
    try {
      let blob;
      if (imageUrl.startsWith("data:")) {
        blob = dataURLtoBlob(imageUrl);
      } else {
        blob = await fetch(imageUrl).then((res) => res.blob());
      }
      const formData = new FormData();
      formData.append("file", blob, "captured-image.jpeg");
      const YOLO_API_BASE = process.env.REACT_APP_API_URL_YOLO_LOCAL;
      const response = await axios.post(`${YOLO_API_BASE}/scan`, formData);
      return response.data?.image_url || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const submitReport = async (lat, lng, modifiedImageUrl) => {
    setLoading(true);
    try {
      const ogBlob = await fetch(image).then((res) => res.blob());
      const modifiedBlob = await fetch(modifiedImageUrl).then((res) =>
        res.blob()
      );
      const formData = new FormData();
      formData.append("image", ogBlob, "capture.png");
      formData.append("image2", modifiedBlob, "capture-2.png");
      formData.append("remarks", remarks);
      formData.append("latitude", lat);
      formData.append("longitude", lng);

      const response = await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert("Image uploaded successfully!");
        navigate("/");
      }
    } catch (err) {
      if (err?.response?.status === 409) {
        alert(err.response.data.message);
        return;
      }

      alert("Error uploading report. Please try again.");
    } finally {
      setLoading(false);
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        submitReport(
          pos.coords.latitude,
          pos.coords.longitude,
          modifiedImageUrl
        ); // main submit function transferred to submitReport
      },
      (err) => {
        console.log("Location permission denied: ", err);
        alert("Location is required to report garbage.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
  <main className="upload-page">
    <div className="upload-card">

      {/* HEADER */}
      <div className="upload-card__header">
        <h1 className="upload-card__title">Report Garbage</h1>
      </div>

      {/* --- INSTRUCTIONS DROPDOWN --- */}
      <div className="instructions-wrapper">
        <button
          className="instructions-toggle"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <span>🌿 How to Use</span>
          <span className="arrow">{showInstructions ? "▲" : "▼"}</span>
        </button>

        {showInstructions && (
          <div className="instructions-content fade-slide">
            <ul>
              <li>📸 Capture a clear photo of garbage or upload a file.</li>
              <li>📍 Keep location ON — GPS is required for reporting.</li>
              <li>🔍 Ensure garbage is fully visible in the frame.</li>
              <li>🚫 Avoid uploading random photos or clean areas.</li>
              <li>⚠ Wrong or fake uploads may reduce your GreenCoins.</li>
            </ul>
          </div>
        )}
      </div>


      {/* --- TABS --- */}
      <div className="upload__tabs">
        <button
          onClick={() => setActiveTab("camera")}
          className={`upload__tab-button ${activeTab === "camera" ? "active" : ""}`}
        >
          Use Camera
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`upload__tab-button ${activeTab === "upload" ? "active" : ""}`}
        >
          Upload File
        </button>
      </div>

      {/* --- REST OF YOUR EXISTING CONTENT (unchanged) --- */}
      {activeTab === "camera" && (
        <div className="upload__content-panel">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-view__video"
            style={{ display: stream ? "block" : "none" }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          <div className="camera-controls">
            {!stream && (
              <button onClick={startCamera} className="btn btn--primary">
                Start Camera
              </button>
            )}
            {stream && (
              <button onClick={capturePhoto} className="btn btn--capture">
                Capture
              </button>
            )}
            {stream && (
              <button onClick={stopCamera} className="btn btn--danger">
                Stop Camera
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="upload__content-panel">
          <div className="file-upload-view">
            <label
              htmlFor="file-upload"
              className="btn btn--primary file-input__label"
            >
              Choose an Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input__native"
            />
          </div>
        </div>
      )}

      {image && (
        <div className="upload__preview">
          <h2 className="upload__preview-title">Image Preview</h2>
          <img src={image} alt="preview" className="upload__preview-image" />
        </div>
      )}

      {image && (
        <form onSubmit={handleSubmit} className="upload__form">
          <textarea
            placeholder="Add any relevant remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="form__textarea"
          ></textarea>
          <div className="upload__submit-container">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={loading}
              style={{ width: "100%", padding: "14px" }}
            >
              {loading ? <>Processing</> : <>Submit Report</>}
            </button>
          </div>
        </form>
      )}
    </div>
  </main>
);
}
