"""
Test preprocessing service
"""
from services.preprocessing_service import PreprocessingService, get_training_data

print("=" * 70)
print("PREPROCESSING SERVICE TEST")
print("=" * 70)

# Initialize service
service = PreprocessingService()

# Test 1: Preprocess single post
print("\n--- Test 1: Single Post Preprocessing ---\n")
result = service.preprocess_post(1)
if result:
    print(f"Post ID: {result['id']}")
    print(f"Original: {result['original'][:80]}...")
    print(f"Cleaned: {result['cleaned'][:80]}...")
    print(f"Tokens: {result['tokens'][:10]}...")
else:
    print("Post not found")

# Test 2: Batch preprocessing (small sample)
print("\n--- Test 2: Batch Preprocessing (100 posts) ---\n")
X, y = service.get_preprocessed_dataset(limit=100)
print(f"Total samples: {len(X)}")
print(f"Total labels: {len(y)}")
print(f"Positive samples: {sum(y)}")
print(f"Negative samples: {len(y) - sum(y)}")

print("\nSample preprocessed texts:")
for i in range(3):
    label = "Positive" if y[i] == 1 else "Negative"
    print(f"{i+1}. [{label}] {X[i][:60]}...")

# Test 3: Quick function
print("\n--- Test 3: Quick Training Data Function ---\n")
X_train, y_train = get_training_data(limit=50)
print(f"✅ Got {len(X_train)} training samples")
print(f"   Positive: {sum(y_train)}")
print(f"   Negative: {len(y_train) - sum(y_train)}")

print("\n" + "=" * 70)
print("✅ Preprocessing service test complete!")
print("=" * 70)
