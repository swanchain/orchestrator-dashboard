<template>
    <section id="container">
        <img :src="lagrangeLogo" class="lagrange-logo" />
        <h1>Lagrange Provider Status</h1>
        <div class="describe">
            Use this status page to check an Akash Provider information and status.
            <br> This list is refreshed every 5 minutes. Below snapshop taken at
            <strong>{{gmtTime}}</strong>
        </div>

        <div class="providers-overview mt-border">
            <div class="title">Providers Overview</div>
            <el-row :gutter="30">
                <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <div class="grid-content">
                        <h6>Network Providers</h6>
                        <b v-loading="providersLoad">{{pagin.total}}</b>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
                    <div class='chart' id='chart' v-if="false"></div>
                </el-col>
            </el-row>
        </div>

        <div class="providers-network mt-border">
            <div class="title">Lagrange Network Providers</div>
            <el-input v-model="networkInput" placeholder="Search Providers" clearable />
            <el-table :data="providersData" style="width: 100%" empty-text="No Data" v-loading="providersLoad">
                <el-table-column prop="name" label="Name" min-width="180" />
                <el-table-column prop="country" label="Country" />
                <el-table-column prop="region" label="Region" />
                <el-table-column prop="uptime" label="Uptime">
                    <template #default="scope">
                        <div>
                            {{scope.row.uptime ? `${scope.row.uptime * 100}%`:'0%' }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="5 minutes Interval Status" min-width="110">
                    <template #default="scope">
                        <div class="flex-row">
                            <el-icon v-for="n in 5" :key="n">
                                <CircleCheck />
                            </el-icon>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            />
        </div>
    </section>
</template>

<script>
import { defineComponent, computed, onMounted, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
import qs from 'qs'
import {
    CircleCheck
} from '@element-plus/icons-vue'
import * as echarts from "echarts"
export default defineComponent({
    components: {
        CircleCheck
    },
    setup () {
        const store = useStore()
        const bodyWidth = ref(document.body.clientWidth < 992)
        const system = getCurrentInstance().appContext.config.globalProperties
        const route = useRoute()
        const router = useRouter()
        const lagrangeLogo = require("@/assets/images/icons/logo.png")
        const gmtTime = new Date().toGMTString()
        const providersLoad = ref(false)
        const providersData = ref([])
        const pagin = reactive({
            pageSize: 10,
            pageNo: 1,
            total: 0
        })
        const networkInput = ref('')
        const small = ref(false)
        const background = ref(false)

        function handleSizeChange (val) { }
        async function handleCurrentChange (currentPage) {
            pagin.pageNo = currentPage
            init()
        }
        async function init () {
            providersLoad.value = true
            const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
            const params = {
                limit: pagin.pageSize,
                offset: page
            }
            const providerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/dashboard?${qs.stringify(params)}`, 'get')
            if (providerRes && providerRes.status === 'success') {
                pagin.total = providerRes.data.total_providers
                providersData.value = providerRes.data.providers || []
            }
            providersLoad.value = false
        }
        function reset (type) {
            pagin.total = 0
            pagin.pageSize = 10
            pagin.pageNo = 1
            providersData.value = []
            providersLoad.value = false
            if (type) init()
        }
        function drawChart (dataArr) {
            let chart = echarts.init(document.getElementById('chart'))
            window.addEventListener('resize', function () {
                chart.resize()
            })
            chart.setOption({
                grid: {
                    top: '2%',
                    left: '2%',
                    right: '2%',
                    bottom: '2%',
                    containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    // formatter: function (val) {
                    //     if (val.data == null) return;
                    //     return val.data.name + ': ' + val.data.value
                    // }
                    // triggerOn: 'none'
                },
                // tooltip: {
                //     trigger: "item",
                //     show: true,
                //     formatter: function (params) {
                //         let city = params.name + "市";
                //         let res = "";
                //         sswlist.map(item => {
                //             if (item.properties.name == city) {
                //                 res = item.properties.info;
                //             }
                //         });
                //         return res;
                //     },
                //     padding: 2,
                //     textStyle: {
                //         fontSize: 8,
                //         lineHeight: 10,
                //         align: "left"
                //     }
                // },
                geo: {
                    map: 'world',
                    itemStyle: {
                        normal: {
                            areaColor: '#fff',
                            borderColor: '#eee'
                        },
                        emphasis: {
                            areaColor: '#c37af9',
                            label: {
                                show: false
                            }
                        }
                    }
                },
                series: [
                    {
                        name: 'world',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        itemStyle: {
                            color: '#c37af9',
                            shadowBlur: 2,
                            shadowColor: '#000'
                        },
                        data: dataArr
                    }
                ]
            })
        }
        onMounted(() => {
            reset('init')
        })
        return {
            lagrangeLogo,
            gmtTime,
            providersLoad,
            providersData,
            networkInput,
            pagin,
            small,
            background,
            handleSizeChange, handleCurrentChange
        }
    }
})
</script>

<style lang="scss" scoped>
#container {
  font-size: 18px;
  line-height: 1.6;
  letter-spacing: 1px;
  @media screen and (max-width: 1200px) {
    font-size: 16px;
  }
  .lagrange-logo {
    display: block;
    width: 200px;
    margin: 0 0 0.3rem;
  }
  h1 {
    margin: 0 0 0.2rem;
    font-size: 0.35rem;
    font-weight: 600;
  }
  :deep(.providers-overview),
  :deep(.providers-network) {
    padding: 0.4rem 0;
    .title {
      margin: 0;
      font-size: 0.21rem;
      font-weight: 600;
    }
    .el-row {
      .el-col {
        .grid-content {
          padding: 0.15rem;
          margin: 0.3rem 0 0;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 0.1rem;
          h6 {
            font-size: 16px;
            @media screen and (max-width: 1600px) {
              font-size: 14px;
            }
          }
          b {
            font-size: 0.3rem;
          }
        }
        .chart {
          width: 90%;
          margin: 0 auto;
          height: 400px;
        }
      }
    }
    .el-input {
      margin-top: 0.24rem;
      .el-input__inner {
        width: 50%;
        height: 40px;
        background-color: transparent;
        line-height: 40px;
        border-radius: 0.1rem;
        color: #fff;
        @media screen and (max-width: 768px) {
          width: 100%;
        }
        &:hover,
        &:active,
        &:focus {
          border-color: #c37af9;
        }
      }
    }
    .el-table {
      margin: 0.24rem auto;
      background-color: transparent;
      border-top-left-radius: 0.1rem;
      border-top-right-radius: 0.1rem;
      tr {
        background-color: transparent;
        th {
          word-break: break-word;
          padding: 0.1rem 0;
          background-color: #fff;
          .cell {
            color: #000;
            word-break: break-word;
          }
        }
        td {
          padding: 0.16rem 0;
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
          i {
            margin-right: 5px;
            color: #ffffff;
            font-size: 18px;
            @media screen and (max-width: 1600px) {
              font-size: 16px;
            }
          }
        }
        &:hover {
          td {
            background-color: rgba(255, 255, 255, 0.95);
            color: #000;
            i {
              color: #000;
            }
          }
        }
      }
    }
    .el-table--border .el-table__inner-wrapper::after,
    .el-table--border::after,
    .el-table--border::before,
    .el-table__inner-wrapper::before {
      background-color: rgba(255, 255, 255, 0.4);
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-pagination__total {
        color: #fff;
      }
      .btn-next,
      .btn-prev,
      .el-pager li {
        min-width: 32px;
        margin: 0 4px;
        background-color: transparent;
        color: #fff;
        border: 1px solid #f4f4f5;
        border-radius: 5px;
        &:not(.disabled).active,
        &:not(.disabled):hover {
          background-color: #c37af9;
          border-color: #c37af9;
        }
        &:not(.disabled):hover {
        }
      }
    }
  }
}
</style>
