from django.contrib import admin
from .models import SocialMediaPost, SentimentResult, Theme


@admin.register(SocialMediaPost)
class SocialMediaPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'text_preview', 'source', 'original_sentiment', 'timestamp']
    list_filter = ['source', 'original_sentiment', 'timestamp']
    search_fields = ['text', 'brand_keyword']
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text'


@admin.register(SentimentResult)
class SentimentResultAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'sentiment', 'confidence', 'created_at']
    list_filter = ['sentiment', 'created_at']
    search_fields = ['post__text']


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ['id', 'sentiment_category', 'keyword', 'frequency', 'created_at']
    list_filter = ['sentiment_category']
    search_fields = ['keyword']
    ordering = ['-frequency']
