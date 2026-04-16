"""
Test model service
"""
from ml_pipeline.model_service import SentimentModelService, predict_sentiment

print("=" * 70)
print("MODEL SERVICE TEST")
print("=" * 70)

# Initialize service
service = SentimentModelService()

# Test samples
test_samples = [
    "I absolutely love this! Best purchase ever!",
    "Terrible product. Complete waste of money.",
    "Great quality and fast shipping. Highly recommend!",
    "Disappointed with the service. Never buying again.",
    "Amazing experience! Will definitely come back!",
    "Worst customer service I've ever experienced.",
    "Pretty good, meets expectations.",
    "Not bad, could be better though."
]

print("\n--- Prediction Results ---\n")
for i, text in enumerate(test_samples, 1):
    result = service.predict(text)
    
    if 'error' in result:
        print(f"{i}. ERROR: {result['error']}")
    else:
        sentiment = result['sentiment'].upper()
        confidence = result['confidence'] * 100
        
        # Color coding
        emoji = "✅" if sentiment == "POSITIVE" else "❌"
        
        print(f"{i}. {emoji} [{sentiment}] {confidence:.1f}%")
        print(f"   Text: {text}")
        print(f"   Probabilities: Neg={result['probabilities']['negative']:.2f}, "
              f"Pos={result['probabilities']['positive']:.2f}")
        print()

# Test quick function
print("\n--- Quick Function Test ---\n")
quick_result = predict_sentiment("This is awesome!")
print(f"Sentiment: {quick_result['sentiment']}")
print(f"Confidence: {quick_result['confidence']*100:.1f}%")

print("\n" + "=" * 70)
print("✅ Model service test complete!")
print("=" * 70)
