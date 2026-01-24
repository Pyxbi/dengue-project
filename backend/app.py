from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import requests
import os
from dotenv import load_dotenv
import datetime
import sqlite3
import random
import uuid

# --------------------
# App Setup
# --------------------
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --------------------
# Model Loading
# --------------------
try:
    model = joblib.load("dengue_model.pkl")
    USE_ML = True
    print("Loaded ML model")
except:
    USE_ML = False
    print("Using rule-based prediction")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# --------------------
# Weather Helpers
# --------------------
def get_real_weather(lat, lon):
    if not OPENWEATHER_API_KEY:
        return None
    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        )
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            d = r.json()
            return {
                "temp": d["main"]["temp"],
                "humidity": d["main"]["humidity"],
                "rainfall": d.get("rain", {}).get("1h", 0) * 24,
                "salinity": 0.5,
            }
    except Exception as e:
        print("Weather error:", e)
    return None

def get_forecast_weather(lat, lon, days_ahead=2):
    if not OPENWEATHER_API_KEY:
        return None
    try:
        url = (
            f"https://api.openweathermap.org/data/2.5/forecast"
            f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        )
        r = requests.get(url, timeout=5)
        if r.status_code != 200:
            return None

        data = r.json()
        target_date = (datetime.datetime.now() + datetime.timedelta(days=days_ahead)).date()

        items = []
        for item in data["list"]:
            if datetime.datetime.fromtimestamp(item["dt"]).date() == target_date:
                items.append(item)

        if not items:
            items = [data["list"][-1]]

        return {
            "temp": np.mean([x["main"]["temp"] for x in items]),
            "humidity": np.mean([x["main"]["humidity"] for x in items]),
            "rainfall": sum([x.get("rain", {}).get("3h", 0) for x in items]) * 4,
            "salinity": 0.5,
        }
    except Exception as e:
        print("Forecast error:", e)
    return None

# --------------------
# Risk Prediction Logic (CENTRALIZED)
# --------------------
def rule_based_predict(temp, rainfall, humidity, salinity):
    risk = 0

    if 25 <= temp <= 30:
        risk += 35
    elif 23 <= temp < 25 or 30 < temp <= 32:
        risk += 20
    else:
        risk += 5

    if rainfall > 150:
        risk += 35
    elif rainfall > 80:
        risk += 20
    else:
        risk += 5

    if humidity > 75:
        risk += 25
    elif humidity > 65:
        risk += 15
    else:
        risk += 5

    if salinity > 2:
        risk -= 10

    return min(95, max(10, risk + np.random.randint(-3, 3)))

def predict_risk(weather):
    if USE_ML:
        features = np.array([[
            weather["temp"],
            weather["rainfall"],
            weather["humidity"],
            weather["salinity"]
        ]])
        return int(model.predict(features)[0])
    else:
        return int(
            rule_based_predict(
                weather["temp"],
                weather["rainfall"],
                weather["humidity"],
                weather["salinity"]
            )
        )

# --------------------
# Citizen APIs
# --------------------
@app.route("/api/risk")
def get_risk():
    lat = float(request.args.get("lat", 10.03))
    lon = float(request.args.get("lon", 105.78))

    weather = get_real_weather(lat, lon) or {
        "temp": np.random.uniform(27, 31),
        "rainfall": np.random.uniform(100, 250),
        "humidity": np.random.uniform(75, 88),
        "salinity": 0.5,
    }

    risk_pct = predict_risk(weather)

    if risk_pct >= 75:
        level, color = "HIGH", "#FF5733"
    elif risk_pct >= 50:
        level, color = "MEDIUM", "#FFA500"
    else:
        level, color = "LOW", "#4CAF50"

    return jsonify({
        "risk_percentage": risk_pct,
        "risk_level": level,
        "confidence": 94,
        "factors": {
            "temperature": f"{weather['temp']:.1f}°C",
            "rainfall": f"{weather['rainfall']:.0f}mm",
            "humidity": f"{weather['humidity']:.0f}%",
        },
        "last_update": "Just now" if OPENWEATHER_API_KEY else "Simulated",
        "color": color,
    })

@app.route("/api/forecast")
def forecast():
    lat = float(request.args.get("lat", 10.03))
    lon = float(request.args.get("lon", 105.78))
    days = int(request.args.get("days", 2))

    weather = get_forecast_weather(lat, lon, days) or {
        "temp": np.random.uniform(28, 33),
        "rainfall": np.random.uniform(50, 150),
        "humidity": np.random.uniform(70, 85),
        "salinity": 0.5,
    }

    risk_pct = predict_risk(weather)

    if risk_pct >= 75:
        level, color = "HIGH", "#FF5733"
    elif risk_pct >= 50:
        level, color = "MEDIUM", "#FFA500"
    else:
        level, color = "LOW", "#4CAF50"

    date_label = (datetime.datetime.now() + datetime.timedelta(days=days)).strftime("%A, %b %d")

    return jsonify({
        "risk_percentage": risk_pct,
        "risk_level": level,
        "date": date_label,
        "factors": {
            "temperature": f"{weather['temp']:.1f}°C",
            "rainfall": f"{weather['rainfall']:.0f}mm",
            "humidity": f"{weather['humidity']:.0f}%",
        },
        "color": color,
    })

@app.route("/api/heatmap")
def heatmap():
    offset = int(request.args.get("date_offset", 0))
    np.random.seed(42 + offset)

    zones = []
    base_lat, base_lon = 10.03, 105.78

    for la in np.arange(-5, 5, 0.2):
        for lo in np.arange(-3, 3, 0.2):
            risk = np.random.randint(20, 95)
            zones.append({
                "lat": round(base_lat + la + np.random.random() * 0.02, 3),
                "lon": round(base_lon + lo + np.random.random() * 0.02, 3),
                "risk": risk,
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
        {"id": "T5", "desc": "Complete a 3-question Dengue quiz", "points": 20, "type": "quiz"},
        {"id": "wash_hands", "desc": "Wash hands with soap", "points": 50, "type": "photo"}
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
    image_base64 = data.get('image') 
    
    if not image_base64:
        return jsonify({"verified": False, "message": "No image provided. Please upload a photo to verify."}), 400

    # Simulate AI processing time/logic
    # In a real app, decode base64 and pass to model
    # For now, we trust the user if they send an image
    
    verified = True 
    
    date_str = datetime.date.today().isoformat()
    
    conn = sqlite3.connect('dengue.db')
    c = conn.cursor()
    
    # Check if already completed to avoid double counting
    c.execute("SELECT status FROM user_daily_tasks WHERE user_id=? AND task_id=? AND date=?", (user_id, task_id, date_str))
    existing = c.fetchone()
    if existing and existing[0] == 'completed':
         conn.close()
         return jsonify({"verified": True, "points_earned": 0, "message": "Task already completed!"})

    if verified:
        c.execute("UPDATE user_daily_tasks SET status='completed' WHERE user_id=? AND task_id=? AND date=?", 
                  (user_id, task_id, date_str))
        conn.commit()
        
        # Find points (from pools)
        points = 0
        found_task = False
        for pool in TASK_POOLS.values():
             for t in pool:
                if t['id'] == task_id:
                    points = t['points']
                    found_task = True
                    break
             if found_task: break
        
        conn.close()
        return jsonify({
            "verified": True,
            "points_earned": points,
            "message": "Excellent work! Sentinel AI verified your action."
        })
    else:
        conn.close()
        return jsonify({"verified": False, "message": "Could not verify the action. Please try again."})


@app.route('/api/vouchers')
def get_vouchers():
    # Mock Vouchers
    vouchers = [
        {"id": "V1", "title": "50% Off Mosquito Net", "points": 500, "merchant": "Pharmacity"},
        {"id": "V2", "title": "Free Coffee", "points": 200, "merchant": "Highlands Coffee"},
        {"id": "V3", "title": "Cinema Ticket", "points": 1000, "merchant": "CGV Cinemas"},
        {"id": "V4", "title": "Grab Bike 20k Off", "points": 300, "merchant": "Grab"},
        {"id": "V5", "title": "Free Dengue Rapid Test", "points": 1500, "merchant": "City Hospital"}
    ]
    return jsonify({"vouchers": vouchers, "user_points": 1240}) # Mock points

@app.route('/api/vouchers/redeem', methods=['POST'])
def redeem_voucher():
    data = request.json
    user_id = data.get('user_id')
    voucher_id = data.get('voucher_id')
    
    # Mock redemption logic
    # In reality, check balance in DB, deduct, create transaction
    
    # Simulate DB Update
    new_balance = 1240 - 200 # Mock calculation
    
    # Generate a fake QR code URL (using a placeholder service or just a static string)
    # Using a reliable QR placeholder service for demo
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DENGUE-{voucher_id}-{uuid.uuid4().hex[:6].upper()}"
    
    return jsonify({
        "success": True,
        "new_balance": new_balance,
        "qr_code": qr_code_url,
        "message": "Voucher redeemed successfully!"
    })



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
