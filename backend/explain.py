def explain_risk(features):
    explanations = []

    if features["temp_avg_7d"] > 28:
        explanations.append("High average temperature increased mosquito activity")

    if features["rain_sum_14d"] > 100:
        explanations.append("Recent heavy rainfall created breeding sites")

    if features["humidity_avg_7d"] > 75:
        explanations.append("High humidity prolonged mosquito survival")

    if features["temp_trend"] > 1:
        explanations.append("Warming trend accelerating transmission risk")

    return explanations
