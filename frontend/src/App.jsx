import { useState, useEffect } from 'react'
import './App.css'
import BinConfig from './components/BinConfig'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import AlgorithmSelector from './components/AlgorithmSelector'
import Viewport3D from './components/Viewport3D'
import Results from './components/Results'
import { packItems } from './lib/binPacking'

function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  // Bin configuration
  const [bin, setBin] = useState({ width: 10, height: 10, depth: 10 })
  
  // Items to pack
  const [items, setItems] = useState([])
  
  // Algorithm selection
  const [algorithm, setAlgorithm] = useState('ffd')
  
  // Packing results
  const [results, setResults] = useState(null)
  const [packedItems, setPackedItems] = useState([])
  
  // Loading state
  const [loading, setLoading] = useState(false)
  
  // Hover state for 3D interaction
  const [hoveredItem, setHoveredItem] = useState(null)

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const handleAddItem = (item) => {
    setItems(prev => [...prev, item])
  }

  const handleRemoveItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handlePack = () => {
    if (items.length === 0) return
    
    setLoading(true)
    
    try {
      // Run packing algorithm locally (no backend needed)
      const data = packItems(
        bin,
        items.map(item => ({
          id: item.id,
          width: item.width,
          height: item.height,
          depth: item.depth
        })),
        algorithm
      )
      
      setResults({ ...data, algorithm })
      
      // Merge colors from original items
      const packedWithColors = data.packedItems.map(packed => {
        const original = items.find(i => i.id === packed.id)
        return {
          ...packed,
          color: original?.color || packed.color
        }
      })
      setPackedItems(packedWithColors)
      
    } catch (error) {
      console.error('Error packing:', error)
      alert('Packing error: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setItems([])
    setResults(null)
    setPackedItems([])
  }

  // Add some sample items
  const handleAddSamples = () => {
    const samples = [
      { id: 'sample-1', width: 4, height: 3, depth: 2, color: '#E91E63' },
      { id: 'sample-2', width: 2, height: 2, depth: 2, color: '#9C27B0' },
      { id: 'sample-3', width: 3, height: 2, depth: 3, color: '#2196F3' },
      { id: 'sample-4', width: 2, height: 4, depth: 2, color: '#4CAF50' },
      { id: 'sample-5', width: 3, height: 1, depth: 4, color: '#FF9800' },
      { id: 'sample-6', width: 2, height: 2, depth: 3, color: '#00BCD4' },
    ]
    setItems(samples)
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-logo">📦</span>
          <h1 className="header-title">3D Bin Packing Visualizer</h1>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
            <span className="theme-toggle-label">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <BinConfig bin={bin} setBin={setBin} />
          <ItemForm onAddItem={handleAddItem} />
          <ItemList items={items} onRemoveItem={handleRemoveItem} />
          <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />
          
          {/* Quick Actions */}
          <div className="panel-section">
            <h3 className="panel-title">
              <span className="panel-title-icon">⚡</span>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handleAddSamples}
                style={{ flex: 1 }}
              >
                🎲 Samples
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleClear}
                style={{ flex: 1 }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </aside>

        {/* Viewport */}
        <div className="viewport-container">
          <Viewport3D 
            bin={bin} 
            packedItems={packedItems}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
          />
          <Results results={results} hoveredItem={hoveredItem} />
        </div>
      </main>

      {/* Pack Button */}
      <div className="pack-button-container">
        <button 
          className={`btn btn-primary btn-full pack-button ${loading ? 'loading' : ''}`}
          onClick={handlePack}
          disabled={loading || items.length === 0}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Packing...
            </>
          ) : (
            <>
              <span>🚀</span>
              Pack Items ({items.length})
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>© 2026 3D Bin Packing Visualizer ✨</div>
        <div className="footer-links">
          <a href="#" className="footer-link">About</a>
          <a href="#" className="footer-link">GitHub</a>
          <a href="#" className="footer-link">Documentation</a>
        </div>
      </footer>
    </div>
  )
}

export default App
