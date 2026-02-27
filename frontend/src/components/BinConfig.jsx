export default function BinConfig({ bin, setBin }) {
  const handleChange = (field, value) => {
    const numValue = parseFloat(value) || 0
    setBin(prev => ({ ...prev, [field]: numValue }))
  }

  return (
    <div className="panel-section">
      <h3 className="panel-title">
        <span className="panel-title-icon">📦</span>
        Bin Configuration
      </h3>
      
      <div className="dimension-inputs">
        <div className="dimension-input-group">
          <label className="dimension-label">WIDTH</label>
          <input
            type="number"
            className="dimension-input"
            value={bin.width}
            onChange={(e) => handleChange('width', e.target.value)}
            min="1"
            step="1"
          />
        </div>
        <div className="dimension-input-group">
          <label className="dimension-label">HEIGHT</label>
          <input
            type="number"
            className="dimension-input"
            value={bin.height}
            onChange={(e) => handleChange('height', e.target.value)}
            min="1"
            step="1"
          />
        </div>
        <div className="dimension-input-group">
          <label className="dimension-label">DEPTH</label>
          <input
            type="number"
            className="dimension-input"
            value={bin.depth}
            onChange={(e) => handleChange('depth', e.target.value)}
            min="1"
            step="1"
          />
        </div>
      </div>
    </div>
  )
}
