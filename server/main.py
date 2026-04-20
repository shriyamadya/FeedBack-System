from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
import os
import base64

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "feedback_system")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

if not MONGO_URI:
    raise ValueError("MONGO_URI is missing in .env")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
feedback_collection = db["feedbacks"]


def verify_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Basic "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        encoded = authorization.split(" ")[1]
        decoded = base64.b64decode(encoded).decode("utf-8")
        username, password = decoded.split(":", 1)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    return True


@app.get("/")
def root():
    return {"message": "Backend is running"}


@app.post("/feedback")
def submit_feedback(payload: dict):
    required_fields = ["instructor", "subject", "rating"]

    for field in required_fields:
        if field not in payload or not str(payload[field]).strip():
            raise HTTPException(status_code=400, detail=f"{field} is required")

    doc = {
        "instructor": payload["instructor"].strip(),
        "subject": payload["subject"].strip(),
        "rating": payload["rating"].strip(),
        "liked": payload.get("liked", "").strip(),
        "improve": payload.get("improve", "").strip(),
        "created_at": datetime.utcnow().isoformat()
    }

    result = feedback_collection.insert_one(doc)

    return {
        "message": "Feedback submitted successfully",
        "id": str(result.inserted_id)
    }


@app.get("/admin/feedbacks")
def get_feedbacks(admin=Depends(verify_admin)):
    feedbacks = []
    for doc in feedback_collection.find().sort("created_at", -1):
        feedbacks.append({
            "id": str(doc["_id"]),
            "instructor": doc.get("instructor", ""),
            "subject": doc.get("subject", ""),
            "rating": doc.get("rating", ""),
            "liked": doc.get("liked", ""),
            "improve": doc.get("improve", ""),
            "created_at": doc.get("created_at", "")
        })
    return feedbacks


@app.delete("/admin/feedbacks/{feedback_id}")
def delete_feedback(feedback_id: str, admin=Depends(verify_admin)):
    try:
        object_id = ObjectId(feedback_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid feedback ID")

    result = feedback_collection.delete_one({"_id": object_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Feedback not found")

    return {"message": "Feedback deleted successfully"}