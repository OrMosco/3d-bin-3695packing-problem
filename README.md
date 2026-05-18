# 3D Bin Packing Visualizer 📦

An interactive 3D bin packing visualizer with FFD and Best Fit algorithms — runs entirely in the browser, no backend required.

![3D Bin Packing](https://img.shields.io/badge/React-18-blue) ![Three.js](https://img.shields.io/badge/Three.js-3D-orange) ![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)

## ✨ Features

- 🎯 **Two Packing Algorithms**: First Fit Decreasing (FFD) and Best Fit, implemented in JavaScript and run client-side
- 🎨 **Interactive 3D Visualization**: Rotate, zoom, and pan the 3D view
- 🌓 **Dark/Light Mode**: Toggle between themes with system-preference detection
- 📱 **Responsive Design**: Works on desktop and mobile
- 📊 **Real-time Statistics**: Space utilization, packed items count, unpacked items list
- 🎲 **Quick Actions**: Load sample items or clear the workspace in one click

## 🚀 Quick Start

### Frontend Only (recommended)

The frontend runs the packing algorithms entirely in the browser — no backend needed.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Backend (optional, standalone REST API)

A standalone FastAPI backend is also provided if you need the packing algorithms exposed as an API.

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs.

### Deploy to GitHub Pages

```bash
cd frontend
npm run deploy
```

## 📁 Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server (optional)
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
│   │   ├── lib/
│   │   │   └── binPacking.js  # Client-side packing algorithms (JS)
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
└── PRD.txt                  # Product Requirements Document
```

## 🔧 Backend API (optional)

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

### Get Algorithms

```
GET /api/algorithms
```

## 🎨 Tech Stack

- **Frontend**: React 18, Three.js, React Three Fiber, Vite
- **Packing Logic**: Pure JavaScript (client-side, `src/lib/binPacking.js`)
- **Backend** (optional): Python, FastAPI, Pydantic
- **Styling**: Custom CSS with CSS Variables
- **Deploy**: GitHub Pages (`npm run deploy`)

## 📝 License

MIT
