import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

# Load data
try:
    df = pd.read_csv('mekong_dengue_data.csv')
except FileNotFoundError:
    print("Error: 'mekong_dengue_data.csv' not found. Please run data_gen.py first.")
    exit(1)

# Prepare features
X = df[['Temperature', 'Rainfall', 'Humidity', 'Salinity']]
y = df['Risk_Percentage']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'dengue_model.pkl')

print(f"Model trained and saved to 'dengue_model.pkl'")
print(f"Model accuracy (R^2 score) on test set: {model.score(X_test, y_test):.2%}")
