# Configuration for Kaggle dataset mappings
# The defaults here use None for automatic detection, but since the ISOT Fake News Dataset
# separates Fake and True into two CSV files, we need special handling if that's detected.

DATASET_CONFIG = {
    # If the files are already split by class (e.g. True.csv and Fake.csv)
    # The normalization step will use the filename to assign labels
    "split_files": {
        "true_file": "True.csv",
        "fake_file": "Fake.csv"
    },
    
    # Overrides for specific columns
    "title_column": None,
    "text_column": None,
    "label_column": None,
    "source_column": None,
    "date_column": None,
}
