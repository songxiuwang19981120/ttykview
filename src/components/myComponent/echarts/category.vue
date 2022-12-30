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
                return 'wordClound';
            },
        },
        // chartData: {
        //     type: Array,
        // },
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
        // this.getIint();
    },
    methods: {
        /**
     * 词云初始化
     */
        getIint(chartData,xAxis) {
            // if (chartData.length == 0) return;
            // 获取到ref绑定为loginTimes的DOM节点，以canvas的形式展现在视图层
            let myEcharts = undefined
            myEcharts = echarts.init(document.getElementById(this.chartId)).dispose();
            myEcharts = echarts.init(document.getElementById(this.chartId));
            // echarts参数设置
            myEcharts.setOption({
                // tooltip: {
                //     trigger: 'item'
                // },
                xAxis: {
                    type: 'category',
                    data: xAxis
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: chartData,
                        type: 'bar'
                    }
                ]
            });
        },
    },
};
</script>