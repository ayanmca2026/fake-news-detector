import re
from collections import Counter

class KeywordExtractor:
    def __init__(self, stop_words=None):
        self.stop_words = stop_words or set([
            "the", "and", "to", "of", "a", "in", "that", "is", "for", "it", 
            "with", "on", "as", "was", "he", "be", "this", "by", "are", "not",
            "at", "but", "from", "has", "they", "his", "an", "have", "who",
            "which", "or", "will", "their", "would", "about", "been", "there",
            "we", "out", "when", "after", "said", "also", "had", "up", "can",
            "new", "one", "two", "may", "could", "should", "did", "get", "got",
            "its", "more", "some", "than", "other", "like", "just", "over",
            "such", "what", "how", "all", "her", "she", "him", "into", "most",
            "made", "many", "much", "even", "now", "very", "well", "way",
            "make", "say", "do", "go", "see", "use", "come", "take",
            "reuters", "say", "year", "told", "people", "time", "first",
            "last", "long", "great", "part", "since", "back", "still"
        ])
        
    def extract(self, text: str, num_keywords: int = 7):
        """
        Extract top keywords from raw (unprocessed) text.
        Tokenizes properly, preserving word boundaries.
        """
        if not text or not text.strip():
            return []
        
        # Tokenize: extract words of 3+ alpha characters with proper boundaries
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter stop words
        meaningful_words = [w for w in words if w not in self.stop_words]
        
        if not meaningful_words:
            return []
        
        # Count frequency
        counts = Counter(meaningful_words)
        
        # Return top N as a list of individual keyword strings
        return [word for word, count in counts.most_common(num_keywords)]
