# 3D Bin Packing Visualizer 📦

An interactive 3D bin packing visualizer with FFD and Best Fit algorithms.

![3D Bin Packing](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green) ![Three.js](https://img.shields.io/badge/Three.js-3D-orange)

## ✨ Features

- 🎯 **Two Packing Algorithms**: First Fit Decreasing (FFD) and Best Fit
- 🎨 **Interactive 3D Visualization**: Rotate, zoom, and pan the 3D view
- 🌓 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop and mobile
- 📊 **Real-time Statistics**: Space utilization, packed items count

## 🚀 Quick Start

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server
│   ├── models.py            # Pydantic schemas
│   ├── algorithms/
│   │   ├── ffd.py           # First Fit Decreasing
│   │   └── best_fit.py      # Best Fit algorithm
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main component
│   │   ├── components/
│   │   │   ├── Viewport3D.jsx
│   │   │   ├── BinConfig.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── Results.jsx
│   │   │   └── AlgorithmSelector.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
└── PRD.txt                  # Product Requirements Document
```

## 🔧 API

### Pack Items

```
POST /api/pack
```

**Request:**
```json
{
  "bin": { "width": 10, "height": 10, "depth": 10 },
  "items": [
    { "id": "1", "width": 3, "height": 2, "depth": 4 }
  ],
  "algorithm": "ffd"
}
```

**Response:**
```json
{
  "success": true,
  "utilization": 68.5,
  "packedItems": [...],
  "unpackedItems": [],
  "stats": { ... }
}
```

## 🎨 Tech Stack

- **Frontend**: React 18, Three.js, React Three Fiber
- **Backend**: Python, FastAPI, Pydantic
- **Styling**: Custom CSS with CSS Variables

## 📝 License

MIT
