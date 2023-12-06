<template>
  <section id="container">
    <div class="swan-logo">
      <img :src="swanLogo" @click="goLink('https://www.swanchain.io/')" />
      <el-button type="primary" v-if="getnetID === 8598668088 && accessToken !== ''" @click="getdataList">Show API-Key</el-button>
      <el-button type="primary" @click="loginMethod" v-else>Login</el-button>
    </div>
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
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <div class='chart' id='chart' v-loading="providersLoad" element-loading-background="rgba(0, 0, 0, 0)"></div>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="erchart-body">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="title">VCPU</div>
            <h6>Current VCPU usage</h6>
            <div id="maychar-vcpu" class="maychar"></div>
            <h6>
              <i class="background-free"></i> {{providerBody.data.total_vcpu - providerBody.data.total_used_vcpu}} vcpu - Free
            </h6>
            <h6>
              <i class="background-used"></i> {{providerBody.data.total_used_vcpu}} vcpu - Used
            </h6>
            <h6>
              <i class="background-total"></i> {{providerBody.data.total_vcpu}} - Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="title">Memory</div>
            <h6>Current Memory usage</h6>
            <div id="maychar-memory" class="maychar"></div>
            <h6>
              <i class="background-free"></i> {{sizeChange(providerBody.data.total_memory-providerBody.data.total_used_memory)}} - Free
            </h6>
            <h6>
              <i class="background-used"></i> {{sizeChange(providerBody.data.total_used_memory)}} - Used
            </h6>
            <h6>
              <i class="background-total"></i> {{sizeChange(providerBody.data.total_memory)}} - Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="title">Storage</div>
            <h6>Current Storage usage</h6>
            <div id="maychar-storage" class="maychar"></div>
            <h6>
              <i class="background-free"></i> {{sizeChange(providerBody.data.total_storage-providerBody.data.total_used_storage)}} - Free
            </h6>
            <h6>
              <i class="background-used"></i> {{sizeChange(providerBody.data.total_used_storage)}} - Used
            </h6>
            <h6>
              <i class="background-total"></i> {{sizeChange(providerBody.data.total_storage)}} - Total
            </h6>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <div class="erchart">
            <div class="title">GPU</div>
            <h6>Current GPU usage</h6>
            <div id="maychar-gpu" class="maychar"></div>
            <h6>
              <i class="background-free"></i> {{providerBody.data.total_gpu-providerBody.data.total_used_gpu}} - Free
            </h6>
            <h6>
              <i class="background-used"></i> {{providerBody.data.total_used_gpu}} - Used
            </h6>
            <h6>
              <i class="background-total"></i> {{providerBody.data.total_gpu}} - Total
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
              <!--              <div class="tit">city</div>-->
              <!--              <el-divider />-->
              <!--              <div class="desc">{{ props.row.computer_provider.city}}</div>-->
              <!--              <div class="tit">country</div>-->
              <!--              <el-divider />-->
              <!--              <div class="desc">{{ props.row.computer_provider.country}}</div>-->
              <div class="tit">Score</div>
              <el-divider/>
              <div class="list">
                <ul>
                  <li>
                    <div class="li-body">
                      <p>Provider Score</p>
                      <p>
                        <b>{{props.row.computer_provider.score}}</b>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="tit">Deployments</div>
              <el-divider />
              <div class="list">
                <ul>
                  <li>
                    <div class="li-body">
                      <p>Active Deployment</p>
                      <p>
                        <b>{{props.row.computer_provider.active_deployment}}</b>
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
                  <li v-for="(child, gpuKeys, k) in n.specs" :key="k" v-show="gpuKeys === 'gpu'" style="width: 100%;">
                    <div class="flex-warp">
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

    <el-dialog v-model="addVisible" title="Create A Key" :show-close="false" custom-class="add_body">
      <el-form ref="ruleFormRefDelete" status-icon v-loading="listLoad">
        <el-form-item prop="name" style="width:100%">
          <label class="label" for="name">
            Name
          </label>
          <div class="flex flex-row">
            <el-input v-model="ruleForm.name" placeholder=" " />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :disabled="!ruleForm.name" @click="createCom">
            Create
          </el-button>
          <el-button @click="addVisible = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="centerDialogVisible" title="API Keys" custom-class="apikey_body">
      <div class="cont">
        <el-button type="primary" class="add-button" @click="addVisible=true">New API Key</el-button>
        <el-table :data="toolData" v-loading="tokenShow" style="width: 100%" empty-text="No Data" class="table_cell">
          <el-table-column prop="key" label="KEY" width="530">
            <template #default="scope">
              <div class="flex-row" style="justify-content: center;">
                {{scope.row.token}}
                <i class="icon icon_copy" @click="system.$commonFun.copyContent(scope.row.key, 'Copied')"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="flex-row" hide-on-single-page :page-size="paginKey.pageSize" :current-page="paginKey.pageNo" :pager-count="5" layout="total, prev, pager, next" :total="paginKey.total" @size-change="handleSizeChange" @current-change="handleKeyChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">OK</el-button>
        </span>
      </template>
    </el-dialog>
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
    const accessToken = computed(() => (store.state.accessToken))
    const bodyWidth = ref(document.body.clientWidth < 992)
    const system = getCurrentInstance().appContext.config.globalProperties
    const route = useRoute()
    const router = useRouter()
    const swanLogo = require("@/assets/images/icons/logo.png")
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
    const getnetID = ref(NaN)
    const prevType = ref(true)
    const centerDialogVisible = ref(false)
    const tokenShow = ref(false)
    const toolData = ref([])
    const paginKey = reactive({
      pageSize: 12,
      pageNo: 1,
      total: 0,
      sort: 'updated'
    })
    const addVisible = ref(false)
    const listLoad = ref(false)
    const ruleForm = reactive({
      name: ''
    })

    async function handleKeyChange (currentPage) {
      // console.log('handleCurrentChange:', currentPage)
      paginKey.pageNo = currentPage
      getdataList()
    }
    async function createCom () {
      listLoad.value = true
      const params = {
        "name": ruleForm.name
      }
      const listRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_RPCAPI}v1/keys/`, 'post', params)
      if (listRes && String(listRes.code) === '0') paginKey.pageNo = 1
      ruleForm.name = ''
      getdataList()
      listLoad.value = false
      addVisible.value = false
    }
    async function deleteApiKey (id) {
      tokenShow.value = true
      const deleteRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_RPCAPI}v1/keys/${id}`, 'delete')
      getdataList()
      tokenShow.value = false
    }
    async function getdataList() {
      centerDialogVisible.value = true
      tokenShow.value = true
      toolData.value = []

      try {
        const keysRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}/api_token`, 'get')

        if (keysRes && keysRes.status === 'success') {
          // Assuming the 'data' field in response contains the required token
          if (keysRes.data){
            toolData.value = keysRes.data.token ? [keysRes.data.token] : []  // Assigning the token data to toolData
            // If there are multiple tokens, and they are in a list, replace the above line with:
            // toolData.value = keysRes.data.list || []
          } else {
            system.$commonFun.messageTip('error', 'No token found, please generate a new token')
          }

        } else if (keysRes.message) {
          system.$commonFun.messageTip('error', keysRes.message)
        }
      } catch (error) {
        system.$commonFun.messageTip('error', error.message || 'Error fetching data')
      }

      tokenShow.value = false
    }

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
    async function reverseList (list) {
      try {
        if (!list) return []
        list.forEach(element => {
          element.value = element.value.reverse()
        })
        return list
      } catch (err) {
        return []
      }
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
        { value: providerBody.data.total_memory - providerBody.data.total_used_memory, name: sizeChange(providerBody.data.total_memory - providerBody.data.total_used_memory) + ' ' },
        { value: providerBody.data.total_used_memory, name: sizeChange(providerBody.data.total_used_memory) },
      ]
      option4.series[0].data = [
        { value: providerBody.data.total_storage - providerBody.data.total_used_storage, name: sizeChange(providerBody.data.total_storage - providerBody.data.total_used_storage) + ' ' },
        { value: providerBody.data.total_used_storage, name: sizeChange(providerBody.data.total_used_storage) },
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
    function sizeChange (bytes) {
      if (bytes === 0) return '0 B'
      if (!bytes) return '-'
      var k = 1024 // or 1000
      var sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      var i = Math.floor(Math.log(bytes) / Math.log(k))

      if (Math.round((bytes / Math.pow(k, i))).toString().length > 3) i += 1
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
    function goLink (link) {
      window.open(link)
    }
    function fn () {
      document.addEventListener('visibilitychange', function () {
        prevType.value = !document.hidden
      })
      if (typeof window.ethereum === 'undefined') return
      ethereum.on('chainChanged', async function (accounts) {
        if (!prevType.value) return false
        getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
        system.$commonFun.signOutFun()
      })
    }
    onMounted(async () => {
      getnetID.value = await system.$commonFun.web3Init.eth.net.getId()
      reset('init')
      fn()
    })
    return {
      system,
      swanLogo,
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
      getnetID,
      accessToken,
      centerDialogVisible,
      toolData,
      tokenShow,
      paginKey,
      listLoad, addVisible, ruleForm,
      getdataList, createCom, deleteApiKey, handleKeyChange, handleSizeChange, handleCurrentChange, searchProvider, clearProvider, expandChange, unifyNumber, sizeChange, goLink,
      loginMethod
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
  .swan-logo {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 0 0.3rem;
    cursor: pointer;
    img {
      width: 200px;
    }
    :deep(.el-button) {
      background-color: #447dff;
      border-color: #447dff;
      font-family: inherit;
    }
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
                &.background-free {
                  background-color: #4db470;
                }
                &.background-used {
                  background-color: #00b4ff;
                }
                &.background-total {
                  background-color: #9266a9;
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
          background-color: #a2a2a2;
          border: 0;
          .cell {
            color: #fff;
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
            @media screen and (max-width: 1260px) {
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
                  position: relative;
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
                    @media screen and (max-width: 1260px) {
                      font-size: 12px;
                    }
                    strong,
                    b {
                      margin-right: 5px;
                      font-size: 15px;
                      @media screen and (max-width: 1260px) {
                        font-size: 13px;
                      }
                    }
                    &.t {
                      text-transform: capitalize;
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
      background-color: #447dff;
      border-color: #447dff;
      border-radius: 4px;
      font-size: 14px;
      @media screen and (max-width: 768px) {
        font-size: 13px;
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
          height: 0.5rem;
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
                background: #447dff;
                border-color: #447dff;
                font-family: inherit;
                font-size: inherit;
                border: 0;
                color: #fff;
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
                color: #fff;
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
                  color: #fff;
                }
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
