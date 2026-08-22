import os
import sys
import pandas as pd
from sklearn.model_selection import train_test_split

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from training.dataset_config import DATASET_CONFIG
from training.preprocess import TextPreprocessor, normalize_dataset

def run_preprocessing():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "raw")
    processed_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "processed")
    
    os.makedirs(processed_dir, exist_ok=True)
    
    true_path = os.path.join(data_dir, DATASET_CONFIG["split_files"]["true_file"])
    fake_path = os.path.join(data_dir, DATASET_CONFIG["split_files"]["fake_file"])
    
    if not os.path.exists(true_path) or not os.path.exists(fake_path):
        print(f"Error: Could not find split files in {data_dir}. Expected {DATASET_CONFIG['split_files']['true_file']} and {DATASET_CONFIG['split_files']['fake_file']}")
        return
        
    print(f"Loading {true_path}...")
    df_true = pd.read_csv(true_path)
    print(f"Loading {fake_path}...")
    df_fake = pd.read_csv(fake_path)
    
    print("Normalizing dataset (Assigning labels 0=REAL, 1=FAKE)...")
    df = normalize_dataset(df_true, df_fake)
    print(f"Total samples after combining and deduplication: {len(df)}")
    
    print("Preprocessing text (This may take a few minutes)...")
    preprocessor = TextPreprocessor()
    df['clean_text'] = df['combined_text'].apply(preprocessor.clean_text)
    
    # Remove rows that became empty after cleaning
    df = df[df['clean_text'].str.strip().astype(bool)]
    
    print(f"Total samples after cleaning: {len(df)}")
    
    print("Splitting dataset (70% Train, 15% Validation, 15% Test)...")
    X = df['clean_text']
    y = df['label']
    
    # Stratified split: 70% train, 30% temp
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    
    # Split temp into 15% validation and 15% test
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    
    train_df = pd.DataFrame({'text': X_train, 'label': y_train})
    val_df = pd.DataFrame({'text': X_val, 'label': y_val})
    test_df = pd.DataFrame({'text': X_test, 'label': y_test})
    
    train_path = os.path.join(processed_dir, 'train.csv')
    val_path = os.path.join(processed_dir, 'validation.csv')
    test_path = os.path.join(processed_dir, 'test.csv')
    
    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)
    test_df.to_csv(test_path, index=False)
    
    print(f"Saved splits to {processed_dir}:")
    print(f"Train: {len(train_df)} samples")
    print(f"Validation: {len(val_df)} samples")
    print(f"Test: {len(test_df)} samples")

if __name__ == "__main__":
    run_preprocessing()
