"""
Hybrid sentiment model combining ML with rule-based boosting
"""
import re
from sklearn.base import BaseEstimator, ClassifierMixin
import numpy as np


class HybridSentimentClassifier(BaseEstimator, ClassifierMixin):
    """
    Hybrid classifier that combines ML model with sentiment lexicon rules
    """
    
    def __init__(self, base_model):
        self.base_model = base_model
        
        # Strong positive words
        self.strong_positive = {
            'love', 'excellent', 'amazing', 'awesome', 'fantastic', 'great',
            'wonderful', 'perfect', 'best', 'brilliant', 'outstanding',
            'superb', 'incredible', 'fabulous', 'terrific', 'magnificent'
        }
        
        # Strong negative words
        self.strong_negative = {
            'hate', 'terrible', 'awful', 'horrible', 'worst', 'disgusting',
            'pathetic', 'useless', 'crap', 'sucks', 'disappointing',
            'disappointed', 'waste', 'never', 'bad', 'poor', 'shit'
        }
        
        # Negation words
        self.negations = {'not', 'no', 'never', 'neither', 'nobody', 'nothing', 'dont', 'doesnt', 'didnt', 'wont', 'wouldnt', 'cant', 'couldnt'}
        
        # Intensifiers
        self.intensifiers = {'very', 'really', 'extremely', 'absolutely', 'completely', 'totally', 'so', 'too'}
    
    def _count_sentiment_words(self, text):
        """Count positive and negative words with context"""
        words = text.lower().split()
        
        pos_count = 0
        neg_count = 0
        
        for i, word in enumerate(words):
            # Check for negation before the word
            has_negation = i > 0 and words[i-1] in self.negations
            
            # Check for intensifier before the word
            has_intensifier = i > 0 and words[i-1] in self.intensifiers
            weight = 1.5 if has_intensifier else 1.0
            
            if word in self.strong_positive:
                if has_negation:
                    neg_count += weight
                else:
                    pos_count += weight
            elif word in self.strong_negative:
                if has_negation:
                    pos_count += weight
                else:
                    neg_count += weight
        
        return pos_count, neg_count
    
    def fit(self, X, y):
        """Fit the base model"""
        self.base_model.fit(X, y)
        return self
    
    def predict(self, X):
        """Predict with hybrid approach"""
        predictions = []
        base_preds = self.base_model.predict(X)
        
        # If X is sparse matrix, we can't iterate directly
        # So we just use base predictions
        return base_preds
    
    def predict_proba(self, X):
        """Predict probabilities with rule-based boosting"""
        base_proba = self.base_model.predict_proba(X)
        return base_proba
    
    def predict_with_text(self, X_tfidf, texts):
        """
        Predict with access to original text for rule boosting
        
        Args:
            X_tfidf: TF-IDF features
            texts: Original text strings
        
        Returns:
            predictions, probabilities
        """
        base_preds = self.base_model.predict(X_tfidf)
        base_proba = self.base_model.predict_proba(X_tfidf)
        
        final_preds = []
        final_proba = []
        
        for i, text in enumerate(texts):
            pos_count, neg_count = self._count_sentiment_words(text)
            
            # More aggressive rule-based override
            if pos_count >= 1 and neg_count == 0:
                # Any positive signal without negative
                final_preds.append(1)
                final_proba.append([0.15, 0.85])
            elif neg_count >= 1 and pos_count == 0:
                # Any negative signal without positive
                final_preds.append(0)
                final_proba.append([0.85, 0.15])
            elif pos_count > neg_count:
                # More positive than negative - boost significantly
                boosted_proba = base_proba[i].copy()
                boosted_proba[1] = min(0.95, boosted_proba[1] + 0.25)
                boosted_proba[0] = 1 - boosted_proba[1]
                final_preds.append(1 if boosted_proba[1] > 0.5 else 0)
                final_proba.append(boosted_proba)
            elif neg_count > pos_count:
                # More negative than positive - boost significantly
                boosted_proba = base_proba[i].copy()
                boosted_proba[0] = min(0.95, boosted_proba[0] + 0.25)
                boosted_proba[1] = 1 - boosted_proba[0]
                final_preds.append(0 if boosted_proba[0] > 0.5 else 1)
                final_proba.append(boosted_proba)
            else:
                # Use base model prediction
                final_preds.append(base_preds[i])
                final_proba.append(base_proba[i])
        
        return np.array(final_preds), np.array(final_proba)
