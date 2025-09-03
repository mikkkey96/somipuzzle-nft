import { http, createConfig } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { metaMask, injected, walletConnect } from 'wagmi/connectors'

// Определяем Somnia Mainnet
const somnia = {
  id: 5031,
  name: 'Somnia Mainnet',
  nativeCurrency: { name: 'SOMI', symbol: 'SOMI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.infra.mainnet.somnia.network/'] }
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' }
  }
} as const

export const config = getDefaultConfig({
  appName: 'SomiPuzzle',
  projectId: 'f4c4f7b9c3c4a7f2e1d8b6a5c3f7e2d1', // временный ID
  chains: [somnia],
  transports: {
    [somnia.id]: http(),
  },
})
