import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { config } from './wagmi'
import { NFTMinter } from './components/NFTMinter'
import { SEO } from './components/SEO'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  const [hasError, setHasError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Отладка для поиска ошибки в состоянии
  useEffect(() => {
    console.log('App mounted, checking environment:')
    console.log('Project ID:', import.meta.env.VITE_WALLETCONNECT_PROJECT_ID)
    console.log('Contract Address:', import.meta.env.VITE_CONTRACT_ADDRESS)
    console.log('Chain ID:', import.meta.env.VITE_CHAIN_ID)
  }, [])

  // Если ошибка поймана, показываем простой интерфейс
  if (hasError) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🚧 SomiPuzzle - Error Detected</h1>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '600px'
        }}>
          <h2>Error Message:</h2>
          <p style={{ fontFamily: 'monospace', fontSize: '14px' }}>
            {errorMsg}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Главный компонент с перехватом ошибок
  try {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <SEO />
            <div style={{ 
              minHeight: '100vh',
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Header */}
              <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '20px 5%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                width: '90%',
                boxSizing: 'border-box'
              }}>
                <div>
                  <h1 style={{ 
                    margin: 0, 
                    color: 'white', 
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 'bold'
                  }}>
                    🧩 SomiPuzzle
                  </h1>
                  <p style={{ 
                    margin: '5px 0 0 0', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 'clamp(12px, 2vw, 16px)'
                  }}>
                    Gamified NFT minting on Somnia blockchain
                  </p>
                </div>
                <ConnectButton />
              </header>

              {/* Main Content */}
              <main style={{ 
                flex: 1,
                padding: '40px 5%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '90%',
                boxSizing: 'border-box',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '40px',
                  color: 'white',
                  width: '100%'
                }}>
                  <h2 style={{ 
                    fontSize: 'clamp(28px, 6vw, 48px)', 
                    margin: '0 0 15px 0',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    Welcome to SomiPuzzle! 🎮
                  </h2>
                  <p style={{ 
                    fontSize: 'clamp(16px, 3vw, 20px)', 
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                    opacity: '0.9'
                  }}>
                    Solve our blockchain puzzle to mint your unique NFT on the Somnia network. 
                    Each correct answer grants you a special collectible!
                  </p>
                </div>

                {/* Здесь раньше был NFTMinter - временно заменен на заглушку */}
                <div style={{ 
                  width: '100%', 
                  maxWidth: '700px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '30px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  color: 'white'
                }}>
                  <h3>🔧 Debugging Mode</h3>
                  <p>NFTMinter component temporarily disabled for error diagnosis.</p>
                  <p>If you see this message, the basic app structure is working!</p>
                </div>

                {/* Footer Info */}
                <div style={{ 
                  marginTop: '50px',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 'clamp(12px, 2vw, 16px)',
                  width: '100%'
                }}>
                  <p>Built on Somnia Mainnet • Chain ID: 5031</p>
                  <p>
                    <a 
                      href="https://explorer.somnia.network" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'underline' }}
                    >
                      View on Somnia Explorer
                    </a>
                  </p>
                </div>
              </main>
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    )
  } catch (error) {
    console.error('Critical error in App component:', error)
    setHasError(true)
    setErrorMsg(error.message || 'Unknown error occurred')
    
    // На всякий случай возвращаем простой fallback
    return (
      <div style={{ 
        padding: '50px', 
        backgroundColor: '#dc2626', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>💥 Critical Error</h1>
        <p>Something went wrong: {error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: 'white',
            color: '#dc2626',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Reload Page
        </button>
      </div>
    )
  }
}

export default App
