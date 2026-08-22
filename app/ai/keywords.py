import re
from collections import Counter

class KeywordExtractor:
    def __init__(self, stop_words=None):
        self.stop_words = stop_words or set([
            "the", "and", "to", "of", "a", "in", "that", "is", "for", "it", 
            "with", "on", "as", "was", "he", "be", "this", "by", "are", "not",
            "at", "but", "from", "has", "they", "his", "an", "have", "who",
            "which", "or", "will", "their", "would", "about", "been", "there",
            "we", "out", "when", "after", "said", "also", "had", "up", "can"
        ])
        
    def extract(self, text: str, num_keywords: int = 5):
        # Basic tokenization
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter stop words
        meaningful_words = [w for w in words if w not in self.stop_words]
        
        # Count frequency
        counts = Counter(meaningful_words)
        
        # Return top N
        return [word for word, count in counts.most_common(num_keywords)]
