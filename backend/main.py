from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta
import sqlite3
from contextlib import contextmanager

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Indian cities data
INDIAN_CITIES = {
    "mumbai": {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lng": 72.8777},
    "delhi": {"city": "Delhi", "state": "Delhi", "lat": 28.6139, "lng": 77.2090},
    "bangalore": {"city": "Bangalore", "state": "Karnataka", "lat": 12.9716, "lng": 77.5946},
    "hyderabad": {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lng": 78.4867},
    "chennai": {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lng": 80.2707},
    "kolkata": {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lng": 88.3639},
    "pune": {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lng": 73.8567},
    "ahmedabad": {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lng": 72.5714},
    "jaipur": {"city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lng": 75.7873},
    "lucknow": {"city": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lng": 80.9462}
}

class DiseaseCase(BaseModel):
    disease: str
    city: str
    cases: int
    timestamp: str

@contextmanager
def get_db():
    conn = sqlite3.connect('disease_tracker.db')
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                id TEXT PRIMARY KEY,
                disease TEXT,
                city TEXT,
                cases INTEGER,
                timestamp TEXT,
                lat REAL,
                lng REAL
            )
        ''')
        conn.commit()

init_db()

@app.get("/api/cases")
async def get_cases():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM cases")
        cases = cursor.fetchall()
        
        return [
            {
                "id": case[0],
                "disease": case[1],
                "city": case[2],
                "cases": case[3],
                "timestamp": case[4],
                "lat": case[5],
                "lng": case[6]
            }
            for case in cases
        ]

@app.post("/api/cases")
async def create_case(case: DiseaseCase):
    city_data = INDIAN_CITIES.get(case.city.lower())
    if not city_data:
        raise HTTPException(status_code=400, detail="Invalid city")
    
    with get_db() as conn:
        cursor = conn.cursor()
        case_id = str(datetime.now().timestamp())
        
        cursor.execute(
            "INSERT INTO cases VALUES (?, ?, ?, ?, ?, ?, ?)",
            (case_id, case.disease, case.city, case.cases, case.timestamp, 
             city_data["lat"], city_data["lng"])
        )
        conn.commit()
        
        return {
            "id": case_id,
            "disease": case.disease,
            "city": case.city,
            "cases": case.cases,
            "timestamp": case.timestamp,
            "lat": city_data["lat"],
            "lng": city_data["lng"]
        }

@app.get("/api/cases/historical")
async def get_historical_cases(start_date: str, end_date: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM cases WHERE timestamp BETWEEN ? AND ?",
            (start_date, end_date)
        )
        cases = cursor.fetchall()
        
        return [
            {
                "id": case[0],
                "disease": case[1],
                "city": case[2],
                "cases": case[3],
                "timestamp": case[4],
                "lat": case[5],
                "lng": case[6]
            }
            for case in cases
        ]

@app.get("/api/alerts")
async def get_alerts():
    with get_db() as conn:
        cursor = conn.cursor()
        seven_days_ago = (datetime.now() - timedelta(days=7)).isoformat()
        
        cursor.execute(
            """
            SELECT disease, SUM(cases) as total_cases
            FROM cases 
            WHERE timestamp >= ?
            GROUP BY disease
            HAVING total_cases > 1000
            """,
            (seven_days_ago,)
        )
        
        alerts = []
        for disease, total_cases in cursor.fetchall():
            alerts.append({
                "id": f"{disease}-{datetime.now().timestamp()}",
                "message": f"Severe {disease} outbreak with {total_cases} cases",
                "severity": "high",
                "timestamp": datetime.now().isoformat()
            })
        
        return alerts