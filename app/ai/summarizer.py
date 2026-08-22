import re
import nltk
from nltk.tokenize import sent_tokenize
from collections import Counter
import math

class ExtractiveSummarizer:
    def __init__(self):
        try:
            nltk.data.find('tokenizers/punkt_tab')
        except LookupError:
            nltk.download('punkt', quiet=True)
            nltk.download('punkt_tab', quiet=True)
            
        self.stop_words = set([
            "the", "and", "to", "of", "a", "in", "that", "is", "for", "it", 
            "with", "on", "as", "was", "he", "be", "this", "by", "are", "not",
            "at", "but", "from", "has", "they", "his", "an", "have", "who",
            "which", "or", "will", "their", "would", "about", "been", "there",
            "we", "out", "when", "after", "said", "also", "had", "up", "can"
        ])

    def summarize(self, text: str, max_sentences: int = 3) -> str:
        if not text or len(text.strip()) == 0:
            return ""
            
        sentences = sent_tokenize(text)
        if len(sentences) <= max_sentences:
            return text
            
        # Basic scoring based on word frequencies (Luhn's heuristic)
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        meaningful_words = [w for w in words if w not in self.stop_words]
        word_frequencies = Counter(meaningful_words)
        
        max_freq = max(word_frequencies.values()) if word_frequencies else 1
        for word in word_frequencies:
            word_frequencies[word] = word_frequencies[word] / max_freq
            
        sentence_scores = {}
        for i, sentence in enumerate(sentences):
            sentence_words = re.findall(r'\b[a-zA-Z]{3,}\b', sentence.lower())
            score = 0
            for word in sentence_words:
                if word in word_frequencies:
                    score += word_frequencies[word]
            # Normalize by sentence length to not bias purely by length
            if len(sentence_words) > 0:
                sentence_scores[i] = score / math.sqrt(len(sentence_words))
            else:
                sentence_scores[i] = 0
                
        # Get top N sentences by score
        top_sentences_indices = sorted(
            sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:max_sentences]
        )
        
        summary = " ".join([sentences[i] for i in top_sentences_indices])
        return "[AI Summary] " + summary

class SummarizationService:
    def __init__(self):
        self.summarizer = ExtractiveSummarizer()
        
    def generate_summary(self, text: str) -> str:
        return self.summarizer.summarize(text)
