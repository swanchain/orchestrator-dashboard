<template>
  <section id="container">
    <div class="swan-logo flex-row nowrap">
      <div class="flex-row current">
        <img :src="swanLogo" @click="system.$commonFun.goLink('https://www.swanchain.io/')" />
        <div class="flex-row ml-10">
          <svg t="1718862572896" class="icon ml-10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2310" width="22" height="22">
            <path d="M448 832v64l-128.32-128L448 640v64h192a192 192 0 0 0 115.84-345.152l0.704-0.896 90.24-90.24A320 320 0 0 1 640 832l-192.064 0.064zM576 192V128l131.008 128L576 384V320H384a192 192 0 0 0-115.712 345.216l-91.072 91.008A320 320 0 0 1 384 192h192.064z"
              fill="#ffffff" p-id="2311"></path>
          </svg>
          <el-select v-model="currentRef.value" placeholder="Select" size="small" @change="currentMethod">
            <el-option v-for="item in currentRef.options" :key="item.value" :label="item.value" :value="item.value">
              <div class="font-14">{{item.value}}</div>
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex-row nowrap swan-right">
        <div class="nav pcShow">
          <router-link :to="{name: 'dashboard'}" :class="{'active': route.name === 'dashboard'}">Dashboard</router-link>
          <!-- <router-link :to="{ name: 'myCPInfo'}" :class="{'active': route.name === 'myCPInfo'}" v-if="accessToken !== ''">CP Profile</router-link> -->
          <router-link :to="{ name: 'paymentHistory'}" :class="{'active': route.name === 'paymentHistory'}" v-if="accessToken !== ''">Reward History</router-link>
          <router-link :to="{ name: 'UBIHistory'}" :class="{'active': route.name === 'UBIHistory'}" v-if="accessToken !== ''">UBI Reward History</router-link>
        </div>

        <!-- web3Modal testnet-->
        <web3-modal />

        <div class="header-right flex-row nowrap">
          <div class="set">
            <el-dropdown popper-class="menu-style" @command="handleSelect" placement="bottom-end" :hide-on-click="false">
              <div class="el-dropdown-link setting-style loginImg flex-row">
                <el-icon>
                  <Avatar v-if="accessToken !== ''" />
                  <Setting v-else />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="apiKey" v-if="accessToken !== ''">
                    <div class="profile router-link b">Show API-Key</div>
                  </el-dropdown-item>
                  <el-dropdown-item command="cpCollateralTools">
                    <div class="profile router-link b">Collateral Tools</div>
                  </el-dropdown-item>
                  <el-dropdown-item command="sign_out" v-if="accessToken !== ''">
                    <span class="link">Sign Out</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="set mobileShow">
            <el-dropdown popper-class="menu-style" placement="bottom-end" :hide-on-click="false">
              <div class="el-dropdown-link setting-style loginImg flex-row">
                <svg t="1711620409570" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2352" width="16" height="16">
                  <path d="M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z"
                    fill="#ffffff" p-id="2353"></path>
                  <path d="M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z"
                    fill="#ffffff" p-id="2354"></path>
                  <path d="M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z"
                    fill="#ffffff" p-id="2355"></path>
                </svg>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div class="profile router-link b">
                      <router-link :to="{name: 'dashboard'}" :class="{'active': route.name === 'dashboard'}">Dashboard</router-link>
                    </div>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item v-if="accessToken !== ''">
                    <div class="profile router-link b">
                      <router-link :to="{ name: 'myCPInfo'}" :class="{'active': route.name === 'myCPInfo'}">CP Profile</router-link>
                    </div>
                  </el-dropdown-item> -->
                  <el-dropdown-item v-if="accessToken !== ''">
                    <div class="profile router-link b">
                      <router-link :to="{ name: 'paymentHistory'}" :class="{'active': route.name === 'paymentHistory'}">Reward History</router-link>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="accessToken !== ''">
                    <div class="profile router-link b">
                      <router-link :to="{ name: 'UBIHistory'}" :class="{'active': route.name === 'UBIHistory'}">UBI Reward History</router-link>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="centerDialogVisible" title="API Keys" custom-class="apikey_body" class="apikey_body">
      <div class="cont" v-loading="tokenShow">
        <el-button type="primary" class="add-button" @click="createCom">New API Key</el-button>
        <el-input v-show="toolData !== ''" v-model="toolData" type="text" readonly placeholder=" ">
          <template #append>
            <div class="action flex-row">
              <!-- <i class="icon" @click="tokenShow=!tokenShow">
                <View />
              </i> -->
              <i class="icon flex-row" @click="system.$commonFun.copyContent(toolData, 'Copied')">
                <DocumentCopy />
              </i>
              <i class="icon flex-row" @click="deleteToken(toolData)">
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

    <el-dialog v-model="cpCollateralCont.diagle" :append-to-body="false" :width="bodyWidth" :before-close="cpCollateralCont.user_input_address=''" custom-class="wrongNet" class="wrongNet">
      <template #header>
        <el-tabs v-model="activeName" @tab-click="collateralClick">
          <el-tab-pane name="deposit" :disabled="metaAddress?false:true" label="Deposit Collateral"></el-tab-pane>
          <el-tab-pane name="check" label="Check Collateral"></el-tab-pane>
        </el-tabs>
      </template>

      <div v-if="activeName === 'deposit'" v-loading="cpCollateralCont.show">
        <label v-if="cpCollateralCont.tx_hash !== ''">TransactionHash:
          <b @click="system.$commonFun.goLink(`${txLink}/tx/${cpCollateralCont.tx_hash}`)">{{cpCollateralCont.tx_hash}}</b>
        </label>
        <div v-else>
          <div class="area flex-row">
            <div class="fast width">
              <label>CP Account Address</label>
              <!-- <div class="address">{{cpCollateralCont.address}}</div> -->
              <el-input v-model="cpCollateralCont.user_input_address" @change="userInput" type="text" placeholder=" " />
              <p class="error" v-show="cpCollateralCont.tip">Please enter a valid Ethereum address</p>
            </div>
          </div>
          <br />
          <div class="area flex-row">
            <div class="fast width">
              <label>Amount</label>
              <el-input-number v-model="cpCollateralCont.amount" controls-position="right" @change="cpCollateralCont.tip_amount=false" />
              <!-- <p class="error" v-show="cpCollateralCont.tip_amount">The minimum amount is 1</p> -->
            </div>
          </div>
          <br />
          <el-button type="primary" class="add-button" :disabled="!cpCollateralCont.amount || cpCollateralCont.amount<0 || cpCollateralCont.tip || !cpCollateralCont.user_input_address" @click="cpCollateral">OK</el-button>
        </div>
      </div>
      <div v-if="activeName === 'check'" class="area flex-row" v-loading="cpCheckCont.show">
        <div class="fast width">
          <label>CP Account Address</label>
          <div class="address_email">
            <div class="address_body flex-row baseline nowrap space-between">
              <div class="address_left">
                <el-input v-model="cpCollateralCont.user_input_address" @change="userInput" type="text" placeholder=" " />
                <p class="error" v-show="cpCollateralCont.tip">Please enter a valid Ethereum address</p>
              </div>
              <el-button type="primary" class="add-button" :disabled="cpCollateralCont.tip || !cpCollateralCont.user_input_address" @click="cpCheckMethod">Check</el-button>
            </div>
          </div>
        </div>
        <div class="fast width">
          <label>Available Collateral </label>
          <div class="address">{{cpCheckCont.balance}} sETH</div>
        </div>
        <div class="fast width">
          <label>Hold Collateral</label>
          <div class="address">{{cpCheckCont.taskBalance}} sETH</div>
        </div>
        <div class="fast width">
          <label>Total Collateral</label>
          <div class="address">{{system.$commonFun.AddFormat(cpCheckCont.balance, cpCheckCont.taskBalance)}} sETH</div>
        </div>
      </div>
    </el-dialog>
  </section>
</template>


<script>
import web3Modal from "@/components/web3Modal"
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import {
  CircleCheck, DocumentCopy, Avatar, Setting, Delete, View
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import * as echarts from "echarts"
import SpaceTokenABI from '@/utils/abi/SwanToken.json'
import CollateralABI from '@/utils/abi/CollateralContract.json'
export default defineComponent({
  components: {
    CircleCheck, DocumentCopy, Avatar, Setting, Delete, View, web3Modal
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
    const prevType = ref(true)
    const centerDialogVisible = ref(false)
    const tokenShow = ref(false)
    const toolData = ref('')
    const cpCheckCont = reactive({
      diagle: false,
      show: false,
      tip: '',
      status: 'success',
      balance: 0,
      taskBalance: 0,
    })
    const cpCollateralCont = reactive({
      diagle: false,
      show: false,
      tip: false,
      tip_amount: false,
      address: '',
      amount: NaN,
      tx_hash: '',
      user_input_address: ''
    })
    const activeName = ref('deposit')
    const currentRef = reactive({
      value: store.state.networkValue || 'Proxima',
      options: [
        {
          value: 'Mainnet'
        },
        {
          value: 'Proxima'
        }]
    })
    const txLink = process.env.VUE_APP_ATOMBLOCKURL
    const tokenAddress = store.state.networkValue === 'Proxima' ? process.env.VUE_APP_OPSWAN_SWANTOKEN_ADDRESS : process.env.VUE_APP_MINNET_SWANTOKEN_ADDRESS
    const tokenContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, tokenAddress)
    const collateralAddress = store.state.networkValue === 'Proxima' ? process.env.VUE_APP_COLLATERAL_CONTACT : process.env.VUE_APP_MINNET_COLLATERAL_CONTACT
    const collateralContract = new system.$commonFun.web3Init.eth.Contract(CollateralABI, collateralAddress)


    async function createCom () {
      tokenShow.value = true
      const listRes = await system.$commonFun.sendRequest(`${system.$loginurl}api_token`, 'post')
      if (listRes && listRes.status === 'success') {
        system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Success!')
        store.dispatch('setAccessApiKey', listRes.data.token ?.token || '')
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
      const listRes = await system.$commonFun.sendRequest(`${system.$loginurl}api_token/delete`, 'post', formData)
      if (listRes && listRes.status === 'success') {
        store.dispatch('setAccessApiKey', '')
        system.$commonFun.messageTip('success', listRes.message ? listRes.message : 'Delete successfully!')
      } else system.$commonFun.messageTip('error', listRes.message ? listRes.message : 'Delete failed!')
      getdataList()
    }
    async function getdataList () {
      centerDialogVisible.value = true
      tokenShow.value = true
      toolData.value = ''

      try {
        const keysRes = await system.$commonFun.sendRequest(`${system.$loginurl}api_token`, 'get')

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
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      system.$commonFun.providerInit.on('accountsChanged', async function (accounts) {
        if (!prevType.value) return false
        system.$commonFun.signOutFun('disconnect')
      })
      system.$commonFun.providerInit.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        system.$commonFun.signOutFun('disconnect')
      })
    }
    async function handleSelect (key, keyPath) {
      // console.log(key, keyPath) //  
      if (key === 'apiKey') getdataList()
      else if (key === 'cpCollateralTools') cpTools()
      else if (key === 'sign_out') {
        await system.$commonFun.signOutFun()
        // await system.$commonFun.timeout(50)
        window.location.reload()
      }
    }
    function depositMethod () {
      cpCollateralCont.tip = false
      cpCollateralCont.tx_hash = ''
      cpCollateralCont.diagle = true
    }
    async function cpTools () {
      const net = await system.$commonFun.checkNetwork()
      if (net) return
      activeName.value = metaAddress.value ? 'deposit' : 'check'
      depositMethod()
    }
    function collateralClick (tab, event) {
      activeName.value = tab.props.name || 'deposit'
      cpCollateralCont.user_input_address = ''
      cpCollateralCont.tip = false
      if (activeName.value === 'deposit') depositMethod()
      // else cpCheckMethod()
    }
    async function cpCollateral () {
      cpCollateralCont.show = true
      try {
        if (Number(cpCollateralCont.amount) >= 0 && !cpCollateralCont.tip) cpDeposit()
        else {
          cpCollateralCont.tip_amount = true
          cpCollateralCont.show = false
        }
      } catch (err) {
        console.log('err', err)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
        cpCollateralCont.show = false
      }
    }
    function userInput () {
      cpCollateralCont.tip = !system.$commonFun.web3Init.utils.isAddress(cpCollateralCont.user_input_address)
    }
    async function cpDeposit () {
      try {
        const amount = system.$commonFun.web3Init.utils.toWei(String(cpCollateralCont.amount), 'ether')

        let payMethod = collateralContract.methods.deposit(cpCollateralCont.user_input_address)
        let payGasLimit = await payMethod.estimateGas({ from: metaAddress.value })
        const tx = await payMethod.send({ from: metaAddress.value, gasLimit: Math.floor(payGasLimit * 5), value: amount })
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
    async function cpCheckMethod () {
      cpCheckCont.diagle = true
      cpCheckCont.show = true
      try {
        const taskBalance = await collateralContract.methods.lockedCollateral(cpCollateralCont.user_input_address).call()
        const balances = await collateralContract.methods.availableBalance(cpCollateralCont.user_input_address).call()
        cpCheckCont.balance = system.$commonFun.web3Init.utils.fromWei(String(balances), 'ether') || 0
        cpCheckCont.taskBalance = system.$commonFun.web3Init.utils.fromWei(String(taskBalance), 'ether') || 0
      } catch (err) {
        console.log(err.message)
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
      }
      cpCheckCont.show = false
    }
    async function currentMethod (key) {
      store.dispatch('setNetwork', key)
      switch (key) {
        case 'Proxima':
          break
        case 'Mainnet':
          break
      }
      store.dispatch('setVersion', 'v2')
      // await system.$commonFun.signOutFun()
      window.location.reload()
    }
    onMounted(async () => {
      fn()
    })
    watch(route, (to, from) => {
      window.scrollTo(0, 0)
    })
    return {
      system,
      route,
      swanLogo,
      metaAddress,
      accessToken,
      centerDialogVisible,
      toolData,
      tokenShow,
      bodyWidth, cpCheckCont, cpCollateralCont, txLink, activeName, currentRef,
      getdataList, createCom, deleteToken, cpCheckMethod,
      handleSelect, cpCollateral, userInput, collateralClick, currentMethod
    }
  }
})
</script>

<style lang="less" scoped>
#container {
  font-size: 17px;
  line-height: 1.6;
  letter-spacing: 1px;
  @media screen and (max-width: 1600px) {
    font-size: 15px;
  }
  @media screen and (max-width: 1200px) {
    font-size: 14px;
  }
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  :deep(.el-button) {
    border: 0;
    border-radius: 0.08rem;
    background: linear-gradient(45deg, #025bd5, #3c73ec);
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    font-family: inherit;
  }
  .swan-logo {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 0 0.5rem;
    cursor: pointer;
    img {
      height: 0.42rem;
      @media screen and (max-width: 767px) {
        height: 35px;
      }
    }
    .current {
      .ml-10 {
        margin-left: 0.06rem;
      }
      :deep(.el-select) {
        width: auto;
        .el-select__wrapper {
          width: 115px;
          background-color: transparent;
          font-size: inherit;
          border: 0;
          border-radius: 0.5rem;
          box-shadow: none;
          .el-select__placeholder,
          .el-select__suffix .el-select__icon {
            color: @white-color;
          }
        }
      }
    }
    .swan-right {
      @media screen and (max-width: 767px) {
        flex-wrap: wrap;
        justify-content: flex-end;
        margin: 6px 0 0;
      }
      .pcShow {
        display: block;
        @media screen and (max-width: 767px) {
          display: none;
        }
      }
      .mobileShow {
        display: none;
        @media screen and (max-width: 767px) {
          display: block;
        }
      }
    }
    .nav {
      color: @white-color;
      @media screen and (max-width: 599px) {
        width: 100%;
        margin: 0 0 6px;
      }
      a {
        padding: 6px;
        margin: 0 0.05rem;
        color: inherit;
        border-radius: 8px;
        &:hover,
        &.active {
          background-color: rgb(21, 23, 28);
          color: @theme-color;
        }
        @media screen and (max-width: 599px) {
          padding: 6px 2px;
        }
      }
    }
    .header-right {
      .setting-style {
        width: 35px;
        height: 35px;
        padding: 0;
        margin: 0 0 0 0.1rem;
        background: linear-gradient(45deg, #025bd5, #3c73ec) !important;
        cursor: pointer;
        border-radius: 0.08rem;
        transition: all 0.2s;
        outline: none;
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
    .el-button {
      font-family: inherit;
      font-size: inherit;
    }
  }
}

:deep(.el-overlay-dialog) {
  display: flex;
  align-items: center;
  .wrongNet {
    padding: 0;
    margin: auto !important;
    box-shadow: 0 0 13px rgba(128, 128, 128, 0.8);
    border-radius: 0.2rem;
    text-align: left;
    .el-dialog__header {
      padding: 0.06rem 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dfdfdf;
      color: #000;
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 1;
      text-transform: capitalize;
      @media screen and (max-width: 479px) {
        padding: 0.3rem 0.2rem;
      }
      .el-tabs {
        width: 100%;
        .el-tabs__nav-wrap:after,
        .el-tabs__active-bar {
          display: none;
        }
        .el-tabs__header {
          margin: 0;
          .el-tabs__nav {
            width: 100%;
            .el-tabs__item {
              width: 50%;
              padding: 0;
              margin: 0;
              font-size: inherit;
              text-align: center;
            }
          }
        }
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
      padding: 0.2rem 0.4rem 0.3rem;
      font-size: 0.16rem;
      @media screen and (max-width: 540px) {
        padding: 0.2rem;
      }
      .is-disabled {
        opacity: 0.8;
      }
      .cp-show {
        min-height: 50px;
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
          margin: 10px 0 0;
          .address_left {
            width: 100%;
            margin: 0 0.1rem 0 0;
          }
          .bg-primary {
            &::before {
              background-color: #4d73ff;
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
        flex-wrap: wrap;
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
          .el-input-number {
            width: 100%;
            .el-input-number__decrease,
            .el-input-number__increase {
              display: none;
            }
            .el-input__inner {
              text-align: left;
            }
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
      &.is-disabled {
        opacity: 0.8;
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
.tabs-dropdown {
  .el-dropdown-menu {
    .el-dropdown-menu__item {
      padding: 2px 20px;
      &:hover,
      &:focus {
        background-color: #eee;
        font-weight: 900;
        color: @theme-color;
      }
    }
  }
}
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
        padding: 5px 0;
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
