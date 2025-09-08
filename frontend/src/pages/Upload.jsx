import { useState, useRef } from "react";

export default function Upload() {
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null); // store camera stream
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera (rear cam on mobile if available)
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Capture a frame
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

  // Handle gallery upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Upload Image</h2>

      {/* Camera */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            maxWidth: "500px",
            display: "block",
            margin: "0 auto",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        />
        <br />
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Capture</button>
        <button onClick={stopCamera}>Stop Camera</button>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>

      <hr />

      {/* File Upload */}
      <div style={{ textAlign: "center" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Preview */}
      {image && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h4>Preview:</h4>
          <img
            src={image}
            alt="preview"
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "block",
              margin: "0 auto",
              border: "1px solid #ccc",
              borderRadius: "8px"
            }}
          />
        </div>
      )}

      {/* Remarks */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <textarea placeholder="Remarks" style={{ width: "80%", height: "80px" }}></textarea>
      </div>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button>Submit</button>
      </div>
    </div>
  );
}
