import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.ai.inference import InferenceEngine

def run_tests():
    engine = InferenceEngine()
    
    # Test A: Real news article
    print("=" * 60)
    print("TEST A: Real-sounding news")
    print("=" * 60)
    res_a = engine.analyze(
        "NASA Successfully Launches New Earth Observation Satellite",
        "NASA successfully launched a new Earth observation satellite from Cape Canaveral on Wednesday. The satellite, part of the agency's ongoing efforts to monitor climate change, will orbit the planet and collect data on atmospheric conditions, sea level changes, and deforestation patterns. Scientists at NASA's Goddard Space Flight Center said the mission will provide critical data for climate research over the next decade."
    )
    print(f"Prediction:    {res_a['prediction']}")
    print(f"Confidence:    {res_a['confidence']}% ({res_a['confidence_level']})")
    print(f"Credibility:   {res_a['credibility_score']} / 100")
    print(f"Risk:          {res_a['risk_level']}")
    print(f"Keywords:      {res_a['keywords']}")
    print(f"Model:         {res_a['model_name']}")
    print()
    
    # Test B: Fake-sounding news article
    print("=" * 60)
    print("TEST B: Fake-sounding news")
    print("=" * 60)
    res_b = engine.analyze(
        "Scientists Confirm That Drinking Hot Water Immediately Makes Humans Immune to Every Disease",
        "In a shocking discovery, scientists have confirmed that drinking hot water immediately makes every human being immune to every disease known to mankind. You won't believe what researchers found! The truth about hot water has been hidden from the public for decades. This miracle cure was exposed by anonymous sources who claim that pharmaceutical companies have been suppressing this information. Must watch and share with everyone you know!!"
    )
    print(f"Prediction:    {res_b['prediction']}")
    print(f"Confidence:    {res_b['confidence']}% ({res_b['confidence_level']})")
    print(f"Credibility:   {res_b['credibility_score']} / 100")
    print(f"Risk:          {res_b['risk_level']}")
    print(f"Keywords:      {res_b['keywords']}")
    print(f"Model:         {res_b['model_name']}")
    print()
    
    # Test C: Ambiguous / short text
    print("=" * 60)
    print("TEST C: Short ambiguous text")
    print("=" * 60)
    res_c = engine.analyze(
        "Breaking News Update",
        "Something happened today that nobody expected."
    )
    print(f"Prediction:    {res_c['prediction']}")
    print(f"Confidence:    {res_c['confidence']}% ({res_c['confidence_level']})")
    print(f"Credibility:   {res_c['credibility_score']} / 100")
    print(f"Risk:          {res_c['risk_level']}")
    print(f"Keywords:      {res_c['keywords']}")
    print(f"Model:         {res_c['model_name']}")
    print()
    
    # Assertions
    print("=" * 60)
    print("ASSERTIONS")
    print("=" * 60)
    
    # If Test B predicts FAKE with high confidence, credibility must NOT be 100
    if res_b['prediction'] == 'FAKE' and res_b['confidence'] >= 80:
        assert res_b['credibility_score'] < 80, f"FAIL: FAKE 98% should NOT have credibility >= 80, got {res_b['credibility_score']}"
        assert res_b['risk_level'] == 'HIGH', f"FAIL: FAKE 98% should be HIGH risk, got {res_b['risk_level']}"
        print("PASS: High-confidence FAKE has low credibility and HIGH risk")
    
    # Keywords must be a list of individual strings
    assert isinstance(res_b['keywords'], list), "FAIL: keywords is not a list"
    assert len(res_b['keywords']) > 0, "FAIL: keywords is empty"
    for kw in res_b['keywords']:
        assert ' ' not in kw or len(kw.split()) <= 3, f"FAIL: keyword too long: {kw}"
        assert len(kw) < 30, f"FAIL: keyword suspiciously long (concatenated?): {kw}"
    print("PASS: Keywords are properly separated individual terms")
    
    # Model name should reflect actual model
    assert 'Random Forest' in res_b['model_name'], f"FAIL: model_name should contain 'Random Forest', got {res_b['model_name']}"
    print("PASS: Model name correctly reports Random Forest")
    
    print()
    print("ALL ASSERTIONS PASSED")

if __name__ == "__main__":
    run_tests()
