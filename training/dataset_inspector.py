import os
import pandas as pd
from typing import Dict, List, Any

class DatasetInspector:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.files = []
        self._find_files()

    def _find_files(self):
        for f in os.listdir(self.data_dir):
            if f.endswith(('.csv', '.json', '.xlsx', '.xls')):
                self.files.append(os.path.join(self.data_dir, f))

    def inspect(self) -> List[Dict[str, Any]]:
        results = []
        for file_path in self.files:
            file_name = os.path.basename(file_path)
            try:
                if file_name.endswith('.csv'):
                    df = pd.read_csv(file_path)
                elif file_name.endswith('.json'):
                    df = pd.read_json(file_path)
                elif file_name.endswith(('.xlsx', '.xls')):
                    df = pd.read_excel(file_path)
                else:
                    continue
                
                rows, cols = df.shape
                columns = df.columns.tolist()
                dtypes = df.dtypes.astype(str).to_dict()
                missing = df.isnull().sum().to_dict()
                duplicates = int(df.duplicated().sum())
                
                # Detect columns heuristically
                detected_title = self._detect_column(columns, ['title', 'headline', 'news_title'])
                detected_text = self._detect_column(columns, ['text', 'article', 'content', 'body', 'news', 'article_text'])
                detected_label = self._detect_column(columns, ['label', 'target', 'class', 'category', 'is_fake'])
                detected_source = self._detect_column(columns, ['source', 'url', 'domain', 'publisher'])
                detected_date = self._detect_column(columns, ['date', 'time', 'timestamp', 'published'])
                
                label_dist = {}
                if detected_label:
                    label_dist = df[detected_label].value_counts().to_dict()

                results.append({
                    "file": file_name,
                    "rows": rows,
                    "columns_count": cols,
                    "columns": columns,
                    "dtypes": dtypes,
                    "missing": missing,
                    "duplicates": duplicates,
                    "detected": {
                        "title": detected_title,
                        "text": detected_text,
                        "label": detected_label,
                        "source": detected_source,
                        "date": detected_date
                    },
                    "label_dist": label_dist
                })
            except Exception as e:
                results.append({
                    "file": file_name,
                    "error": str(e)
                })
        return results

    def _detect_column(self, columns: List[str], candidates: List[str]) -> str:
        columns_lower = [c.lower() for c in columns]
        for candidate in candidates:
            for i, col in enumerate(columns_lower):
                if candidate in col or col in candidate:
                    return columns[i]
        return None
