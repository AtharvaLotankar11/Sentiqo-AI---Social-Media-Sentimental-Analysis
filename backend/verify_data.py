"""Verify loaded data"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from api.models import SocialMediaPost

print("=== Database Verification ===\n")

total = SocialMediaPost.objects.count()
positive = SocialMediaPost.objects.filter(original_sentiment=1).count()
negative = SocialMediaPost.objects.filter(original_sentiment=0).count()

print(f"Total posts: {total}")
print(f"Positive posts: {positive} ({positive/total*100:.1f}%)")
print(f"Negative posts: {negative} ({negative/total*100:.1f}%)")

print("\n--- Sample Positive Posts ---")
for post in SocialMediaPost.objects.filter(original_sentiment=1)[:3]:
    print(f"✅ {post.text[:100]}...")

print("\n--- Sample Negative Posts ---")
for post in SocialMediaPost.objects.filter(original_sentiment=0)[:3]:
    print(f"❌ {post.text[:100]}...")

print("\n✅ Data verification complete!")
