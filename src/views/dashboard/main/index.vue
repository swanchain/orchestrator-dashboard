<template>
  <section id="container">
    <img :src="lagrangeLogo" class="lagrange-logo" />
    <h1>Lagrange Provider Status</h1>
    <div class="describe">
      Use this status page to check an Lagrange Provider information and status.
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

      <el-row :gutter="30" class="erchart-body">
        <el-col>
          <div class="erchart">
            <div class="title">CPU</div>
            <h6>Current CPU usage</h6>
            <div id="maychar-cpu" class="maychar"></div>
            <h6>
              <i class="background-available"></i> {{providerBody.data.total_cpu}} vcpu - Available
            </h6>
            <h6>
              <i class="background-active"></i> {{providerBody.data.total_used_cpu}} vcpu - Active
            </h6>
          </div>
        </el-col>
        <el-col>
          <div class="erchart">
            <div class="title">GPU</div>
            <h6>Current GPU usage</h6>
            <div id="maychar-gpu" class="maychar"></div>
            <h6>
              <i class="background-available"></i> {{sizeChange(providerBody.data.total_gpu)}} - Available
            </h6>
            <h6>
              <i class="background-active"></i> {{sizeChange(providerBody.data.total_used_gpu)}} - Active
            </h6>
          </div>
        </el-col>
        <el-col>
          <div class="erchart">
            <div class="title">Memory</div>
            <h6>Current Memory usage</h6>
            <div id="maychar-memory" class="maychar"></div>
            <h6>
              <i class="background-available"></i> {{sizeChange(providerBody.data.total_memory)}} - Available
            </h6>
            <h6>
              <i class="background-active"></i> {{sizeChange(providerBody.data.total_used_memory)}} - Active
            </h6>
          </div>
        </el-col>
        <el-col>
          <div class="erchart">
            <div class="title">Storage</div>
            <h6>Current Storage usage</h6>
            <div id="maychar-storage" class="maychar"></div>
            <h6>
              <i class="background-available"></i> {{sizeChange(providerBody.data.total_storage)}} - Available
            </h6>
            <h6>
              <i class="background-active"></i> {{sizeChange(providerBody.data.total_used_storage)}} - Active
            </h6>
          </div>
        </el-col>
        <el-col>
          <div class="erchart">
            <div class="title">VCPU</div>
            <h6>Current VCPU usage</h6>
            <div id="maychar-vcpu" class="maychar"></div>
            <h6>
              <i class="background-available"></i> {{providerBody.data.total_vcpu}} vcpu - Available
            </h6>
            <h6>
              <i class="background-active"></i> {{providerBody.data.total_used_vcpu}} vcpu - Active
            </h6>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="providers-network mt-border">
      <div class="title">Lagrange Network Providers</div>
      <div class="search-body flex">
        <el-input v-model="networkInput" placeholder="Search Providers" />
        <el-button type="primary" :disabled="!networkInput ? true:false" round @click="searchProvider">Search</el-button>
        <el-button type="info" :disabled="!networkInput ? true:false" round @click="clearProvider">Clear</el-button>
      </div>
      <el-table :data="providersData" @expand-change="expandChange" style="width: 100%" empty-text="No Data" v-loading="providersLoad">
        <el-table-column type="expand">
          <template #default="props">
            <div class="service-body" v-if="props.row.computer_provider">
              <div class="tit">city</div>
              <el-divider />
              <div class="desc">{{ props.row.computer_provider.city}}</div>
              <div class="tit">country</div>
              <el-divider />
              <div class="desc">{{ props.row.computer_provider.country}}</div>
              <div class="tit">Deployments</div>
              <el-divider />
              <div class="list">
                <ul>
                  <li>
                    <div class="li-body">
                      <p>Active Deployment</p>
                      <p>
                        <strong>{{props.row.computer_provider.active_deployment}}</strong>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="tit">Resources</div>
              <el-divider />
              <div v-for="n in props.row.computer_provider.machines" :key="n" class="list">
                <div class="li-title">Machine ID: {{n.machine_id}}</div>
                <ul>
                  <li v-for="(child, keys, k) in n.specs" :key="k">
                    <div v-if="keys !== 'gpu' && keys !== 'cpu' && keys !== 'model'" class="li-body">
                      <p>{{keys}}</p>
                      <p>
                        <strong>{{child.free}}</strong>free</p>
                      <p>
                        <strong>{{child.total}}</strong>total</p>
                      <p>
                        <strong>{{child.used}}</strong>used</p>
                    </div>
                    <div v-else-if="keys === 'gpu'" class="flex-warp">
                      <div v-for="g in child.details" :key="g" class="li-body">
                        <p>{{g.product_name}} ({{keys}})</p>
                        <p>
                          <strong>{{g.fb_memory_usage.free}}</strong>free</p>
                        <p>
                          <strong>{{g.fb_memory_usage.total}}</strong>total</p>
                        <p>
                          <strong>{{g.fb_memory_usage.used}}</strong>used</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="service-body" v-else>No Data</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" min-width="180" />
        <el-table-column prop="country" label="Country" />
        <el-table-column prop="region" label="Region" />
        <el-table-column prop="uptime" label="Uptime">
          <template #default="scope">
            <div>
              {{unifyNumber(scope.row.uptime)}}%
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="" label="5 minutes Interval Status" min-width="110">-->
        <!--          <template #default="scope">-->
        <!--            <div class="flex-row">-->
        <!--              <el-icon v-for="n in 5" :key="n">-->
        <!--                <CircleCheck />-->
        <!--              </el-icon>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
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
    const providerBody = reactive({
      data: {}
    })
    const networkInput = ref('')
    const small = ref(false)
    const background = ref(false)
    const searchJudge = ref(false)

    function handleSizeChange (val) { }
    async function handleCurrentChange (currentPage) {
      pagin.pageNo = currentPage
      init()
    }
    async function init (nameText) {
      if (searchJudge.value) return
      providersLoad.value = true
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const params = {
        limit: pagin.pageSize,
        offset: page * pagin.pageSize,
        search_string: nameText
      }
      const providerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cp/dashboard?${qs.stringify(params)}`, 'get')
      if (providerRes && providerRes.status === 'success') {
        pagin.total = providerRes.data.total_providers
        providerBody.data = providerRes.data || {}
        providersData.value = providerRes.data.providers || []
        changetype()
      } else {
        providersData.value = []
        if (providerRes.status) system.$commonFun.messageTip(providerRes.status, providerRes.message)
      }
      providersLoad.value = false
    }
    async function searchProvider () {
      pagin.pageSize = 10
      pagin.pageNo = 1
      init(networkInput.value)
    }
    function clearProvider () {
      searchJudge.value = false
      reset('init')
    }
    function expandChange (row, expand) {
      // console.log(row, expand)
    }
    function reset (type) {
      pagin.total = 0
      pagin.pageSize = 10
      pagin.pageNo = 1
      providersData.value = []
      providersLoad.value = false
      networkInput.value = ''
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
    function unifyNumber (num) {
      if (!num) return 0
      const handleNum = parseFloat(num * 100)
      const isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > 2
      if (isToFixed) {
        const handleArray = handleNum.toString().split('.')
        const decimal = handleArray[1].substr(0, 2)
        if (decimal === "00") return handleNum.toFixed(0)
        else return `${handleArray[0]}.${decimal}`
      } else return handleNum
    }

    const changetype = () => {
      const machart_1 = echarts.init(document.getElementById("maychar-cpu"));
      const machart_2 = echarts.init(document.getElementById("maychar-gpu"));
      const machart_3 = echarts.init(document.getElementById("maychar-memory"));
      const machart_4 = echarts.init(document.getElementById("maychar-storage"));
      const machart_5 = echarts.init(document.getElementById("maychar-vcpu"));
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'none'
        },
        color: ['#4dd0e1', '#8bc34a'],
        series: [
          {
            name: 'Total',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 3,
              borderColor: 'transparent',
              borderWidth: 5
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 11,
                borderColor: 'transparent',
                color: '#fff'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: providerBody.data.total_cpu, name: `${providerBody.data.total_cpu} vcpu` },
              { value: providerBody.data.total_used_cpu, name: `${providerBody.data.total_used_cpu} vcpu` },
            ]
          }
        ]
      }
      const option2 = JSON.parse(JSON.stringify(option))
      const option3 = JSON.parse(JSON.stringify(option))
      const option4 = JSON.parse(JSON.stringify(option))
      const option5 = JSON.parse(JSON.stringify(option))
      option2.series[0].data = [
        { value: providerBody.data.total_gpu, name: sizeChange(providerBody.data.total_gpu) },
        { value: providerBody.data.total_used_gpu, name: sizeChange(providerBody.data.total_used_gpu) },
      ]
      option3.series[0].data = [
        { value: providerBody.data.total_memory, name: sizeChange(providerBody.data.total_memory) },
        { value: providerBody.data.total_used_memory, name: sizeChange(providerBody.data.total_used_memory) },
      ]
      option4.series[0].data = [
        { value: providerBody.data.total_storage, name: sizeChange(providerBody.data.total_storage) },
        { value: providerBody.data.total_used_storage, name: sizeChange(providerBody.data.total_used_storage) },
      ]
      option5.series[0].data = [
        { value: providerBody.data.total_vcpu, name: `${providerBody.data.total_vcpu} vcpu` },
        { value: providerBody.data.total_used_vcpu, name: `${providerBody.data.total_used_vcpu} vcpu` },
      ]
      machart_1.setOption(option);
      machart_2.setOption(option2);
      machart_3.setOption(option3);
      machart_4.setOption(option4);
      machart_5.setOption(option5);
      window.addEventListener("resize", function () {
        machart_1.resize();
        machart_2.resize();
        machart_3.resize();
        machart_4.resize();
        machart_5.resize();
      })
    }
    function sizeChange (bytes) {
      if (bytes === 0) return '0 B'
      if (!bytes) return '-'
      var k = 1024 // or 1000
      var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      var i = Math.floor(Math.log(bytes) / Math.log(k))

      if (Math.round((bytes / Math.pow(k, i))).toString().length > 3) i += 1
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
      providerBody,
      handleSizeChange, handleCurrentChange, searchProvider, clearProvider, expandChange, unifyNumber, sizeChange
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
  .flex {
    display: flex;
    align-items: center;
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
      &.erchart-body {
        .el-col {
          flex: 0 0 20%;
          max-width: 20%;
          margin: 0.3rem 0 0;
          @media screen and (max-width: 1024px) {
            flex: 0 0 33%;
            max-width: 33%;
          }
          @media screen and (max-width: 599px) {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .erchart {
            margin: 0.3rem 0 0;
            .title {
              font-size: 0.18rem;
            }
            h6 {
              display: flex;
              align-items: center;
              margin: 0 0 0.1rem;
              font-weight: 100;
              i {
                display: block;
                width: 23px;
                height: 8px;
                margin: auto 0.05rem auto 0;
                border-radius: 5px;
                &.background-available {
                  background-color: #4dd0e1;
                }
                &.background-active {
                  background-color: #8bc34a;
                }
              }
            }
            .maychar {
              width: 100%;
              height: 220px;
              @media screen and (max-width: 599px) {
                max-width: 250px;
                height: 150px;
              }
            }
          }
        }
      }
    }
    .search-body {
      justify-content: flex-start;
      flex-wrap: wrap;
      margin: 0.24rem 0 0;
      .el-input {
        width: 50%;
        margin: 0 0.2rem 0 0;
        .el-input__inner {
          width: 100%;
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
      .el-button {
        font-family: inherit;
        &.el-button--primary {
          background-color: #7405ff;
          border-color: #7405ff;
        }
        &:hover,
        &.is-disabled {
          opacity: 0.7;
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
          background-color: transparent;
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
          .service-body {
            padding: 0 0.25rem 0.45rem;
            color: #333;
            // border-top: rgb(220, 223, 230) 1px solid;
            // border-bottom: rgb(220, 223, 230) 1px solid;
            .tit {
              margin: 0.2rem 0 0;
              font-size: 16px;
              font-weight: 500;
              text-transform: capitalize;
              @media screen and (max-width: 1600px) {
                font-size: 14px;
              }
            }
            .desc {
              padding: 0 0 0.1rem;
              font-size: 14px;
              @media screen and (max-width: 1600px) {
                font-size: 12px;
              }
            }
            .list {
              padding: 0.1rem 0 0.15rem;
              .li-title {
                width: 100%;
              }
              ul {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                .flex-warp {
                  display: flex;
                  flex-wrap: wrap;
                  align-items: stretch;
                }
                .li-body {
                  padding: 0.1rem 0.3rem;
                  margin: 0.15rem 0.15rem 0 0;
                  // background-color: #f4f4f4;
                  border: 1px solid #e4e7ed;
                  border-radius: 5px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                  @media screen and (max-width: 768px) {
                    padding: 0.1rem 0.5rem;
                    margin: 0.25rem 0.25rem 0 0;
                  }
                  p {
                    padding: 3px 0;
                    font-size: 14px;
                    line-height: 1.3;
                    @media screen and (max-width: 1600px) {
                      font-size: 12px;
                    }
                    strong {
                      margin-right: 5px;
                      font-size: 15px;
                      @media screen and (max-width: 1600px) {
                        font-size: 13px;
                      }
                    }
                    &:nth-child(1) {
                      strong {
                        color: #41b883;
                      }
                    }
                    &:nth-child(2) {
                      strong {
                        color: #ff8a65;
                      }
                    }
                    &:nth-child(3) {
                      strong {
                        color: #faad15;
                      }
                    }
                  }
                }
              }
            }
            .el-divider--horizontal {
              margin: 0.1rem 0;
            }
          }
          &.el-table__expanded-cell {
            background-color: rgba(255, 255, 255, 0.95) !important;
          }
        }
        &.expanded,
        &:hover {
          td {
            background-color: rgba(255, 255, 255, 0.85);
            color: #000;
            i {
              color: #000;
            }
          }
        }
        &.expanded {
          td {
            background-color: rgba(255, 255, 255, 0.95);
          }
          &:hover {
            td {
              background-color: rgba(255, 255, 255, 0.85);
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
