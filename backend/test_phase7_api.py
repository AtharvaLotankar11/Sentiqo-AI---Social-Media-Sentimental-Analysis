import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_endpoints():
    print("--- Testing API Endpoints ---")
    
    # 1. Test Analyze
    print("\n1. Testing /analyze/")
    try:
        resp = requests.post(f"{BASE_URL}/analyze/", json={"text": "I love this project, it is amazing!"})
        print(f"Status: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

    # 2. Test Stats
    print("\n2. Testing /dashboard/stats/")
    try:
        resp = requests.get(f"{BASE_URL}/dashboard/stats/")
        print(f"Status: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json(), indent=2)}")
    except Exception as e:
        print(f"Error: {e}")

    # 3. Test Trends
    print("\n3. Testing /trends/")
    try:
        resp = requests.get(f"{BASE_URL}/trends/")
        print(f"Status: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json()[:2], indent=2)} (showing first 2)")
    except Exception as e:
        print(f"Error: {e}")

    # 4. Test Themes
    print("\n4. Testing /themes/")
    try:
        resp = requests.get(f"{BASE_URL}/themes/")
        print(f"Status: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json()[:2], indent=2)} (showing first 2)")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_endpoints()
