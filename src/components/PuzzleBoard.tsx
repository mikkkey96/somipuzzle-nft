import { useState, useEffect } from 'react'

// Helper функция для перемешивания массива
function shuffle(array: number[]): number[] {
  let currentIndex = array.length, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

interface PuzzleBoardProps {
  onSolved: () => void
}

export function PuzzleBoard({ onSolved }: PuzzleBoardProps) {
  // Создаем пары чисел (каждое число дублируется) 
  const createInitialTiles = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1) // числа 1-8
    const pairs = [...numbers, ...numbers] // дублируем для пар
    return shuffle(pairs)
  }

  const [tiles, setTiles] = useState<number[]>(createInitialTiles)
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (selectedTiles.length === 2) {
      const [firstIndex, secondIndex] = selectedTiles
      const firstValue = tiles[firstIndex]
      const secondValue = tiles[secondIndex]

      if (firstValue === secondValue) {
        // Пара совпала! Добавляем в matched
        setMatchedPairs(prev => new Set([...prev, firstValue]))
      }

      // Скрываем выбранные тайлы через 800ms
      setTimeout(() => {
        setSelectedTiles([])
      }, 800)
    }
  }, [selectedTiles, tiles])

  // Проверяем решен ли пазл (найдены все 8 пар)
  useEffect(() => {
    if (matchedPairs.size === 8) {
      setTimeout(() => {
        onSolved()
      }, 1000)
    }
  }, [matchedPairs, onSolved])

  const handleTileClick = (index: number) => {
    const tileValue = tiles[index]
    
    // Не позволяем кликать на уже совпавшие или уже выбранные тайлы
    if (matchedPairs.has(tileValue) || selectedTiles.includes(index)) {
      return
    }

    // Не позволяем выбирать больше 2 тайлов
    if (selectedTiles.length < 2) {
      setSelectedTiles(prev => [...prev, index])
    }
  }

  const resetPuzzle = () => {
    setTiles(createInitialTiles())
    setSelectedTiles([])
    setMatchedPairs(new Set())
  }

  const getTileStyle = (index: number, value: number) => {
    const isSelected = selectedTiles.includes(index)
    const isMatched = matchedPairs.has(value)
    
    let backgroundColor = '#3b82f6' // синий по умолчанию
    if (isMatched) backgroundColor = '#22c55e' // зеленый для совпавших
    else if (isSelected) backgroundColor = '#f59e0b' // оранжевый для выбранных

    return {
      width: '70px',
      height: '70px',
      backgroundColor,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      borderRadius: '12px',
      cursor: isMatched ? 'default' : 'pointer',
      userSelect: 'none' as const,
      transition: 'all 0.3s ease',
      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
      boxShadow: isSelected ? '0 4px 12px rgba(245, 158, 11, 0.4)' : 
                 isMatched ? '0 4px 12px rgba(34, 197, 94, 0.4)' : 
                 '0 2px 4px rgba(0,0,0,0.1)',
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginBottom: '20px', color: '#374151' }}>
        🎯 Memory Puzzle: Find all matching pairs!
      </h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Matched pairs: <strong>{matchedPairs.size}/8</strong>
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 70px)',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        {tiles.map((value, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            style={getTileStyle(index, value)}
          >
            {selectedTiles.includes(index) || matchedPairs.has(value) ? value : '?'}
          </div>
        ))}
      </div>

      {matchedPairs.size === 8 && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f0fdf4',
          border: '2px solid #22c55e',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#15803d', margin: '0 0 10px 0' }}>
            🎉 Puzzle Solved!
          </h3>
          <p style={{ color: '#166534', margin: 0 }}>
            Great job! You can now mint your NFT!
          </p>
        </div>
      )}

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
        🔄 Reset Puzzle
      </button>
    </div>
  )
}
