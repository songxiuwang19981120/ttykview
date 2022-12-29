<template>
    <div>
        <div :style="{ height: height, width: width }" class="wordClound" :id="chartId"></div>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-wordcloud';
export default {
    props: {
        chartId: {
            type: String,
            default: () => {
                return '';
            },
        },
        height: {
            type: String,
            default: () => {
                return '400px';
            },
        },
        width: {
            type: String,
            default: () => {
                return '400px';
            },
        },
    },
    data() {
        return {
        };
    },
    created() {
    },
    mounted() {
        this.getIint();
    },
    methods: {
        /**
     * 词云初始化
     */
        getIint(chartData, xAxis,legend) {
            // if (chartData.length==0) return;
            // 获取到ref绑定为loginTimes的DOM节点，以canvas的形式展现在视图层
            let myEcharts
            myEcharts = echarts.init(document.getElementById(this.chartId)).dispose();
            myEcharts = echarts.init(document.getElementById(this.chartId));
            myEcharts.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: '#ABD1FD',
                            opacity: 0.1,
                        },
                    },
                },
                legend: {
                    data: legend
                },
                // xAxis:xAxis,
                xAxis: {
                    type: 'category',
                    data: xAxis,
                },
                yAxis: {
                    type: 'value',
                },
                grid: {
                    containLabel: true,
                    left: '0%',
                    right: '0%',
                },
                color: ['#5a72e0'],
                series: chartData,
            });
            window.addEventListener('resize', function () {
                myEcharts.resize();
            });
        },
    },
};
</script>