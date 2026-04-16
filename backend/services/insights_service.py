from django.db.models import Count
from api.models import SentimentResult, Theme
import datetime

class InsightsService:
    @staticmethod
    def get_recent_insights():
        """
        Analyzes recent data to find spikes or concerning trends.
        Returns a list of insight objects.
        """
        insights = []
        
        # 1. Check for Negative Sentiment Spikes
        # In a real app, we'd compare today vs yesterday. 
        # For this MVP, we'll look at the current distribution.
        total = SentimentResult.objects.count()
        if total == 0:
            return [{
                "id": "no-data",
                "type": "info",
                "title": "Awaiting Data",
                "message": "Upload messages to begin generating AI insights."
            }]

        neg_count = SentimentResult.objects.filter(sentiment='negative').count()
        neg_percentage = (neg_count / total) * 100

        if neg_percentage > 35:
            insights.append({
                "id": "neg-spike",
                "type": "warning",
                "title": "Negative Sentiment Alert",
                "message": f"Negative sentiment is currently at {neg_percentage:.1f}%, which is above the 35% stability threshold."
            })

            # 2. Identify Top Negative Keywords for context
            neg_themes = Theme.objects.filter(sentiment_category='negative').order_by('-frequency')[:2]
            if neg_themes.exists():
                keywords = ", ".join([t.keyword for t in neg_themes])
                insights.append({
                    "id": "neg-drivers",
                    "type": "action",
                    "title": "Critical Issues Detected",
                    "message": f"Primary drivers of dissatisfaction: {keywords}. Recommend immediate investigation into these themes."
                })

        # 3. Positive Momentum Check
        pos_count = SentimentResult.objects.filter(sentiment='positive').count()
        pos_percentage = (pos_count / total) * 100
        
        if pos_percentage > 50:
            insights.append({
                "id": "pos-growth",
                "type": "success",
                "title": "Brand Momentum High",
                "message": f"Positive sentiment reached {pos_percentage:.1f}%. Leverage this by increasing marketing engagement."
            })

        return insights
