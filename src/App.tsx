import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { config } from './wagmi'
import { NFTMinter } from './components/NFTMinter'
import { SEO } from './components/SEO'
import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
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
                  Solve our blockchain puzzle to mint your unique NFT on the Somnia network!
                </p>
              </div>

              <div style={{ width: '100%', maxWidth: '700px' }}>
                <NFTMinter />
              </div>

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
}

export default App
