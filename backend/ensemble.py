def ensemble_predict(ml_risk, rule_risk, trend_score):
    return int(
        0.5 * ml_risk +
        0.3 * rule_risk +
        0.2 * trend_score
    )
