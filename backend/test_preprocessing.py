"""
Test preprocessing pipeline
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from ml_pipeline.preprocessing import TextPreprocessor

print("=" * 70)
print("PREPROCESSING PIPELINE TEST")
print("=" * 70)

# Initialize preprocessor
preprocessor = TextPreprocessor()

# Test samples
test_samples = [
    "@user I LOVE this product!!! https://example.com #amazing 😊",
    "This is the WORST experience ever... I'm so disappointed 😞",
    "@company Your service is great! Keep it up! 👍",
    "Terrible quality. Don't waste your money!!! #disappointed",
    "Amazing product! Highly recommend it to everyone! 5 stars ⭐⭐⭐⭐⭐"
]

print("\n--- Test 1: Individual Steps ---\n")
sample = test_samples[0]
print(f"Original: {sample}")
print(f"Remove URLs: {preprocessor.remove_urls(sample)}")
print(f"Remove mentions: {preprocessor.remove_mentions(sample)}")
print(f"Lowercase: {preprocessor.to_lowercase(sample)}")
print(f"Remove punctuation: {preprocessor.remove_punctuation(sample)}")

print("\n--- Test 2: Complete Pipeline ---\n")
for i, text in enumerate(test_samples, 1):
    print(f"{i}. Original:")
    print(f"   {text}")
    
    # Preprocess as string
    cleaned = preprocessor.preprocess(text)
    print(f"   Cleaned:")
    print(f"   {cleaned}")
    
    # Preprocess as tokens
    tokens = preprocessor.preprocess(text, return_tokens=True)
    print(f"   Tokens: {tokens}")
    print()

print("\n--- Test 3: Real Tweet Samples ---\n")
from api.models import SocialMediaPost

# Get sample tweets
tweets = SocialMediaPost.objects.all()[:5]

for i, tweet in enumerate(tweets, 1):
    sentiment = "Positive" if tweet.original_sentiment == 1 else "Negative"
    print(f"{i}. [{sentiment}]")
    print(f"   Original: {tweet.text[:80]}...")
    cleaned = preprocessor.preprocess(tweet.text)
    print(f"   Cleaned: {cleaned[:80]}...")
    print()

print("=" * 70)
print("✅ Preprocessing pipeline test complete!")
print("=" * 70)
