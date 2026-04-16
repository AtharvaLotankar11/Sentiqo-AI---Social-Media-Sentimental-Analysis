"""
Script to load Sentiment140 dataset into database
Usage: python load_dataset.py
"""
import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from api.models import SocialMediaPost

# Path to your dataset
DATASET_PATH = r'D:\Sentiqo-AI---Social-Media-Sentimental-Analysis\training.1600000.processed.noemoticon.csv'

def load_balanced_data(limit_per_class=5000):
    """
    Load balanced data from Sentiment140 CSV
    Format: sentiment, id, date, query, user, text
    sentiment: 0=negative, 4=positive
    """
    print(f"Loading dataset from: {DATASET_PATH}")
    print(f"Limit: {limit_per_class} per class (total: {limit_per_class * 2})")
    
    # Clear existing data
    print("\nClearing existing posts...")
    SocialMediaPost.objects.all().delete()
    
    posts_batch = []
    batch_size = 1000
    
    negative_count = 0
    positive_count = 0
    
    try:
        with open(DATASET_PATH, 'r', encoding='latin-1') as file:
            reader = csv.reader(file)
            
            for row in reader:
                if negative_count >= limit_per_class and positive_count >= limit_per_class:
                    break
                
                if len(row) >= 6:
                    sentiment_label = int(row[0])
                    text = row[5]
                    
                    # Skip if we have enough of this class
                    if sentiment_label == 0 and negative_count >= limit_per_class:
                        continue
                    if sentiment_label == 4 and positive_count >= limit_per_class:
                        continue
                    
                    # Convert sentiment: 0->negative (0), 4->positive (1)
                    original_sentiment = 0 if sentiment_label == 0 else 1
                    
                    posts_batch.append(
                        SocialMediaPost(
                            text=text,
                            source='twitter',
                            original_sentiment=original_sentiment
                        )
                    )
                    
                    if sentiment_label == 0:
                        negative_count += 1
                    else:
                        positive_count += 1
                    
                    # Bulk create in batches
                    if len(posts_batch) >= batch_size:
                        SocialMediaPost.objects.bulk_create(posts_batch)
                        print(f"Loaded: {negative_count} negative, {positive_count} positive...")
                        posts_batch = []
            
            # Create remaining posts
            if posts_batch:
                SocialMediaPost.objects.bulk_create(posts_batch)
        
        total = negative_count + positive_count
        print(f"\n✅ Successfully loaded {total} posts!")
        print(f"   Negative: {negative_count}")
        print(f"   Positive: {positive_count}")
        print(f"Total posts in database: {SocialMediaPost.objects.count()}")
        
        # Show sample
        print("\n--- Sample Negative Posts ---")
        for post in SocialMediaPost.objects.filter(original_sentiment=0)[:3]:
            print(f"❌ {post.text[:80]}...")
        
        print("\n--- Sample Positive Posts ---")
        for post in SocialMediaPost.objects.filter(original_sentiment=1)[:3]:
            print(f"✅ {post.text[:80]}...")
    
    except FileNotFoundError:
        print(f"❌ Error: Dataset file not found at {DATASET_PATH}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")


if __name__ == '__main__':
    # Load 50,000 negative + 50,000 positive = 100,000 total
    load_balanced_data(limit_per_class=50000)

