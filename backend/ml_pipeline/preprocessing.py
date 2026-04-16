"""
Text preprocessing functions for sentiment analysis
"""
import re
import string
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


class TextPreprocessor:
    """
    Text preprocessing pipeline for social media data
    """
    
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
    
    def remove_urls(self, text):
        """Remove URLs from text"""
        url_pattern = re.compile(r'https?://\S+|www\.\S+')
        return url_pattern.sub('', text)
    
    def remove_mentions(self, text):
        """Remove @mentions"""
        return re.sub(r'@\w+', '', text)
    
    def remove_hashtags(self, text):
        """Remove # from hashtags but keep the word"""
        return re.sub(r'#', '', text)
    
    def remove_punctuation(self, text):
        """Remove punctuation"""
        return text.translate(str.maketrans('', '', string.punctuation))
    
    def to_lowercase(self, text):
        """Convert to lowercase"""
        return text.lower()
    
    def remove_numbers(self, text):
        """Remove numbers"""
        return re.sub(r'\d+', '', text)
    
    def remove_extra_whitespace(self, text):
        """Remove extra whitespace"""
        return ' '.join(text.split())
    
    def tokenize(self, text):
        """Tokenize text into words"""
        return word_tokenize(text)
    
    def remove_stopwords(self, tokens):
        """Remove stopwords from token list"""
        return [word for word in tokens if word not in self.stop_words]
    
    def lemmatize(self, tokens):
        """Lemmatize tokens"""
        return [self.lemmatizer.lemmatize(word) for word in tokens]
    
    def preprocess(self, text, return_tokens=False):
        """
        Complete preprocessing pipeline
        
        Args:
            text (str): Raw text to preprocess
            return_tokens (bool): If True, return list of tokens; if False, return string
        
        Returns:
            str or list: Preprocessed text or tokens
        """
        # Step 1: Remove URLs
        text = self.remove_urls(text)
        
        # Step 2: Remove mentions
        text = self.remove_mentions(text)
        
        # Step 3: Remove hashtags
        text = self.remove_hashtags(text)
        
        # Step 4: Convert to lowercase
        text = self.to_lowercase(text)
        
        # Step 5: Remove punctuation
        text = self.remove_punctuation(text)
        
        # Step 6: Remove numbers
        text = self.remove_numbers(text)
        
        # Step 7: Remove extra whitespace
        text = self.remove_extra_whitespace(text)
        
        # Step 8: Tokenize
        tokens = self.tokenize(text)
        
        # Step 9: Remove stopwords
        tokens = self.remove_stopwords(tokens)
        
        # Step 10: Lemmatize
        tokens = self.lemmatize(tokens)
        
        if return_tokens:
            return tokens
        else:
            return ' '.join(tokens)
    
    def preprocess_batch(self, texts, return_tokens=False):
        """
        Preprocess multiple texts
        
        Args:
            texts (list): List of raw texts
            return_tokens (bool): If True, return list of token lists
        
        Returns:
            list: List of preprocessed texts or token lists
        """
        return [self.preprocess(text, return_tokens) for text in texts]


# Convenience function
def preprocess_text(text, return_tokens=False):
    """
    Quick preprocessing function
    
    Args:
        text (str): Raw text
        return_tokens (bool): Return tokens or string
    
    Returns:
        str or list: Preprocessed text
    """
    preprocessor = TextPreprocessor()
    return preprocessor.preprocess(text, return_tokens)
