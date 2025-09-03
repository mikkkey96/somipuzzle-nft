import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'

// Настройте Somnia chain
const somnia = {
  id: 5031,
  name: 'Somnia',
  nativeCurrency: {
    decimals: 18,
    name: 'SOMI',
    symbol: 'SOMI',
  },
  rpcUrls: {
    default: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
    public: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
}

export const config = getDefaultConfig({
  appName: 'SomiPuzzle',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '1926b41c73e81b702d67de732af0d193',
  chains: [somnia, mainnet],
  ssr: false,
})
