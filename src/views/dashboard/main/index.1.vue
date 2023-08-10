<template>
    <section id="container" v-loading="providersLoad">
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
                        <b>{{pagin.total}}</b>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
                    <div class='chart' id='chart'></div>
                </el-col>
            </el-row>
        </div>

        <div class="providers-network mt-border">
            <div class="title">Lagrange Network Providers</div>
            <el-input v-model="networkInput" placeholder="Search Providers" clearable />
            <el-table :data="providersData" style="width: 100%" empty-text="No Data">
                <el-table-column prop="name" label="Name" min-width="180" />
<!--                <el-table-column prop="country" label="Country" />-->
                <el-table-column prop="region" label="Region" />
                <el-table-column prop="uptime" label="Uptime">
                    <template #default="scope">
                        <div style="color: #ffffff;">
                            {{scope.row.uptime ? `${scope.row.uptime * 100}%`:'0%' }}
                        </div>
                    </template>
                </el-table-column>
<!--                <el-table-column prop="" label="5 minutes Interval Status" min-width="110">-->
<!--                    <template #default="scope">-->
<!--                        <div class="flex-row">-->
<!--                            <el-icon v-for="n in 5" :key="n">-->
<!--                                <CircleCheck />-->
<!--                            </el-icon>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </el-table-column>-->
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



                providerRes.data.providers = [
                    {
                        "city": 'cp2.city',
                        "country": 'cp2.country',
                        "name": 'cp2.name',
                        "node_id": 'cp2.node_id',
                        "region": 'cp2.region',
                        "uptime": 0
                    },
                    {
                        "city": 'cp2.city',
                        "country": 'cp2.country',
                        "name": 'cp2.name',
                        "node_id": 'cp2.node_id',
                        "region": 'cp2.region',
                        "uptime": 1
                    },
                    {
                        "city": 'cp2.city',
                        "country": 'cp2.country',
                        "name": 'cp2.name',
                        "node_id": 'cp2.node_id',
                        "region": 'cp2.region',
                        "uptime": 0.50
                    }
                ]
                providerRes.data.total_providers = 100





                pagin.total = providerRes.data.total_providers
                providersData.value = providerRes.data.providers
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
        async function getWorld (data) {
            const providerRes = await system.$commonFun.sendRequest(`/static/js/world.json`, 'get')
            let namemap = providerRes.namemap
            // let dataArr = providerRes.data.dataArr
            let dataArr = [{
                "name": "中国",
                "value": 1359821.465
            }]
            drawChart(namemap, dataArr)
        }
        function drawChart (name, data) {
            let chart = echarts.init(document.getElementById('chart'))
            window.addEventListener('resize', function () {
                chart.resize()
            })
            chart.setOption({
                grid: {
                    width: '100%',
                    height: '100%',
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    // containLabel: true
                },
                // 提示框组件
                tooltip: {
                    trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                    // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                    // 使用函数模板  传入的数据值 -> value: number | Array
                    formatter: function (val) {
                        if (val.data == null) return;
                        return val.data.name + ': ' + val.data.value
                    }
                },
                series: [
                    {
                        type: 'map', // 类型
                        // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                        name: 'world',
                        map: 'world', // 地图类型
                        // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                        roam: false,
                        // 图形上的文本标签
                        label: {
                            show: false // 是否显示对应地名
                        },
                        zoom: 1.2,
                        // 地图区域的多边形 图形样式
                        itemStyle: {
                            // areaColor: '#7B68EE', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            borderWidth: 0.5, // 描边线宽 为 0 时无描边
                            borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                            borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                        },
                        // 高亮状态下的多边形和标签样式
                        emphasis: {
                            label: {
                                show: true, // 是否显示标签
                                color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                            },
                            itemStyle: {
                                areaColor: '#FF6347' // 地图区域的颜色
                            }
                        },
                        // 自定义地区的名称映射
                        nameMap: name,
                        // 地图系列中的数据内容数组 数组项可以为单个数值
                        data: data
                    }
                ]
            })
        }
        onMounted(() => {
            getWorld()
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
      margin: 0 auto 0.24rem;
      font-size: 0.21rem;
      font-weight: 600;
    }
    .el-row {
      .el-col {
        .grid-content {
          padding: 0.15rem;
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
          padding: 0.1rem 0;
          background-color: #fff;
          .cell {
            color: #000;
          }
        }
        td {
          padding: 0.16rem 0;
          color: #fff;
          border-color: rgba(255, 255, 255, 0.4);
          i {
            margin-right: 5px;
            color: #c37af9;
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
  :deep(.el-loading-mask) {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
</style>
