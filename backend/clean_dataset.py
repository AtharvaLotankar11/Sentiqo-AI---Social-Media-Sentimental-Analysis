"""
Clean dataset by keeping only high-quality samples
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from api.models import SocialMediaPost

# Strong sentiment indicators
strong_positive = {
    'love', 'excellent', 'amazing', 'awesome', 'fantastic', 'great',
    'wonderful', 'perfect', 'best', 'brilliant', 'outstanding',
    'happy', 'excited', 'yay', 'thanks', 'thank'
}

strong_negative = {
    'hate', 'terrible', 'awful', 'horrible', 'worst', 'disgusting',
    'pathetic', 'useless', 'sucks', 'disappointing', 'disappointed',
    'waste', 'bad', 'poor', 'sad', 'sorry', 'miss'
}

def has_strong_sentiment(text, sentiment_label):
    """Check if text has strong sentiment indicators"""
    words = set(text.lower().split())
    
    pos_words = words & strong_positive
    neg_words = words & strong_negative
    
    if sentiment_label == 1:  # Positive
        # Keep if has positive words and no/few negative words
        return len(pos_words) >= 1 and len(neg_words) == 0
    else:  # Negative
        # Keep if has negative words and no/few positive words
        return len(neg_words) >= 1 and len(pos_words) == 0

print("=" * 70)
print("CLEANING DATASET - Keeping only high-quality samples")
print("=" * 70)

# Get all posts
all_posts = SocialMediaPost.objects.all()
total = all_posts.count()
print(f"\nTotal posts in database: {total}")

# Filter high-quality posts
print("\nFiltering posts with strong sentiment signals...")
posts_to_keep = []
posts_to_delete = []

for i, post in enumerate(all_posts):
    if i % 10000 == 0 and i > 0:
        print(f"  Processed {i} posts...")
    
    if has_strong_sentiment(post.text, post.original_sentiment):
        posts_to_keep.append(post.id)
    else:
        posts_to_delete.append(post.id)

print(f"\n✓ Analysis complete!")
print(f"  High-quality posts: {len(posts_to_keep)} ({len(posts_to_keep)/total*100:.1f}%)")
print(f"  Low-quality posts: {len(posts_to_delete)} ({len(posts_to_delete)/total*100:.1f}%)")

# Delete low-quality posts
print(f"\nDeleting {len(posts_to_delete)} low-quality posts...")
SocialMediaPost.objects.filter(id__in=posts_to_delete).delete()

# Verify
remaining = SocialMediaPost.objects.count()
positive = SocialMediaPost.objects.filter(original_sentiment=1).count()
negative = SocialMediaPost.objects.filter(original_sentiment=0).count()

print(f"\n✓ Cleanup complete!")
print(f"  Remaining posts: {remaining}")
print(f"  Positive: {positive} ({positive/remaining*100:.1f}%)")
print(f"  Negative: {negative} ({negative/remaining*100:.1f}%)")

print("\n" + "=" * 70)
print("✅ Dataset cleaned! Now retrain the model.")
print("=" * 70)
