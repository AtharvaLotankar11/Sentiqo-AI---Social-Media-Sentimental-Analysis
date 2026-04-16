from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import SocialMediaPost, SentimentResult, Theme
from .serializers import SocialMediaPostSerializer, SentimentResultSerializer, ThemeSerializer
from ml_pipeline.model_service import predict_sentiment, get_model_service
import csv
import io
import pandas as pd
from services.insights_service import InsightsService


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_data(request):
    """
    Upload CSV file and store posts in database
    Expects CSV with columns: sentiment, id, date, query, user, text
    """
    try:
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        csv_file = request.FILES['file']
        
        # Read CSV file
        decoded_file = csv_file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string)
        
        posts_created = 0
        batch_size = 1000
        posts_batch = []
        
        for row in reader:
            if len(row) >= 6:
                # Sentiment140 format: sentiment, id, date, query, user, text
                try:
                    sentiment_label = int(row[0])  # 0=negative, 4=positive
                except ValueError:
                    continue # Skip header or invalid rows
                    
                text = row[5]
                
                # Convert sentiment: 0->negative, 4->positive, 2->neutral
                if sentiment_label == 0:
                    original_sentiment = 0  # negative
                elif sentiment_label == 4:
                    original_sentiment = 1  # positive
                else:
                    original_sentiment = 2  # neutral
                
                posts_batch.append(
                    SocialMediaPost(
                        text=text,
                        source='twitter',
                        original_sentiment=original_sentiment
                    )
                )
                
                # Bulk create in batches
                if len(posts_batch) >= batch_size:
                    SocialMediaPost.objects.bulk_create(posts_batch)
                    posts_created += len(posts_batch)
                    posts_batch = []
        
        # Create remaining posts
        if posts_batch:
            SocialMediaPost.objects.bulk_create(posts_batch)
            posts_created += len(posts_batch)
        
        return Response({
            'message': 'Data uploaded successfully',
            'posts_created': posts_created
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_posts(request):
    """Get all posts with pagination"""
    posts = SocialMediaPost.objects.all()[:100]  # Limit to 100 for now
    serializer = SocialMediaPostSerializer(posts, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def get_insights_view(request):
    """
    Returns AI-generated insights based on current sentiment data.
    """
    insights = InsightsService.get_recent_insights()
    return Response(insights)


@api_view(['POST'])
def analyze_sentiment_view(request):
    """
    Analyze sentiment for a single text input and persist to DB
    """
    text = request.data.get('text', '')
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    # 1. Prediction logic
    result = predict_sentiment(text)
    
    # 2. Persist to Database if prediction was successful
    if result.get('sentiment'):
        try:
            # Create the raw post record first
            post = SocialMediaPost.objects.create(
                text=text,
                source='manual_analysis'
            )
            
            # Create the linked sentiment result
            SentimentResult.objects.create(
                post=post,
                sentiment=result['sentiment'],
                confidence=result['confidence']
            )
        except Exception as e:
            print(f"[ERROR] Database persistence failed: {e}")
            # We still return the result even if DB saving fails so the UI doesn't break
    
    return Response(result)


@api_view(['GET'])
def dashboard_stats(request):
    """
    Get sentiment counts for dashboard KPI cards and pie chart
    """
    # If no results exist yet, we might want to analyze some samples or return empty
    results = SentimentResult.objects.all()
    
    if not results.exists() and SocialMediaPost.objects.exists():
        # Fallback to original_sentiment from SocialMediaPost if available
        stats = SocialMediaPost.objects.values('original_sentiment').annotate(count=Count('id'))
        positive = sum(item['count'] for item in stats if item['original_sentiment'] == 1)
        negative = sum(item['count'] for item in stats if item['original_sentiment'] == 0)
        neutral = sum(item['count'] for item in stats if item['original_sentiment'] == 2)
    else:
        positive = results.filter(sentiment='positive').count()
        negative = results.filter(sentiment='negative').count()
        neutral = results.filter(sentiment='neutral').count()
    
    total = positive + negative + neutral
    
    return Response({
        'total_posts': total,
        'positive': positive,
        'negative': negative,
        'neutral': neutral,
        'positive_percentage': round((positive / total * 100), 2) if total > 0 else 0,
        'negative_percentage': round((negative / total * 100), 2) if total > 0 else 0
    })


@api_view(['GET'])
def sentiment_trends(request):
    """
    Get sentiment trends over time
    """
    # Group by date and count sentiments
    trends = SocialMediaPost.objects.annotate(date=TruncDate('timestamp')) \
        .values('date', 'original_sentiment') \
        .annotate(count=Count('id')) \
        .order_by('date')
    
    # Format for frontend Recharts
    formatted_trends = {}
    for item in trends:
        date_str = item['date'].strftime('%Y-%m-%d')
        if date_str not in formatted_trends:
            formatted_trends[date_str] = {'date': date_str, 'positive': 0, 'negative': 0, 'neutral': 0}
        
        sentiment = item['original_sentiment']
        if sentiment == 1:
            formatted_trends[date_str]['positive'] = item['count']
        elif sentiment == 0:
            formatted_trends[date_str]['negative'] = item['count']
        else:
            formatted_trends[date_str]['neutral'] = item['count']
            
    return Response(list(formatted_trends.values()))


@api_view(['GET'])
def get_themes(request):
    """
    Get top keywords by sentiment
    """
    themes = Theme.objects.all().order_by('sentiment_category', '-frequency')
    serializer = ThemeSerializer(themes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def bulk_analyze(request):
    """
    Batch processing of multiple texts
    """
    texts = request.data.get('texts', [])
    if not isinstance(texts, list) or not texts:
        return Response({'error': 'Expected a list of texts'}, status=status.HTTP_400_BAD_REQUEST)
    
    service = get_model_service()
    results = service.predict_batch(texts)
    return Response({'results': results})
