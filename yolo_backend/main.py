from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import os
from dotenv import load_dotenv
import shutil
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

load_dotenv()

# Serve the uploads folder so the frontend can view images
app.mount("/uploads", StaticFiles(directory="uploads", html=True), name="uploads")

# Load your custom trained model
model = YOLO("weights/my_model.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/scan")
async def scan_image(file: UploadFile = File(...)):
    # 1. Save the uploaded file locally
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    print(f"Uploaded file saved at: {file_path}")

    # 2. Run Inference using YOLO
    results = model(file_path, conf=0.4,iou=0.5, augment=True)
    result = results[0]  # Get the first result

    # 3. Check if any objects/garbage were detected
    if len(result.boxes) == 0:
        return JSONResponse({
            "status": "failed",
            "message": "No garbage detected.",
            "objects_detected": False
        }, status_code=200)

    # 4. Annotate the image with detected boxes and labels  
    annotated_image = result.plot()

    # 5. Save the annotated image
    marked_filename = f"marked_{file.filename}"
    marked_path = os.path.join(UPLOAD_DIR, marked_filename)
    
    # Save the plotted image using OpenCV
    cv2.imwrite(marked_path, annotated_image)

    # 6. Generate the URL to send back to the frontend
    image_url = f"http://localhost:8000/uploads/{marked_filename}"

    return JSONResponse({
        "status": "success",
        "message": "Objects detected.",
        "image_url": image_url 
    })