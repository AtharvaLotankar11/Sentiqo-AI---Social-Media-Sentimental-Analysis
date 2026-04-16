# 🎨 Sentiqo AI — UI/UX Design Document

## Design System & Experience Guidelines

---

## 1. 🧠 Design Philosophy

Sentiqo AI’s interface blends **modern data dashboard aesthetics** with a subtle layer of **neo-brutalism** to achieve:

* Clarity in data-heavy environments
* Strong visual hierarchy
* Fast cognitive scanning
* Minimal but bold interaction design

### Core Principles:

* **Data First** → UI should never overpower insights
* **Sharp & Confident** → Bold edges, clear contrast
* **Minimal Friction** → Fast navigation, intuitive layout
* **Controlled Brutalism** → Slight rawness, not chaos

---

## 2. 🎯 UI Inspiration Breakdown (Dribbble Reference)

From the referenced dashboard design:

### Key Observations:

* Clean grid-based layout
* Card-driven UI structure
* Soft shadows + depth layering
* Clear typography hierarchy
* Balanced whitespace usage
* Subtle color coding for data insights

### Adaptation for Sentiqo:

* Replace soft UI with **slightly harder edges (neo-brutalism touch)**
* Increase contrast and border definition
* Add **functional boldness** instead of decorative softness

---

## 3. 🧩 Layout System

### 3.1 Overall Structure

```
[ Sidebar ]   [ Top Navbar ]
              -------------------------
              |   Dashboard Content   |
              |  (Cards + Graphs)     |
              -------------------------
```

---

### 3.2 Grid System

* 12-column responsive grid
* Card-based modular sections
* Consistent spacing system (8px scale)

---

### 3.3 Core Sections

#### 🔹 Sidebar (Left)

* Logo (icon-logo.png at top)
* Navigation items:

  * Dashboard
  * Sentiment Analysis
  * Trends
  * Reports
  * Settings

#### 🔹 Top Navbar

* Search bar
* Date filter
* User profile/avatar

#### 🔹 Main Dashboard

* KPI Cards (Top Row)
* Graphs (Middle)
* Insights + Word Cloud (Bottom)

---

## 4. 🎨 Color System

### Base Palette:

* **Primary:** #4F46E5 (Indigo)
* **Secondary:** #22C55E (Green)
* **Accent:** #F59E0B (Amber)

### Sentiment Colors:

* Positive → #22C55E
* Negative → #EF4444
* Neutral → #6B7280

### Neo-Brutalism Touch:

* Black borders (#000000)
* High contrast backgrounds
* Occasional solid blocks (no gradients overload)

---

## 5. 🔤 Typography System

### Font Stack:

* **Primary Font:** Inter
* **Alternative:** Poppins

### Hierarchy:

| Element        | Size    | Weight    |
| -------------- | ------- | --------- |
| Heading (H1)   | 28–32px | Bold      |
| Section Titles | 20–24px | Semi-Bold |
| Card Titles    | 16–18px | Medium    |
| Body Text      | 14–16px | Regular   |
| Labels         | 12–14px | Medium    |

### Styling Rules:

* Tight line-height for headings
* Generous spacing for readability
* Avoid excessive font mixing

---

## 6. 🧱 Component Design

### 6.1 Cards (Core Element)

* White background
* **Hard border (2px black for brutalism touch)**
* Subtle shadow OR none
* Rounded corners: 8px (minimal rounding)

---

### 6.2 Buttons

* Solid fill (Primary color)
* Sharp edges (4–6px radius)
* Bold text
* Hover: Slight scale + darker shade

---

### 6.3 Inputs & Search

* Outlined inputs
* Focus state: colored border
* Minimal styling

---

### 6.4 Charts & Graphs

* Clean and uncluttered

* Use:

  * Line charts (trend)
  * Pie charts (distribution)
  * Bar charts (comparisons)

* Avoid heavy gradients

* Use flat colors + subtle highlights

---

## 7. 🧭 Iconography

### Style:

* Outline-based icons
* Consistent stroke width (1.5–2px)
* Minimal and readable

### Libraries:

* Lucide Icons
* Heroicons

### Usage:

* Sidebar navigation
* Data indicators
* Action buttons

---

## 8. 🧩 Branding Integration

### Logo Usage:

* Use **icon-logo.png**:

  * Sidebar top
  * Navbar (compact version optional)

### Rules:

* Maintain padding around logo
* No distortion or recoloring
* Use on neutral backgrounds

---

## 9. ⚡ Microinteractions

* Hover → slight scale (1.02x)
* Click → subtle press effect
* Chart hover → tooltip highlight
* Sidebar → smooth transition

---

## 10. 🧪 UX Flow

### Primary User Flow:

1. User lands on Dashboard
2. Views sentiment summary
3. Filters by keyword/date
4. Explores trends
5. Analyzes themes
6. Extracts insights

---

## 11. 📱 Responsiveness

### Breakpoints:

* Desktop (default)
* Tablet
* Mobile

### Mobile Adaptations:

* Sidebar → collapsible
* Cards → stacked layout
* Simplified charts

---

## 12. 🧩 Neo-Brutalism Integration (Controlled)

To avoid overdesign:

### Apply Brutalism To:

* Borders
* Buttons
* Card outlines

### Avoid Brutalism In:

* Graphs (keep clean)
* Typography (keep readable)

---

## 13. ❌ Design Anti-Patterns

* Overuse of gradients
* Excessive animations
* Cluttered dashboards
* Too many colors
* Inconsistent spacing

---

## 14. 🚀 Final Design Direction

Sentiqo AI should feel like:

> **“A sharp, intelligent dashboard that speaks data clearly, with just enough boldness to stand out.”**

---

## 15. 📌 Summary

* Modern dashboard base
* Clean card-driven UI
* Strong typography hierarchy
* Subtle neo-brutalism accents
* Data-first visualization

---
