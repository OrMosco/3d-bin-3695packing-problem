export default function Results({ results, hoveredItem }) {
  if (!results) {
    return (
      <div className="results-panel">
        <div className="result-item">
          <span className="result-icon">📊</span>
          <div>
            <div className="result-label">Status</div>
            <div className="result-value" style={{ fontSize: '16px' }}>Ready to pack</div>
          </div>
        </div>
      </div>
    )
  }

  const { utilization, stats, unpackedItems, algorithm } = results

  return (
    <div className="results-panel">
      <div className="result-item">
        <span className="result-icon">🎯</span>
        <div>
          <div className="result-label">Utilization</div>
          <div className={`result-value ${utilization >= 70 ? 'success' : ''}`}>
            {utilization.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="result-item">
        <span className="result-icon">📦</span>
        <div>
          <div className="result-label">Packed</div>
          <div className="result-value">
            {stats.packedCount}/{stats.totalItems}
          </div>
        </div>
      </div>
      
      <div className="result-item">
        <span className="result-icon">⚡</span>
        <div>
          <div className="result-label">Algorithm</div>
          <div className="result-value" style={{ fontSize: '16px' }}>
            {algorithm === 'ffd' ? 'FFD' : 'Best Fit'}
          </div>
        </div>
      </div>
      
      <div className="result-item">
        <span className="result-icon">📐</span>
        <div>
          <div className="result-label">Volume Used</div>
          <div className="result-value" style={{ fontSize: '16px' }}>
            {stats.usedVolume.toFixed(0)} / {stats.binVolume.toFixed(0)}
          </div>
        </div>
      </div>
      
      {unpackedItems.length > 0 && (
        <div className="unpacked-warning">
          <span>⚠️</span>
          {unpackedItems.length} item(s) couldn't fit
        </div>
      )}
      
      {hoveredItem && (
        <div className="result-item">
          <span className="result-icon">👆</span>
          <div>
            <div className="result-label">Selected</div>
            <div className="result-value" style={{ fontSize: '14px' }}>
              {hoveredItem}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
