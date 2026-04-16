from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_pic = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Profile of {self.user.username}"


class SocialMediaPost(models.Model):
    """Raw social media post data"""
    text = models.TextField()
    source = models.CharField(max_length=50, default='twitter')  # twitter, reddit, etc.
    timestamp = models.DateTimeField(auto_now_add=True)
    brand_keyword = models.CharField(max_length=100, blank=True, null=True)
    original_sentiment = models.IntegerField(blank=True, null=True)  # For labeled data
    
    class Meta:
        db_table = 'social_media_posts'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.source} - {self.text[:50]}..."


class SentimentResult(models.Model):
    """Sentiment analysis results"""
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    post = models.ForeignKey(SocialMediaPost, on_delete=models.CASCADE, related_name='sentiments')
    sentiment = models.CharField(max_length=20, choices=SENTIMENT_CHOICES)
    confidence = models.FloatField()  # 0.0 to 1.0
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sentiment_results'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sentiment} ({self.confidence:.2f}) - Post {self.post.id}"


class Theme(models.Model):
    """Extracted themes/keywords per sentiment category"""
    SENTIMENT_CATEGORY = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    
    sentiment_category = models.CharField(max_length=20, choices=SENTIMENT_CATEGORY)
    keyword = models.CharField(max_length=100)
    frequency = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'themes'
        unique_together = ['sentiment_category', 'keyword']
        ordering = ['-frequency']
    
    def __str__(self):
        return f"{self.sentiment_category} - {self.keyword} ({self.frequency})"
