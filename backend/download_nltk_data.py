"""
Download required NLTK data
Run this once: python download_nltk_data.py
"""
import nltk

print("Downloading NLTK data...")
print("-" * 50)

# Download required NLTK data
datasets = [
    ('stopwords', 'Stopwords'),
    ('punkt', 'Punkt Tokenizer'),
    ('wordnet', 'WordNet'),
    ('averaged_perceptron_tagger', 'POS Tagger')
]

for dataset, name in datasets:
    try:
        print(f"Downloading {name}...")
        nltk.download(dataset, quiet=True)
        print(f"  ✓ {name} downloaded")
    except Exception as e:
        print(f"  ✗ Error downloading {name}: {e}")

print("-" * 50)
print("✅ NLTK data download complete!")
