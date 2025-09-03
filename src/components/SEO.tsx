import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function SEO({ 
  title = "SomiPuzzle - Gamified NFT minting on Somnia blockchain",
  description = "🧩 Solve our challenging puzzle game and mint your unique SomiPuzzle NFT on the Somnia blockchain. Limited collection of 10,000 NFTs - only 0.1 SOMI each!",
  image = "https://green-unfair-dolphin-882.mypinata.cloud/ipfs/bafybeic4py3mrsblsu67nz54wdrxppos4n3a2lg7ngdpmz2i577qrw3w5u",
  url = "https://somipuzzle.xyz"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
