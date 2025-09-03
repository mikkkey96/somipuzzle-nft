import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useSwitchChain } from 'wagmi'
import { parseEther } from 'viem'
import { ImagePuzzle } from './ImagePuzzle'
import { NFTPreview } from './NFTPreview'

const CONTRACT_ABI = [
  {
    name: 'solvePuzzleAndMint',
    type: 'function',
    inputs: [{ name: 'answer', type: 'string' }],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    name: 'getMintPrice',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    name: 'totalSupply',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    name: 'hasMinted',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    name: 'MAX_SUPPLY',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  }
] as const

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`
const PUZZLE_IMAGE_URL = 'https://green-unfair-dolphin-882.mypinata.cloud/ipfs/bafybeic4py3mrsblsu67nz54wdrxppos4n3a2lg7ngdpmz2i577qrw3w5u'
const SOMNIA_CHAIN_ID = 5031

// Функция для "очистки" сообщений об ошибках
const prettifyError = (error: string): string => {
  const errorLower = error.toLowerCase()
  
  // Пользователь отменил транзакцию
  if (errorLower.includes('user rejected') || 
      errorLower.includes('user denied') || 
      errorLower.includes('cancelled by user')) {
    return '❌ Transaction cancelled. You denied the signature in your wallet. No funds were spent.'
  }
  
  // Недостаточно средств
  if (errorLower.includes('insufficient funds') || 
      errorLower.includes('insufficient balance')) {
    return '💰 Insufficient funds. You need more SOMI to cover the mint price and gas fees.'
  }
  
  // Уже заминтил
  if (errorLower.includes('already minted') || 
      errorLower.includes('already claimed')) {
    return '🎯 You have already minted your NFT. Each wallet can only mint once.'
  }
  
  // Коллекция закончилась
  if (errorLower.includes('max supply') || 
      errorLower.includes('sold out')) {
    return '😞 Collection sold out. All NFTs have been minted.'
  }
  
  // Неправильная сеть
  if (errorLower.includes('wrong network') || 
      errorLower.includes('unsupported chain')) {
    return '🔗 Please switch to Somnia Network to continue.'
  }
  
  // Для остальных ошибок - показываем первые 150 символов
  return error.split('\n')[0].substring(0, 150) + (error.length > 150 ? '...' : '')
}

export function NFTMinter() {
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Читаем данные из контракта
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
  })

  const { data: maxSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'MAX_SUPPLY',
  })

  const { data: hasAlreadyMinted } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
  })

  const { data: mintPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMintPrice',
  })

  const handleMint = async () => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'solvePuzzleAndMint',
        args: ['somnia'],
        value: mintPrice || parseEther('0.1'),
      })
    } catch (err) {
      console.error('Minting error:', err)
    }
  }

  const handlePuzzleSolved = () => {
    setPuzzleSolved(true)
    setTimeout(() => {
      setShowPreview(true)
    }, 1000)
  }

  if (!isConnected) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '2px dashed rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white'
      }}>
        <h3>🔗 Connect Your Wallet</h3>
        <p>Please connect MetaMask to start the puzzle!</p>
      </div>
    )
  }

  if (chain?.id !== SOMNIA_CHAIN_ID) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '30px',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderRadius: '12px',
        border: '2px solid rgba(251, 191, 36, 0.3)',
        color: 'white'
      }}>
        <h3 style={{ color: '#fbbf24' }}>🔗 Wrong Network</h3>
        <p>Please switch to Somnia Network to continue</p>
        <button
          onClick={() => switchChain({ chainId: SOMNIA_CHAIN_ID })}
          style={{
            marginTop: '15px',
            padding: '12px 24px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Switch to Somnia
        </button>
      </div>
    )
  }

  if (hasAlreadyMinted) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '2px solid rgba(251, 191, 36, 0.5)',
        borderRadius: '12px',
        backgroundColor: 'rgba(254, 243, 199, 0.1)',
        color: 'white'
      }}>
        <h3 style={{ color: '#fbbf24' }}>🎉 Already Completed!</h3>
        <p style={{ fontSize: '16px' }}>
          You have already minted your SomiPuzzle NFT!
        </p>
      </div>
    )
  }

  const currentSupply = Number(totalSupply || 0)
  const maxSupplyNum = Number(maxSupply || 10000)
  
  if (currentSupply >= maxSupplyNum) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        border: '2px solid rgba(239, 68, 68, 0.5)',
        borderRadius: '12px',
        backgroundColor: 'rgba(254, 226, 226, 0.1)',
        color: 'white'
      }}>
        <h3 style={{ color: '#ef4444' }}>😞 Collection Sold Out</h3>
        <p style={{ fontSize: '16px' }}>
          All {maxSupplyNum.toLocaleString()} SomiPuzzle NFTs have been minted!
        </p>
      </div>
    )
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      color: 'white'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
        🧩 SomiPuzzle Challenge
      </h2>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', marginBottom: '10px', color: 'white' }}>
          <strong>Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
          🎯 One NFT per wallet • {(maxSupplyNum - currentSupply).toLocaleString()} remaining
        </p>
      </div>

      {/* Этап 1: Решение пазла */}
      {!puzzleSolved && (
        <div>
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'rgba(254, 243, 199, 0.1)',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <p style={{ margin: 0, color: '#fbbf24' }}>
              📝 <strong>Instructions:</strong> Click tiles to swap them and assemble the complete image!
            </p>
          </div>
          <ImagePuzzle imageUrl={PUZZLE_IMAGE_URL} onSolved={handlePuzzleSolved} />
        </div>
      )}

      {/* Этап 2: Показываем что пазл решен */}
      {puzzleSolved && !showPreview && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'rgba(240, 253, 244, 0.1)',
          borderRadius: '12px',
          border: '2px solid rgba(34, 197, 94, 0.5)'
        }}>
          <h3 style={{ color: '#22c55e', marginBottom: '15px' }}>
            🎉 Congratulations!
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}>
            You solved the puzzle! Preparing your NFT...
          </p>
        </div>
      )}

      {/* Этап 3: Предпросмотр NFT и минт */}
      {showPreview && (
        <NFTPreview 
          imageUrl={PUZZLE_IMAGE_URL}
          onMint={handleMint}
          isMinting={isPending || isConfirming}
        />
      )}

      {hash && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(236, 253, 245, 0.1)',
          border: '1px solid rgba(209, 250, 229, 0.3)',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
            <strong>Transaction Hash:</strong>{' '}
            <a 
              href={`https://explorer.somnia.network/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#22c55e', textDecoration: 'underline' }}
            >
              {hash.slice(0, 10)}...{hash.slice(-8)}
            </a>
          </p>
        </div>
      )}

      {isSuccess && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: 'rgba(240, 253, 244, 0.1)',
          border: '2px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#22c55e', margin: '0 0 10px 0' }}>
            🎉 NFT Minted Successfully!
          </h3>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)' }}>
            Your SomiPuzzle NFT has been minted to your wallet!
          </p>
        </div>
      )}

      {/* УЛУЧШЕННОЕ отображение ошибок */}
      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: 'rgba(254, 242, 242, 0.1)',
          border: '1px solid rgba(254, 202, 202, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>
              {error.message.toLowerCase().includes('user') ? '🚫' : '⚠️'}
            </span>
            <h4 style={{ margin: 0, color: '#ef4444', fontSize: '18px' }}>
              {error.message.toLowerCase().includes('user') ? 'Transaction Cancelled' : 'Transaction Error'}
            </h4>
          </div>
          <p style={{ 
            margin: 0, 
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            {prettifyError(error.message)}
          </p>
          
          {/* Дополнительные советы */}
          {error.message.toLowerCase().includes('user') && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                margin: 0, 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px'
              }}>
                💡 <strong>Tip:</strong> Click the mint button again when you're ready to try the transaction.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
