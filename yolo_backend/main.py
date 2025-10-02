from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles  # ✅ NEW
from starlette.responses import FileResponse
from ultralytics import YOLO
from typing import Optional
import torch
from yolov8face import get_bbox
import os
from dotenv import load_dotenv
import shutil
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, OPTIONS...
    allow_headers=["*"],  # Authorization, Content-Type...
)

load_dotenv()
env = os.getenv("ENVIRONMENT", "development")

app.mount("/uploads", StaticFiles(directory="uploads", html=True), name="uploads")

model = YOLO("weights/my_model.pt")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_bbox(image_path):
    results = model(image_path)[0]

    bboxes = []
    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0].tolist()  # Convert tensor to list
        bboxes.append([int(x1), int(y1), int(x2), int(y2)])

    return bboxes

@app.post("/scan")
async def scan_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"Uploaded file saved at: {file_path}")

    # Detect face using yolov8face
    bboxes = get_bbox(file_path)
    print(f"BBoxes returned: {bboxes}")

    if not bboxes:
        return JSONResponse({
            "status": "failed",
            "message": "No face detected.",
            "face_detected": False
        }, status_code=200)

    image = cv2.imread(file_path)
    print(f"Image shape: {image.shape if image is not None else 'Image not read!'}")

    # ✅ Draw all detected faces
    for bbox in bboxes:
        x1, y1, x2, y2 = bbox
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)

    marked_filename = f"marked_{file.filename}"
    marked_path = os.path.join(UPLOAD_DIR, marked_filename)
    cv2.imwrite(marked_path, image)

    image_url = f"http://localhost:8000/uploads/{marked_filename}"

    return JSONResponse({
        "status": "success",
        "message": "Face detected.",
        "image_url": image_url  # ✅ Send this to frontend
    })