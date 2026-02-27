export default function ItemList({ items, onRemoveItem }) {
  if (items.length === 0) {
    return (
      <div className="panel-section">
        <h3 className="panel-title">
          <span className="panel-title-icon">📋</span>
          Items ({items.length})
        </h3>
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <p className="empty-state-text">No items added yet.<br/>Add items above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel-section">
      <h3 className="panel-title">
        <span className="panel-title-icon">📋</span>
        Items ({items.length})
      </h3>
      
      <div className="item-list">
        {items.map((item, index) => (
          <div key={item.id} className="item-card">
            <div className="item-info">
              <span 
                className="item-color" 
                style={{ backgroundColor: item.color, color: item.color }}
              />
              <div>
                <div className="item-name">Item {index + 1}</div>
                <div className="item-dims">
                  {item.width} × {item.height} × {item.depth}
                </div>
              </div>
            </div>
            <button 
              className="item-delete" 
              onClick={() => onRemoveItem(item.id)}
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
