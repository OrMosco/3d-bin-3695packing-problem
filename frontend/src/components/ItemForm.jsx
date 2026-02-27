import { useState } from 'react'

const COLORS = [
  "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
  "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
  "#CDDC39", "#FFC107", "#FF9800", "#FF5722", "#795548"
]

export default function ItemForm({ onAddItem }) {
  const [width, setWidth] = useState('2')
  const [height, setHeight] = useState('2')
  const [depth, setDepth] = useState('2')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const w = parseFloat(width)
    const h = parseFloat(height)
    const d = parseFloat(depth)
    
    if (w > 0 && h > 0 && d > 0) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      onAddItem({
        id: `item-${Date.now()}`,
        width: w,
        height: h,
        depth: d,
        color
      })
      setWidth('')
      setHeight('')
      setDepth('')
    }
  }

  return (
    <div className="panel-section">
      <h3 className="panel-title">
        <span className="panel-title-icon">➕</span>
        Add Item
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="dimension-inputs">
          <div className="dimension-input-group">
            <label className="dimension-label">W</label>
            <input
              type="number"
              className="dimension-input"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="0"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="dimension-input-group">
            <label className="dimension-label">H</label>
            <input
              type="number"
              className="dimension-input"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="0"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="dimension-input-group">
            <label className="dimension-label">D</label>
            <input
              type="number"
              className="dimension-input"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              placeholder="0"
              min="0.1"
              step="0.1"
            />
          </div>
        </div>
        
        <button type="submit" className="btn btn-secondary btn-full" style={{ marginTop: '12px' }}>
          <span>➕</span> Add Item
        </button>
      </form>
    </div>
  )
}
