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
            let myEcharts = undefined
            myEcharts = echarts.init(document.getElementById(this.chartId)).dispose();
            myEcharts = echarts.init(document.getElementById(this.chartId));
            const data = chartData.map((item) => {
                return {
                    name: item.name,
                    value: item.value,
                };
            });
            // echarts参数设置
            myEcharts.setOption({
                backgroundColor: '#fff', // canvas背景颜色
                tooltip: {
                    trigger: 'item'
                },
                series: [
                    {
                        type: 'wordCloud',
                        // left: '-5%', // X轴偏移量
                        // top: '20%', // Y轴偏移量
                        width: '100%', // canvas宽度大小
                        height: '95%', // canvas高度大小
                        sizeRange: [12, 50], //  词典字体大小范围配置
                        rotationRange: [-90, 90], // 词典字体旋转角度配置，默认不旋转
                        rotationStep: 45,
                        gridSize: 10, // 词典字体间距配置
                        layoutAnimation: true, // 为false词典过度会阻塞
                        textStyle: {
                            // 词典样式配置
                            color: function () {
                                // 颜色随机
                                let colors = ['#5E75FB', '#0CB5FF', '#7551EA', '#3BC171', '#8E9FFF', '#FFB800', '#7B61FF'];
                                return colors[Math.floor(Math.random() * 7)];
                            },
                        },
                        // 渲染词典数据
                        data,
                    },
                ],
            });
        },
    },
};
</script>