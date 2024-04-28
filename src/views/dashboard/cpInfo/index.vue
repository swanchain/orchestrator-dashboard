<template>
  <section id="container">
    <div class="providers-overview">
      <div class="title">Basic Information</div>
      <el-row :gutter="16" class="border-row" v-loading="cpLoad">
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">Total Number Of Node</h6>
            <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(pagin.total)}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">Total CPU</h6>
            <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(ringGraphData.data.cpu_total)}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">Total GPU</h6>
            <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(ringGraphData.data.gpu_total)}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">Total Memory (GiB)</h6>
            <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(ringGraphData.data.memory_total)}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">Total Storage (GiB)</h6>
            <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(ringGraphData.data.storage_total)}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">average score</h6>
            <b class="flex-row font-bold color">{{ringGraphData.data.average_score_total || '-'}}</b>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <div class="grid-content">
            <h6 class="flex-row">total claimed amount (swan token)</h6>
            <b class="flex-row font-bold color">{{ringGraphData.data.claimed_amount_total || '-'}}</b>
          </div>
        </el-col>
      </el-row>

      <div class="tabs-container">
        <el-row :gutter="16" justify="space-between" class="erchart-body">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="erchart" v-loading="cpLoad">
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <h6 class="title-graph">Job completion in the last seven days</h6>
              <div class="flex-row">
                <div id="maychar-job" class="maychar"></div>
                <div class="right">
                  <h6 class="flex-row background-free">
                    <i></i>
                    <b>{{ringGraphData.data.total_success}}</b> Success
                  </h6>
                  <h6 class="flex-row background-used">
                    <i></i>
                    <b>{{ringGraphData.data.total_failed}}</b> Failed
                  </h6>
                  <h6 class="flex-row background-total">
                    <i></i>
                    <b>{{ringGraphData.data.total_submit}}</b> Total
                  </h6>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="erchart" v-loading="cpLoad">
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <div class="drain-time"></div>
              <h6 class="title-graph">Reward claims in the last seven days</h6>
              <div class="flex-row">
                <div id="maychar-reward" class="maychar"></div>
                <div class="right">
                  <h6 class="flex-row background-free">
                    <i></i>
                    <b>{{ringGraphData.data.claimed_count_total}}</b> Claimed Count
                  </h6>
                  <h6 class="flex-row background-used">
                    <i></i>
                    <b>{{ringGraphData.data.waitng_total}}</b> Waiting
                  </h6>
                  <h6 class="flex-row background-total">
                    <i></i>
                    <b>{{ringGraphData.data.claim_total}}</b> Total
                  </h6>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="title t-margin">Competition Score</div>
      <div class="tabs-container">
        <el-row :gutter="16" justify="space-between" class="erchart-body">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h6 class="subtitle">Job completion in the last seven days</h6>
            <el-row :gutter="16" v-loading="cpLoad">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content small-margin">
                  <h6 class="flex-row">ECP (Edge Computing Provider) Reward</h6>
                  <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(35)}}</b>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content small-margin">
                  <h6 class="flex-row">FCP (Fog Computing Provider) Reward</h6>
                  <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(23)}}</b>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content small-margin">
                  <h6 class="flex-row">MCP (Market Computing Provider) Reward</h6>
                  <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(14)}}</b>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h6 class="subtitle">Transaction Drive Program</h6>
            <el-row :gutter="16" v-loading="cpLoad">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content small-margin">
                  <h6 class="flex-row">Wallet Address Contribution Score</h6>
                  <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(67)}}</b>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content small-margin">
                  <h6 class="flex-row">Reward</h6>
                  <b class="flex-row font-bold color">{{system.$commonFun.replaceFormat(78)}}</b>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="providers-network">
      <div class="providers-cp">
        <!-- <div class="search-body flex">
          <el-input v-model="networkInput" placeholder="Search Providers" @chang="searchProvider" @input="searchProvider" />
          <el-button type="primary" :disabled="!networkInput ? true:false" round @click="searchProvider">Search</el-button>
          <el-button type="info" :disabled="!networkInput ? true:false" round @click="clearProvider">Clear</el-button>
        </div> -->
        <el-table :data="providersData" @expand-change="expandChange" :row-key="getRowKeys" :expand-row-keys="expands" style="width: 100%" empty-text="No Data" v-loading="providersTableLoad">
          <el-table-column type="expand" width="40">
            <template #default="props">
              <div class="service-body" v-if="props.row.computer_provider">
                <div v-for="n in props.row.computer_provider.machines" :key="n" class="list">
                  <div class="li-title">Machine ID: {{n.machine_id}}</div>
                  <div class="li-title">Multi Address: {{props.row.computer_provider.multi_address}}</div>
                  <div class="li-title">Last Update At: {{system.$commonFun.momentFun(props.row.computer_provider.updated_at)}}</div>
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
                  <div class="li-title">GPU Source
                    <span>(CUDA Version: {{n.specs.gpu.cuda_version}})</span>
                  </div>
                  <ul>
                    <li class="m-r" v-for="(child, gpuKeys, k) in n.specs" :key="k" v-show="gpuKeys === 'gpu'" style="width:100%;">
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
          <el-table-column prop="name" label="Name" min-width="120">
            <template #default="scope">
              <div class="badge">
                {{scope.row.name}}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="country" label="Country" /> -->
          <el-table-column prop="computer_provider.status" label="status" width="120" />
          <el-table-column prop="computer_provider.score" label="Score" width="120" />
          <el-table-column prop="gpu_list" label="GPU" min-width="140">
            <template #default="scope">
              <div class="badge">
                <div class="flex-row machines-style">
                  <span v-for="(gpu, g) in scope.row.gpu_list" :key="g">
                    {{gpu}}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="region" label="Region" min-width="100" />
          <el-table-column prop="uptime" label="Uptime">
            <template #default="scope">
              <div>
                {{unifyNumber(scope.row.uptime)}}%
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination hide-on-single-page :page-size="pagin.pageSize" :current-page="pagin.pageNo" :pager-count="5" :small="small" :background="background" layout="total, prev, pager, next" :total="pagin.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed, onActivated, watch, ref, reactive, getCurrentInstance } from 'vue'
import { useStore } from "vuex"
import { useRouter, useRoute } from 'vue-router'
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
    const gmtTime = new Date().toGMTString()
    const providersTableLoad = ref(false)
    const providersData = ref([])
    const pagin = reactive({
      pageSize: 10,
      pageNo: 1,
      total: 0,
      total_deployments: 0,
      active_applications: 0
    })
    const providerBody = reactive({
      data: {},
      ubiData: {},
      ubiTableData: {},
      totalData: {
        gas_used_today: '',
        total_addresses: '',
        total_blocks: '',
        total_gas_used: '',
        total_transactions: '',
        transactions_today: '',
        smart_contracts: '',
        new_smart_contracts_24h: ''
      },
      storageData: {},
      providerData: {},
      generalData: {}
    })
    const networkInput = ref('')
    const small = ref(false)
    const background = ref(false)
    const dataArr = ref([])
    const expands = ref([])
    const activeName = ref('CP')
    const cpLoad = ref(false)
    const ringGraphData = reactive({
      data: {}
    })

    function handleSizeChange (val) { }
    async function handleCurrentChange (currentPage) {
      pagin.pageNo = currentPage
      init()
    }
    async function init () {
      cpLoad.value = true
      providersTableLoad.value = true
      const page = pagin.pageNo > 0 ? pagin.pageNo - 1 : 0
      const params = {
        limit: pagin.pageSize,
        offset: page * pagin.pageSize,
        search_string: networkInput.value,
        // start_time: 1713470000,
        // end_time: 1714077711
      }
      // ?${system.$Qs.stringify(params)}
      // ?${new URLSearchParams(params).toString()}
      const providerRes = await system.$commonFun.sendRequest(`${process.env.VUE_APP_BASEAPI}cpdata/${metaAddress.value}`, 'get')
      const providerRes_test = {
        "data": {
          "list_providers_cnt": 4,
          "providers": [
            {
              "city": "Montreal",
              "computer_provider": {
                "allowed_nodes": null,
                "autobid": 1,
                "city": "Montreal",
                "country": null,
                "created_at": "1709866614",
                "deleted_at": null,
                "job_stats": {
                  "end_time": 1714092141,
                  "failed": 0,
                  "start_time": 1713487341,
                  "submit_failed": 0,
                  "total_submit": 0
                },
                "last_active_at": null,
                "lat": 45.5075,
                "lon": -73.5887,
                "machines": [
                  {
                    "created_at": "1709866624",
                    "machine_id": "315ae8c203ec4b3aa9bf7dd9bd96cec0",
                    "node_id": "04d5fce8dae0f493b35ae3e09aa9ba9fb9981ca8bb8c4c83d43eb23a6ff014e77ebab8e989265385571f2b34df7a6c1131a3aa713c9c9369027a73d57224e8b3c5",
                    "specs": {
                      "cpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      },
                      "gpu": {
                        "attached_gpus": 2,
                        "cuda_version": "12020",
                        "details": [
                          {
                            "bar1_memory_usage": {
                              "free": "249 MiB",
                              "total": "256 MiB",
                              "used": "6 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "8745 MiB",
                              "total": "10240 MiB",
                              "used": "1494 MiB"
                            },
                            "product_name": "NVIDIA 3080",
                            "status": "available"
                          },
                          {
                            "bar1_memory_usage": {
                              "free": "254 MiB",
                              "total": "256 MiB",
                              "used": "1 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "24257 MiB",
                              "total": "24576 MiB",
                              "used": "318 MiB"
                            },
                            "product_name": "NVIDIA 3090",
                            "status": "occupied"
                          }
                        ],
                        "driver_version": "535.113.01"
                      },
                      "memory": {
                        "free": "233.00 GiB",
                        "total": "251.00 GiB",
                        "used": "18.00 GiB"
                      },
                      "model": "amd64",
                      "storage": {
                        "free": "375.00 GiB",
                        "total": "410.00 GiB",
                        "used": "35.00 GiB"
                      },
                      "vcpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      }
                    },
                    "updated_at": "1712735774"
                  }
                ],
                "multi_address": "/ip4/38.140.46.60/tcp/8086",
                "name": "cp-2.44-2",
                "node_id": "04d5fce8dae0f493b35ae3e09aa9ba9fb9981ca8bb8c4c83d43eb23a6ff014e77ebab8e989265385571f2b34df7a6c1131a3aa713c9c9369027a73d57224e8b3c5",
                "online": false,
                "payment_stats": {
                  "claimed_amount": null,
                  "claimed_count": 0,
                  "end_time": 1714092141,
                  "start_time": 1713487341,
                  "waiting_claim_count": 0
                },
                "public_address": "0xFbc1d38a2127D81BFe3EA347bec7310a1cfa2373",
                "region": "Quebec-CA",
                "score": 100,
                "status": "Active",
                "updated_at": "1714061249"
              },
              "country": null,
              "name": "cp-2.44-2",
              "node_id": "04d5fce8dae0f493b35ae3e09aa9ba9fb9981ca8bb8c4c83d43eb23a6ff014e77ebab8e989265385571f2b34df7a6c1131a3aa713c9c9369027a73d57224e8b3c5",
              "region": "Quebec-CA",
              "uptime": 0.9725905402731051
            },
            {
              "city": "Montreal",
              "computer_provider": {
                "allowed_nodes": null,
                "autobid": 1,
                "city": "Montreal",
                "country": null,
                "created_at": "1712053635",
                "deleted_at": null,
                "job_stats": {
                  "end_time": 1714092141,
                  "failed": 0,
                  "start_time": 1713487341,
                  "submit_failed": 0,
                  "total_submit": 0
                },
                "last_active_at": null,
                "lat": 45.5075,
                "lon": -73.5887,
                "machines": [
                  {
                    "created_at": "1712053645",
                    "machine_id": "315ae8c203ec4b3aa9bf7dd9bd96cec0",
                    "node_id": "049d09a536d1ea95e7f863a8f93265913f4115ac4fb4d56cfcde051f3a78c7dc52cb1a6feb48e17690f0e98145e221c69262c0e3e7c3657caeaec7841a8d8104a3",
                    "specs": {
                      "cpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      },
                      "cpu_name": "",
                      "gpu": {
                        "attached_gpus": 2,
                        "cuda_version": "12020",
                        "details": [
                          {
                            "bar1_memory_usage": {
                              "free": "249 MiB",
                              "total": "256 MiB",
                              "used": "6 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "8745 MiB",
                              "total": "10240 MiB",
                              "used": "1494 MiB"
                            },
                            "product_name": "NVIDIA 3080",
                            "status": "available"
                          },
                          {
                            "bar1_memory_usage": {
                              "free": "254 MiB",
                              "total": "256 MiB",
                              "used": "1 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "24257 MiB",
                              "total": "24576 MiB",
                              "used": "318 MiB"
                            },
                            "product_name": "NVIDIA 3090",
                            "status": "occupied"
                          }
                        ],
                        "driver_version": "535.113.01"
                      },
                      "memory": {
                        "free": "233.00 GiB",
                        "total": "251.00 GiB",
                        "used": "18.00 GiB"
                      },
                      "model": "amd64",
                      "storage": {
                        "free": "375.00 GiB",
                        "total": "410.00 GiB",
                        "used": "35.00 GiB"
                      },
                      "vcpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      }
                    },
                    "updated_at": "1712132889"
                  }
                ],
                "multi_address": "/ip4/38.140.46.60/tcp/8086",
                "name": "cp-2.44-2",
                "node_id": "049d09a536d1ea95e7f863a8f93265913f4115ac4fb4d56cfcde051f3a78c7dc52cb1a6feb48e17690f0e98145e221c69262c0e3e7c3657caeaec7841a8d8104a3",
                "online": false,
                "payment_stats": {
                  "claimed_amount": null,
                  "claimed_count": 0,
                  "end_time": 1714092141,
                  "start_time": 1713487341,
                  "waiting_claim_count": 0
                },
                "public_address": "0xFbc1d38a2127D81BFe3EA347bec7310a1cfa2373",
                "region": "Quebec-CA",
                "score": 97,
                "status": "Active",
                "updated_at": "1714061249"
              },
              "country": null,
              "name": "cp-2.44-2",
              "node_id": "049d09a536d1ea95e7f863a8f93265913f4115ac4fb4d56cfcde051f3a78c7dc52cb1a6feb48e17690f0e98145e221c69262c0e3e7c3657caeaec7841a8d8104a3",
              "region": "Quebec-CA",
              "uptime": 0.9727884425094003
            },
            {
              "city": "Montreal",
              "computer_provider": {
                "allowed_nodes": null,
                "autobid": 1,
                "city": "Montreal",
                "country": null,
                "created_at": "1712137980",
                "deleted_at": null,
                "job_stats": {
                  "end_time": 1714092141,
                  "failed": 0,
                  "start_time": 1713487341,
                  "submit_failed": 0,
                  "total_submit": 0
                },
                "last_active_at": null,
                "lat": 45.5075,
                "lon": -73.5887,
                "machines": [
                  {
                    "created_at": "1712143229",
                    "machine_id": "70518000-5ab2-11eb-8000-18c04db4a530",
                    "node_id": "04495c245fff4f0eb99ac3ee3e979af9b974c35d99798e97397afecdc0a495abf146f874ea0164ea2b815e43da4f0daffcf5481cbaface642d161ed1e3f579a484",
                    "specs": {
                      "cpu": {
                        "free": "53",
                        "total": "96",
                        "used": "43"
                      },
                      "cpu_name": "AMD",
                      "gpu": {
                        "attached_gpus": 2,
                        "cuda_version": "12020",
                        "details": [
                          {
                            "bar1_memory_usage": {
                              "free": "249 MiB",
                              "total": "256 MiB",
                              "used": "6 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "8745 MiB",
                              "total": "10240 MiB",
                              "used": "1494 MiB"
                            },
                            "product_name": "NVIDIA 3080",
                            "status": ""
                          },
                          {
                            "bar1_memory_usage": {
                              "free": "254 MiB",
                              "total": "256 MiB",
                              "used": "1 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "24257 MiB",
                              "total": "24576 MiB",
                              "used": "318 MiB"
                            },
                            "product_name": "NVIDIA 3090",
                            "status": ""
                          }
                        ],
                        "driver_version": "535.113.01"
                      },
                      "memory": {
                        "free": "147 GiB",
                        "total": "251 GiB",
                        "used": "9 GiB"
                      },
                      "model": "",
                      "storage": {
                        "free": "128 GiB",
                        "total": "455 GiB",
                        "used": "304 GiB"
                      },
                      "vcpu": {
                        "free": "53",
                        "total": "96",
                        "used": "43"
                      }
                    },
                    "updated_at": "1712735051"
                  }
                ],
                "multi_address": "/ip4/38.140.46.60/tcp/8086",
                "name": "ubi-cp-24",
                "node_id": "04495c245fff4f0eb99ac3ee3e979af9b974c35d99798e97397afecdc0a495abf146f874ea0164ea2b815e43da4f0daffcf5481cbaface642d161ed1e3f579a484",
                "online": false,
                "payment_stats": {
                  "claimed_amount": null,
                  "claimed_count": 0,
                  "end_time": 1714092141,
                  "start_time": 1713487341,
                  "waiting_claim_count": 0
                },
                "public_address": "0xFbc1d38a2127D81BFe3EA347bec7310a1cfa2373",
                "region": "Quebec-CA",
                "score": 98,
                "status": "Active",
                "updated_at": "1714061249"
              },
              "country": null,
              "name": "ubi-cp-24",
              "node_id": "04495c245fff4f0eb99ac3ee3e979af9b974c35d99798e97397afecdc0a495abf146f874ea0164ea2b815e43da4f0daffcf5481cbaface642d161ed1e3f579a484",
              "region": "Quebec-CA",
              "uptime": 0.9726894913912527
            },
            {
              "city": "Montreal",
              "computer_provider": {
                "allowed_nodes": null,
                "autobid": 1,
                "city": "Montreal",
                "country": null,
                "created_at": "1712735800",
                "deleted_at": null,
                "job_stats": {
                  "end_time": 1714092141,
                  "failed": 12,
                  "start_time": 1713487341,
                  "submit_failed": 7,
                  "total_submit": 40
                },
                "last_active_at": "1713938072",
                "lat": 45.5075,
                "lon": -73.5887,
                "machines": [
                  {
                    "created_at": "1712735811",
                    "machine_id": "315ae8c203ec4b3aa9bf7dd9bd96cec0",
                    "node_id": "0478a886cb6e191a0531fb6f8a7da4c0fbf0ec220af6d49e622f7e2da514f0ea205ed77918796c66ae642f0996dbf0ecc4bb7f1dd949705d1306abd1c14b60fb8a",
                    "specs": {
                      "cpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      },
                      "cpu_name": "",
                      "gpu": {
                        "attached_gpus": 2,
                        "cuda_version": "12020",
                        "details": [
                          {
                            "bar1_memory_usage": {
                              "free": "254 MiB",
                              "total": "256 MiB",
                              "used": "1 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "10007 MiB",
                              "total": "10240 MiB",
                              "used": "232 MiB"
                            },
                            "product_name": "NVIDIA 3080",
                            "status": "occupied"
                          },
                          {
                            "bar1_memory_usage": {
                              "free": "254 MiB",
                              "total": "256 MiB",
                              "used": "1 MiB"
                            },
                            "fb_memory_usage": {
                              "free": "24257 MiB",
                              "total": "24576 MiB",
                              "used": "318 MiB"
                            },
                            "product_name": "NVIDIA 3090",
                            "status": "available"
                          }
                        ],
                        "driver_version": "535.113.01"
                      },
                      "memory": {
                        "free": "237.00 GiB",
                        "total": "251.00 GiB",
                        "used": "14.00 GiB"
                      },
                      "storage": {
                        "free": "365.00 GiB",
                        "total": "410.00 GiB",
                        "used": "45.00 GiB"
                      },
                      "vcpu": {
                        "free": "79",
                        "total": "96",
                        "used": "17"
                      }
                    },
                    "updated_at": "1714092133"
                  }
                ],
                "multi_address": "/ip4/38.140.46.60/tcp/8086",
                "name": "cp-2.44-2",
                "node_id": "0478a886cb6e191a0531fb6f8a7da4c0fbf0ec220af6d49e622f7e2da514f0ea205ed77918796c66ae642f0996dbf0ecc4bb7f1dd949705d1306abd1c14b60fb8a",
                "online": true,
                "payment_stats": {
                  "claimed_amount": "246.89306",
                  "claimed_count": 19,
                  "end_time": 1714092141,
                  "start_time": 1713487341,
                  "waiting_claim_count": 7
                },
                "public_address": "0xFbc1d38a2127D81BFe3EA347bec7310a1cfa2373",
                "region": "Quebec-CA",
                "score": 100,
                "status": "Active",
                "updated_at": "1714080093"
              },
              "country": null,
              "name": "cp-2.44-2",
              "node_id": "0478a886cb6e191a0531fb6f8a7da4c0fbf0ec220af6d49e622f7e2da514f0ea205ed77918796c66ae642f0996dbf0ecc4bb7f1dd949705d1306abd1c14b60fb8a",
              "region": "Quebec-CA",
              "uptime": 0.9728793427694744
            }
          ]
        },
        "message": "cp data api returns successfully",
        "status": "success"
      }
      if (providerRes && providerRes.status === 'success') {
        pagin.total = providerRes.data.list_providers_cnt || 0
        providersData.value = await getList(providerRes.data.providers)
        ringGraphData.data = await resolveNodeTree(providerRes)
        changetype()
      } else {
        providersData.value = []
        cpLoad.value = false
        if (providerRes.status) system.$commonFun.messageTip(providerRes.status, providerRes.message)
      }
      providersTableLoad.value = false
    }
    function resolveNodeTree (nodeData) {
      const res = {
        cpu_total: 0,
        gpu_total: 0,
        memory_total: 0,
        storage_total: 0,
        average_score_total: 0, //（所有score 加起来/node总数）
        failed_total: 0, //(job_stats.failed)
        submit_failed_total: 0, //(job_stats.submit_failed)
        total_failed: 0, //(job_stats.total_submit + job_stats.failed)
        total_success: 0, //(job_stats.total_submit - job_stats.failed)
        total_submit: 0, //(job_stats.total_submit + job_stats.submit_failed)
        claimed_count_total: 0, //(payment_stats.claimed_count )
        claimed_amount_total: 0, //(payment_stats.claimed_amount)
        waitng_total: 0, //(payment_stats.waiting_claim_count)
        claim_total: 0 //(payment_stats.claimed_count + payment_stats.waiting_claim_count)
      }
      let data = []
      let list_providers_cnt = 0
      if (nodeData && nodeData.data && nodeData.data.list_providers_cnt > 0) {
        list_providers_cnt = Number(nodeData.data.list_providers_cnt)
        data = nodeData.data.providers || []
      } else {
        return res
      }
      let memoryUnit = ''
      let storageUnit = ''
      data.forEach((item) => {
        if (!item.computer_provider) {
          return
        }
        res.average_score_total += Number(item.computer_provider.score || 0)
        // job_stats
        const job_stats = item.computer_provider.job_stats || {}
        res.failed_total += Number(job_stats.failed || 0)
        res.submit_failed_total += Number(job_stats.submit_failed || 0)
        res.total_failed += Number(job_stats.submit_failed || 0) + Number(job_stats.failed || 0)
        res.total_success += Number(job_stats.total_submit || 0) - Number(job_stats.failed || 0)
        res.total_submit += Number(job_stats.total_submit || 0) + Number(job_stats.submit_failed || 0)
        // payment_stats
        const payment_stats = item.computer_provider.payment_stats || {}
        res.claimed_count_total += Number(payment_stats.claimed_count || 0)
        res.claimed_amount_total += Number(payment_stats.claimed_amount || 0)
        res.waitng_total += Number(payment_stats.waiting_claim_count || 0)
        res.claim_total +=
          Number(payment_stats.claimed_count || 0) + Number(payment_stats.waiting_claim_count || 0)
        // machines
        const machines = item.computer_provider.machines || []
        machines.forEach((machine) => {
          if (!machine.specs) {
            return
          }
          // cpu
          res.cpu_total += machine.specs.cpu ? Number(machine.specs.cpu.total || 0) : 0
          // gpu
          res.gpu_total += machine.specs.gpu ? Number(machine.specs.gpu.attached_gpus || 0) : 0
          // memory
          const memoryList =
            machine.specs.memory && machine.specs.memory.total
              ? machine.specs.memory.total.split(' ')
              : []
          memoryUnit = memoryList[1] ? ` ${memoryList[1]}` : memoryUnit
          res.memory_total += Number(memoryList[0] || 0)
          // storage
          const storageList =
            machine.specs.storage && machine.specs.storage.total
              ? machine.specs.storage.total.split(' ')
              : []
          storageUnit = storageList[1] ? ` ${storageList[1]}` : storageUnit
          res.storage_total += Number(storageList[0] || 0)
        })
      })
      // add memory unit
      //res.memory_total += memoryUnit ? memoryUnit : 0
      // add storage unit
      //res.storage_total += storageUnit ? storageUnit : 0
      res.average_score_total = Number((res.average_score_total / list_providers_cnt).toFixed(2))
      return res
    }
    async function getGraphData (list) {
      let l = list || []
      l.forEach((element) => {
        element.gpu_list = []
        try {
          if (element.computer_provider.machines && element.computer_provider.machines.length > 0) {
            element.computer_provider.machines.forEach((machines) => {
              if (machines.specs.gpu.details && machines.specs.gpu.details.length > 0) {
                machines.specs.gpu.details.forEach((gpu) => {
                  if (element.gpu_list.indexOf(gpu.product_name) < 0) element.gpu_list.push(gpu.product_name)
                })
              }
            })
          }
        } catch{ }
      })
      return l
    }
    async function getList (list) {
      let l = list || []
      l.forEach((element) => {
        element.gpu_list = []
        try {
          if (element.computer_provider.machines && element.computer_provider.machines.length > 0) {
            element.computer_provider.machines.forEach((machines) => {
              if (machines.specs.gpu.details && machines.specs.gpu.details.length > 0) {
                machines.specs.gpu.details.forEach((gpu) => {
                  if (element.gpu_list.indexOf(gpu.product_name) < 0) element.gpu_list.push(gpu.product_name)
                })
              }
            })
          }
        } catch{ }
      })
      return l
    }
    const searchProvider = system.$commonFun.debounce(async function () {
      pagin.pageSize = 10
      pagin.pageNo = 1
      init()
    }, 700)
    function clearProvider () {
      networkInput.value = ''
      pagin.pageSize = 10
      pagin.pageNo = 1
      init()
    }
    function expandChange (row, expandedRows) {
      // console.log(row, expandedRows)
      if (expandedRows.length) {
        expands.value = [];
        if (row) expands.value.push(row.node_id);
      } else expands.value = [];
    }
    let getRowKeys = (row) => {
      return row.node_id;
    }
    function reset (type) {
      pagin.total = 0
      pagin.total_deployments = 0
      pagin.active_applications = 0
      pagin.pageSize = 10
      pagin.pageNo = 1
      providersData.value = []
      providerBody.ubiTableData = []
      providersTableLoad.value = false
      networkInput.value = ''
      if (type) init()
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
      const machart_reward = echarts.init(document.getElementById("maychar-reward"));
      const machart_job = echarts.init(document.getElementById("maychar-job"));
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
      option2.series[0].data = [
        { value: ringGraphData.data.claimed_count_total, name: ringGraphData.data.claimed_count_total },
        { value: ringGraphData.data.waitng_total, name: ringGraphData.data.waitng_total },
      ]
      option3.series[0].data = [
        { value: ringGraphData.data.total_failed, name: ringGraphData.data.total_failed },
        { value: ringGraphData.data.total_success, name: ringGraphData.data.total_success },
      ]
      machart_reward.setOption(option2);
      machart_job.setOption(option3);
      window.addEventListener("resize", function () {
        machart_reward.resize();
        machart_job.resize();
      })
      cpLoad.value = false
    }
    onActivated(async () => {
      reset('init')
    })
    return {
      system,
      route,
      metaAddress,
      gmtTime,
      providersTableLoad,
      providersData,
      networkInput,
      pagin,
      small,
      background,
      providerBody,
      accessToken, expands, activeName, cpLoad, ringGraphData,
      handleSizeChange, handleCurrentChange, searchProvider, clearProvider, expandChange, unifyNumber, getRowKeys
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
    font-size: 14px;
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
  h1 {
    margin: 0 0 0.2rem;
    font-size: 0.35rem;
    font-weight: 600;
  }
  .color {
    color: #3c85ff;
  }
  :deep(.providers-overview),
  :deep(.providers-network) {
    padding: 0.4rem 0 0;
    .title {
      margin: 0;
      font-size: 0.24rem;
      font-weight: 600;
      &.top {
        margin: 0.15rem 0 0;
        font-size: 0.18rem;
        font-weight: 600;
        text-transform: capitalize;
        // border-bottom: 2px solid rgba(255, 255, 255, 0.3);
      }
      &.t-margin {
        margin: 0.64rem 0 0;
      }
    }
    .tabs-container {
      margin: 0;
      &.m {
        margin: 0.3rem 0;
      }
      .el-tabs {
        .el-tabs__header {
          margin: 0 0 0.2rem;
          .el-tabs__nav {
            display: flex;
            align-items: stretch;
            width: 100%;
            border-top: 1px solid #868688;
            border-bottom-left-radius: 0.15rem;
            border-bottom-right-radius: 0.15rem;
            overflow: hidden;
            .el-tabs__item {
              width: 50%;
              height: auto;
              padding: 0.2rem 0;
              background-color: #26272a;
              font-size: 0.18rem;
              font-weight: 600;
              color: #fff;
              text-align: center;
              line-height: 1;
              &.is-active {
                background-color: #447dff;
              }
            }
          }
        }
        .el-tabs__nav-wrap::after,
        .el-tabs__active-bar {
          display: none;
        }
      }
    }
    .el-row {
      .el-col {
        &.flex-row {
          display: flex;
        }
        .border-row {
          position: relative;
          height: calc(100% - 0.3rem);
          padding: 0.15rem;
          margin: 0.3rem 0 0;
          border-radius: 0.15rem;
          overflow: hidden;
          text-align: center;
          background: #26272a;
          border: 1px solid #3a67cf;
          .el-col {
            .grid-list {
              h6 {
                padding: 0 6px 0 0;
                font-size: 12px;
                text-transform: capitalize;
                text-align: left;
                @media screen and (min-width: 1800px) {
                  font-size: 14px;
                }
                @media screen and (max-width: 768px) {
                  font-size: 12px;
                }
              }
              b {
                align-items: baseline;
                margin: 6px 0;
                font-size: 14px;
                line-height: 1;
                @media screen and (min-width: 1800px) {
                  font-size: 16px;
                }
                @media screen and (max-width: 768px) {
                  font-size: 14px;
                }
                .span {
                  margin: 0 0 0 10px;
                  font-size: 0.16rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 0.18rem;
                  }
                  @media screen and (max-width: 768px) {
                    font-size: 15px;
                  }
                  &.up {
                    color: #38a169;
                  }
                  &.down {
                    color: #e53e3e;
                  }
                  small {
                    margin: 0;
                    font-family: "Montserrat-Regular";
                    font-weight: normal;
                    color: #a0a0a0;
                    font-size: 0.14rem;
                    @media screen and (min-width: 1800px) {
                      font-size: 0.16rem;
                    }
                    @media screen and (max-width: 768px) {
                      font-size: 13px;
                    }
                  }
                }
                small {
                  margin: 0 0 0 4px;
                  font-size: 0.16rem;
                  @media screen and (min-width: 1800px) {
                    font-size: 0.18rem;
                  }
                  @media screen and (max-width: 768px) {
                    font-size: 15px;
                  }
                }
              }
            }
          }
        }
        .subtitle {
          margin: 0.1rem 0;
          text-align: left;
          font-size: 0.14rem;
          font-weight: 100;
          @media screen and (max-width: 768px) {
            font-size: 12px;
          }
        }
        .grid-content {
          padding: 0.15rem;
          margin: 0.3rem 0 0;
          background: #26272a;
          // backdrop-filter: blur(5px);
          border: 1px solid #3a67cf;
          border-radius: 0.14rem;
          // animation: glow 1s ease-in-out infinite alternate;
          overflow: hidden;
          &.small-margin {
            margin: 0;
          }
          h6 {
            min-height: 34px;
            font-size: 12px;
            line-height: 17px;
            text-transform: capitalize;
            @media screen and (min-width: 1800px) {
              min-height: 38px;
              font-size: 14px;
              line-height: 19px;
            }
            .el-tooltip__trigger {
              margin: 0 0 0 4px;
            }
            .t {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: normal;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            small {
              margin: 0 0 0 5px;
              font-family: "Montserrat-Regular";
              font-weight: normal;
              color: #a0a0a0;
              font-size: 0.13rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.15rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 12px;
              }
            }
          }
          b {
            align-items: baseline;
            margin: 6px 0;
            font-size: 0.195rem;
            line-height: 1;
            @media screen and (min-width: 1800px) {
              font-size: 0.21rem;
            }
            @media screen and (max-width: 1440px) {
              font-size: 0.19rem;
            }
            @media screen and (max-width: 768px) {
              font-size: 13px;
            }
            .span {
              margin: 0 0 0 10px;
              font-size: 0.16rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.18rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
              &.up {
                color: #38a169;
              }
              &.down {
                color: #e53e3e;
              }
              small {
                margin: 0;
                font-family: "Montserrat-Regular";
                font-weight: normal;
                color: #a0a0a0;
                font-size: 0.14rem;
                @media screen and (min-width: 1800px) {
                  font-size: 0.16rem;
                }
                @media screen and (max-width: 768px) {
                  font-size: 13px;
                }
              }
            }
            small {
              margin: 0 0 0 4px;
              font-size: 0.16rem;
              @media screen and (min-width: 1800px) {
                font-size: 0.18rem;
              }
              @media screen and (max-width: 768px) {
                font-size: 15px;
              }
            }
          }
        }
        .chart {
          width: 100%;
          margin: 0.45rem auto 0;
          height: 500px;
          @media screen and (max-width: 540px) {
            height: 400px;
          }
        }
      }
      &.erchart-body {
        margin: 0;
        .el-col {
          margin: 0.1rem 0;
          .erchart {
            position: relative;
            height: calc(100% - 0.6rem);
            padding: 0.15rem;
            margin: 0.3rem 0 0;
            border-radius: 0.15rem;
            // border: 2px solid @theme-color-opacity1;
            overflow: hidden;
            text-align: center;
            // box-shadow: 0 0 15px #447dff;

            background: #26272a;
            // backdrop-filter: blur(5px);
            border: 1px solid #3a67cf;
            // border: 2px solid red;
            // animation: glowing 2s linear infinite;

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
              margin: 0.1rem 0 0;
              font-size: 0.14rem;
              font-weight: 100;
              &.title-graph {
                min-height: 0.36rem;
                line-height: 0.18rem;
                @media screen and (max-width: 768px) {
                  min-height: 0.48rem;
                  line-height: 0.24rem;
                }
              }
              @media screen and (max-width: 768px) {
                font-size: 12px;
              }
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
                @media screen and (max-width: 768px) {
                  margin: auto 6px auto 0;
                }
              }
              b {
                padding: 0 5px 0 0;
                font-size: 0.15rem;
                font-weight: normal;
                @media screen and (max-width: 768px) {
                  font-size: 13px;
                }
              }
            }
            .maychar {
              width: 50%;
              height: 200px;
              @media screen and (min-width: 2100px) {
                height: 260px;
              }
              @media screen and (min-width: 1800px) {
                height: 230px;
              }
              @media screen and (max-width: 768px) {
                width: 45%;
                height: 170px;
              }
              @media screen and (max-width: 599px) {
                max-width: 250px;
                height: 130px;
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
        &.zk-input {
          width: 30%;
        }
        .el-input__wrapper {
          background-color: rgb(21, 23, 28);
          border: 1px solid rgb(38, 39, 47);
          border-radius: 0.1rem;
          box-shadow: none;
          .el-input__inner {
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #d1d1d1;
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
      }
      .el-button {
        font-family: inherit;
        &.el-button--primary {
          background-color: #7405ff;
          border-color: #7405ff;
        }
        &:hover,
        &.is-disabled {
          opacity: 0.9;
        }
      }
    }
    .el-table {
      margin: 0.24rem auto 0.4rem;
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
            @media screen and (max-width: 540px) {
              font-size: 12px;
              line-height: 1.1;
            }
          }
        }
        td {
          padding: 0.16rem 0;
          background-color: @primary-color;
          color: rgb(181, 183, 200);
          border-color: rgb(38, 39, 47);
          @media screen and (max-width: 540px) {
            font-size: 12px;
            line-height: 1.1;
          }
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
                span {
                  font-size: 12px;
                }
              }
              ul {
                display: flex;
                align-items: stretch;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 0 auto 0.25rem;
                @media screen and (max-width: 768px) {
                  justify-content: flex-start;
                }
                li {
                  width: 27%;
                  margin-right: 6%;
                  @media screen and (max-width: 768px) {
                    width: auto;
                    margin-right: 0.5rem;
                  }
                  &.m-r {
                    margin-right: 0;
                  }
                  .flex-row {
                    flex-wrap: wrap;
                    .li-body {
                      width: 27%;
                      margin-right: 6%;
                      @media screen and (max-width: 768px) {
                        width: auto;
                        margin-right: 0.5rem;
                      }
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
                      padding: 0.15rem 0.3rem;
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
                        @media screen and (max-width: 540px) {
                          font-size: 13px;
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
          .copy-style {
            cursor: pointer;
            svg {
              margin: 0 0 0 0.05rem;
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
            .machines-style {
              flex-wrap: wrap;
              span {
                padding: 3px 10px;
                margin: 3px 5px 3px 0;
                background-color: @theme-color;
                font-size: 12px;
                border-radius: 45px;
                word-break: break-word;
                line-height: 1;
                color: @white-color;
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
