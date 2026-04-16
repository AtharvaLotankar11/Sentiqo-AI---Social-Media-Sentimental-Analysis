"""
Preprocessing service for batch processing
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from ml_pipeline.preprocessing import TextPreprocessor
from api.models import SocialMediaPost


class PreprocessingService:
    """
    Service for preprocessing social media posts
    """
    
    def __init__(self):
        self.preprocessor = TextPreprocessor()
    
    def preprocess_post(self, post_id):
        """
        Preprocess a single post by ID
        
        Args:
            post_id (int): Post ID
        
        Returns:
            dict: Original and cleaned text
        """
        try:
            post = SocialMediaPost.objects.get(id=post_id)
            cleaned = self.preprocessor.preprocess(post.text)
            
            return {
                'id': post.id,
                'original': post.text,
                'cleaned': cleaned,
                'tokens': self.preprocessor.preprocess(post.text, return_tokens=True)
            }
        except SocialMediaPost.DoesNotExist:
            return None
    
    def preprocess_all_posts(self, limit=None):
        """
        Preprocess all posts in database
        
        Args:
            limit (int): Limit number of posts to process
        
        Returns:
            tuple: (original_texts, cleaned_texts, labels)
        """
        posts = SocialMediaPost.objects.all()
        if limit:
            posts = posts[:limit]
        
        original_texts = []
        cleaned_texts = []
        labels = []
        
        print(f"Preprocessing {posts.count()} posts...")
        
        for i, post in enumerate(posts):
            if i % 1000 == 0 and i > 0:
                print(f"  Processed {i} posts...")
            
            original_texts.append(post.text)
            cleaned_texts.append(self.preprocessor.preprocess(post.text))
            labels.append(post.original_sentiment)
        
        print(f"[OK] Preprocessing complete! {len(cleaned_texts)} posts processed.")
        
        return original_texts, cleaned_texts, labels
    
    def get_preprocessed_dataset(self, limit=None):
        """
        Get preprocessed dataset ready for ML training
        
        Args:
            limit (int): Limit number of posts
        
        Returns:
            tuple: (X, y) where X is cleaned texts and y is labels
        """
        _, cleaned_texts, labels = self.preprocess_all_posts(limit)
        return cleaned_texts, labels


# Convenience function
def get_training_data(limit=None):
    """
    Quick function to get training data
    
    Args:
        limit (int): Limit number of samples
    
    Returns:
        tuple: (X, y) preprocessed texts and labels
    """
    service = PreprocessingService()
    return service.get_preprocessed_dataset(limit)
