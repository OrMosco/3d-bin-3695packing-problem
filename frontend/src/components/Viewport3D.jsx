import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

function BinWireframe({ bin }) {
  const { width, height, depth } = bin
  
  const geometry = useMemo(() => new THREE.BoxGeometry(width, height, depth), [width, height, depth])
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry])
  
  return (
    <group position={[width / 2, height / 2, depth / 2]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#E91E63" transparent opacity={0.6} />
      </lineSegments>
      {/* Solid floor for the bin */}
      <mesh position={[0, -height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#E91E63" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function PackedItem({ item, isHovered, onHover, onUnhover }) {
  const { position, dimensions, color, id } = item
  
  return (
    <group
      position={[
        position.x + dimensions.width / 2,
        position.y + dimensions.height / 2,
        position.z + dimensions.depth / 2
      ]}
    >
      {/* Main box */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(id)
        }}
        onPointerOut={() => onUnhover()}
      >
        <boxGeometry args={[dimensions.width - 0.02, dimensions.height - 0.02, dimensions.depth - 0.02]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={isHovered ? 1 : 0.85}
          emissive={color}
          emissiveIntensity={isHovered ? 0.3 : 0.1}
        />
      </mesh>
      {/* Edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(dimensions.width - 0.02, dimensions.height - 0.02, dimensions.depth - 0.02)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </lineSegments>
    </group>
  )
}

function Scene({ bin, packedItems, hoveredItem, setHoveredItem }) {
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      
      <BinWireframe bin={bin} />
      
      {packedItems.map((item) => (
        <PackedItem 
          key={item.id} 
          item={item} 
          isHovered={hoveredItem === item.id}
          onHover={setHoveredItem}
          onUnhover={() => setHoveredItem(null)}
        />
      ))}
      
      {/* Simple grid floor */}
      <gridHelper args={[50, 50, '#303050', '#252542']} position={[0, -0.01, 0]} />
      
      <OrbitControls 
        makeDefault
        minDistance={5}
        maxDistance={100}
        target={[bin.width / 2, bin.height / 2, bin.depth / 2]}
      />
    </>
  )
}

export default function Viewport3D({ bin, packedItems, hoveredItem, setHoveredItem }) {
  return (
    <div className="viewport-3d">
      <Canvas
        camera={{ 
          position: [bin.width * 2, bin.height * 1.5, bin.depth * 2], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)' }}
      >
        <Scene 
          bin={bin} 
          packedItems={packedItems} 
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
        />
      </Canvas>
    </div>
  )
}
