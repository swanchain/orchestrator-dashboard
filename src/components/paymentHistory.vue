<template>
  <div id="payment">
    <div class="payment-history container-landing">
      <div class="title">Reward history</div>
      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%">
        <!-- <el-table-column prop="chain_id" label="chain id" min-width="110" /> -->
        <el-table-column prop="job" label="task uuid" min-width="100">
          <template #default="scope">
            <div>
              <span>{{scope.row.task_uuid || '-'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="status" min-width="135">
          <template #default="scope">
            <div>
              <!-- <span v-if="scope.row.chain_id === 80001 && scope.row.order.updated_at < 1700508000 && scope.row.status.toLowerCase() === 'refundable'">Pending</span> -->
              <!-- <el-button type="primary" v-if="scope.row.status.toLowerCase() === 'accepted' || scope.row.status.toLowerCase() === 'refundable'" plain @click="rewardFun(scope.row)">Refund</el-button> -->
              <span v-if="scope.row.status && scope.row.status.toLowerCase() === 'waiting_for_cooling_down'">Cooling Down</span>
              <span v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'pending'">Job Running</span>
              <el-button type="primary" v-else-if="scope.row.status && scope.row.status.toLowerCase() === 'rewardable'" plain @click="rewardFun(scope.row, 1)">Claim Reward</el-button>
              <span v-else>{{scope.row.status}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="transaction_hash" label="Detail" min-width="120">
          <template #default="scope">
            <!-- <a :href="`${scope.row.url_tx}${scope.row.transaction_hash}`" target="_blank">{{scope.row.transaction_hash}}</a> -->
            <el-button type="primary" v-if="scope.row.claimed" plain @click="checkFun(scope.row)">Check</el-button>
            <el-button type="primary" v-else disabled plain>Check</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="created at" min-width="100">
          <template #default="scope">
            <span>
              {{system.$commonFun.momentFun(scope.row.created_at)}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="flex-row" :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="txhashVisible" title="Payment Detail" :width="bodyWidth" :append-to-body="false" custom-class="wrongNet" :before-close="handleClose">
      <div class="cont">
        <div class="area flex-row">
          <div class="fast width">
            <label>Transaction Hash</label>
            <div class="address">
              <div class="flex-row hash">
                {{system.$commonFun.hiddAddress(txHash)}}
                <svg @click="system.$commonFun.copyContent(txHash, 'Copied')" t="1706499607741" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2309" width="18" height="18">
                  <path d="M720 192h-544A80.096 80.096 0 0 0 96 272v608C96 924.128 131.904 960 176 960h544c44.128 0 80-35.872 80-80v-608C800 227.904 764.128 192 720 192z m16 688c0 8.8-7.2 16-16 16h-544a16 16 0 0 1-16-16v-608a16 16 0 0 1 16-16h544a16 16 0 0 1 16 16v608z"
                    p-id="2310" fill="#b5b7c8"></path>
                  <path d="M848 64h-544a32 32 0 0 0 0 64h544a16 16 0 0 1 16 16v608a32 32 0 1 0 64 0v-608C928 99.904 892.128 64 848 64z" p-id="2311" fill="#b5b7c8"></path>
                  <path d="M608 360H288a32 32 0 0 0 0 64h320a32 32 0 1 0 0-64zM608 520H288a32 32 0 1 0 0 64h320a32 32 0 1 0 0-64zM480 678.656H288a32 32 0 1 0 0 64h192a32 32 0 1 0 0-64z" p-id="2312" fill="#b5b7c8"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div class="area flex-row">
          <div class="fast width">
            <label>Amount</label>
            <div class="address">{{system.$commonFun.NumFormat(rowAll.amount)}} {{rowAll.token || '-'}}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { defineComponent, computed, onMounted, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import BiddingABI from '@/utils/abi/Bidding.json'
import TaskABI from '@/utils/abi/Task.json'
export default defineComponent({
  name: 'Payment History',
  setup () {
    const store = useStore()
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const bodyWidth = ref(document.body.clientWidth > 600 ? '450px' : '95%')
    const paymentData = ref([])
    const paymentLoad = ref(false)
    const paymentType = ref(route.query.type || 'user')
    const prevType = ref(true)
    const txhashVisible = ref(false)
    const txHash = ref('')
    const rowAll = ref({})
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0
    })
    const small = ref(false)
    const background = ref(false)
    let biddingContractAddress = process.env.VUE_APP_OPSWAN_BIDDING_ADDRESS
    let biddingContract = new system.$commonFun.web3Init.eth.Contract(BiddingABI, biddingContractAddress)

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
      rowAll.value = {}
      txhashVisible.value = false
    }
    function checkFun (row) {
      rowAll.value = row
      txHash.value = row.transaction_hash
      txhashVisible.value = true
    }
    async function rewardFun (row, type) {
      if (getnetID.toString() !== '2024') {
        await system.$commonFun.walletChain(2024)
        return
      }
      paymentLoad.value = true
      try {
        // get task contract address
        let taskContractAddress = await biddingContract.methods.tasks(String(row.task_uuid)).call()
        console.log(row.task_uuid)
        if (taskContractAddress.indexOf('0x0') > -1) {
          system.$commonFun.messageTip('error', 'Cannot get task contract, Please try again later!')
          paymentLoad.value = false
          return
        }
        let taskContract = new system.$commonFun.web3Init.eth.Contract(TaskABI, taskContractAddress)

        if (type) {
          console.log('task_uuid:', row.task_uuid)
          let gasLimit = await taskContract.methods
            .claimReward()
            .estimateGas({ from: store.state.metaAddress })

          const tx = await taskContract.methods
            .claimReward()
            .send({ from: store.state.metaAddress, gasLimit: Math.floor(gasLimit * 1.5) })
            .on('transactionHash', async (transactionHash) => {
              console.log('claim transactionHash:', transactionHash)
            })
            .on('receipt', async (receipt) => {
              // receipt example
              console.log('claim receipt:', receipt)
              claimStatus(row, receipt)
            })
            .on('error', () => paymentLoad.value = false)
        } else {
          console.log('refund id:', row.transaction_hash)
          let gasLimit = await taskContract.methods
            .claimRefund()
            .estimateGas({ from: store.state.metaAddress })

          const tx = await taskContract.methods
            .claimRefund()
            .send({ from: store.state.metaAddress, gasLimit: Math.floor(gasLimit * 1.5) })
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
    async function claimStatus (row, receipt) {
      paymentLoad.value = true
      let formData = new FormData()
      formData.append('tx_hash', receipt.transactionHash)
      formData.append('chain_id', getnetID)
      formData.append('uuid', row.uuid)
      formData.append('token', 'SwanToken')
      try {
        formData.append('amount', system.$commonFun.web3Init.utils.fromWei(String(receipt.events.RewardClaimed.returnValues.reward), 'ether'))
      } catch{ }
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
    let getnetID = NaN
    onMounted(async () => { })
    onActivated(async () => {
      getnetID = await system.$commonFun.web3Init.eth.net.getId()
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
      rowAll,
      pagin,
      background,
      small, bodyWidth,
      rewardFun, reviewFun, checkFun, handleClose, handleSizeChange, handleCurrentChange
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
    color: @white-color;
    font-size: 14px;
    text-align: left;
    .title {
      margin: 0 0 0.4rem;
      font-weight: bold;
      font-size: 0.24rem;
      color: @white-color;
      text-transform: capitalize;
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
    :deep(.el-pagination) {
      margin: 0.4rem auto;
      justify-content: center;
      .btn-next,
      .btn-prev,
      .el-pager li {
        background-color: @primary-color;
        color: rgb(181, 183, 200);
        &.active,
        &:hover {
          color: @white-color;
        }
      }
      .btn-prev {
        i {
          font-size: 14px;
          @media screen and (min-width: 1800px) {
            font-size: 16px;
          }
        }
      }
    }
  }
}
:deep(.el-overlay-dialog) {
  display: flex;
  justify-content: center;
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
        .hash {
          svg {
            margin: 0 0 0 0.05rem;
            cursor: pointer;
          }
        }
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
</style>