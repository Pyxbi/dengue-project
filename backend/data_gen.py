import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Number of samples
n_samples = 1000

# Generate synthetic features
data = {
    'Temperature': np.random.uniform(20, 35, n_samples),  # 20 to 35 degrees Celsius
    'Rainfall': np.random.uniform(0, 300, n_samples),     # 0 to 300 mm
    'Humidity': np.random.uniform(40, 100, n_samples),    # 40 to 100 %
    'Salinity': np.random.uniform(0, 30, n_samples)       # 0 to 30 ppt
}

df = pd.DataFrame(data)

# Define a function to calculate risk percentage based on some rules with noise
def calculate_risk(row):
    risk = 0
    # Temperature: Optimal 25-30
    if 25 <= row['Temperature'] <= 30:
        risk += 35
    elif 23 <= row['Temperature'] < 25 or 30 < row['Temperature'] <= 32:
        risk += 20
    else:
        risk += 5
    
    # Rainfall: High rainfall increases breeding sites
    if row['Rainfall'] > 150:
        risk += 35
    elif row['Rainfall'] > 80:
        risk += 20
    else:
        risk += 5
    
    # Humidity: High humidity favors mosquito survival
    if row['Humidity'] > 75:
        risk += 25
    elif row['Humidity'] > 65:
        risk += 15
    else:
        risk += 5
    
    # Salinity: Aedes aegypti prefers fresh water
    if row['Salinity'] > 2:
        risk -= 10
        
    # Add random noise
    risk += np.random.randint(-5, 5)
    
    # Clip between 0 and 100
    return min(100, max(0, risk))

df['Risk_Percentage'] = df.apply(calculate_risk, axis=1)

# Save to CSV
df.to_csv('mekong_dengue_data.csv', index=False)
print("Synthetic data generated and saved to 'mekong_dengue_data.csv'")
