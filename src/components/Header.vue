<template>
  <section id="container">
    <div class="swan-logo flex-row nowrap">
      <img :src="swanLogo" @click="system.$commonFun.goLink('https://www.swanchain.io/')" />
      <div class="nav">
        <router-link :to="{name: 'dashboard'}" :class="{'active': route.name === 'dashboard'}">Dashboard</router-link>
        <router-link :to="{ name: 'paymentHistory', query: { type: 'user' }}" :class="{'active': route.name === 'paymentHistory'}">Reword History</router-link>
      </div>
      <div class="header-right flex-row nowrap" v-if="getnetID === 8598668088 && accessToken !== ''">
        <div class="set ">
          <div class="info-style flex-row">
            <div class="address" @click="wrongMethod">
              {{system.$commonFun.hiddAddress(metaAddress)}}
            </div>
          </div>
        </div>
        <div class="set">
          <el-dropdown popper-class="menu-style" @command="handleSelect" placement="bottom-end" :hide-on-click="false">
            <router-link to="/personal_center" class="el-dropdown-link setting-style loginImg flex-row">
              <el-icon>
                <Avatar />
              </el-icon>
            </router-link>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="apiKey">
                  <div class="profile router-link b">Show API-Key</div>
                </el-dropdown-item>
                <el-dropdown-item command="cpCollateral">
                  <div class="profile router-link b">CP Collateral</div>
                </el-dropdown-item>
                <el-dropdown-item command="cpCollateralCheck">
                  <div class="profile router-link b">CP Collateral Check</div>
                </el-dropdown-item>
                <el-dropdown-item command="sign_out">
                  <span class="link">Sign Out</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-button type="primary" @click="loginMethod" v-else>Login</el-button>
    </div>

    <el-dialog v-model="centerDialogVisible" title="API Keys" custom-class="apikey_body">
      <div class="cont" v-loading="tokenShow">
        <el-button type="primary" class="add-button" @click="createCom">New API Key</el-button>
        <el-input v-show="toolData !== ''" v-model="toolData" type="text" readonly placeholder=" ">
          <template #append>
            <div class="action flex-row">
              <!-- <i class="icon" @click="tokenShow=!tokenShow">
                <View />
              </i> -->
              <i class="icon" @click="system.$commonFun.copyContent(toolData, 'Copied')">
                <DocumentCopy />
              </i>
              <i class="icon" @click="deleteToken(toolData)">
                <Delete />
              </i>
            </div>
          </template>
        </el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">OK</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="Account" v-model="wrongVisible" :append-to-body="false" :width="bodyWidth" custom-class="wrongNet">
      <label>Connected with MetaMask</label>
      <div class="address">{{system.$commonFun.hiddAddress(metaAddress)}}</div>
      <div class="area flex-row">
        <div class="fast">
          <label>Network</label>
          <div class="address">{{info.network}}</div>
        </div>
        <div class="fast">
          <label>Balance</label>
          <div class="address">{{info.balance||'-'}} {{info.unit}}</div>
        </div>
      </div>
      <div class="share flex-row">
        <el-button :disabled="info.url?false:true" @click="system.$commonFun.goLink(`${info.url}${metaAddress}`)">
          <svg t="1669800457857" class="icon icon_big" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6207" width="64" height="64">
            <path d="M923.648 1015.442H100.206a91.648 91.648 0 0 1-91.721-91.72V101.01a91.502 91.502 0 0 1 91.72-91.501H649.29a30.72 30.72 0 0 1 0 61.44H130.487a60.855 60.855 0 0 0-60.928 60.854v762.003a60.855 60.855 0 0 0 60.928 60.928h762.441a60.855 60.855 0 0 0 60.928-60.928V345.088a30.72 30.72 0 1 1 61.44 0v579.291a91.21 91.21 0 0 1-91.648 91.063z m-497.81-403.675a30.574 30.574 0 1 1-43.228-43.228L930.816 17.92a30.574 30.574 0 1 1 43.154 43.3L425.91 611.768z"
              p-id="6208" fill="#7405ff"></path>
            <path d="M923.648 1023.854H100.206A100.206 100.206 0 0 1 0.073 923.72v-822.71C0.22 45.86 44.91 1.096 100.206 1.096h549.083a39.131 39.131 0 1 1 0 78.263H130.414a52.443 52.443 0 0 0-52.444 52.443v762.003c0 28.964 23.48 52.443 52.517 52.516H893a52.368 52.368 0 0 0 37.084-15.36 52.81 52.81 0 0 0 15.36-37.156V345.088a39.131 39.131 0 0 1 78.262 0v579.291a99.913 99.913 0 0 1-100.059 99.475zM100.059 17.92c-45.787 0-82.944 37.23-83.017 83.09v822.784c0.073 46.007 37.303 83.237 83.31 83.31h823.37a83.09 83.09 0 0 0 83.163-82.798V345.015a22.309 22.309 0 0 0-44.544 0v548.864c0 18.359-7.315 35.986-20.188 49.006a68.754 68.754 0 0 1-49.079 20.333H130.487a69.486 69.486 0 0 1-69.34-69.34V131.804a69.266 69.266 0 0 1 69.267-69.339h518.948a22.309 22.309 0 1 0-0.146-44.544h-549.01z m304.202 611.328a39.058 39.058 0 0 1-27.575-66.706L924.818 11.995a38.985 38.985 0 1 1 55.077 55.223l-548.06 550.473c-7.314 7.315-17.261 11.484-27.574 11.557zM952.32 17.335a22.162 22.162 0 0 0-15.58 6.583L388.536 574.39a22.162 22.162 0 1 0 31.378 31.451L968.046 55.296a21.943 21.943 0 0 0 6.583-15.726 22.382 22.382 0 0 0-22.236-22.235z"
              p-id="6209" fill="#7405ff"></path>
          </svg>
          View on explorer
        </el-button>

        <el-button @click="system.$commonFun.copyContent(metaAddress, 'Copied')">
          <svg t="1640938541398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4760" width="32" height="32">
            <path d="M746.932 698.108" p-id="4761" fill="#7405ff"></path>
            <path d="M925.731 288.698c-1.261-1.18-3.607-3.272-6.902-6.343-5.486-5.112-11.615-10.758-18.236-16.891-18.921-17.526-38.003-35.028-56.046-51.397-2.038-1.848-2.038-1.835-4.077-3.682-24.075-21.795-44.156-39.556-58.996-52.076-8.682-7.325-15.517-12.807-20.539-16.426-3.333-2.402-6.043-4.13-8.715-5.396-3.365-1.595-6.48-2.566-10.905-2.483C729.478 134.227 720 143.77 720 155.734l0 42.475 0 42.475 0 84.95L720 347l21.205 0L890 347l0 595L358.689 942C323.429 942 295 913.132 295 877.922L295 177l361.205 0c11.736 0 21.25-9.771 21.25-21.5s-9.514-21.5-21.25-21.5l-382.5 0L252 134l0 21.734L252 813l-52.421 0C166.646 813 140 786.928 140 754.678L140 72l566.286 0C739.29 72 766 98.154 766 130.404L766 134l40 0 0-3.596C806 76.596 761.271 33 706.286 33L119.958 33 100 33l0 19.506 0 702.172C100 808.463 144.642 852 199.579 852L252 852l0 25.922C252 936.612 299.979 984 358.689 984l552.515 0L932 984l0-21.237L932 325.635 932 304l0.433 0C932.432 299 930.196 292.878 925.731 288.698zM762 304l0-63.315L762 198.21l0-0.273c14 11.479 30.3 26.369 49.711 43.942 2.022 1.832 2.136 1.832 4.157 3.665 17.923 16.259 36.957 33.492 55.779 50.926 2.878 2.666 5.713 5.531 8.391 7.531L762 304.001z"
              p-id="4762" fill="#7405ff"></path>
            <path d="M816.936 436 407.295 436c-10.996 0-19.91 8.727-19.91 19.5 0 10.77 8.914 19.5 19.91 19.5l409.641 0c11 0 19.914-8.73 19.914-19.5C836.85 444.727 827.936 436 816.936 436z" p-id="4763" fill="#7405ff"></path>
            <path d="M816.936 553 407.295 553c-10.996 0-19.91 8.727-19.91 19.5 0 10.774 8.914 19.5 19.91 19.5l409.641 0c11 0 19.914-8.726 19.914-19.5C836.85 561.727 827.936 553 816.936 553z" p-id="4764" fill="#7405ff"></path>
            <path d="M816.936 689 407.295 689c-10.996 0-19.91 8.729-19.91 19.503 0 10.769 8.914 19.497 19.91 19.497l409.641 0c11 0 19.914-8.729 19.914-19.497C836.85 697.729 827.936 689 816.936 689z" p-id="4765" fill="#7405ff"></path>
          </svg>
          Copy Wallet Address
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="CP Collateral" v-model="cpCollateralCont.diagle" :append-to-body="false" :width="bodyWidth" custom-class="wrongNet">
      <div v-loading="cpCollateralCont.show">
        <label v-if="cpCollateralCont.tx_hash !== ''">TransactionHash:
          <b @click="system.$commonFun.goLink(`${txLink}/tx/${cpCollateralCont.tx_hash}`)">{{cpCollateralCont.tx_hash}}</b>
        </label>
        <div v-else>
          <div class="area flex-row">
            <div class="fast width">
              <label>CP Address</label>
              <!-- <div class="address">{{cpCollateralCont.address}}</div> -->
              <el-input v-model="cpCollateralCont.address" type="text" placeholder=" " />
              <p class="error" v-show="cpCollateralCont.tip">Please enter a valid Ethereum address</p>
            </div>
          </div>
          <br />
          <div class="area flex-row">
            <div class="fast width">
              <label>Amount</label>
              <el-input v-model="cpCollateralCont.amount" type="text" placeholder=" " />
            </div>
          </div>
          <br />
          <el-button type="primary" class="add-button" @click="cpCollateral">OK</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="CP Collateral Check" v-model="cpCheckCont.diagle" :append-to-body="false" :width="bodyWidth" custom-class="wrongNet">
      <div class="area flex-row" v-loading="cpCheckCont.show">
        <div class="fast width">
          <label>Balance</label>
          <div class="address">{{cpCheckCont.balance}} SWAN</div>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import qs from 'qs'
import {
  CircleCheck, DocumentCopy, Avatar, Delete, View
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import * as echarts from "echarts"
import SpaceTokenABI from '@/utils/abi/SwanToken.json'
import CollateralABI from '@/utils/abi/CollateralContract.json'
export default defineComponent({
  components: {
    CircleCheck, DocumentCopy, Avatar, Delete, View
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessToken = computed(() => (store.state.accessToken))
    const bodyWidth = ref(document.body.clientWidth > 600 ? '450px' : '95%')
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const swanLogo = require("@/assets/images/icons/logo.png")
    const providersLoad = ref(false)
    const providersData = ref([])
    const small = ref(false)
    const background = ref(false)
    const getnetID = ref(NaN)
    const prevType = ref(true)
    const centerDialogVisible = ref(false)
    const tokenShow = ref(false)
    const toolData = ref('')
    const paginKey = reactive({
      pageSize: 12,
      pageNo: 1,
      total: 0,
      sort: 'updated'
    })
    const ruleForm = reactive({
      name: ''
    })
    const info = reactive({
      network: '',
      url: '',
      balance: '',
      unit: ''
    })
    const wrongVisible = ref(false)
    const cpCheckCont = reactive({
      diagle: false,
      show: true,
      tip: '',
      status: 'success',
      balance: 0
    })
    const cpCollateralCont = reactive({
      diagle: false,
      show: false,
      tip: false,
      address: '',
      amount: '50',
      tx_hash: ''
    })
    const txLink = process.env.VUE_APP_OPSWANURL
    const tokenAddress = process.env.VUE_APP_OPSWAN_SWANTOKEN_ADDRESS
    const tokenContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, tokenAddress)
    const collateralAddress = process.env.VUE_APP_COLLATERAL_CONTACT
    const collateralContract = new system.$commonFun.web3Init.eth.Contract(CollateralABI, collateralAddress)


    async function handleKeyChange (currentPage) {
      paginKey.pageNo = currentPage
      getdataList()
    }
    async function createCom () {
      tokenShow.value = true
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token`, 'post')
      if (listRes && listRes.status === 'success') {
        system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Success!')
        getdataList()
        return
      } else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Failed!')
      // await system.$commonFun.timeout(500)
      tokenShow.value = false
    }
    async function deleteToken (tokenName) {
      tokenShow.value = true
      let formData = new FormData()
      formData.append('api_token', tokenName)
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}api_token/delete`, 'post', formData)
      if (listRes && listRes.status === 'success') system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Delete successfully!')
      else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Delete failed!')
      getdataList()
    }
    async function getdataList () {
      centerDialogVisible.value = true
      tokenShow.value = true
      toolData.value = ''

      try {
        const keysRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}/api_token`, 'get')

        if (keysRes && keysRes.status === 'success') {
          // Assuming the 'data' field in response contains the required token
          if (keysRes.data) toolData.value = keysRes.data.token.token || ''
          else system.$commonFun.messageTip('error', 'No token found, please generate a new token')
        } else if (keysRes.message) {
          system.$commonFun.messageTip('error', keysRes.message)
        }
      } catch (error) {
        system.$commonFun.messageTip('error', error.message || 'Error fetching data')
      }

      tokenShow.value = false
    }
    function handleSizeChange (val) { }
    let lastTime = 0
    async function throttle () {
      // Prevent multiple signatures
      let now = new Date().valueOf();
      if (lastTime > 0 && (now - lastTime) <= 2000) return false
      lastTime = now
      return true
    }
    async function loginMethod () {
      const time = await throttle()
      if (!time) return false
      system.$commonFun.Init(async (addr, chain) => {
        providersLoad.value = true
        getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
        await system.$commonFun.timeout(500)
        if (accessToken.value !== '' && getnetID.value === 8598668088) providersLoad.value = false
        else await signIn()
      })
    }
    async function signIn () {
      if (getnetID.value !== 8598668088) system.$commonFun.walletChain(8598668088)
      else system.$commonFun.login()
    }
    async function signSetIn (t) {
      let time = t || 0
      let timer = null
      timer = setInterval(() => {
        if (time > 3) {
          clearInterval(timer)
          if (accessToken.value !== '' && getnetID.value === 8598668088) providersLoad.value = false
          else signIn()
        } else time += 1
      }, 1000)
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      ethereum.on('accountsChanged', async function (accounts) {
        if (!prevType.value) return false
        getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
        system.$commonFun.signOutFun()
      })
      ethereum.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
        system.$commonFun.signOutFun()
      })
    }
    async function handleSelect (key, keyPath) {
      // console.log(key, keyPath) //  
      if (key === 'apiKey') getdataList()
      else if (key === 'cpCollateral') {
        cpCollateralCont.tip = false
        cpCollateralCont.tx_hash = ''
        cpCollateralCont.diagle = true
      } else if (key === 'cpCollateralCheck') cpCheck()
      else if (key === 'sign_out') {
        await system.$commonFun.signOutFun()
        // await system.$commonFun.timeout(50)
        window.location.reload()
      }
    }
    async function cpCollateral () {
      cpCollateralCont.show = true
      try {
        const isAddress = system.$commonFun.web3Init.utils.isAddress(cpCollateralCont.address)
        if (!isAddress) {
          cpCollateralCont.tip = true
          cpCollateralCont.show = false
          return
        } else cpCollateralCont.tip = false

        if (cpCollateralCont.address !== metaAddress.value) {
          ElMessageBox.confirm(
            'Detected that the currently filled wallet address does not match the login wallet address, continue？',
            'Warning',
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
            }
          )
            .then(async () => {
              cpDeposit()
            })
            .catch(() => {
              cpCollateralCont.show = false
            })
        } else cpDeposit()
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        cpCollateralCont.show = false
      }
      // cpCollateralCont.diagle = false
    }
    async function cpDeposit () {
      try {
        const amount = system.$commonFun.web3Init.utils.toWei(String(cpCollateralCont.amount), 'ether')

        let approveMethod = tokenContract.methods.approve(collateralAddress, amount)
        let approveGasLimit = await approveMethod.estimateGas({ from: metaAddress.value })
        const approve_tx = await approveMethod.send({
          from: metaAddress.value, gasLimit: approveGasLimit
        })

        let payMethod = collateralContract.methods.deposit(cpCollateralCont.address, amount)
        let payGasLimit = await payMethod.estimateGas({ from: metaAddress.value })
        const tx = await payMethod.send({ from: metaAddress.value, gasLimit: payGasLimit })
          .on('transactionHash', async (transactionHash) => {
            console.log('transactionHash:', transactionHash)
            cpCollateralCont.tx_hash = transactionHash
            cpCollateralCont.show = false
          })
          .on('error', () => cpCollateralCont.show = false)
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        cpCollateralCont.show = false
      }
    }
    async function cpCheck () {
      cpCheckCont.diagle = true
      cpCheckCont.show = true
      const cpRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/collateral/${metaAddress.value}`, 'get')
      if (cpRes) {
        system.$commonFun.messageTip(cpRes.status, cpRes.message)
        cpCheckCont.tip = cpRes.message
        cpCheckCont.balance = cpRes.data.balance ? system.$commonFun.web3Init.utils.fromWei(String(cpRes.data.balance), 'ether') : 0
        cpCheckCont.status = cpRes.status
      }
      cpCheckCont.show = false
    }
    async function activeMenu (row) {
      const chainId = await system.$commonFun.web3Init.eth.net.getId()
      const { unit, name, url } = await system.$commonFun.getUnit(chainId)
      info.network = name || `Chain ID: ${chainId}`
      info.unit = unit
      info.url = url || ''
    }
    function balanceMethod () {
      if (!metaAddress.value) return false
      system.$commonFun.web3Init.eth.getBalance(metaAddress.value).then((balance) => {
        // console.log(balance)
        const myBalance = balance
        const balanceAll = system.$commonFun.web3Init.utils.fromWei(myBalance, 'ether')
        info.balance = Number(balanceAll).toFixed(4)
        return true
      })
    }
    async function wrongMethod () {
      activeMenu()
      const info = await balanceMethod()
      wrongVisible.value = true
    }
    onMounted(async () => {
      getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
      fn()
      activeMenu()
      balanceMethod()
    })
    watch(route, (to, from) => {
      activeMenu(to.path)
      window.scrollTo(0, 0)
    })
    watch(metaAddress, (to, from) => {
      balanceMethod()
    })
    return {
      system,
      route,
      swanLogo,
      metaAddress,
      providersLoad,
      providersData,
      small,
      background,
      getnetID,
      accessToken,
      centerDialogVisible,
      toolData,
      tokenShow,
      paginKey,
      ruleForm,
      info, wrongVisible, bodyWidth, cpCheckCont, cpCollateralCont, txLink,
      getdataList, createCom, deleteToken, handleKeyChange, handleSizeChange,
      loginMethod, handleSelect, wrongMethod, cpCollateral
    }
  }
})
</script>

<style lang="less" scoped>
#container {
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 1px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  :deep(.el-button) {
    border: 0;
    border-radius: 0.08rem;
    background: linear-gradient(45deg, @theme-color, #9e42f5);
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-family: inherit;
  }
  .swan-logo {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 0 0.3rem;
    cursor: pointer;
    img {
      height: 50px;
    }
    .nav {
      color: @white-color;
      a {
        padding: 10px;
        margin: 0 0.1rem;
        color: inherit;
        border-radius: 8px;
        &:hover,
        &.active {
          background-color: rgb(21, 23, 28);
          color: @theme-color;
        }
      }
    }
    .header-right {
      .setting-style {
        width: 35px;
        height: 35px;
        padding: 0;
        margin: 0 0 0 0.1rem;
        background: linear-gradient(45deg, @theme-color, #9e42f5) !important;
        cursor: pointer;
        border-radius: 0.08rem;
        transition: all 0.2s;
        &:hover {
          background-color: transparent !important;
        }
        * {
          cursor: pointer;
        }
        i,
        svg,
        path {
          width: 18px;
          height: 18px;
          margin: 0 auto;
          color: @white-color;
        }
        .el-sub-menu__icon-arrow {
          display: none;
        }
        .el-sub-menu__title {
          padding: 0;
        }
      }
      .set {
        align-items: center;
        vertical-align: middle;
        * {
          vertical-align: middle;
        }
        .info-style {
          background: linear-gradient(45deg, @theme-color, #9e42f5);
          color: @white-color;
          cursor: text;
          border-radius: 0.08rem;
          transition: all 0.2s;
          &:hover {
            background-color: transparent !important;
          }
          .address {
            padding: 5px 0.1rem;
            line-height: 25px;
            cursor: pointer;
          }
          .el-dropdown {
            padding: 0.05rem 0.07rem 0.05rem 0.05rem;
            border-left: 1px solid @theme-color;
          }
        }
        .el-button-group > .el-button {
          border-radius: 7px;
          &:first-child {
            padding-left: 10px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
        .el-icon {
          margin: auto;
          cursor: pointer;
          color: #fff;
          svg {
            width: 1em;
            cursor: pointer;
            path {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

:deep(.el-overlay-dialog) {
  display: flex;
  align-items: center;
  .wrongNet {
    margin: auto !important;
    box-shadow: 0 0 13px rgba(128, 128, 128, 0.8);
    border-radius: 0.2rem;
    text-align: left;
    .el-dialog__header {
      padding: 0.2rem 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dfdfdf;
      color: #000;
      font-size: 0.2rem;
      font-weight: 500;
      line-height: 1;
      text-transform: capitalize;
      @media screen and (max-width: 479px) {
        padding: 0.3rem 0.2rem;
      }
      .el-dialog__headerbtn {
        position: relative;
        top: auto;
        right: auto;
        font-size: inherit;
        i {
          font-size: inherit;
          * {
            cursor: pointer;
          }
          &:hover {
            color: #7405ff;
          }
        }
      }
      .el-dialog__title {
        font-size: inherit;
      }
    }
    .el-dialog__body {
      position: relative;
      padding: 0.3rem 0.4rem 0.4rem;
      font-size: 0.16rem;
      @media screen and (max-width: 540px) {
        padding: 0.2rem;
      }
      .cp-show {
        min-height: 50px;
        label {
        }
      }
      label {
        word-break: break-word;
        line-height: 1;
        color: #666;
        font-size: inherit;
      }
      .address {
        background: rgba(233, 233, 233, 1);
        padding: 8px;
        margin: 10px 0 12px;
        border-radius: 8px;
        font-size: inherit;
      }
      .address_email {
        margin: 0 0 10px;
        .address_body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 10px 0 0;
          .address {
            width: 80%;
            margin: 0;
          }
          .address_right {
            position: relative;
            display: inline-block;
            padding: 0.05rem 0.2rem 0.05rem 0.32rem;
            margin: 0 5px;
            background-color: rgba(85, 128, 233, 0.15);
            font-size: 14px;
            border-radius: 0.5rem;
            white-space: nowrap;
            @media screen and (max-width: 1600px) {
              font-size: 13px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }
            &::before {
              position: absolute;
              left: 0.16rem;
              top: 50%;
              content: "";
              width: 0.08rem;
              height: 0.08rem;
              margin-top: -0.04rem;
              background-color: #606266;
              border-radius: 0.5rem;
            }
          }
          .bg-primary {
            &::before {
              background-color: #4d73ff;
            }
          }
        }
        .share {
          .el-button {
            width: 100%;
            margin: 3px 0 0;
            font-size: 13px;
            @media screen and (min-width: 1800px) {
              font-size: 14px;
            }
            @media screen and (max-width: 600px) {
              font-size: 12px;
            }
          }
        }
        .el-loading-mask {
          .el-loading-spinner {
            top: 50%;
          }
        }
      }
      .area {
        justify-content: space-between;
        .fast {
          width: 48%;
          &.width {
            width: 100%;
          }
          .address {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .error {
            font-size: 12px;
            color: firebrick;
          }
        }
      }
      .share {
        flex-wrap: wrap;
        justify-content: flex-start;
        font-size: inherit;
        svg,
        path {
          fill: @theme-color;
        }
        .el-button {
          justify-content: flex-start;
          min-width: 50%;
          padding: 0;
          margin: 8px 0 0;
          background: transparent !important;
          border: 0;
          color: @theme-color !important;
          font-size: inherit;
          font-weight: normal;
          font-family: inherit;
          opacity: 0.8;
          box-shadow: none !important;
          span {
            display: flex;
            align-items: center;
            svg {
              width: 15px;
              height: 15px;
              margin: 0 3px 0 0;
            }
            .icon_big {
              width: 13px;
              height: 13px;
            }
          }
          &:hover {
            background: transparent;
            opacity: 1;
          }
          &.is-disabled {
            opacity: 0.4;
          }
        }
      }
      .loadStyle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.2rem;
      }
      .apiTipCont {
        p {
          display: flex;
          align-items: center;
          text-indent: 0.1rem;
          margin: 0.1rem;
          color: #7e7e7e;
          font-size: 0.18rem;
          .el-icon-document-copy {
            display: block;
            font-size: 17px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
:deep(.apikey_body) {
  width: 570px;
  border-radius: 0.23rem;
  text-align: left;
  color: #000;
  word-break: break-word;
  @media screen and (max-width: 600px) {
    width: 94%;
  }
  .el-dialog__body {
    .add-button {
      height: auto;
      margin: 0 0 0.2rem;
      padding: 0.1rem 0.15rem;
      background-color: @theme-color;
      border-color: @theme-color;
      border-radius: 4px;
      font-size: 14px;
      @media screen and (max-width: 768px) {
        font-size: 13px;
      }
    }
    .el-input {
      border-color: #ececed;
      .el-input__inner {
        height: auto;
        padding: 0.12rem 0.15rem;
        background-color: #fff !important;
        border-right: 0;
        border-color: inherit;
        line-height: 1;
      }
      .el-input-group__append {
        padding: 0 0.15rem;
        background-color: #fff;
        border-left: 0;
        border-color: inherit;
      }
      .action {
        height: 100%;
      }
      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 0 3px;
        cursor: pointer;
        @media screen and (min-width: 1800px) {
          width: 18px;
          height: 18px;
        }
        &:hover {
          opacity: 0.7;
        }
      }
      .el-input__suffix {
        right: 0;
        .el-icon {
          font-size: 0.2rem;
          cursor: pointer;
          svg,
          path {
            cursor: pointer;
          }
        }
      }
    }
    .el-table {
      border-top: 1px solid #f1f1f1;
      border-bottom: 1px solid #cacaca;
      .el-table__header-wrapper {
        .has-gutter {
          tr {
            background-color: #f2f2f2;
          }
        }
      }
      tr {
        font-size: 12px;
        line-height: 1.2;
        border-radius: 0.08rem;
        th {
          height: 0.4rem;
          padding: 0;
          text-align: center;
          border-bottom: 1px solid #f1f1f1;
          .cell {
            word-break: break-word;
            font-weight: 500;
            color: #565656;
            text-transform: uppercase;
            line-height: 1.2;
          }
        }
        th:first-child {
          border-top-left-radius: 0.08rem;
          border-bottom-left-radius: 0.08rem;
        }
        th:last-child {
          border-top-right-radius: 0.08rem;
          border-bottom-right-radius: 0.08rem;
        }
        td {
          border-top: 1px solid #f1f1f1;
          .cell {
            padding: 0;
            word-break: break-word;
            color: #000;
            text-align: center;
            line-height: 1.4;
            .el-rate__icon {
              font-size: 0.16rem;
              margin-right: 0;
              @media screen and (max-width: 768px) {
                font-size: 14px;
              }
            }
            .revoke {
              .el-button {
                width: auto;
                height: auto;
                min-width: 0.5rem;
                padding: 5px 0;
                background: @theme-color;
                border-color: @theme-color;
                font-family: inherit;
                font-size: inherit;
                border: 0;
                color: @white-color;
                line-height: 1.2;
                cursor: pointer;
              }
            }
            .el-button.el-icon-upload {
              padding: 0 0.1rem;
              line-height: 0.25rem;
              font-size: 0.1372rem;
            }
            .bot {
              justify-content: center;
              p {
                font-size: 0.1372rem;
                padding: 0 0.08rem;
                margin: 0 0.05rem;
                border: 1px solid #0b318f;
                border-radius: 0.05rem;
                cursor: pointer;
              }
              p.color {
                background: #0b318f;
                color: @white-color;
              }
              .el-radio {
                margin: 0;
                .el-radio__input {
                  display: none;
                }
                .el-radio__label {
                  display: block;
                  font-size: 0.1372rem;
                  padding: 0 0.04rem;
                  margin: 0 0.01rem;
                  border: 1px solid #0b318f;
                  border-radius: 0.05rem;
                  cursor: pointer;
                  line-height: 1.8;
                }
                .el-radio__input.is-checked + .el-radio__label {
                  background: #0b318f;
                  color: @white-color;
                }
              }
            }
            .icon_copy {
              width: 16px;
              height: 16px;
              margin: -1px 0 0 0.07rem;
              cursor: pointer;
              @media screen and (min-width: 1800px) {
                width: 18px;
                height: 18px;
              }
              svg,
              path {
                width: 100%;
                height: 100%;
              }
              &:hover {
                opacity: 0.7;
              }
            }
          }
        }
        td.el-table_1_column_1 {
          .cell {
            // color:#0c3090
          }
        }
      }
    }
  }
}
:deep(.add_body) {
  width: 40%;
  max-width: 770px;
  min-width: 310px;
  border-radius: 0.13rem;
  text-align: left;
  @media screen and (max-width: 768px) {
    width: 60%;
  }
  @media screen and (max-width: 441px) {
    width: 90%;
  }
  .el-dialog__header {
    padding: 0.17rem 0.25rem 0.1rem;
    font-size: 17px;
    color: #000;
    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
    @media screen and (min-width: 1800px) {
      font-size: 18px;
    }
  }
  .el-dialog__body {
    padding: 0;
    .tip,
    .tip_black {
      padding: 0.1rem 0.25rem;
      background-color: #f3f1ff;
      color: #562683;
      font-size: 15px;
      word-break: break-word;
      line-height: 1.3;
      @media screen and (max-width: 768px) {
        font-size: 14px;
      }
      @media screen and (min-width: 1800px) {
        font-size: 17px;
      }
    }
    .tip_black {
      background-color: transparent;
      color: #000;
      a {
        text-decoration: underline;
      }
    }
    .el-form {
      padding: 0.15rem 0.25rem 0;
      .el-form-item {
        .el-form-item__content {
          .label {
            color: #000;
            font-size: 15px;
            @media screen and (max-width: 768px) {
              font-size: 14px;
            }
            @media screen and (min-width: 1800px) {
              font-size: 17px;
            }
          }
          .flex-row {
            width: 100%;
          }
          .el-input {
            .el-input__inner {
              // background: linear-gradient(180deg, #fefefe, #f0f0f0);
            }
          }
        }
      }
    }
    .apiTipCont {
      padding: 0.15rem 0.25rem;
      p {
        margin-bottom: 0.15rem;
        line-height: 1.5;
        word-break: break-word;
        @media screen and (min-width: 1800px) {
          font-size: 16px;
        }
      }
    }
  }
  .el-dialog__footer {
    padding: 0 0.25rem 0.25rem;
    text-align: left;
    .el-button {
      width: auto;
      height: auto;
      padding: 0.07rem 0.15rem;
      margin: 0 0.15rem 0 0;
      background: linear-gradient(180deg, #fefefe, #f0f0f0);
      font-family: inherit;
      font-size: 16px;
      line-height: 1;
      color: #000;
      border-radius: 0.07rem;
      @media screen and (max-width: 1600px) {
        font-size: 14px;
      }
      &:hover {
        opacity: 0.9;
        span {
          cursor: pointer;
        }
      }
      &.is-disabled {
        opacity: 0.5;
        border-color: #e3e6eb;
      }
    }
  }
}
</style>

<style lang="less">
.menu-style {
  border-radius: 0.1rem;
  border-top-right-radius: 0.05rem;
  .el-dropdown-menu {
    position: relative;
    border-radius: 0.1rem;
    border-top-right-radius: 0.05rem;
    &:first-child {
      &:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 12px;
        height: 1px;
        background-color: #e7e7e7;
      }
    }
    .el-dropdown-menu__item {
      min-width: 170px;
      padding: 5px 12px;
      &:hover,
      &:focus {
        background-color: #fbfbfc;
        color: #000;
        // background-color: rgba(116, 5, 255, 0.1);
        // color: rgba(116, 5, 255, 1);
        .link {
          text-decoration: underline;
        }
      }
      .link {
        padding: 5px 0;
        cursor: pointer;
      }
      .profile {
        width: 100%;
        padding: 5px 0 0;
        margin: 0;
        // &.router-link {
        //   display: block;
        //   width: 100%;
        //   height: auto;
        //   padding: 3px 3px 3px 22px;
        //   &:hover {
        //     text-decoration: underline;
        //   }
        // }
        // &.b {
        // }
        cursor: pointer;
        * {
          cursor: pointer;
        }
        .tit {
          font-size: 12px;
          color: #989898;
          line-height: 1.5;
        }
        .flex-row {
          img {
            margin-right: 7px;
            border-radius: 100%;
          }
          .link {
            padding: 2px 0;
          }
        }
      }
      .set {
        vertical-align: middle;
        * {
          vertical-align: middle;
        }
        .el-button-group > .el-button {
          border-radius: 7px;
          &:first-child {
            padding-left: 10px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
          &:last-child {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
        .el-icon {
          margin: auto;
          cursor: pointer;
          svg {
            width: 1em;
            cursor: pointer;
            path {
              cursor: pointer;
            }
          }
        }
        .loginImg {
          cursor: pointer;
          img {
            width: 23px;
            height: 23px;
            margin: 0 5px 0 0;
            cursor: pointer;
            background-color: #fff;
            border: 1px solid #b9b9b9;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
