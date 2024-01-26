<template>
  <div id="payment">
    <div class="payment-history container-landing">
      <div class="title">UBI Reward history</div>
      <el-table v-loading="paymentLoad" :data="paymentData" stripe style="width: 100%">
        <el-table-column prop="task_id" label="Task ID" width="90" />
        <el-table-column prop="type" label="Task Type" width="90">
          <template #default="scope">
            <span>{{scope.row.type === 0 ? 'CPU': 'GPU'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zk_type" label="ZK Type" min-width="120" />
        <el-table-column prop="started_at" label="Started AT" min-width="135">
          <template #default="scope">
            <span>{{system.$commonFun.momentFun(scope.row.started_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ended_at" label="ended at" min-width="135">
          <template #default="scope">
            <span>{{system.$commonFun.momentFun(scope.row.ended_at)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tx_hash" label="transaction hash" min-width="120">
          <template #default="scope">
            <a :href="`${scope.row.url_tx}${scope.row.tx_hash}`" target="_blank">{{scope.row.tx_hash}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="Amount (SWAN)" />
      </el-table>
      <el-pagination class="flex-row" hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
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
    const prevType = ref(true)
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0
    })
    const small = ref(false)
    const background = ref(false)

    async function handleSizeChange (val) {
      // console.log('handleSizeChange:', val)
    }
    async function handleCurrentChange (currentPage) {
      // console.log('handleCurrentChange:', currentPage)
      pagin.pageNo = currentPage
      init()
    }
    async function init (params) {
      paymentLoad.value = true
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const paramsCont = {
        "owner_addr": store.state.metaAddress,
        // "owner_addr": '0xFbc1d38a2127D81BFe3EA347bec7310a1cfa2373',
        "page_no": page,
        "page_size": pagin.pageSize
      }
      const paymentsRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_UBI}rewards?${system.$Qs.stringify(paramsCont)}`, 'get') //?public_address=${store.state.metaAddress}
      if (paymentsRes && paymentsRes.code === 0) {
        for (let p = 0; p < paymentsRes.data.list.length; p++) {
          let { url_tx } = await system.$commonFun.getUnit(parseInt(paymentsRes.data.list[p].chain_id), 16)
          paymentsRes.data.list[p].url_tx = url_tx
          const amount = Number(paymentsRes.data.list[p].amount).toFixed(2)
          paymentsRes.data.list[p].amount = amount
        }
        pagin.total = paymentsRes.data.total
        paymentData.value = paymentsRes.data.list || []
      } else {
        pagin.total = 0
        paymentData.value = []
      }
      paymentLoad.value = false
    }
    onMounted(async () => { })
    onActivated(async () => {
      init()
    })
    watch(route, (to, from) => {
      if (to.name === "UBIHistory") init()
    })
    return {
      paymentData,
      paymentLoad,
      system,
      route,
      router,
      pagin, background, small,
      handleSizeChange, handleCurrentChange
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
</style>