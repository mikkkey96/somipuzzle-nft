import { useState, useEffect } from 'react'

// Функция для перемешивания массива
function shuffle(array: number[]): number[] {
  let currentIndex = array.length, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

interface ImagePuzzleProps {
  imageUrl: string
  onSolved: () => void
}

export function ImagePuzzle({ imageUrl, onSolved }: ImagePuzzleProps) {
  const size = 4
  const tileSize = 80
  const initialOrder = Array.from({ length: size * size }, (_, i) => i + 1)
  
  const [tiles, setTiles] = useState<number[]>(() => shuffle([...initialOrder]))
  const [selectedTile, setSelectedTile] = useState<number | null>(null)
  const [moves, setMoves] = useState(0)

  // Проверяем решен ли пазл
  useEffect(() => {
    if (tiles.every((tile, idx) => tile === initialOrder[idx])) {
      setTimeout(() => {
        onSolved()
      }, 500)
    }
  }, [tiles])

  // Меняем местами две плитки
  const swapTiles = (index1: number, index2: number) => {
    const newTiles = [...tiles]
    const temp = newTiles[index1]
    newTiles[index1] = newTiles[index2]
    newTiles[index2] = temp
    setTiles(newTiles)
    setMoves(prev => prev + 1)
  }

  const handleTileClick = (clickedIndex: number) => {
    if (selectedTile === null) {
      setSelectedTile(clickedIndex)
    } else if (selectedTile === clickedIndex) {
      setSelectedTile(null)
    } else {
      swapTiles(selectedTile, clickedIndex)
      setSelectedTile(null)
    }
  }

  const resetPuzzle = () => {
    setTiles(shuffle([...initialOrder]))
    setSelectedTile(null)
    setMoves(0)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '15px', color: '#374151' }}>
        🧩 Assemble the Image Puzzle
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Moves: <strong>{moves}</strong> | Click two tiles to swap them
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
        gap: '4px',
        justifyContent: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '2px solid #e2e8f0'
      }}>
        {tiles.map((tileNumber, index) => {
          const correctRow = Math.floor((tileNumber - 1) / size)
          const correctCol = (tileNumber - 1) % size
          const bgX = -correctCol * tileSize
          const bgY = -correctRow * tileSize
          const isSelected = selectedTile === index

          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                borderRadius: '8px',
                border: isSelected ? '3px solid #6366f1' : '2px solid #d1d5db',
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `${bgX}px ${bgY}px`,
                backgroundSize: `${size * tileSize}px ${size * tileSize}px`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected 
                  ? '0 4px 12px rgba(99, 102, 241, 0.4)' 
                  : '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
          )
        })}
      </div>

      <button
        onClick={resetPuzzle}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        🔄 Shuffle Again
      </button>
    </div>
  )
}
