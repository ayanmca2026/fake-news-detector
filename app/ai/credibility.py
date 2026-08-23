import re

class CredibilityEngine:
    """
    Computes a credibility score (0-100) for an article using both
    surface-level heuristic signals AND the ML model's prediction output.
    
    The score reflects how credible the article appears overall:
      - High score (80-100) = appears credible
      - Medium score (40-79) = mixed signals
      - Low score (0-39) = appears not credible
    """
    
    def analyze(self, text: str, title: str = "", prediction: str = "REAL", confidence: float = 50.0):
        """
        Args:
            text: article body
            title: article headline
            prediction: ML model prediction label ("REAL", "FAKE", or "UNCERTAIN")
            confidence: ML model confidence as a percentage (0-100)
        
        Returns:
            dict with score (0-100), risk_level, and indicators
        """
        score = 100.0
        indicators = []
        
        full_text = (title + " " + text).strip()
        
        # ── Heuristic signals (surface-level) ──
        
        # 1. Excessive capital letters in title
        if title:
            alpha_chars = [c for c in title if c.isalpha()]
            if len(alpha_chars) > 0:
                caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
                if caps_ratio > 0.5:
                    score -= 10
                    indicators.append("Title has excessive capitalization (sensationalism).")
                    
        # 2. Excessive punctuation (multiple exclamation / question marks)
        if re.search(r'!!+|\?\?+', full_text):
            score -= 8
            indicators.append("Excessive exclamation or question marks.")
            
        # 3. Clickbait / Sensational phrasing
        clickbait_phrases = [
            "you won't believe", "shocking", "must watch", "mind blowing",
            "secret", "truth about", "exposed", "what they don't want you to know",
            "miracle", "cure", "immediately", "every disease"
        ]
        lower_text = full_text.lower()
        found_phrases = [p for p in clickbait_phrases if p in lower_text]
        if found_phrases:
            score -= min(20, 8 * len(found_phrases))
            indicators.append(f"Contains sensational phrases: {', '.join(found_phrases)}.")
            
        # 4. Article length
        words = full_text.split()
        if len(words) < 50:
            score -= 15
            indicators.append("Article is suspiciously short, lacking depth.")
        
        # ── ML model signal (most important factor) ──
        # The model's prediction and confidence should heavily influence credibility
        
        if prediction == "FAKE":
            # Model says FAKE — reduce credibility proportionally to confidence
            # At 98% confidence FAKE: penalty = 0.98 * 45 = ~44 points
            # At 60% confidence FAKE: penalty = 0.60 * 45 = ~27 points
            ml_penalty = (confidence / 100.0) * 45
            score -= ml_penalty
            indicators.append(
                f"ML model predicts FAKE with {confidence:.1f}% confidence."
            )
        elif prediction == "UNCERTAIN":
            # Model is uncertain — moderate credibility reduction
            score -= 15
            indicators.append("ML model is uncertain about this article's authenticity.")
        else:
            # Model says REAL — slight credibility boost (cap at 100)
            ml_boost = (confidence / 100.0) * 10
            score = min(100, score + ml_boost)
        
        # Bound score between 0 and 100
        score = max(0, min(100, round(score)))
        
        # ── Risk level derived from BOTH prediction and credibility score ──
        risk = self._calculate_risk(prediction, confidence, score)
            
        return {
            "score": score,
            "risk_level": risk,
            "indicators": indicators
        }
    
    def _calculate_risk(self, prediction: str, confidence: float, credibility_score: int) -> str:
        """
        Risk reflects how likely this article is to be misinformation.
        Combines the ML prediction, confidence, and credibility score.
        """
        if prediction == "FAKE":
            if confidence >= 80:
                return "HIGH"
            elif confidence >= 60:
                return "MEDIUM"
            else:
                return "MEDIUM"
        elif prediction == "UNCERTAIN":
            return "MEDIUM"
        else:  # REAL
            if confidence >= 80:
                return "LOW"
            elif confidence >= 60:
                return "LOW"
            else:
                return "MEDIUM"
