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
      alert('Minting failed! Check console for details.')
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

  // Проверка сети
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

  // Проверяем, заминтил ли пользователь уже NFT
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
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          Each wallet can only mint one NFT to keep the collection fair.
        </p>
      </div>
    )
  }

  // Проверяем достигнут ли максимальный supply
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
          All 10,000 SomiPuzzle NFTs have been minted!
        </p>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          Thank you for your interest in our collection.
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
      
      {/* Статистика коллекции */}
      <div style={{
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>Collection Progress</h4>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              {currentSupply} / {maxSupplyNum.toLocaleString()} minted
            </p>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#6366f1'
          }}>
            {Math.round((currentSupply / maxSupplyNum) * 100)}%
          </div>
        </div>
        
        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(currentSupply / maxSupplyNum) * 100}%`,
            height: '100%',
            backgroundColor: '#6366f1',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Информация о цене */}
      <div style={{
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(14, 165, 233, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', color: 'white' }}>Mint Price</h4>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Each NFT costs 0.1 SOMI + gas fees
            </p>
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#0ea5e9'
          }}>
            0.1 SOMI
          </div>
        </div>
      </div>
      
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
          <div style={{ marginTop: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(34, 197, 94, 0.3)',
              borderTop: '4px solid #22c55e',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
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
            Your SomiPuzzle NFT #{currentSupply} has been minted to your wallet!
          </p>
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(254, 242, 242, 0.1)',
          border: '1px solid rgba(254, 202, 202, 0.3)',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, color: '#ef4444' }}>
            <strong>Error:</strong> {error.message}
          </p>
          {error.message.includes('Already minted') && (
            <p style={{ margin: '10px 0 0 0', color: 'rgba(239, 68, 68, 0.8)', fontSize: '14px' }}>
              💡 You can only mint one NFT per wallet.
            </p>
          )}
          {error.message.includes('Max supply reached') && (
            <p style={{ margin: '10px 0 0 0', color: 'rgba(239, 68, 68, 0.8)', fontSize: '14px' }}>
              😞 All NFTs have been minted! Collection is sold out.
            </p>
          )}
          {error.message.includes('Insufficient payment') && (
            <p style={{ margin: '10px 0 0 0', color: 'rgba(239, 68, 68, 0.8)', fontSize: '14px' }}>
              💰 Make sure you have at least 0.1 SOMI + gas fees.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
