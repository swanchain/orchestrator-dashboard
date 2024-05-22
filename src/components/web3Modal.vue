<script setup>
  import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
  import { mainnet, arbitrum } from 'viem/chains'
  import { reconnect } from '@wagmi/core'
  import store from './../store'
  import { ref, getCurrentInstance, watch } from 'vue'
  import { getAccount, watchAccount } from '@wagmi/core'


  const system = getCurrentInstance().appContext.config.globalProperties;

  const SWAN_PROXIMA = {
    id: Number(20241133), //Number(process.env.NEXT_PUBLIC_L2_PROXIMA_CHAIN_ID),
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
        http: [String("https://rpc-proxima.swanchain.io")], // [String(process.env.NEXT_PUBLIC_L2_PROXIMA_RPC_URL)],
      },
    },
    blockExplorers: {
      default: {
        name: 'Swan Testnet Explorer',
        url: "https://proxima-explorer.swanchain.io" || '',// process.env.NEXT_PUBLIC_L2_PROXIMA_EXPLORER_URL || '',
      },
    },
    testnet: true,
  }

  // 1. Define constants
  const projectId = '96edc188f4c9ba78898f2145f6210614'

  // 2. Create wagmiConfig
  const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const chains = [SWAN_PROXIMA] //mainnet, arbitrum
  const config = defaultWagmiConfig({
    chains, // required
    projectId, // required
    metadata, // required
    enableWalletConnect: true, // Optional - true by default
    enableInjected: true, // Optional - true by default
    enableEIP6963: true, // Optional - true by default
    enableCoinbase: true // Optional - true by default
  })

  

  reconnect(config)
  // 3. Create modal
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true // Optional - defaults to your Cloud configuration
  })

  const account = ref(getAccount(config))
  console.log(account)

  const unwatch = watchAccount(config, {
    onChange(data) {
      console.log('Account changed!', data)
      },
    })
  unwatch()

  console.log("Testing")

  const providerInit = window.ethereum && window.ethereum.providers ? window.ethereum.providers.find((provider) => provider.isMetaMask) : window.ethereum

  async function sign(nonce) {
    const rightnow = (Date.now() / 1000).toFixed(0)
    const sortanow = rightnow - (rightnow % 600)
    const local = process.env.VUE_APP_DOMAINNAME
    const buff = Buffer.from("Signing in to " + local + " at " + sortanow, 'utf-8')
    let signature = null
    let signErr = ''
    await providerInit.request({
      method: 'personal_sign',
      params: [buff.toString('hex'), store.state.metaAddress]
    }).then(sig => {
      signErr = ''
      signature = sig
    }).catch(err => {
      console.log(err)
      signature = ''
      signErr = err && err.code ? String(err.code) : err
      signOutFun()
    })
    return [signature, signErr]
  }

  let lastTime = 0

  async function throttle() {
    // Prevent multiple signatures
    let now = new Date().valueOf();
    if (lastTime > 0 && (now - lastTime) <= 2000) return false
    lastTime = now
    return true
  }

  let awesome = false
  async function login() {
    console.log("Goodbye")
    awesome = !awesome
    modal.open()
  }

  watch(account, (newVal, oldVal) => {
      console.log("inside watch")
      // login2();
    }, { deep: true });
  
  let test = ref('');
  async function login2 () {
      /*console.log("here")
      console.log(account)
      const time = await throttle()
      if (!time) return false
      system.$commonFun.Init(async (addr, chain) => {
        await system.$commonFun.timeout(500)
        system.$commonFun.login()
      })*/
      test.value = "No"
    }
  
  watch(test, (newVal) => {
      console.log("test watch")
      login2();
    });

</script>

<template>
  <w3m-button />
</template>



