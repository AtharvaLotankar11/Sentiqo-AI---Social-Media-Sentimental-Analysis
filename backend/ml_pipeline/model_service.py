"""
Model service for sentiment prediction
"""
import os
import joblib
from .preprocessing import preprocess_text


class SentimentModelService:
    """
    Service for loading model and making predictions
    """
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.model_loaded = False
        self.load_model()
    
    def load_model(self):
        """Load trained model and vectorizer"""
        try:
            model_dir = os.path.join(os.path.dirname(__file__), 'models')
            model_path = os.path.join(model_dir, 'sentiment_model.joblib')
            vectorizer_path = os.path.join(model_dir, 'tfidf_vectorizer.joblib')
            
            if os.path.exists(model_path) and os.path.exists(vectorizer_path):
                self.model = joblib.load(model_path)
                self.vectorizer = joblib.load(vectorizer_path)
                self.model_loaded = True
                print("[OK] Model and vectorizer loaded successfully")
            else:
                print("[WARN] Model files not found. Please train the model first.")
                self.model_loaded = False
        except Exception as e:
            print(f"[ERROR] Error loading model: {e}")
            self.model_loaded = False
    
    def predict(self, text):
        """
        Predict sentiment for a single text
        
        Args:
            text (str): Raw text to analyze
        
        Returns:
            dict: Prediction result with sentiment, confidence, and label
        """
        if not self.model_loaded:
            return {
                'error': 'Model not loaded',
                'sentiment': None,
                'confidence': 0.0
            }
        
        try:
            # Preprocess text
            cleaned_text = preprocess_text(text)
            
            # Check if text is too short after preprocessing
            if len(cleaned_text.strip()) == 0:
                return {
                    'sentiment': 'neutral',
                    'label': 2,
                    'confidence': 0.5,
                    'original_text': text,
                    'cleaned_text': cleaned_text
                }
            
            # Vectorize
            text_tfidf = self.vectorizer.transform([cleaned_text])
            
            # Predict
            prediction = self.model.predict(text_tfidf)[0]
            probabilities = self.model.predict_proba(text_tfidf)[0]
            confidence = float(max(probabilities))
            
            # Map prediction to sentiment
            sentiment_map = {
                0: 'negative',
                1: 'positive'
            }
            
            sentiment = sentiment_map.get(prediction, 'neutral')
            
            return {
                'sentiment': sentiment,
                'label': int(prediction),
                'confidence': confidence,
                'probabilities': {
                    'negative': float(probabilities[0]),
                    'positive': float(probabilities[1])
                },
                'original_text': text,
                'cleaned_text': cleaned_text
            }
        
        except Exception as e:
            return {
                'error': str(e),
                'sentiment': None,
                'confidence': 0.0
            }
    
    def predict_batch(self, texts):
        """
        Predict sentiment for multiple texts
        
        Args:
            texts (list): List of raw texts
        
        Returns:
            list: List of prediction results
        """
        return [self.predict(text) for text in texts]


# Global instance
_model_service = None

def get_model_service():
    """Get or create model service instance"""
    global _model_service
    if _model_service is None:
        _model_service = SentimentModelService()
    return _model_service


def predict_sentiment(text):
    """
    Quick function to predict sentiment
    
    Args:
        text (str): Raw text
    
    Returns:
        dict: Prediction result
    """
    service = get_model_service()
    return service.predict(text)
