
/* Attempted file to add web3Modal until relizing web3Modal does not work
const SWAN_PROXIMA = {
  id: Number(process.env.NEXT_PUBLIC_L2_PROXIMA_CHAIN_ID),
  name: 'Proxima',
  network: 'SWAN',
  iconUrl: 'https://i.imgur.com/Q3oIdip.png',
  iconBackground: '#000000',
  nativeCurrency: {
    decimals: 18,
    name: 'Swan ETH',
    symbol: 'sETH',
  },
  rpcUrls: {
    default: {
      http: [String(process.env.NEXT_PUBLIC_L2_PROXIMA_RPC_URL)],
    },
  },
  blockExplorers: {
    default: {
      name: 'Swan Testnet Explorer',
      url: process.env.NEXT_PUBLIC_L2_PROXIMA_EXPLORER_URL || '',
    },
  },
  testnet: true,
}
*/


// import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
// import { reconnect } from '@wagmi/core'

// import { mainnet, arbitrum } from 'viem/chains'

// import axios from 'axios'
/*
// 1. Define constants
const projectId = '96edc188f4c9ba78898f2145f6210614'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata
  // ...wagmiOptions // Optional - Override createConfig parameters
})

reconnect(config)
// 3. Create modal
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  // enableAnalytics: true, // Optional - defaults to your Cloud configuration
  // enableOnramp: true // Optional - false as default
})
*/
const modal = 1

export default modal