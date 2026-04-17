"""
Quick retrain script - uses CSV directly, no DB needed.
Fixes scikit-learn 1.5+ compatibility (multi_class removed from LogisticRegression).
"""
import os, sys, joblib, csv
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import FeatureUnion
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from ml_pipeline.hybrid_model import HybridSentimentClassifier
from ml_pipeline.preprocessing import preprocess_text

CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        '..', 'training.1600000.processed.noemoticon.csv')
SAMPLE_SIZE = 20000  # 10k pos + 10k neg

print("Loading data from CSV...")
positives, negatives = [], []

with open(CSV_PATH, encoding='latin-1') as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) < 6:
            continue
        try:
            label = int(row[0])
        except ValueError:
            continue
        text = row[5].strip()
        if not text:
            continue
        if label == 4 and len(positives) < SAMPLE_SIZE // 2:
            positives.append((text, 1))
        elif label == 0 and len(negatives) < SAMPLE_SIZE // 2:
            negatives.append((text, 0))
        if len(positives) >= SAMPLE_SIZE // 2 and len(negatives) >= SAMPLE_SIZE // 2:
            break

samples = positives + negatives
np.random.seed(42)
np.random.shuffle(samples)

texts_raw = [s[0] for s in samples]
labels    = [s[1] for s in samples]

print(f"Preprocessing {len(texts_raw)} samples...")
texts = [preprocess_text(t) for t in texts_raw]

X_train, X_test, y_train, y_test = train_test_split(
    texts, labels, test_size=0.2, random_state=42, stratify=labels
)

print("Vectorizing...")
word_vec = TfidfVectorizer(max_features=10000, ngram_range=(1, 3),
                           min_df=3, max_df=0.9, sublinear_tf=True, analyzer='word')
char_vec = TfidfVectorizer(max_features=5000, ngram_range=(2, 5),
                           analyzer='char', sublinear_tf=True)
vectorizer = FeatureUnion([('word', word_vec), ('char', char_vec)])

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf  = vectorizer.transform(X_test)

print("Training model...")
lr = LogisticRegression(C=2.0, max_iter=1000, random_state=42,
                        solver='saga', class_weight='balanced')
model = HybridSentimentClassifier(lr)
model.fit(X_train_tfidf, y_train)

y_pred = model.predict(X_test_tfidf)
acc = accuracy_score(y_test, y_pred)
print(f"Test accuracy: {acc*100:.2f}%")

model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         'ml_pipeline', 'models')
os.makedirs(model_dir, exist_ok=True)
joblib.dump(model,      os.path.join(model_dir, 'sentiment_model.joblib'))
joblib.dump(vectorizer, os.path.join(model_dir, 'tfidf_vectorizer.joblib'))
print("Model and vectorizer saved successfully.")
