export default function AlgorithmSelector({ algorithm, setAlgorithm }) {
  return (
    <div className="panel-section">
      <h3 className="panel-title">
        <span className="panel-title-icon">⚙️</span>
        Algorithm
      </h3>
      
      <select 
        className="algorithm-select"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >
        <option value="ffd">🚀 First Fit Decreasing (FFD)</option>
        <option value="best_fit">🎯 Best Fit</option>
      </select>
      
      <p style={{ 
        fontSize: '12px', 
        color: 'var(--text-muted)', 
        marginTop: '8px',
        lineHeight: '1.5'
      }}>
        {algorithm === 'ffd' 
          ? '⚡ Fast algorithm that places items in the first available position.'
          : '🎯 Evaluates all positions to minimize wasted space.'}
      </p>
    </div>
  )
}
