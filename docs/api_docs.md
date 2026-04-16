# 🔌 Sentiqo AI — API Documentation

## Base URL
`http://127.0.0.1:8000/api`

---

### 1. Sentiment Analysis
**Endpoint:** `POST /analyze/`  
**Description:** Predicts sentiment for a single block of text.

**Request Body:**
```json
{
  "text": "I love the new design of Sentiqo AI!"
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "confidence": 0.999,
  "original_text": "...",
  "probabilities": { "positive": 0.999, "negative": 0.001 }
}
```

---

### 2. Dashboard Stats
**Endpoint:** `GET /dashboard/stats/`  
**Description:** Returns aggregated sentiment KPIs for the dashboard.

**Response:**
```json
{
  "total_posts": 14704,
  "positive": 8701,
  "negative": 6003,
  "positive_percentage": 59.17,
  "negative_percentage": 40.83
}
```

---

### 3. Sentiment Trends
**Endpoint:** `GET /trends/`  
**Description:** Returns time-series data for sentiment shifts.

---

### 4. Theme Extraction
**Endpoint:** `GET /themes/`  
**Description:** Returns top keywords categorized by sentiment.

---

### 5. AI Insights
**Endpoint:** `GET /insights/`  
**Description:** Returns dynamic recommendations and anomaly alerts.

**Response:**
```json
[
  {
    "id": "neg-spike",
    "type": "warning",
    "title": "Negative Sentiment Alert",
    "message": "Negative sentiment is currently at 41.2%..."
  }
]
```
