"""
Train sentiment analysis model
"""
import os
import sys
import django
import joblib
import numpy as np
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from services.preprocessing_service import get_training_data

print("=" * 70)
print("SENTIMENT ANALYSIS MODEL TRAINING")
print("=" * 70)

# Step 1: Load and preprocess data
print("\n[Step 1] Loading and preprocessing data...")
X, y = get_training_data(limit=100000)  # Use all 100,000 posts

# Filter out very short texts (less than 3 words)
print(f"Original samples: {len(X)}")
filtered_X = []
filtered_y = []
for text, label in zip(X, y):
    if len(text.split()) >= 3:
        filtered_X.append(text)
        filtered_y.append(label)

X = filtered_X
y = filtered_y

# Filter out None labels and normalize to binary (0, 1)
print(f"Samples before None filtering: {len(X)}")
final_X = []
final_y = []
for text, label in zip(X, y):
    if label is not None:
        # Normalize label to binary: 0 (negative) or 1 (positive)
        # Handle cases where label might be 4 (from Sentiment140 format)
        if label in [0, '0']:
            normalized_label = 0
        elif label in [1, '1', 4, '4']:
            normalized_label = 1
        else:
            # Skip invalid labels
            continue
        
        final_X.append(text)
        final_y.append(normalized_label)

X = final_X
y = final_y

print(f"✓ Loaded {len(X)} samples (after filtering short texts and None labels)")
print(f"  Positive: {sum(y)} ({sum(y)/len(y)*100:.1f}%)")
print(f"  Negative: {len(y) - sum(y)} ({(len(y)-sum(y))/len(y)*100:.1f}%)")

# Step 2: Split data into train/test sets (80/20)
print("\n[Step 2] Splitting data into train/test sets (80/20)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"✓ Training set: {len(X_train)} samples")
print(f"✓ Test set: {len(X_test)} samples")

# Step 3: TF-IDF Vectorization with character n-grams
print("\n[Step 3] Creating TF-IDF features with word and character n-grams...")
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import FeatureUnion

# Word-level TF-IDF
word_vectorizer = TfidfVectorizer(
    max_features=10000,
    ngram_range=(1, 3),
    min_df=3,
    max_df=0.9,
    sublinear_tf=True,
    analyzer='word'
)

# Character-level TF-IDF (captures patterns like "!!!", "???")
char_vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(2, 5),
    analyzer='char',
    sublinear_tf=True
)

# Combine both
vectorizer = FeatureUnion([
    ('word', word_vectorizer),
    ('char', char_vectorizer)
])

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)
print(f"✓ Combined TF-IDF matrix shape: {X_train_tfidf.shape}")

# Step 4: Train ensemble and wrap in hybrid classifier
print("\n[Step 4] Training hybrid ensemble model...")
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import VotingClassifier
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from ml_pipeline.hybrid_model import HybridSentimentClassifier

# Model 1: Naive Bayes
nb_model = MultinomialNB(alpha=0.01)

# Model 2: Logistic Regression
lr_model = LogisticRegression(
    C=2.0,
    max_iter=1000,
    random_state=42,
    solver='saga',
    class_weight='balanced'
)

# Model 3: Calibrated SVM
svm_model = CalibratedClassifierCV(
    LinearSVC(C=1.0, max_iter=2000, random_state=42, class_weight='balanced'),
    cv=3
)

# Ensemble
base_ensemble = VotingClassifier(
    estimators=[
        ('nb', nb_model),
        ('lr', lr_model),
        ('svm', svm_model)
    ],
    voting='soft',
    weights=[1, 2, 1]
)

# Wrap in hybrid classifier
model = HybridSentimentClassifier(base_ensemble)
model.fit(X_train_tfidf, y_train)
print("✓ Hybrid ensemble model training complete!")

# Step 5: Evaluate model with hybrid predictions
print("\n[Step 5] Evaluating model performance...")

# Training accuracy (standard)
y_train_pred = model.predict(X_train_tfidf)
train_accuracy = accuracy_score(y_train, y_train_pred)
print(f"✓ Training Accuracy: {train_accuracy*100:.2f}%")

# Test accuracy with hybrid approach
y_test_pred, y_test_proba = model.predict_with_text(X_test_tfidf, X_test)
test_accuracy = accuracy_score(y_test, y_test_pred)
print(f"✓ Test Accuracy (Hybrid): {test_accuracy*100:.2f}%")

# Classification report
print("\n--- Classification Report ---")
print(classification_report(y_test, y_test_pred, 
                          target_names=['Negative', 'Positive']))

# Confusion matrix
print("--- Confusion Matrix ---")
cm = confusion_matrix(y_test, y_test_pred)
print(f"True Negatives: {cm[0][0]}, False Positives: {cm[0][1]}")
print(f"False Negatives: {cm[1][0]}, True Positives: {cm[1][1]}")

# Step 6: Save model and vectorizer
print("\n[Step 6] Saving model and vectorizer...")
model_dir = 'ml_pipeline/models'
os.makedirs(model_dir, exist_ok=True)

model_path = os.path.join(model_dir, 'sentiment_model.joblib')
vectorizer_path = os.path.join(model_dir, 'tfidf_vectorizer.joblib')

joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)
print(f"✓ Model saved to: {model_path}")
print(f"✓ Vectorizer saved to: {vectorizer_path}")

# Step 7: Test predictions with confidence scores
print("\n[Step 7] Testing predictions with confidence scores...")
test_samples = [
    "I love this product! It's amazing!",
    "Terrible experience. Very disappointed.",
    "Great service, highly recommend!",
    "Worst purchase ever. Don't buy this."
]

from ml_pipeline.preprocessing import preprocess_text

for text in test_samples:
    # Preprocess
    cleaned = preprocess_text(text)
    
    # Vectorize
    text_tfidf = vectorizer.transform([cleaned])
    
    # Predict
    prediction = model.predict(text_tfidf)[0]
    probabilities = model.predict_proba(text_tfidf)[0]
    confidence = max(probabilities)
    
    sentiment = "Positive" if prediction == 1 else "Negative"
    print(f"\nText: {text}")
    print(f"Sentiment: {sentiment} (Confidence: {confidence*100:.2f}%)")

# Summary
print("\n" + "=" * 70)
print("TRAINING SUMMARY")
print("=" * 70)
print(f"✓ Dataset: {len(X)} samples")
print(f"✓ Training Accuracy: {train_accuracy*100:.2f}%")
print(f"✓ Test Accuracy: {test_accuracy*100:.2f}%")
print(f"✓ Model: Hybrid Ensemble (ML + Rules)")
print(f"✓ Features: TF-IDF (Word + Char n-grams)")
print(f"✓ Status: {'✅ PASSED' if test_accuracy >= 0.80 else '⚠️ NEEDS IMPROVEMENT'}")
print("=" * 70)
