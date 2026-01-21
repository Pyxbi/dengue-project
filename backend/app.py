from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load trained model (or use rule-based)
try:
    model = joblib.load('dengue_model.pkl')
    USE_ML = True
    print("Loaded ML model")
except:
    USE_ML = False
    print("Using rule-based prediction")

OPENWEATHER_API_KEY = os.getenv('OPENWEATHER_API_KEY')

def get_real_weather(lat, lon):
    if not OPENWEATHER_API_KEY:
        return None
    
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                'temp': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'rainfall': data.get('rain', {}).get('1h', 0) * 24, # Estimate daily rainfall from 1h
                'salinity': 0.5 # Mock salinity as it's not in standard weather API
            }
    except Exception as e:
        print(f"Error fetching weather: {e}")
    return None

def rule_based_predict(temp, rainfall, humidity, salinity):
    risk = 0
    if 25 <= temp <= 30: risk += 35
    elif 23 <= temp < 25 or 30 < temp <= 32: risk += 20
    else: risk += 5
    
    if rainfall > 150: risk += 35
    elif rainfall > 80: risk += 20
    else: risk += 5
    
    if humidity > 75: risk += 25
    elif humidity > 65: risk += 15
    else: risk += 5
    
    if salinity > 2: risk -= 10
    
    return min(95, max(10, risk + np.random.randint(-3, 3)))

@app.route('/api/risk')
def get_risk():
    # Get location
    lat = float(request.args.get('lat', 10.03))
    lon = float(request.args.get('lon', 105.78))
    
    # Try real weather, fallback to mock
    weather = get_real_weather(lat, lon)
    if not weather:
        weather = {
            'temp': np.random.uniform(27, 31),
            'rainfall': np.random.uniform(100, 250),
            'humidity': np.random.uniform(75, 88),
            'salinity': 0.5
        }
    
    # Predict risk
    if USE_ML:
        features = np.array([[
            weather['temp'],
            weather['rainfall'],
            weather['humidity'],
            weather['salinity']
        ]])
        risk_pct = int(model.predict(features)[0])
    else:
        risk_pct = int(rule_based_predict(weather['temp'], weather['rainfall'], weather['humidity'], weather['salinity']))
    
    # Determine level
    if risk_pct >= 75:
        level = "HIGH"
        color = "#FF5733"
    elif risk_pct >= 50:
        level = "MEDIUM"
        color = "#FFA500"
    else:
        level = "LOW"
        color = "#4CAF50"
    
    return jsonify({
        "risk_percentage": risk_pct,
        "risk_level": level,
        "confidence": 94,
        "factors": {
            "temperature": f"{weather['temp']:.1f}°C",
            "rainfall": f"{weather['rainfall']:.0f}mm",
            "humidity": f"{weather['humidity']:.0f}%"
        },
        "last_update": "Just now" if OPENWEATHER_API_KEY else "Simulated",
        "color": color
    })

def get_forecast_weather(lat, lon, days_ahead=2):
    if not OPENWEATHER_API_KEY:
        return None
    
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            # Find readings for ~noon on the target day
            target_date = (datetime.datetime.now() + datetime.timedelta(days=days_ahead)).date()
            
            # Filter for items on that day
            day_items = []
            for item in data['list']:
                item_date = datetime.datetime.fromtimestamp(item['dt']).date()
                if item_date == target_date:
                    day_items.append(item)
            
            if not day_items:
                # Fallback to last available item if target out of range (5 days max usually)
                day_items = [data['list'][-1]]
            
            # Average the values for that day
            avg_temp = np.mean([x['main']['temp'] for x in day_items])
            avg_humidity = np.mean([x['main']['humidity'] for x in day_items])
            # Forecast rain is often in 3h chunks. Sum them? Or avg?
            # 'rain' object might not exist.
            total_rain = sum([x.get('rain', {}).get('3h', 0) for x in day_items])
            
            return {
                'temp': avg_temp,
                'humidity': avg_humidity,
                'rainfall': total_rain * 4, # Crude estimate to daily
                'salinity': 0.5
            }
    except Exception as e:
        print(f"Error fetching forecast: {e}")
    return None

@app.route('/api/forecast')
def get_forecast():
    # Same parameters as /api/risk but for future
    lat = float(request.args.get('lat', 10.03))
    lon = float(request.args.get('lon', 105.78))
    days = int(request.args.get('days', 2))
    
    # Try real forecast, fallback to mock
    weather = get_forecast_weather(lat, lon, days)
    
    if not weather:
        # Mock future weather (make it slightly worse for demo risk)
        weather = {
            'temp': np.random.uniform(28, 33), # Hotter
            'rainfall': np.random.uniform(50, 150),
            'humidity': np.random.uniform(70, 85),
            'salinity': 0.5
        }
    
    # Predict risk
    if USE_ML:
        features = np.array([[weather['temp'], weather['rainfall'], weather['humidity'], weather['salinity']]])
        risk_pct = int(model.predict(features)[0])
    else:
        risk_pct = int(rule_based_predict(weather['temp'], weather['rainfall'], weather['humidity'], weather['salinity']))
    
    # Levels
    if risk_pct >= 75:
        level, color = "HIGH", "#FF5733"
    elif risk_pct >= 50:
        level, color = "MEDIUM", "#FFA500"
    else:
        level, color = "LOW", "#4CAF50"
    
    target_date = (datetime.datetime.now() + datetime.timedelta(days=days)).strftime("%A, %b %d")

    return jsonify({
        "risk_percentage": risk_pct,
        "risk_level": level,
        "date": target_date,
        "factors": {
            "temperature": f"{weather['temp']:.1f}°C",
            "rainfall": f"{weather['rainfall']:.0f}mm",
            "humidity": f"{weather['humidity']:.0f}%"
        },
        "color": color
    })

@app.route('/api/heatmap')
def get_heatmap():
    # Generate heatmap points for Mekong Delta
    # If date_offset > 0, we can shift the "hotspots" slightly to simulate change
    offset = int(request.args.get('date_offset', 0))
    
    zones = []
    # Can Tho coordinates
    base_lat = 10.03
    base_lon = 105.78
    
    # Use a fixed seed based on offset to keep map stable per day but different between days
    np.random.seed(42 + offset)
    
    for lat_offset in np.arange(-5.0, 5.0, 0.2): # Wider range (Southern Vietnam)
        for lon_offset in np.arange(-3.0, 3.0, 0.2):
            # Create some "movement" in risk based on offset
            base_risk = np.random.randint(20, 95)
            if offset > 0:
                # Simulate risk spreading or changing
                change = np.random.randint(-10, 15)
                risk = min(100, max(0, base_risk + change))
            else:
                risk = base_risk
                
            zones.append({
                "lat": round(base_lat + lat_offset + (np.random.random()*0.02), 3), # Jitter
                "lon": round(base_lon + lon_offset + (np.random.random()*0.02), 3),
                "risk": risk
            })
    
    return jsonify({"zones": zones})


# Gemini Chatbot Integration
import google.generativeai as genai

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    chat_model = genai.GenerativeModel('gemini-flash-latest')
    print("Gemini model configured")
else:
    print("Warning: GEMINI_API_KEY not found")

@app.route('/api/chat', methods=['POST'])
def chat_with_bot():
    data = request.json
    user_message = data.get('message', '')
    
    if not GEMINI_API_KEY:
        return jsonify({"response": "I'm currently offline (API Key missing). Please check back later!"})

    try:
        # Construct prompt with persona
        prompt = f"""
        You are Sentinel AI, a friendly and helpful local health assistant for families in the Mekong Delta.
        Your goal is to explain Dengue prevention in a simple, encouraging, and easy-to-understand way.

        Guidelines:
        - Use a warm, conversational tone (like a helpful neighbor).
        - Use emojis 🦟💧🏡 to make the text engaging.
        - Use ### for Section Headers (e.g., "### 1. Tip the Water").
        - Use **bold text** for important words.
        - Use simple bullet points (-) for lists.
        - Keep answers short and scannable.
        - Focus on practical actions: "Empty water jars", "Sleep under nets", "Wear long sleeves".
        - If the user asks about symptoms, list them clearly but always say: "If you feel sick, visit the doctor immediately! 🏥"
        - Avoid complex medical jargon. Speak simply.
        
        User: {user_message}
        Sentinel AI:
        """
        
        response = chat_model.generate_content(prompt)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return jsonify({"response": "I'm having trouble connecting to my knowledge base right now. Please try again."}), 500

# --- Daily Quest Engine ---
import sqlite3
import random
import datetime
import uuid

# Task Pools
TASK_POOLS = {
    "HIGH": [
        {"id": "T1", "desc": "Clean stagnant water in 3 jars", "points": 50, "type": "photo"},
        {"id": "T2", "desc": "Apply mosquito repellent to family", "points": 40, "type": "photo"},
        {"id": "T3", "desc": "Alert 5 neighbors via SMS/App", "points": 60, "type": "action"}
    ],
    "MEDIUM": [
        {"id": "T4", "desc": "Check window screens for holes", "points": 25, "type": "photo"},
        {"id": "T5", "desc": "Complete a 3-question Dengue quiz", "points": 20, "type": "quiz"}
    ],
    "LOW": [
        {"id": "T6", "desc": "Read today's health tip", "points": 10, "type": "read"}
    ]
}

def init_db():
    conn = sqlite3.connect('dengue.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS user_daily_tasks
                 (user_id text, task_id text, status text, date text, risk_level_at_assignment real)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/daily-task')
def get_daily_task():
    user_id = request.args.get('user_id', 'user_123') # Default user
    
    # Get current risk (reuse logic from get_risk)
    # Ideally, refactor risk calculation into a helper function
    lat = float(request.args.get('lat', 10.03))
    lon = float(request.args.get('lon', 105.78))
    weather = get_real_weather(lat, lon)
    if not weather:
        weather = {
            'temp': np.random.uniform(27, 31),
            'rainfall': np.random.uniform(100, 250),
            'humidity': np.random.uniform(75, 88),
            'salinity': 0.5
        }
    
    if USE_ML:
        features = np.array([[weather['temp'], weather['rainfall'], weather['humidity'], weather['salinity']]])
        risk_pct = int(model.predict(features)[0])
    else:
        risk_pct = int(rule_based_predict(weather['temp'], weather['rainfall'], weather['humidity'], weather['salinity']))
        
    date_str = datetime.date.today().isoformat()
    
    # Check DB for existing task
    conn = sqlite3.connect('dengue.db')
    c = conn.cursor()
    c.execute("SELECT task_id, status FROM user_daily_tasks WHERE user_id=? AND date=?", (user_id, date_str))
    existing = c.fetchone()
    
    task_data = None
    
    if existing:
        task_id, status = existing
        # Find task details in pools
        for pool in TASK_POOLS.values():
            for t in pool:
                if t['id'] == task_id:
                    task_data = t
                    task_data['status'] = status
                    break
    else:
        # Assign new task
        if risk_pct >= 70:
            pool = TASK_POOLS["HIGH"]
        elif risk_pct >= 30:
            pool = TASK_POOLS["MEDIUM"]
        else:
            pool = TASK_POOLS["LOW"]
        
        task_data = random.choice(pool)
        task_data['status'] = 'assigned'
        
        c.execute("INSERT INTO user_daily_tasks VALUES (?, ?, ?, ?, ?)", 
                  (user_id, task_data['id'], 'assigned', date_str, risk_pct))
        conn.commit()
    
    conn.close()
    
    return jsonify({
        "user_id": user_id,
        "current_local_risk": risk_pct,
        "task": {
            "task_id": task_data['id'],
            "title": "Daily Prevention Quest",
            "description": task_data['desc'],
            "reward_points": task_data['points'],
            "type": task_data['type'],
            "status": task_data['status'],
            "expiry": f"{date_str}T23:59:59"
        }
    })

@app.route('/api/tasks/verify', methods=['POST'])
def verify_daily_task():
    # Mock AI Verification
    data = request.json
    user_id = data.get('user_id', 'user_123')
    task_id = data.get('task_id')
    image_base64 = data.get('image') # Not processing this for mock
    
    # Simulate AI processing time/logic
    # In a real app, decode base64 and pass to model
    
    verified = True # Always verified for demo
    
    date_str = datetime.date.today().isoformat()
    
    conn = sqlite3.connect('dengue.db')
    c = conn.cursor()
    
    if verified:
        c.execute("UPDATE user_daily_tasks SET status='completed' WHERE user_id=? AND task_id=? AND date=?", 
                  (user_id, task_id, date_str))
        conn.commit()
        
        # Get points
        c.execute("SELECT rowid FROM user_daily_tasks WHERE user_id=? AND task_id=? AND date=?", 
                   (user_id, task_id, date_str)) # Just checking row existence
        
        # Find points (simplified)
        points = 0
        for pool in TASK_POOLS.values():
             for t in pool:
                if t['id'] == task_id:
                    points = t['points']
                    break
        
        conn.close()
        return jsonify({
            "verified": True,
            "points_earned": points,
            "message": "Excellent work! Sentinel AI verified your action."
        })
    else:
        conn.close()
        return jsonify({"verified": False, "message": "Could not verify the action. Please try again."})


# --- Manager Dashboard APIs ---

@app.route('/api/manager/heatmap')
def manager_heatmap():
    # 14-day forecast risk map using Real AI Model
    days = int(request.args.get('days', 14))
    
    # Defined Districts in Mekong Delta
    districts = [
        {"name": "Ninh Kieu", "id": "CT-NK", "center": [10.03, 105.78], "pop": 280000}, # Can Tho (Urban)
        {"name": "Cai Rang", "id": "CT-CR", "center": [10.01, 105.74], "pop": 105000},
        {"name": "Binh Thuy", "id": "CT-BT", "center": [10.06, 105.76], "pop": 140000},
        {"name": "O Mon", "id": "CT-OM", "center": [10.10, 105.62], "pop": 128000},
        {"name": "Phong Dien", "id": "CT-PD", "center": [9.99, 105.68], "pop": 98000},
        {"name": "Vinh Long", "id": "VL-TP", "center": [10.25, 105.97], "pop": 150000},
        {"name": "Sa Dec", "id": "DT-SD", "center": [10.29, 105.75], "pop": 110000}, # Dong Thap
        {"name": "Cao Lanh", "id": "DT-CL", "center": [10.46, 105.63], "pop": 160000},
        {"name": "Soc Trang", "id": "ST-TP", "center": [9.60, 105.97], "pop": 140000}, # Coastal
        {"name": "Bac Lieu", "id": "BL-TP", "center": [9.29, 105.72], "pop": 150000}  # Coastal
    ]
    
    response_data = []
    
    for d in districts:
        lat, lon = d['center']
        
        # 1. Get Forecast Weather (Extrapolate to 14 days if needed)
        # We rely on get_forecast_weather (which currently does +2 days). 
        # For the "Manager View" looking 14 days ahead, we'll simulate a trend based on the 2-day forecast.
        weather_now = get_forecast_weather(lat, lon, days_ahead=2) # Get real 2-day forecast as baseline
        
        if not weather_now:
             weather_now = {
                'temp': 30, 'rainfall': 50, 'humidity': 80, 'salinity': 0.5
            }

        # Simulate 14-day shift based on user request
        # If looking 14 days ahead, we assume weather patterns intensify or settle
        # For demo purposes: random fluctuation around the real 2-day prediction
        future_weather = {
            'temp': weather_now['temp'] + np.random.uniform(-2, 2),
            'rainfall': max(0, weather_now['rainfall'] + np.random.uniform(-20, 50)), # Maybe more rain?
            'humidity': min(100, weather_now['humidity'] + np.random.uniform(-5, 5)),
            'salinity': weather_now['salinity']
        }
        
        # Coastal districts have higher salinity risk
        if d['name'] in ["Soc Trang", "Bac Lieu"]:
             future_weather['salinity'] = np.random.uniform(1.0, 5.0) # High salinity

        # 2. RUN AI MODEL
        if USE_ML:
            features = np.array([[
                future_weather['temp'],
                future_weather['rainfall'],
                future_weather['humidity'],
                future_weather['salinity']
            ]])
            # Predict
            risk_pct = int(model.predict(features)[0])
        else:
             risk_pct = int(rule_based_predict(future_weather['temp'], future_weather['rainfall'], future_weather['humidity'], future_weather['salinity']))
        
        # Clamp
        risk_pct = min(100, max(0, risk_pct))
        
        # Calculate Trend (Compare to a baseline "today" risk)
        # Simplified: Just randomize trend label for UI if we don't store history
        trend = "up" if risk_pct > 50 else "stable"
        
        color = "#ef4444" if risk_pct >= 75 else "#f97316" if risk_pct >= 50 else "#22c55e"
        
        response_data.append({
            **d,
            "risk": int(risk_pct * 0.9), # Current (approx)
            "projected_risk": risk_pct,  # Future
            "trend": trend,
            "color": color
        })
        
    return jsonify({"districts": response_data})

@app.route('/api/manager/sensors')
def manager_sensors():
    # Mock real-time sensor array - Competition Ready Data
    return jsonify({
        "salinity": {"value": 1.2, "unit": "ppt", "status": "Alert", "trend": "up"}, # High salinity alert
        "rainfall": {"value": 45, "unit": "mm", "status": "High", "trend": "up"},
        "temperature": {"value": 32.5, "unit": "°C", "status": "Elevated", "trend": "up"},
        "water_level": {"value": 1.4, "unit": "m", "status": "alert", "trend": "up"}
    })

@app.route('/api/manager/priority-zones')
def manager_priority_zones():
    # Top hotspots matching the mockup logic
    return jsonify([
        {
            "id": "Z1",
            "name": "Ninh Kieu, Ward 5",
            "mosquito_index": 8.8,
            "risk_label": "CRITICAL",
            "status": "Pending",
            "action_needed": "Immediate Spraying"
        },
        {
            "id": "Z2",
            "name": "Cai Rang, Hung Phu",
            "mosquito_index": 7.2,
            "risk_label": "HIGH",
            "status": "Scheduled",
            "action_needed": "Larvicide"
        },
        {
            "id": "Z3",
            "name": "O Mon, Phuoc Thoi",
            "mosquito_index": 6.5,
            "risk_label": "ELEVATED",
            "status": "In Progress",
            "action_needed": "Community Cleanup"
        }
    ])

@app.route('/api/manager/broadcast', methods=['POST'])
def manager_broadcast():
    data = request.json
    zone_id = data.get('zone_id')
    message = data.get('message', 'Urgent Dengue Alert')
    
    # Mock sending to Firebase/SMS
    return jsonify({
        "success": True,
        "recipients": 5420,
        "zone": zone_id,
        "status": "Sent"
    })

@app.route('/api/manager/roi-stats')
def manager_roi():
    # Impact calculations - Fake for Value Demonstration
    return jsonify({
        "cases_avoided": 342,
        "money_saved_usd": 51300, # $150 * 342
        "money_saved_vnd": 1282500000, 
        "citizen_actions": 5230,
        "prevention_rate_improvement": "24%"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5328, debug=True)
