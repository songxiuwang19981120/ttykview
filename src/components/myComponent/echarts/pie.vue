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
            wordChart: undefined,
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
        getIint(chartData) {
            // if (chartData.length == 0) return;
            // 获取到ref绑定为loginTimes的DOM节点，以canvas的形式展现在视图层
            this.wordChart = echarts.init(document.getElementById(this.chartId)).dispose();
            this.wordChart = echarts.init(document.getElementById(this.chartId));
            const data = chartData.map((item) => {
                return {
                    name: item.name,
                    value: item.value,
                };
            });
            // echarts参数设置
            this.wordChart.setOption({
                color: ['#FF411F', '#65FCA8 ', '#FCE97E'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                // backgroundColor: '#fff', // canvas背景颜色
                series: [
                    {
                        // name: '性别',
                        type: 'pie',
                        radius: ['30%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center',
                            formatter: '{d}%'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data,
                    },
                ],
            });
        },
    },
};
</script>