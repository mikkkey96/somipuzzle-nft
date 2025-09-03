interface NFTPreviewProps {
  imageUrl: string
  onMint: () => void
  isMinting: boolean
}

export function NFTPreview({ imageUrl, onMint, isMinting }: NFTPreviewProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '30px',
      backgroundColor: '#f0f9ff',
      borderRadius: '16px',
      border: '2px solid #0ea5e9'
    }}>
      <h3 style={{ color: '#0c4a6e', marginBottom: '20px' }}>
        🎉 Puzzle Completed! Your NFT Preview:
      </h3>
      
      <div style={{
        display: 'inline-block',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        marginBottom: '25px'
      }}>
        <img 
          src={imageUrl} 
          alt="SomiPuzzle NFT"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '8px',
            objectFit: 'cover'
          }}
        />
        <div style={{ 
          marginTop: '15px', 
          padding: '10px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>
            SomiPuzzle NFT
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Unique puzzle solver achievement
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '16px', color: '#0c4a6e', marginBottom: '10px' }}>
          Ready to mint your achievement NFT for <strong>0.1 SOMI</strong>?
        </p>
        <p style={{ fontSize: '14px', color: '#0369a1' }}>
          This NFT proves you solved the SomiPuzzle challenge!
        </p>
        <p style={{ fontSize: '12px', color: '#0369a1', marginTop: '5px' }}>
          💰 Payment goes directly to the creator&apos;s wallet
        </p>
      </div>

      <button
        onClick={onMint}
        disabled={isMinting}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: isMinting ? '#9ca3af' : '#22c55e',
          border: 'none',
          borderRadius: '12px',
          cursor: isMinting ? 'not-allowed' : 'pointer',
          minWidth: '200px'
        }}
      >
        {isMinting ? '🔄 Minting...' : '🎯 Mint NFT (0.1 SOMI)'}
      </button>
    </div>
  )
}
