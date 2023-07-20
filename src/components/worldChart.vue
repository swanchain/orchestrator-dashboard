<template>
    <div id="maychar" ref="refName"></div>
</template>
<script>
import * as echarts from "echarts";
export default {
    data () {
        return {
            chart: null,
        };
    },
    props: {
        chartData: {
            type: Object,
            required: true,
        },
    },
    watch: {
        chartData: {
            deep: true,
            handler (val) {
                this.drawChart(this.chartData.namemap, this.chartData.dataArr); // 动态监听父组件传递的值是否发生改变
            },
        },
    },
    mounted () {
        this.drawChart(this.chartData.namemap, this.chartData.dataArr);
    },
    methods: {
        drawChart (name, data) {
            // 基于准备好的dom，初始化echarts实例
            this.chart = echarts.init(document.getElementById("maychar"));
            // 监听屏幕变化自动缩放图表
            window.addEventListener("resize", () => {
                this.chart.resize();
            });
            // 绘制图表
            this.chart.setOption({
                grid: {
                    width: "100%",
                    height: "100%",
                    left: "0%",
                    right: "0%",
                    bottom: "0%",
                    containLabel: true,
                },
                // 提示框组件
                tooltip: {
                    trigger: "item", // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                    // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                    // 使用函数模板  传入的数据值 -> value: number | Array
                    formatter: function (val) {
                        if (val.data == null) return;
                        return val.data.name + ": " + val.data.value;
                    },
                },
                // 视觉映射组件
                visualMap: {
                    type: "piecewise", // 定义为分段型 visualMap
                    min: 0,
                    max: 100,
                    realtime: false,
                    calculable: true,
                    splitNumber: 5,
                    seriesIndex: [0],
                    itemWidth: 20, // 每个图元的宽度
                    pieces: [
                        // 自定义每一段的范围，以及每一段的文字 
                        { gte: 80, lte: 100, label: "80-100", color: "#6271fe" },
                        { gte: 60, lte: 80, label: "60-80", color: "#5f95ff" },
                        { gte: 40, lte: 60, label: "40-60", color: "#5db8fe" },
                        { gte: 20, lte: 40, label: "20-40", color: "#7bd4ff" },
                        { gte: 0, lte: 20, label: "0-20", color: "#62d6bf" },
                    ],
                    textStyle: {
                        color: "#737373",
                    },
                },
                series: [
                    {
                        type: "map", // 类型
                        // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                        name: "世界地图",
                        mapType: "world", // 地图类型
                        // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                        roam: false,
                        // 图形上的文本标签
                        label: {
                            show: false, // 是否显示对应地名
                        },
                        zoom: 1.2,
                        // 地图区域的多边形 图形样式
                        itemStyle: {
                            areaColor: "#7B68EE", // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                            borderWidth: 0, // 描边线宽 为 0 时无描边
                            // borderColor: "#000", // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                            borderType: "solid", // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                        },
                        // 高亮状态下的多边形和标签样式
                        emphasis: {
                            label: {
                                show: true, // 是否显示标签
                                color: "auto", // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                            },
                            itemStyle: {
                                // areaColor: "#FF6347", // 地图区域的颜色
                                areaColor: "none",
                                opacity: 0.5,
                            },
                        },
                        // 自定义地区的名称映射
                        nameMap: name,
                        // 地图系列中的数据内容数组 数组项可以为单个数值
                        data: data,
                    },
                ],
            });
        },
    },
};
</script>