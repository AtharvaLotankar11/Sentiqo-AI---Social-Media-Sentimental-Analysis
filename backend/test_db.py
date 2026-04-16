"""Quick test script to verify database models work"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from api.models import SocialMediaPost, SentimentResult, Theme

# Test 1: Create a sample post
print("Creating sample post...")
post = SocialMediaPost.objects.create(
    text="I love this product! It's amazing!",
    source="twitter",
    brand_keyword="product"
)
print(f"✅ Created post: {post}")

# Test 2: Create sentiment result
print("\nCreating sentiment result...")
sentiment = SentimentResult.objects.create(
    post=post,
    sentiment="positive",
    confidence=0.95
)
print(f"✅ Created sentiment: {sentiment}")

# Test 3: Create theme
print("\nCreating theme...")
theme = Theme.objects.create(
    sentiment_category="positive",
    keyword="love",
    frequency=5
)
print(f"✅ Created theme: {theme}")

# Test 4: Query data
print("\n--- Database Query Test ---")
print(f"Total posts: {SocialMediaPost.objects.count()}")
print(f"Total sentiments: {SentimentResult.objects.count()}")
print(f"Total themes: {Theme.objects.count()}")

print("\n✅ All database operations successful!")
