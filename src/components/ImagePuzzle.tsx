import { useState } from 'react'

interface ImagePuzzleProps {
  imageUrl: string
  onSolved: () => void
}

export function ImagePuzzle({ imageUrl, onSolved }: ImagePuzzleProps) {
  // 16 частей пазла (0-15)
  const [tiles, setTiles] = useState<number[]>(() => 
    Array.from({ length: 16 }, (_, i) => i)
  )
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isShuffled, setIsShuffled] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  const shufflePuzzle = () => {
    let shuffled = [...tiles]
    // Перемешиваем Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setTiles(shuffled)
    setSelectedIndex(null)
    setMoveCount(0)
    setIsShuffled(true)
  }

  const swapTiles = (index1: number, index2: number) => {
    const newTiles = [...tiles]
    ;[newTiles[index1], newTiles[index2]] = [newTiles[index2], newTiles[index1]]
    setTiles(newTiles)
    setMoveCount(prev => prev + 1)
    
    // Проверка решения - все части в правильном порядке
    const isSolved = newTiles.every((tile, index) => tile === index)
    
    if (isSolved) {
      setTimeout(() => {
        onSolved()
      }, 500)
    }
  }

  // Обработка клика по плитке
  const handleTileClick = (index: number) => {
    if (selectedIndex === null) {
      // Первый клик - выбираем плитку
      setSelectedIndex(index)
    } else if (selectedIndex === index) {
      // Клик по той же плитке - снимаем выбор
      setSelectedIndex(null)
    } else {
      // Второй клик - меняем местами
      swapTiles(selectedIndex, index)
      setSelectedIndex(null)
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
          <p style={{ color: 'white', marginBottom: '20px' }}>
            🧩 Click Start to shuffle the puzzle pieces!
          </p>
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
              Moves: <strong>{moveCount}</strong> | 
              {selectedIndex !== null ? 
                ' Now click another tile to swap!' : 
                ' Click a tile to select it'
              }
            </p>
          </div>
          
          {/* Сетка пазла 4x4 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '8px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '400px',
            height: '400px',
            margin: '0 auto'
          }}>
            {tiles.map((tile, index) => {
              // Вычисляем позицию части в оригинальной картинке
              const sourceRow = Math.floor(tile / 4)
              const sourceCol = tile % 4
              const isSelected = index === selectedIndex
              
              return (
                <div
                  key={`tile-${index}-${tile}`}
                  onClick={() => handleTileClick(index)}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '400px 400px',
                    backgroundPosition: `-${sourceCol * 100}px -${sourceRow * 100}px`,
                    backgroundRepeat: 'no-repeat',
                    border: isSelected ? '4px solid #4f46e5' : '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    userSelect: 'none',
                    boxShadow: isSelected ? '0 0 20px rgba(79, 70, 229, 0.6)' : 'none'
                  }}
                />
              )
            })}
          </div>
          
          <button 
            onClick={shufflePuzzle}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🔄 Reshuffle
          </button>
        </div>
      )}
    </div>
  )
}
