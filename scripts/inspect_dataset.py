import os
import sys

# Add parent directory to path to import training modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from training.dataset_inspector import DatasetInspector

def run_inspection():
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "raw")
    if not os.path.exists(data_dir):
        print(f"Directory not found: {data_dir}")
        return

    inspector = DatasetInspector(data_dir)
    results = inspector.inspect()
    
    if not results:
        print(f"No valid dataset files found in {data_dir}")
        return
        
    for res in results:
        print("========================================")
        print("DATASET INSPECTION")
        print("========================================")
        if "error" in res:
            print(f"File: {res['file']}")
            print(f"Error loading file: {res['error']}")
            continue
            
        print(f"File: {res['file']}")
        print(f"Rows: {res['rows']}")
        print(f"Columns: {res['columns_count']}\n")
        
        print("Available Columns:")
        for col in res['columns']:
            print(f"- {col} ({res['dtypes'][col]}) - Missing: {res['missing'][col]}")
            
        print("\nDetected Title Column:")
        print(res['detected']['title'] or "None")
        
        print("\nDetected Text Column:")
        print(res['detected']['text'] or "None")
        
        print("\nDetected Label Column:")
        print(res['detected']['label'] or "None")
        
        print("\nDetected Source Column:")
        print(res['detected']['source'] or "None")
        
        print("\nDetected Date Column:")
        print(res['detected']['date'] or "None")
        
        print(f"\nDuplicate Rows:\n{res['duplicates']}")
        
        if res['label_dist']:
            print("\nLabel Distribution:")
            for k, v in res['label_dist'].items():
                print(f"{k}: {v}")
                
        print("========================================\n")

if __name__ == "__main__":
    run_inspection()
