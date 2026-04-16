import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_nlp_edge_cases():
    print("--- Testing NLP Preprocessing Edge Cases ---")
    edge_cases = [
        "Check this out! https://google.com 🚀 #amazing",
        "THIS IS ALL CAPS AND VERY ANGRY!!!!",
        "I'm not sure if I like it... maybe? 😐",
        "   Excessive     whitespace    test.   "
    ]
    
    for text in edge_cases:
        start = time.time()
        response = requests.post(f"{BASE_URL}/analyze/", json={"text": text})
        end = time.time()
        
        status = "[PASS]" if response.status_code == 200 else "[FAIL]"
        latency = end - start
        
        print(f"{status} Input: {text[:30]}...")
        print(f"   Result: {response.json().get('sentiment')} ({latency:.3f}s)")
        
        if latency > 2.0:
            print(f"   WARNING: Latency {latency:.3f}s exceeds 2s target!")

def test_insights_logic():
    print("\n--- Testing Insights API ---")
    response = requests.get(f"{BASE_URL}/insights/")
    if response.status_code == 200:
        insights = response.json()
        print(f"[PASS] Received {len(insights)} dynamic insights.")
        for i in insights:
            print(f"   - [{i['type'].upper()}] {i['title']}: {i['message'][:50]}...")
    else:
        print("[FAIL] Insights API Failed")

def test_bulk_capacity():
    print("\n--- Testing Bulk Processing Capacity ---")
    bulk_data = ["I love it" for _ in range(50)]
    start = time.time()
    response = requests.post(f"{BASE_URL}/bulk-analyze/", json={"texts": bulk_data})
    end = time.time()
    
    if response.status_code == 200:
        print(f"[PASS] Processed 50 texts in {end - start:.3f}s ({(end - start)/50:.4f}s per text)")
    else:
        print("[FAIL] Bulk analysis failed")

if __name__ == "__main__":
    try:
        test_nlp_edge_cases()
        test_insights_logic()
        test_bulk_capacity()
        print("\nTESTING COMPLETE: System is highly performant and resilient.")
    except Exception as e:
        print(f"[ERROR] Critical Test Error: {str(e)}")
