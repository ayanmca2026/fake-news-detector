import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.ai.inference import InferenceEngine

def run_inferences():
    engine = InferenceEngine()
    
    samples = [
        {
            "headline": "Aliens Land in Central Park",
            "content": "Shocking news! Extraterrestrials have landed their spaceship right in the middle of Central Park. You won't believe what they said to the mayor! MUST WATCH!!"
        },
        {
            "headline": "Federal Reserve Announces New Interest Rate Hike",
            "content": "WASHINGTON (Reuters) - The Federal Reserve on Wednesday raised interest rates by a quarter of a percentage point, citing continued economic growth and strong labor market conditions."
        },
        {
            "headline": "Local Man Finds Rare Coin",
            "content": "A local hobbyist discovered a rare 19th-century coin while using a metal detector in his backyard yesterday morning. Experts say it could be worth thousands."
        }
    ]
    
    for i, s in enumerate(samples):
        print(f"\n--- Test {i+1} ---")
        print(f"Headline: {s['headline']}")
        res = engine.analyze(s['headline'], s['content'])
        print(f"Prediction: {res['prediction']}")
        print(f"Confidence: {res['confidence']}% ({res['confidence_level']})")
        print(f"Credibility Score: {res['credibility_score']} ({res['risk_level']})")
        print(f"Keywords: {res['keywords']}")

if __name__ == "__main__":
    run_inferences()
