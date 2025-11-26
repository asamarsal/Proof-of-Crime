import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Define Lisk Sepolia network
export const liskSepolia = defineChain({
  id: 4202,
  caipNetworkId: 'eip155:4202',
  chainNamespace: 'eip155',
  name: 'Lisk Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia-api.lisk.com']
    }
  },
  blockExplorers: {
    default: {
      name: 'Lisk Sepolia Blockscout',
      url: 'https://sepolia-blockscout.lisk.com'
    }
  },
  testnet: true
})

export const networks = [liskSepolia]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
