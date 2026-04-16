from rest_framework import serializers
from .models import SocialMediaPost, SentimentResult, Theme


class SocialMediaPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaPost
        fields = ['id', 'text', 'source', 'timestamp', 'brand_keyword', 'original_sentiment']
        read_only_fields = ['id', 'timestamp']


class SentimentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentResult
        fields = ['id', 'post', 'sentiment', 'confidence', 'created_at']
        read_only_fields = ['id', 'created_at']


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ['id', 'sentiment_category', 'keyword', 'frequency', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
