"""
Theme extraction using TF-IDF and keyword extraction
"""
import os
import django
from collections import Counter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sentiqo_backend.settings')
django.setup()

from sklearn.feature_extraction.text import TfidfVectorizer
from api.models import SocialMediaPost, Theme


class ThemeExtractor:
    """
    Extract top keywords/themes per sentiment category
    """
    
    def __init__(self, top_n=5):
        self.top_n = top_n
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            ngram_range=(1, 2),
            min_df=2,
            stop_words='english'
        )
    
    def extract_themes_tfidf(self, texts, sentiment_category):
        """
        Extract themes using TF-IDF
        
        Args:
            texts: List of preprocessed texts
            sentiment_category: 'positive' or 'negative'
        
        Returns:
            List of (keyword, score) tuples
        """
        if len(texts) < 2:
            return []
        
        # Fit TF-IDF
        tfidf_matrix = self.vectorizer.fit_transform(texts)
        
        # Get feature names
        feature_names = self.vectorizer.get_feature_names_out()
        
        # Calculate average TF-IDF score for each term
        avg_scores = tfidf_matrix.mean(axis=0).A1
        
        # Get top keywords
        top_indices = avg_scores.argsort()[-self.top_n:][::-1]
        top_keywords = [(feature_names[i], avg_scores[i]) for i in top_indices]
        
        return top_keywords
    
    def extract_themes_frequency(self, texts, sentiment_category):
        """
        Extract themes using simple word frequency
        
        Args:
            texts: List of preprocessed texts
            sentiment_category: 'positive' or 'negative'
        
        Returns:
            List of (keyword, frequency) tuples
        """
        # Count all words
        all_words = []
        for text in texts:
            words = text.split()
            # Filter out very short words
            words = [w for w in words if len(w) > 3]
            all_words.extend(words)
        
        # Get top keywords by frequency
        word_counts = Counter(all_words)
        top_keywords = word_counts.most_common(self.top_n)
        
        return top_keywords
    
    def extract_and_save_themes(self):
        """
        Extract themes for all sentiment categories and save to database
        """
        print("=" * 70)
        print("THEME EXTRACTION")
        print("=" * 70)
        
        from ml_pipeline.preprocessing import TextPreprocessor
        preprocessor = TextPreprocessor()
        
        # Clear existing themes
        print("\nClearing existing themes...")
        Theme.objects.all().delete()
        
        # Extract for positive sentiment
        print("\n[1/2] Extracting positive themes...")
        positive_posts = SocialMediaPost.objects.filter(original_sentiment=1)[:1000]
        positive_texts = [preprocessor.preprocess(post.text) for post in positive_posts]
        
        if len(positive_texts) > 0:
            positive_themes = self.extract_themes_frequency(positive_texts, 'positive')
            
            print(f"[OK] Found {len(positive_themes)} positive themes")
            for keyword, freq in positive_themes[:5]:
                print(f"  - {keyword}: {freq}")
                Theme.objects.create(
                    sentiment_category='positive',
                    keyword=keyword,
                    frequency=freq
                )
        
        # Extract for negative sentiment
        print("\n[2/2] Extracting negative themes...")
        negative_posts = SocialMediaPost.objects.filter(original_sentiment=0)[:1000]
        negative_texts = [preprocessor.preprocess(post.text) for post in negative_posts]
        
        if len(negative_texts) > 0:
            negative_themes = self.extract_themes_frequency(negative_texts, 'negative')
            
            print(f"[OK] Found {len(negative_themes)} negative themes")
            for keyword, freq in negative_themes[:5]:
                print(f"  - {keyword}: {freq}")
                Theme.objects.create(
                    sentiment_category='negative',
                    keyword=keyword,
                    frequency=freq
                )
        
        # Summary
        total_themes = Theme.objects.count()
        positive_count = Theme.objects.filter(sentiment_category='positive').count()
        negative_count = Theme.objects.filter(sentiment_category='negative').count()
        
        print("\n" + "=" * 70)
        print("THEME EXTRACTION COMPLETE")
        print("=" * 70)
        print(f"[OK] Total themes extracted: {total_themes}")
        print(f"  Positive themes: {positive_count}")
        print(f"  Negative themes: {negative_count}")
        print("=" * 70)
        
        return {
            'total': total_themes,
            'positive': positive_count,
            'negative': negative_count
        }


def extract_themes():
    """Quick function to extract themes"""
    extractor = ThemeExtractor(top_n=5)
    return extractor.extract_and_save_themes()
