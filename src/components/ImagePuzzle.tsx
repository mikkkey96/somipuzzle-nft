import { useState, useEffect } from 'react'

interface ImagePuzzleProps {
  imageUrl: string
  onSolved: () => void
}

export function ImagePuzzle({ imageUrl, onSolved }: ImagePuzzleProps) {
  // ИСПРАВЛЕНО: правильная инициализация массивом
  const [tiles, setTiles] = useState<number[]>(() => 
    Array.from({ length: 16 }, (_, i) => i)
  )
  const [isShuffled, setIsShuffled] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  const shufflePuzzle = () => {
    // Создаем новый массив для перемешивания
    let shuffled = [...Array.from({ length: 16 }, (_, i) => i)]
    
    // Простое перемешивание
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setTiles(shuffled)
    setIsShuffled(true)
    setMoveCount(0)
  }

  const moveTile = (clickedIndex: number) => {
    const emptyIndex = tiles.indexOf(15)
    const canMove = [
      emptyIndex - 1, emptyIndex + 1,
      emptyIndex - 4, emptyIndex + 4
    ].includes(clickedIndex)

    if (canMove) {
      const newTiles = [...tiles]
      ;[newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]]
      setTiles(newTiles)
      setMoveCount(prev => prev + 1)
      
      // Проверка решения
      if (newTiles.every((tile, index) => tile === index)) {
        setTimeout(() => {
          onSolved()
        }, 500)
      }
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {!isShuffled ? (
        <div>
          <img 
            src={imageUrl} 
            alt="Complete puzzle" 
            style={{ 
              width: '100%', 
              maxWidth: '400px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}
          />
          <button 
            onClick={shufflePuzzle}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔀 Start Puzzle
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px'
          }}>
            <p style={{ margin: 0, color: 'white' }}>
              Moves: <strong>{moveCount}</strong>
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px',
            borderRadius: '12px',
            maxWidth: '400px',
            margin: '0 auto',
            aspectRatio: '1'
          }}>
            {tiles.map((tile, index) => (
              <div
                key={`tile-${index}-${tile}`}
                onClick={() => moveTile(index)}
                style={{
                  aspectRatio: '1',
                  backgroundColor: tile === 15 ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                  border: tile === 15 ? '2px dashed rgba(255, 255, 255, 0.3)' : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: tile === 15 ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                {tile === 15 ? '' : tile + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
