<script setup>
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { reconnect } from '@wagmi/core'
import { useStore } from "vuex"
import {
  computed,
  ref,
  getCurrentInstance,
  watch,
  onMounted,
  onUpdated,
  watchEffect,
  reactive,
} from 'vue'
import { getAccount, watchAccount } from '@wagmi/core'
import configJS from './../utils/config'

const system = getCurrentInstance().appContext.config.globalProperties
const store = useStore()
const metaAddress = computed(() => (store.state.metaAddress))
const signature = computed(() => (store.state.signature))

const projectId = configJS.projectId
const config = configJS.config
reconnect(config)
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

let lastTime = 0
async function throttle () {
  // Prevent multiple signatures
  let now = new Date().valueOf()
  if (lastTime > 0 && now - lastTime <= 2000) return false
  lastTime = now
  return true
}

let account = reactive(getAccount(config))

async function login2 () {
  // console.log('here')
  // console.log(account)
  const time = await throttle()
  if (!time) return false
  system.$commonFun.Init(async (addr, chain) => {
    await system.$commonFun.timeout(500)
    system.$commonFun.login(config)
  })
}

async function signout2 () {
  await system.$commonFun.signOutFun('disconnect')
  // console.log("in signout function")
  // window.location.reload()
}

watchAccount(config, {
  onChange (account, prevAccount) {
    // account = getAccount(config)
    console.log('watch', account)
    console.log('prev', prevAccount)
    console.log("changed")
    if (account ?.isConnected && signature.value === '' && metaAddress.value === '') {
      console.log("prompted")
      login2()
    } else if (!account ?.isConnected && prevAccount ?.isConnected) {
      signout2()
    }
  },
})

async function test () {
  console.log(store.state.metaAddress)
  console.log(store.state.signature)
  console.log("here")
}
</script>

<template>
  <div class="flex-row">
    <w3m-button balance="hide" @click="test" />
    <el-button type="primary" @click="login2" v-if="metaAddress && signature === ''" class="m-button">Signature</el-button>
  </div>
</template>
