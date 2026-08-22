import re

class CredibilityEngine:
    def analyze(self, text: str, title: str = ""):
        score = 100
        indicators = []
        
        full_text = title + " " + text
        
        # 1. Excessive capital letters in title
        if title:
            caps_ratio = sum(1 for c in title if c.isupper()) / max(1, len(title.replace(" ", "")))
            if caps_ratio > 0.3:
                score -= 15
                indicators.append("Title has excessive capitalization (sensationalism).")
                
        # 2. Excessive punctuation (multiple exclamation marks)
        if re.search(r'!!+|\?\?+', full_text):
            score -= 10
            indicators.append("Excessive exclamation or question marks.")
            
        # 3. Clickbait / Sensational phrasing
        clickbait_phrases = ["you won't believe", "shocking", "must watch", "mind blowing", "secret", "truth about"]
        lower_text = full_text.lower()
        found_phrases = [p for p in clickbait_phrases if p in lower_text]
        if found_phrases:
            score -= (10 * len(found_phrases))
            indicators.append(f"Contains sensational phrases: {', '.join(found_phrases)}.")
            
        # 4. Article length
        words = full_text.split()
        if len(words) < 50:
            score -= 20
            indicators.append("Article is suspiciously short, lacking depth.")
            
        # Bound score
        score = max(0, min(100, score))
        
        if score >= 80:
            risk = "LOW"
        elif score >= 50:
            risk = "MEDIUM"
        else:
            risk = "HIGH"
            
        return {
            "score": score,
            "risk_level": risk,
            "indicators": indicators
        }
