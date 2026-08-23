import numpy as np
from collections import Counter
import re

class KeywordExtractor:
    def __init__(self, stop_words=None, vectorizer=None):
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
        self.vectorizer = vectorizer
        if self.vectorizer and hasattr(self.vectorizer, 'get_feature_names_out'):
            self.feature_names = self.vectorizer.get_feature_names_out()
        else:
            self.feature_names = None
        
    def extract(self, text: str, num_keywords: int = 7):
        """
        Extract top keywords from raw (unprocessed) text.
        If a TF-IDF vectorizer is available, it uses TF-IDF weights to find
        meaningful phrases (e.g., 'artificial intelligence').
        Otherwise, falls back to simple token frequency.
        """
        if not text or not text.strip():
            return []
            
        if self.vectorizer and self.feature_names is not None:
            # Use TF-IDF
            try:
                tfidf_matrix = self.vectorizer.transform([text])
                
                # Get non-zero elements
                non_zero_indices = tfidf_matrix.nonzero()[1]
                if len(non_zero_indices) > 0:
                    scores = zip(non_zero_indices, [tfidf_matrix[0, x] for x in non_zero_indices])
                    # Sort by score descending
                    sorted_scores = sorted(scores, key=lambda x: x[1], reverse=True)
                    
                    keywords = []
                    for idx, score in sorted_scores:
                        word = self.feature_names[idx]
                        # Filter out basic stopwords if they sneak through
                        if word.lower() not in self.stop_words:
                            keywords.append(word)
                        if len(keywords) >= num_keywords:
                            break
                    
                    if keywords:
                        return keywords
            except Exception as e:
                print(f"TF-IDF extraction failed, falling back: {e}")
                
        # Fallback to frequency count if TF-IDF isn't available or fails
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        meaningful_words = [w for w in words if w not in self.stop_words]
        
        if not meaningful_words:
            return []
            
        counts = Counter(meaningful_words)
        return [word for word, count in counts.most_common(num_keywords)]
