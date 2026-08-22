import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string

# We will download NLTK data lazily
_nltk_downloaded = False

def _ensure_nltk():
    global _nltk_downloaded
    if not _nltk_downloaded:
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('omw-1.4', quiet=True)
        _nltk_downloaded = True

class TextPreprocessor:
    def __init__(self):
        _ensure_nltk()
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def clean_text(self, text: str) -> str:
        if not isinstance(text, str):
            return ""
            
        # Lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'https?://\S+|www\.\S+', '', text)
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove punctuation
        text = text.translate(str.maketrans('', '', string.punctuation))
        
        # Remove numbers
        text = re.sub(r'\d+', '', text)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Tokenization & Lemmatization (basic)
        tokens = text.split()
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]
        
        return ' '.join(tokens)

def normalize_dataset(df_true: pd.DataFrame, df_fake: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes separated True/Fake dataframes into a single format.
    0 = REAL
    1 = FAKE
    """
    # Assign labels
    df_true['label'] = 0
    df_fake['label'] = 1
    
    # Concatenate
    df_combined = pd.concat([df_true, df_fake], ignore_index=True)
    
    # Handle text columns (title + text if both exist)
    if 'title' in df_combined.columns and 'text' in df_combined.columns:
        df_combined['combined_text'] = df_combined['title'] + " " + df_combined['text']
    elif 'text' in df_combined.columns:
        df_combined['combined_text'] = df_combined['text']
    elif 'title' in df_combined.columns:
        df_combined['combined_text'] = df_combined['title']
    else:
        # Fallback to first string column
        text_cols = df_combined.select_dtypes(include=['object']).columns
        if len(text_cols) > 0:
            df_combined['combined_text'] = df_combined[text_cols[0]]
        else:
            raise ValueError("Could not detect text columns for combined_text.")
            
    # Drop duplicates
    df_combined.drop_duplicates(subset=['combined_text'], inplace=True)
    
    # Remove nulls
    df_combined.dropna(subset=['combined_text'], inplace=True)
    
    return df_combined[['combined_text', 'label']]
