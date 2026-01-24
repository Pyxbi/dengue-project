import numpy as np

def engineer_features(weather_history):
    """
    weather_history: list of dicts (last 14 days)
    """
    temps = np.array([d['temp'] for d in weather_history])
    rains = np.array([d['rainfall'] for d in weather_history])
    hums = np.array([d['humidity'] for d in weather_history])

    features = {
        "temp_avg_7d": temps[-7:].mean(),
        "humidity_avg_7d": hums[-7:].mean(),
        "rain_sum_14d": rains.sum(),
        "temp_trend": temps[-1] - temps[0],
        "rain_trend": rains[-7:].sum() - rains[:7].sum(),
        "salinity_flag": weather_history[-1].get("salinity", 0.5)
    }
    return features
