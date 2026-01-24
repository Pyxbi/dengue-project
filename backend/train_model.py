import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import joblib

# -------------------------------
# 1. Load Dataset
# -------------------------------
DATA_FILE = "mekong_dengue_data.csv"

try:
    df = pd.read_csv(DATA_FILE)
except FileNotFoundError:
    raise FileNotFoundError(
        "Dataset not found. Please run data_gen.py first to generate training data."
    )

# -------------------------------
# 2. Feature Engineering
# -------------------------------

# Sort for time-series style processing (synthetic but consistent)
df = df.reset_index(drop=True)

# Rolling averages (simulate lag effects)
df["temp_avg_7d"] = df["Temperature"].rolling(window=7, min_periods=1).mean()
df["humidity_avg_7d"] = df["Humidity"].rolling(window=7, min_periods=1).mean()
df["rain_sum_14d"] = df["Rainfall"].rolling(window=14, min_periods=1).sum()

# Trends (difference over time)
df["temp_trend"] = df["Temperature"].diff().fillna(0)
df["rain_trend"] = df["Rainfall"].diff().fillna(0)

# Salinity modifier (kept as is)
df["salinity_flag"] = df["Salinity"]

# -------------------------------
# 3. Define Features & Target
# -------------------------------
FEATURES = [
    "temp_avg_7d",
    "humidity_avg_7d",
    "rain_sum_14d",
    "temp_trend",
    "rain_trend",
    "salinity_flag"
]

X = df[FEATURES]
y = df["Risk_Percentage"]

# -------------------------------
# 4. Train / Test Split
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------------
# 5. Train Model (Enhanced)
# -------------------------------
model = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=4,
    random_state=42
)

model.fit(X_train, y_train)

# -------------------------------
# 6. Evaluate Model
# -------------------------------
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)

print("✅ Model training complete")
print(f"📈 R² Score on test set: {r2:.3f}")

# -------------------------------
# 7. Save Model
# -------------------------------
MODEL_FILE = "dengue_model_v2.pkl"
joblib.dump(model, MODEL_FILE)

print(f"💾 Model saved as '{MODEL_FILE}'")

# -------------------------------
# 8. Feature Importance (Explainability)
# -------------------------------
feature_importance = pd.DataFrame({
    "feature": FEATURES,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)

print("\n🔍 Feature Importance:")
print(feature_importance.to_string(index=False))
