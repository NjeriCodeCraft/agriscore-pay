from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

#Initialize the App
app = FastAPI(title="AgriScore-Pay API")

#CORS- Cross-Origin Resource Sharing
# This allows frontend to reach this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model

model = joblib.load("agriscore_pipeline.pkl")

# Define the input structure JSON
class FarmerData(BaseModel):
    farmSize: float
    yearsfarming: int
    lastYieldKg: float
    existingLoans: str
    irrigated: str
    soilType: str
    cropType: str
    requestedAmount: float

@app.get("/")
def health_check():
    return {"status": "AgriScore API is online", "version": "1.0.0"}

@app.post("/predict")
def predict_score(data: FarmerData):
    # Convert incoming data to a DataFrame for the model
    input_df = pd.DataFrame([data.dict()])
    
    #  Get the prediction (The Regression part)
    prediction = model.predict(input_df)[0]
    final_score = round(prediction)

    # 6. Classification Logic
    if final_score > 700:
        risk_level = "Low"
        status = "Approved"
    elif final_score >= 500:
        risk_level = "Medium"
        status = "Pending Manual Review"
    else:
        risk_level = "High"
        status = "Declined"

    # Credit Limit Logic (Example: Score * constant)
    recommended_limit = round(final_score * 250, 2)

    return {
        "agriScore": final_score,
        "riskLevel": risk_level,
        "status": status,
        "recommendedLimit": recommended_limit
    }