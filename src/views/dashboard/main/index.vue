<template>
  <section id="container">
    <h1>Swan Provider Status</h1>
    <div class="describe">
      Use this status page to check an Swan Provider information and status.
      <br> This list is refreshed every 5 minutes. Below snapshot taken at
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
          <div class="grid-content">
            <h6>Active Applications</h6>
            <b v-loading="providersLoad">{{pagin.active_applications}}</b>
          </div>
          <div class="grid-content">
            <h6>Total Deployments</h6>
            <b v-loading="providersLoad">{{pagin.total_deployments}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" class="flex-row">
          <div class='chart' id='chart' v-loading="providersLoad" element-loading-background="rgba(0, 0, 0, 0)"></div>
        </el-col>
      </el-row>

      <el-row :gutter="40" class="erchart-body">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="title">VCPU</div>
            <h6>Current VCPU usage</h6>
            <div id="maychar-vcpu" class="maychar"></div>
            <h6 class="background-free">
              <i></i>
              <b>{{providerBody.data.total_vcpu - providerBody.data.total_used_vcpu}}</b> vcpu Free
            </h6>
            <h6 class="background-used">
              <i></i>
              <b>{{providerBody.data.total_used_vcpu}}</b> vcpu Used
            </h6>
            <h6 class="background-total">
              <i></i>
              <b>{{providerBody.data.total_vcpu}}</b> Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="title">Memory</div>
            <h6>Current Memory usage</h6>
            <div id="maychar-memory" class="maychar"></div>
            <h6 class="background-free">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_memory-providerBody.data.total_used_memory)}}</b> Free
            </h6>
            <h6 class="background-used">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_used_memory)}}</b> Used
            </h6>
            <h6 class="background-total">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_memory)}}</b> Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="title">Storage</div>
            <h6>Current Storage usage</h6>
            <div id="maychar-storage" class="maychar"></div>
            <h6 class="background-free">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_storage-providerBody.data.total_used_storage)}}</b> Free
            </h6>
            <h6 class="background-used">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_used_storage)}}</b> Used
            </h6>
            <h6 class="background-total">
              <i></i>
              <b>{{system.$commonFun.sizeChange(providerBody.data.total_storage)}}</b> Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="drain-time"></div>
            <div class="title">GPU</div>
            <h6>Current GPU usage</h6>
            <div id="maychar-gpu" class="maychar"></div>
            <h6 class="background-free">
              <i></i>
              <b>{{providerBody.data.total_gpu-providerBody.data.total_used_gpu}}</b> Free
            </h6>
            <h6 class="background-used">
              <i></i>
              <b>{{providerBody.data.total_used_gpu}}</b> Used
            </h6>
            <h6 class="background-total">
              <i></i>
              <b>{{providerBody.data.total_gpu}}</b> Total
            </h6>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="providers-network mt-border">
      <div class="title">Swan Network Providers</div>
      <div class="search-body flex">
        <el-input v-model="networkInput" placeholder="Search Providers" />
        <el-button type="primary" :disabled="!networkInput ? true:false" round @click="searchProvider">Search</el-button>
        <el-button type="info" :disabled="!networkInput ? true:false" round @click="clearProvider">Clear</el-button>
      </div>
      <el-table :data="providersData" @expand-change="expandChange" style="width: 100%" empty-text="No Data" v-loading="providersLoad">
        <el-table-column type="expand" width="40">
          <template #default="props">
            <div class="service-body" v-if="props.row.computer_provider">
              <div v-for="n in props.row.computer_provider.machines" :key="n" class="list">
                <div class="li-title">Machine ID: {{n.machine_id}}</div>
                <ul>
                  <li v-for="(child, vcpuKeys, k) in n.specs" :key="k" v-show="vcpuKeys === 'vcpu'">
                    <div class="li-body">
                      <p :class="{'t':true, 't-capitalize': vcpuKeys === 'vcpu'}">{{vcpuKeys}}</p>
                      <p>
                        <strong>{{child.free}}</strong>free</p>
                      <p>
                        <strong>{{child.total}}</strong>total</p>
                      <p>
                        <strong>{{child.used}}</strong>used</p>
                    </div>
                  </li>
                  <li v-for="(child, memoryKeys, k) in n.specs" :key="k" v-show="memoryKeys === 'memory'">
                    <div class="li-body">
                      <p :class="{'t':true, 't-capitalize': memoryKeys === 'vcpu'}">{{memoryKeys}}</p>
                      <p>
                        <strong>{{child.free}}</strong>free</p>
                      <p>
                        <strong>{{child.total}}</strong>total</p>
                      <p>
                        <strong>{{child.used}}</strong>used</p>
                    </div>
                  </li>
                  <li v-for="(child, storageKeys, k) in n.specs" :key="k" v-show="storageKeys === 'storage'">
                    <div class="li-body">
                      <p :class="{'t':true, 't-capitalize': storageKeys === 'vcpu'}">{{storageKeys}}</p>
                      <p>
                        <strong>{{child.free}}</strong>free</p>
                      <p>
                        <strong>{{child.total}}</strong>total</p>
                      <p>
                        <strong>{{child.used}}</strong>used</p>
                    </div>
                  </li>
                </ul>
                <div class="li-title">GPU Source</div>
                <ul>
                  <li v-for="(child, gpuKeys, k) in n.specs" :key="k" v-show="gpuKeys === 'gpu'" style="width:100%;">
                    <div class="flex-row">
                      <div v-for="g in child.details" :key="g" :class="{'li-body':true}">
                        <p :class="{'t':true, 't-capitalize': gpuKeys === 'gpu'}">{{g.product_name}} ({{gpuKeys}})</p>
                        <p>
                          <strong>{{g.fb_memory_usage.free}}</strong>free</p>
                        <p>
                          <strong>{{g.fb_memory_usage.total}}</strong>total</p>
                        <p>
                          <strong>{{g.fb_memory_usage.used}}</strong>used</p>
                        <p>Status:
                          <strong>{{g.status}}</strong>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="service-body" v-else>No Data</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Name" min-width="90">
          <template #default="scope">
            <div class="badge">
              <img v-if="scope.$index < 2 && pagin.pageNo <= 1" :src="badgeIcon01" alt="">
              <img v-else :src="badgeIcon02" alt=""> {{scope.row.name}}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="country" label="Country" /> -->
        <el-table-column prop="computer_provider.active_deployment" label="Active deployment" />
        <el-table-column prop="computer_provider.score" label="Score" />
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
  CircleCheck, DocumentCopy, Avatar
} from '@element-plus/icons-vue'
import * as echarts from "echarts"
export default defineComponent({
  components: {
    CircleCheck, DocumentCopy, Avatar
  },
  setup () {
    const store = useStore()
    const metaAddress = computed(() => (store.state.metaAddress))
    const accessToken = computed(() => (store.state.accessToken))
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const badgeIcon01 = require("@/assets/images/icons/badge-1.png")
    const badgeIcon02 = require("@/assets/images/icons/badge-2.png")
    const gmtTime = new Date().toGMTString()
    const providersLoad = ref(false)
    const providersData = ref([])
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0,
      total_deployments: 0,
      active_applications: 0
    })
    const providerBody = reactive({
      data: {}
    })
    const networkInput = ref('')
    const small = ref(false)
    const background = ref(false)
    const searchJudge = ref(false)
    const dataArr = ref([])

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
      const providerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_LAG_BASEAPI}cp/dashboard?${qs.stringify(params)}`, 'get')
      if (providerRes && providerRes.status === 'success') {
        pagin.total = providerRes.data.total_providers
        pagin.total_deployments = providerRes.data.total_deployments
        pagin.active_applications = providerRes.data.active_applications
        providerBody.data = providerRes.data || {}
        providersData.value = providerRes.data.providers || []
        dataArr.value = providerRes.data.map_info
        drawChart(dataArr.value)
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
      pagin.total_deployments = 0
      pagin.active_applications = 0
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
          trigger: "item",
          formatter: function (val) {
            if (val.data && val.data.city) return val.data.city
            else return val.name
          },
          // show: false,
          padding: 5,
          textStyle: {
            fontSize: 8,
            lineHeight: 10,
            align: "left"
          }
        },
        geo: {
          show: true,
          map: 'world',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          // aspectScale: 0.75,
          roam: false,
          itemStyle: {
            normal: {
              areaColor: '#fff',
              borderColor: '#eee'
            },
            // emphasis: {
            //   areaColor: '#a467d1',
            //   label: {
            //     show: false
            //   }
            // }
          },
          emphasis: {
            focus: 'none'
          },
          silent: true
          // left: '5%',
          // right: '5%'
        },
        series: [
          {
            name: 'world',
            type: 'scatter',
            coordinateSystem: 'geo',
            itemStyle: {
              // borderWidth: 1,
              // borderColor: '#fff',
              // color: 'rgba(89, 152, 14, 1)',
              color: '#4db470',
              shadowBlur: 2,
              shadowColor: '#000'
            },
            data: dataArr,
            symbolSize: 10,
            zlevel: 1
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
      const machart_gpu = echarts.init(document.getElementById("maychar-gpu"));
      const machart_memory = echarts.init(document.getElementById("maychar-memory"));
      const machart_storage = echarts.init(document.getElementById("maychar-storage"));
      const machart_vcpu = echarts.init(document.getElementById("maychar-vcpu"));
      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'none'
        },
        color: ['#4db470', '#00b4ff'],
        series: [
          {
            name: 'Total',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'],
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
            }
          }
        ]
      }
      const option2 = JSON.parse(JSON.stringify(option))
      const option3 = JSON.parse(JSON.stringify(option))
      const option4 = JSON.parse(JSON.stringify(option))
      const option5 = JSON.parse(JSON.stringify(option))
      option2.series[0].data = [
        { value: providerBody.data.total_gpu - providerBody.data.total_used_gpu, name: providerBody.data.total_gpu - providerBody.data.total_used_gpu },
        { value: providerBody.data.total_used_gpu, name: providerBody.data.total_used_gpu },
      ]
      option3.series[0].data = [
        { value: providerBody.data.total_memory - providerBody.data.total_used_memory, name: system.$commonFun.sizeChange(providerBody.data.total_memory - providerBody.data.total_used_memory) + ' ' },
        { value: providerBody.data.total_used_memory, name: system.$commonFun.sizeChange(providerBody.data.total_used_memory) },
      ]
      option4.series[0].data = [
        { value: providerBody.data.total_storage - providerBody.data.total_used_storage, name: system.$commonFun.sizeChange(providerBody.data.total_storage - providerBody.data.total_used_storage) + ' ' },
        { value: providerBody.data.total_used_storage, name: system.$commonFun.sizeChange(providerBody.data.total_used_storage) },
      ]
      option5.series[0].data = [
        { value: providerBody.data.total_vcpu - providerBody.data.total_used_vcpu, name: `${providerBody.data.total_vcpu - providerBody.data.total_used_vcpu} vcpu ` },
        { value: providerBody.data.total_used_vcpu, name: `${providerBody.data.total_used_vcpu} vcpu` },
      ]
      machart_gpu.setOption(option2);
      machart_memory.setOption(option3);
      machart_storage.setOption(option4);
      machart_vcpu.setOption(option5);
      window.addEventListener("resize", function () {
        machart_gpu.resize();
        machart_memory.resize();
        machart_storage.resize();
        machart_vcpu.resize();
      })
    }
    onMounted(async () => {
      reset('init')
    })
    return {
      system,
      route,
      metaAddress,
      gmtTime,
      providersLoad,
      providersData,
      networkInput,
      pagin,
      small,
      background,
      providerBody,
      badgeIcon01,
      badgeIcon02,
      accessToken,
      handleSizeChange, handleCurrentChange, searchProvider, clearProvider, expandChange, unifyNumber
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
        &.flex-row {
          display: flex;
        }
        .grid-content {
          padding: 0.15rem;
          margin: 0.45rem 0 0.55rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.1rem;
          animation: glow 1s ease-in-out infinite alternate;
          h6 {
            font-size: 16px;
            @media screen and (max-width: 1260px) {
              font-size: 14px;
            }
          }
          b {
            font-size: 0.3rem;
          }
        }
        .chart {
          width: 100%;
          margin: 0 auto;
          height: 400px;
        }
      }
      &.erchart-body {
        .el-col {
          margin: 0.3rem 0 0;
          .erchart {
            position: relative;
            padding: 0.15rem;
            margin: 0.3rem 0 0;
            border-radius: 0.15rem;
            // border: 2px solid @theme-color-opacity1;
            overflow: hidden;
            text-align: center;
            box-shadow: 0 0 15px #447dff;

            border: 2px solid red;
            animation: glowing 2s linear infinite;

            @keyframes glowing {
              0% {
                border-color: red;
              }
              50% {
                border-color: green;
              }
              100% {
                border-color: red;
              }
            }

            .drain-time {
              display: none;
              position: absolute;
              z-index: 6;
              &:nth-child(1) {
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                animation: run1 1s linear infinite; // animation-delay: 0s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(2) {
                top: 0;
                right: 0;
                height: 100%;
                width: 2px;
                animation: run2 1s linear infinite;
                // animation-delay: 1s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(3) {
                bottom: 0;
                left: 0;
                height: 2px;
                width: 100%;
                animation: run3 1s linear infinite;
                // animation-delay: 2s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
              &:nth-child(4) {
                top: 0;
                left: -1px;
                height: 100%;
                width: 2px;
                animation: run4 1s linear infinite;
                // animation-delay: 3s;
                background: linear-gradient(
                  to right,
                  @theme-color-opacity2,
                  @theme-color-opacity1,
                  @theme-color-opacity
                );
              }
            }
            .title {
              font-size: 0.18rem;
            }
            h6 {
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 0 0.1rem;
              font-weight: 100;
              &.background-free {
                i {
                  background-color: #4db470;
                }
                b {
                  color: #4db470;
                }
              }
              &.background-used {
                i {
                  background-color: #00b4ff;
                }
                b {
                  color: #00b4ff;
                }
              }
              &.background-total {
                i {
                  background-color: #9266a9;
                }
                b {
                  color: #9266a9;
                }
              }
              i {
                display: block;
                width: 23px;
                height: 8px;
                margin: auto 0.05rem auto 0;
                border-radius: 5px;
              }
              b {
                padding: 0 5px 0 0;
                font-size: 0.15rem;
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
          background-color: rgb(21, 23, 28);
          line-height: 40px;
          border-color: rgb(38, 39, 47);
          border-radius: 0.1rem;
          color: rgb(154, 156, 174);
          @media screen and (max-width: 768px) {
            width: 100%;
          }
          &:hover,
          &:active,
          &:focus {
            border-color: @theme-color;
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
      border-radius: 0.1rem;
      border: 1px solid rgb(30, 32, 39);
      tr {
        background-color: transparent;
        th {
          word-break: break-word;
          padding: 0.1rem 0;
          background-color: @primary-color;
          border: 0;
          .cell {
            color: @text-color;
            word-break: break-word;
          }
        }
        td {
          padding: 0.16rem 0;
          background-color: @primary-color;
          color: rgb(181, 183, 200);
          border-color: rgb(38, 39, 47);
          i {
            margin-right: 5px;
            color: @text-color;
            font-size: 18px;
            @media screen and (max-width: 1260px) {
              font-size: 16px;
            }
          }
          .service-body {
            padding: 0 0.25rem 0.1rem;
            // color: #333;
            // border-top: rgb(220, 223, 230) 1px solid;
            // border-bottom: rgb(220, 223, 230) 1px solid;
            .tit {
              margin: 0.2rem 0 0;
              font-size: 16px;
              font-weight: 500;
              text-transform: capitalize;
              @media screen and (max-width: 1260px) {
                font-size: 14px;
              }
            }
            .desc {
              padding: 0 0 0.1rem;
              font-size: 14px;
              @media screen and (max-width: 1260px) {
                font-size: 12px;
              }
            }
            .list {
              padding: 0.1rem 0 0;
              .li-title {
                width: 100%;
                padding: 0 0 0.1rem;
                border-bottom: 1px solid #26272f;
              }
              ul {
                display: flex;
                align-items: stretch;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 0 auto 0.25rem;
                li {
                  width: 27%;
                  .flex-row {
                    .li-body {
                      width: 27%;
                      margin-right: 0.7rem;
                    }
                  }
                  .li-body {
                    position: relative;
                    padding: 0.15rem;
                    margin: 0.3rem 0;
                    background-color: #0d0e12;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
                    -webkit-backdrop-filter: blur(5px);
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.1rem;
                    animation: glow 1s ease-in-out infinite alternate;
                    @media screen and (max-width: 768px) {
                    }
                    p {
                      padding: 3px 0;
                      font-size: 14px;
                      line-height: 1.3;
                      text-align: center;
                      @media screen and (max-width: 1260px) {
                        font-size: 12px;
                      }
                      strong,
                      b {
                        margin-right: 5px;
                        font-size: 17px;
                        @media screen and (max-width: 1260px) {
                          font-size: 15px;
                        }
                      }
                      &.t {
                        text-transform: capitalize; // color: #808290;
                      }
                      &.t-capitalize {
                        text-transform: uppercase;
                      }
                      &:nth-child(2) {
                        strong {
                          color: #4db470;
                        }
                      }
                      &:nth-child(3) {
                        strong {
                          color: #488fc3;
                        }
                      }
                      &:nth-child(4) {
                        strong {
                          color: #9266a9;
                        }
                      }
                    }
                    &.li-gpu {
                      &::before {
                        position: absolute;
                        content: "";
                        right: 0.1rem;
                        top: 0.1rem;
                        width: 7px;
                        height: 7px;
                        background-color: orange;
                        border-radius: 7px;
                      }
                    }
                    &.li-status {
                      &::before {
                        background-color: #8bc34a;
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
          .badge {
            display: flex;
            align-items: center;
            img {
              width: 30px;
              height: 30px;
              margin-right: 5px;
              @media screen and (max-width: 1260px) {
                width: 25px;
                height: 25px;
              }
            }
          }
          &.el-table__expanded-cell {
            padding: 0.32rem 0.64rem;
            // border: 1px solid @white-color;
            &:hover {
              background-color: @primary-color !important;
            }
          }
        }
        // &.expanded,
        // &:hover {
        //   td {
        //     background-color: rgba(255, 255, 255, 0.85);
        //     color: #000;
        //     i {
        //       color: #000;
        //     }
        //   }
        // }
        &.expanded {
          border: 1px solid @white-color;
          border-collapse: collapse;
        }
      }
    }
    .el-table--border .el-table__inner-wrapper::after,
    .el-table--border::after,
    .el-table--border::before,
    .el-table__inner-wrapper::before {
      background-color: rgb(38, 39, 47);
      height: 0;
    }
    .el-pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .el-pagination__total {
        color: @white-color;
      }
      .btn-next,
      .btn-prev,
      .el-pager li {
        min-width: 32px;
        margin: 0 4px;
        background-color: transparent;
        color: @white-color;
        border: 1px solid #f4f4f5;
        border-radius: 5px;
        &:not(.disabled).active,
        &:not(.disabled):hover {
          background-color: @theme-color;
          border-color: @theme-color;
        }
        &:not(.disabled):hover {
        }
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
