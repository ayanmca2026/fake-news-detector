import os, sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.ai.inference import InferenceEngine

engine = InferenceEngine()

# Microsoft test article from the user's bug report
res = engine.analyze(
    "Microsoft Announces New AI Tools for Software Developers",
    "Microsoft announced new artificial intelligence tools designed to help software developers write, test, and understand code. The company said the tools are intended to improve developer productivity while providing features for code analysis and debugging. The announcement was made as part of Microsoft's broader investment in artificial intelligence technologies."
)

print("MICROSOFT ARTICLE TEST")
print("=" * 50)
print(f"Prediction:      {res['prediction']}")
print(f"Confidence:      {res['confidence']}% ({res['confidence_level']})")
print(f"Credibility:     {res['credibility_score']} / 100")
print(f"Risk:            {res['risk_level']}")
print(f"Keywords:        {res['keywords']}")
print(f"Model:           {res['model_name']}")
print(f"Summary:         {res['summary'][:100]}...")
print()

# Assertions
assert res['credibility_score'] != 100, f"FAIL: credibility is still 100"
if res['prediction'] == 'FAKE' and res['confidence'] >= 60:
    assert res['risk_level'] != 'LOW', f"FAIL: FAKE+{res['confidence']}% should not be LOW risk"
    assert res['credibility_score'] < 80, f"FAIL: FAKE+{res['confidence']}% should have credibility < 80"

assert isinstance(res['keywords'], list), "FAIL: keywords not a list"
assert len(res['keywords']) > 1, "FAIL: should have multiple keywords"
for kw in res['keywords']:
    assert len(kw) < 25, f"FAIL: keyword concatenated: '{kw}'"

assert 'Random Forest' in res['model_name'], f"FAIL: model_name wrong: {res['model_name']}"

print("ALL ASSERTIONS PASSED")
