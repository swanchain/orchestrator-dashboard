<template>
  <div id="payment">
    <div class="payment-history container-landing">
      <div class="title">Reward history</div>
      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%">
        <el-table-column prop="chain_id" label="chain id" min-width="110" />
        <el-table-column prop="amount" label="amount" />
        <el-table-column prop="status" label="status" min-width="135">
          <template #default="scope">
            <div>
              <!-- <span v-if="scope.row.chain_id === 80001 && scope.row.order.updated_at < 1700508000 && scope.row.status.toLowerCase() === 'refundable'">Pending</span> -->
              <el-button type="primary" v-if="scope.row.status.toLowerCase() === 'accepted' || scope.row.status.toLowerCase() === 'refundable'" plain @click="refundFun(scope.row)">Refund</el-button>
              <el-button type="primary" v-else-if="scope.row.status.toLowerCase() === 'rewardable'" plain @click="reviewFun(scope.row)">Claim Reward</el-button>
              <span v-else>{{scope.row.status}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="transaction_hash" label="transaction hash" min-width="120">
          <template #default="scope">
            <!-- <a :href="`${scope.row.url_tx}${scope.row.transaction_hash}`" target="_blank">{{scope.row.transaction_hash}}</a> -->
            <el-button type="primary" v-if="scope.row.transaction_hash" plain @click="checkFun(scope.row.transaction_hash)">Check</el-button>
            <el-button type="primary" v-else disabled plain>Check</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="txhashVisible" title="Transaction Hash" :append-to-body="false" :show-close="false" custom-class="transaction-style" :before-close="handleClose">
      <div class="flex-row hash">
        {{system.$commonFun.hiddAddress(txHash)}}
        <svg @click="system.$commonFun.copyContent(txHash, 'Copied')" t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
          <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
            p-id="2310" fill="#b5b7c8"></path>
          <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
          <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
        </svg>
      </div>
      <template #footer>
        <span class="dialog-footer flex-row flex-end">
          <el-button type="primary" @click="txhashVisible = false">
            Close
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import SpaceTokenABI from '@/utils/abi/SpacePaymentV6.json'
export default defineComponent({
  name: 'Payment History',
  setup () {
    const store = useStore()
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const paymentData = ref([])
    const paymentLoad = ref(false)
    const paymentType = ref(route.query.type || 'user')
    const prevType = ref(true)
    const txhashVisible = ref(false)
    const txHash = ref('')
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0
    })
    const small = ref(false)
    const background = ref(false)
    let paymentContractAddress = process.env.VUE_APP_HARDWARE_ADDRESS
    let paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, paymentContractAddress)

    function handleSizeChange (val) { }
    async function handleCurrentChange (currentPage) {
      pagin.pageNo = currentPage
      init()
    }
    async function reviewFun (row) {
      const net = await system.$commonFun.checkNetwork()
      if (net) return
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const reviewRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}claim_review`, 'post', formData)
      if (reviewRes) {
        ElMessageBox.alert(
          `Status: ${reviewRes.status}<br />Message: ${reviewRes.message}`,
          'Review Detail',
          {
            // if you want to disable its autofocus
            // autofocus: false,
            confirmButtonText: 'OK',
            dangerouslyUseHTMLString: true,
            callback: (action) => {
              init()
            }
          }
        )
      }
    }
    function handleClose () {
      txHash.value = ''
      txhashVisible.value = false
    }
    function checkFun (hash) {
      txHash.value = hash
      txhashVisible.value = true
    }
    async function refundFun (row, type) {
      if (row.chain_id.toString() !== getnetID.toString()) {
        await system.$commonFun.walletChain(Number(row.chain_id))
        return
      }
      paymentLoad.value = true
      try {
        if (type) {
          console.log('task_uuid:', row.job.uuid)
          let gasLimit = await paymentContract.methods
            .claimReward(String(row.job.uuid))
            .estimateGas({ from: store.state.metaAddress })

          const tx = await paymentContract.methods
            .claimReward(String(row.job.uuid))
            .send({ from: store.state.metaAddress, gasLimit: gasLimit })
            .on('transactionHash', async (transactionHash) => {
              console.log('claim transactionHash:', transactionHash)
              claimStatus(row, transactionHash)
            })
            .on('error', () => paymentLoad.value = false)
        } else {
          console.log('refund id:', row.transaction_hash)
          let gasLimit = await paymentContract.methods
            .claimRefund(String(row.transaction_hash))
            .estimateGas({ from: store.state.metaAddress })

          const tx = await paymentContract.methods
            .claimRefund(String(row.transaction_hash))
            .send({ from: store.state.metaAddress, gasLimit: gasLimit })
            .on('transactionHash', async (transactionHash) => {
              console.log('refund transactionHash:', transactionHash)
              refundStatus(row, transactionHash)
            })
            .on('error', () => paymentLoad.value = false)
        }
      } catch (err) {
        console.log('err', err)
        paymentLoad.value = false
        if (err && err.message) system.$commonFun.messageTip('error', err.message)
      }
    }
    async function refundStatus (row, transactionHash) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', row.transaction_hash)
      formData.append('chain_id', row.chain_id)
      const refundRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/refund`, 'post', formData)
      if (!refundRes || refundRes.status !== 'success') if (refundRes.message) system.$commonFun.messageTip('error', refundRes.message)
      init()
    }
    async function claimStatus (row, transactionHash) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', transactionHash)
      formData.append('chain_id', row.chain_id)
      formData.append('uuid', row.uuid)
      const claimRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}user/provider/payments`, 'post', formData)
      if (!claimRes || claimRes.status !== 'success') if (claimRes.message) system.$commonFun.messageTip('error', claimRes.message)
      init()
    }
    async function init (params) {
      paymentLoad.value = true
      paymentType.value = route.query.type || 'user'
      const requestURL = `${process.env.VUE_APP_BASEAPI}provider/payments`
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const paramsOption = {
        limit: pagin.pageSize,
        offset: page * pagin.pageSize
      }
      const paymentsRes = await system.$commonFun.sendRequest(`${requestURL}?${system.$Qs.stringify(paramsOption)}`, 'get') //?public_address=${store.state.metaAddress}
      if (paymentsRes && paymentsRes.status === 'success') {
        for (let p = 0; p < paymentsRes.data.payments.length; p++) {
          let { url_tx } = await system.$commonFun.getUnit(parseInt(paymentsRes.data.payments[p].chain_id), 16)
          paymentsRes.data.payments[p].url_tx = url_tx
        }
        paymentData.value = paymentsRes.data.payments || []
        pagin.total = paymentsRes.data.total || 0
      }
      // else if (paymentsRes.message) system.$commonFun.messageTip('error', paymentsRes.message)
      paymentLoad.value = false
    }
    async function paymentEnv () {
      if (getnetID !== 80001) {
        paymentContractAddress = process.env.VUE_APP_OPSWAN_ADDRESS
        paymentContract = new system.$commonFun.web3Init.eth.Contract(SpaceTokenABI, paymentContractAddress)
      }
    }
    let getnetID = NaN
    onMounted(async () => { })
    onActivated(async () => {
      getnetID = await system.$commonFun.web3Init.eth.net.getId()
      paymentEnv()
      init()
    })
    watch(route, (to, from) => {
      if (to.name === "paymentHistory") init()
    })
    return {
      paymentData,
      paymentLoad,
      system,
      route,
      router,
      paymentType,
      txhashVisible,
      txHash,
      pagin,
      background,
      small,
      refundFun, reviewFun, checkFun, handleClose, handleSizeChange, handleCurrentChange
    }
  },
})
</script>
<style  lang="less" scoped>
#payment {
  width: 100%;
  .payment-history {
    height: calc(100% - 1.2rem);
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    margin: 0 auto;
    box-sizing: border-box;
    word-break: break-word;
    text-transform: capitalize;
    color: @white-color;
    font-size: 14px;
    text-align: left;
    .title {
      margin: 0 0 0.4rem;
      font-weight: bold;
      font-size: 0.24rem;
      color: @white-color;
    }
    :deep(.el-table) {
      background-color: transparent;
      // border-radius: 0.1rem;
      border: 1px solid rgb(30, 32, 39);
      tr {
        th,
        td {
          padding: 0.1rem 0;
          background-color: @primary-color;
          font-size: 15px;
          color: rgb(181, 183, 200);
          border-color: rgb(38, 39, 47);
          @media screen and (max-width: 1600px) {
            font-size: 13px;
          }
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }
          .cell {
            display: flex;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            line-height: 1.5;
            word-break: break-word;
            text-align: center;
            a {
              color: inherit;
              &:hover {
                text-decoration: underline;
              }
            }
            .el-button {
              height: auto;
              padding: 6px 0.1rem;
              background-color: transparent;
              font-family: inherit;
              font-size: inherit;
              border-color: @theme-color;
              border-radius: 1rem;
              line-height: 1;
              color: @theme-color;
              &:hover {
                background-color: @theme-color;
                color: @white-color;
              }
              &.is-disabled {
                border-color: @text-color;
                color: @text-color;
                &:hover {
                  background-color: transparent;
                  color: @text-color;
                }
              }
            }
          }
        }
        th {
          font-size: 16px;
          font-weight: normal;
          background-color: @primary-color;
          text-transform: uppercase;
          color: @text-color;
          @media screen and (max-width: 1600px) {
            font-size: 14px;
          }
          @media screen and (max-width: 768px) {
            font-size: 13px;
          }
        }
      }
      .el-table__inner-wrapper::before {
        height: 0;
      }
    }
  }
}
:deep(.el-overlay-dialog) {
  display: flex;
  justify-content: center;
  align-items: center;
  .transaction-style {
    width: 40%;
    max-width: 400px;
    min-width: 300px;
    margin: auto;
    text-align: left;
    @media screen and (max-width: 768px) {
      width: 60%;
    }
    @media screen and (max-width: 441px) {
      width: 90%;
    }
    .el-dialog__header {
      padding: 15px 15px 10px;
      font-size: 17px;
      color: #000;
      @media screen and (max-width: 768px) {
        font-size: 15px;
      }
      @media screen and (min-width: 1800px) {
        font-size: 18px;
      }
      .el-dialog__title {
        font-size: inherit;
      }
      .el-dialog__headerbtn {
        top: 14px;
      }
    }
    .el-dialog__body {
      padding: 10px 15px;
      .hash {
        svg {
          margin: 0 0 0 0.05rem;
          cursor: pointer;
        }
      }
    }
    .el-dialog__footer {
      padding: 5px 15px 10px;
    }
  }
}
</style>