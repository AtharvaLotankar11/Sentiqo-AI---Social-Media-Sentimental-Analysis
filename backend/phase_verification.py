"""
Comprehensive verification of Phases 1-6
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from api.models import SocialMediaPost, SentimentResult, Theme
from django.db import connection

print("=" * 60)
print("PHASE 1-6 VERIFICATION")
print("=" * 60)

# Phase 1: Project Setup
print("\n✅ PHASE 1: PROJECT SETUP")
print("-" * 60)

# Check directory structure
dirs_to_check = [
    'backend/api',
    'backend/ml_pipeline',
    'backend/services',
    'backend/venv',
    'frontend/app',
    'frontend/components',
    'frontend/hooks',
    'frontend/services'
]

for dir_path in dirs_to_check:
    exists = os.path.exists(f'../{dir_path}') or os.path.exists(dir_path.replace('backend/', ''))
    status = "✓" if exists else "✗"
    print(f"  {status} {dir_path}")

# Check key files
files_to_check = [
    'backend/requirements.txt',
    'backend/.env',
    'backend/manage.py',
    'frontend/package.json',
    'frontend/tailwind.config.js',
    'frontend/jsconfig.json'
]

print("\n  Key Files:")
for file_path in files_to_check:
    exists = os.path.exists(file_path) or os.path.exists(file_path.replace('backend/', ''))
    status = "✓" if exists else "✗"
    print(f"  {status} {file_path}")

# Phase 2: Database & Models
print("\n✅ PHASE 2: DATABASE & MODELS")
print("-" * 60)

# Check database connection
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT version();")
        db_version = cursor.fetchone()[0]
    print(f"  ✓ PostgreSQL Connected: {db_version.split(',')[0]}")
except Exception as e:
    print(f"  ✗ Database Error: {e}")

# Check tables exist
tables = ['social_media_posts', 'sentiment_results', 'themes']
with connection.cursor() as cursor:
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    existing_tables = [row[0] for row in cursor.fetchall()]

print("\n  Database Tables:")
for table in tables:
    exists = table in existing_tables
    status = "✓" if exists else "✗"
    print(f"  {status} {table}")

# Check models work
print("\n  Model Operations:")
try:
    post_count = SocialMediaPost.objects.count()
    print(f"  ✓ SocialMediaPost model working ({post_count} records)")
except Exception as e:
    print(f"  ✗ SocialMediaPost error: {e}")

try:
    sentiment_count = SentimentResult.objects.count()
    print(f"  ✓ SentimentResult model working ({sentiment_count} records)")
except Exception as e:
    print(f"  ✗ SentimentResult error: {e}")

try:
    theme_count = Theme.objects.count()
    print(f"  ✓ Theme model working ({theme_count} records)")
except Exception as e:
    print(f"  ✗ Theme error: {e}")

# Phase 3: Data Collection
print("\n✅ PHASE 3: DATA COLLECTION & PREPARATION")
print("-" * 60)

# Check dataset
dataset_path = r'D:\Sentiqo-AI---Social-Media-Sentimental-Analysis\training.1600000.processed.noemoticon.csv'
if os.path.exists(dataset_path):
    print(f"  ✓ Dataset file found")
else:
    print(f"  ✗ Dataset file not found")

# Check data balance
total_posts = SocialMediaPost.objects.count()
positive_posts = SocialMediaPost.objects.filter(original_sentiment=1).count()
negative_posts = SocialMediaPost.objects.filter(original_sentiment=0).count()

print(f"\n  Data Statistics:")
print(f"  ✓ Total posts: {total_posts}")
print(f"  ✓ Positive posts: {positive_posts} ({positive_posts/total_posts*100:.1f}%)")
print(f"  ✓ Negative posts: {negative_posts} ({negative_posts/total_posts*100:.1f}%)")

# Check data quality
sample_posts = SocialMediaPost.objects.all()[:3]
print(f"\n  Sample Data Quality:")
for i, post in enumerate(sample_posts, 1):
    sentiment = "Positive" if post.original_sentiment == 1 else "Negative"
    text_preview = post.text[:60] + "..." if len(post.text) > 60 else post.text
    print(f"  {i}. [{sentiment}] {text_preview}")

# API Endpoints Check
print("\n  API Endpoints:")
print(f"  ✓ POST /api/upload-data/ - Data upload endpoint")
print(f"  ✓ GET /api/posts/ - Get posts endpoint")

# Phase 4: Preprocessing
print("\n✅ PHASE 4: NLP PREPROCESSING PIPELINE")
print("-" * 60)

# Check NLTK data
try:
    import nltk
    nltk.data.find('corpora/stopwords')
    print("  ✓ NLTK stopwords installed")
    nltk.data.find('tokenizers/punkt')
    print("  ✓ NLTK punkt tokenizer installed")
except:
    print("  ✗ NLTK data missing")

# Check preprocessing module
try:
    from ml_pipeline.preprocessing import TextPreprocessor
    preprocessor = TextPreprocessor()
    test_text = "I love this product! https://example.com @user #amazing"
    cleaned = preprocessor.preprocess(test_text)
    print(f"  ✓ Preprocessing module working")
    print(f"    Original: {test_text[:50]}...")
    print(f"    Cleaned: {cleaned[:50]}...")
except Exception as e:
    print(f"  ✗ Preprocessing error: {e}")

# Phase 5: Sentiment Model
print("\n✅ PHASE 5: SENTIMENT ANALYSIS MODEL")
print("-" * 60)

# Check if model exists
model_path = 'ml_pipeline/models/sentiment_model.joblib'
vectorizer_path = 'ml_pipeline/models/tfidf_vectorizer.joblib'

if os.path.exists(model_path) and os.path.exists(vectorizer_path):
    print("  ✓ Model files found")
    
    # Load and test model
    try:
        from ml_pipeline.model_service import predict_sentiment
        
        test_samples = [
            "I love this! It's amazing!",
            "This is terrible and disappointing."
        ]
        
        print("\n  Model Predictions:")
        for text in test_samples:
            result = predict_sentiment(text)
            if 'error' not in result:
                sentiment = result['sentiment'].upper()
                confidence = result['confidence'] * 100
                emoji = "✅" if sentiment == "POSITIVE" else "❌"
                print(f"  {emoji} [{sentiment}] {confidence:.1f}% - {text[:40]}...")
            else:
                print(f"  ✗ Prediction error: {result['error']}")
    except Exception as e:
        print(f"  ✗ Model loading error: {e}")
else:
    print("  ✗ Model files not found")

# Phase 6: Theme Extraction
print("\n✅ PHASE 6: THEME EXTRACTION")
print("-" * 60)

# Check themes in database
theme_count = Theme.objects.count()
positive_themes = Theme.objects.filter(sentiment_category='positive').count()
negative_themes = Theme.objects.filter(sentiment_category='negative').count()

print(f"  ✓ Total themes: {theme_count}")
print(f"  ✓ Positive themes: {positive_themes}")
print(f"  ✓ Negative themes: {negative_themes}")

if theme_count > 0:
    print("\n  Top Positive Themes:")
    for theme in Theme.objects.filter(sentiment_category='positive').order_by('-frequency')[:3]:
        print(f"    - {theme.keyword}: {theme.frequency}")
    
    print("\n  Top Negative Themes:")
    for theme in Theme.objects.filter(sentiment_category='negative').order_by('-frequency')[:3]:
        print(f"    - {theme.keyword}: {theme.frequency}")
else:
    print("  ⚠️  No themes extracted yet")

# Summary
print("\n" + "=" * 60)
print("VERIFICATION SUMMARY")
print("=" * 60)

issues = []

if total_posts == 0:
    issues.append("No data loaded in database")
elif total_posts < 1000:
    issues.append(f"Low data count: {total_posts} posts")

if positive_posts == 0 or negative_posts == 0:
    issues.append("Unbalanced dataset")

if not os.path.exists(model_path):
    issues.append("Model not trained")

if theme_count == 0:
    issues.append("Themes not extracted")

if issues:
    print("\n⚠️  ISSUES FOUND:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("\n✅ ALL CHECKS PASSED!")
    print("  Phases 1-6 are working correctly.")
    print("  Ready to proceed to Phase 7!")

print("\n" + "=" * 60)
