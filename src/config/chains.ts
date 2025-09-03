import { defineChain } from 'viem'

// Конфиг сети Somnia
const SOMNIA_CONFIG = {
  chainId: '0x139f', // 5031 в hex
  chainName: 'Somnia Mainnet',
  nativeCurrency: {
    name: 'SOMI',
    symbol: 'SOMI',
    decimals: 18,
  },
  rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
  blockExplorerUrls: ['https://explorer.somnia.network/'],
};

// Функция переключения на Somnia
const switchToSomnia = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x139f' }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SOMNIA_CONFIG],
      });
    }
  }
};
