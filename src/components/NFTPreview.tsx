interface NFTPreviewProps {
  imageUrl: string
  onMint: () => void
  isMinting: boolean
}

export function NFTPreview({ imageUrl, onMint, isMinting }: NFTPreviewProps) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: 'white', marginBottom: '20px' }}>🎨 Your NFT Preview</h3>
      
      <div style={{
        position: 'relative',
        display: 'inline-block',
        marginBottom: '25px'
      }}>
        <img 
          src={imageUrl} 
          alt="NFT Preview" 
          style={{ 
            width: '300px',
            height: '300px',
            borderRadius: '16px',
            border: '3px solid #ffd700',
            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
          color: '#000',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          ✨ RARE
        </div>
      </div>

      <div style={{
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <h4 style={{ color: 'white', marginBottom: '15px', textAlign: 'center' }}>NFT Details</h4>
        <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
          <p><strong>Name:</strong> SomiPuzzle #{Math.floor(Math.random() * 10000) + 1}</p>
          <p><strong>Blockchain:</strong> Somnia Network</p>
          <p><strong>Type:</strong> Puzzle Achievement NFT</p>
          <p><strong>Rarity:</strong> Limited Edition</p>
          <p><strong>Price:</strong> 0.1 SOMI</p>
        </div>
      </div>

      <button
        onClick={onMint}
        disabled={isMinting}
        style={{
          padding: '18px 36px',
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: isMinting ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(45deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          borderRadius: '16px',
          cursor: isMinting ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isMinting ? 'none' : '0 8px 32px rgba(16, 185, 129, 0.3)',
          transform: isMinting ? 'none' : 'translateY(-2px)',
          minWidth: '200px'
        }}
        onMouseOver={(e) => {
          if (!isMinting) {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)'
          }
        }}
        onMouseOut={(e) => {
          if (!isMinting) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)'
          }
        }}
      >
        {isMinting ? (
          <span>
            <span style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '10px'
            }}></span>
            Minting...
          </span>
        ) : (
          '🎯 Mint Your NFT'
        )}
      </button>

      <p style={{ 
        marginTop: '15px', 
        fontSize: '14px', 
        color: 'rgba(255, 255, 255, 0.7)' 
      }}>
        🔒 This will be permanently recorded on the Somnia blockchain
      </p>
    </div>
  )
}
