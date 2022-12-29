<template>
    <div>
        <div>
            <button @click="initWords">修改1</button>
            <button @click="initWords2">修改2</button>

            <wordcloud ref="wordcloud" chartId="wordClound" height="392px" width="858px">
            </wordcloud>
            <button @click="initWords3">修改a</button>
            <button @click="initWords4">修改b</button>
            <axis ref="axis" chartId="axis" height="392px" width="858px"></axis>

        </div>
    </div>
</template>

<script>
import wordcloud from "@/components/myComponent/echarts/wordcloud.vue";
import axis from "@/components/myComponent/echarts/axis.vue";
export default {
    name: 'TtprojectVideoAnalysis',
    components: {
        wordcloud,
        axis
    },
    data() {
        return {
        };
    },

    mounted() {
        this.initWords();
        this.initWords3()
    },

    methods: {
        /**
     * 词云初始化
     */
        initWords() {
            let chartData = [
                {
                    name: "aaaaaaa",
                    value: 122
                },
                {
                    name: "bbbbbb",
                    value: 123
                },
                {
                    name: "cccccc",
                    value: 124
                },
                {
                    name: "ddddddd",
                    value: 45
                },
                {
                    name: "eeeeee",
                    value: 97
                },
                {
                    name: "ffffff",
                    value: 98
                },
                {
                    name: "gggggg",
                    value: 67
                },
            ];
            this.$refs.wordcloud.getIint(chartData)
        },
        initWords2() {
            let chartData = [
                {
                    name: "drhyhthtrh",
                    value: 100
                },
                {
                    name: "trthrthrthhings",
                    value: 120
                },
                {
                    name: "rhrthrh",
                    value: 90
                },
                {
                    name: "rthjrthrth",
                    value: 80
                },
                {
                    name: "fifgnmvgnfsh",
                    value: 85
                },
                {
                    name: "erterytey",
                    value: 50
                },
                {
                    name: "kmu,jh,",
                    value: 40
                },
                {
                    name: "thigfhjfghngs",
                    value: 91
                },
                {
                    name: "erhrthrt",
                    value: 70
                },
                {
                    name: "safsfsdg",
                    value: 66
                },
                {
                    name: "shgrthjtyj",
                    value: 87
                },
                {
                    name: "things",
                    value: 38
                },
            ];
            this.$refs.wordcloud.getIint(chartData)
        },
        initWords3() {
            let chartData = [
                {
                    data: [1000,2200,3080,4500,2000,2500,3500],
                    type: 'line',
                    name: 'Email',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#5087EC', //改变折线点的颜色
                            lineStyle: {
                                color: '#5087EC', //改变折线颜色
                            },
                        },
                    },
                },
                {
                    data: [1200,2400,3600,4700,3000,2100,5000],
                    type: 'line',
                    name: 'Email2',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#5BA75F', //改变折线点的颜色
                            lineStyle: {
                                color: '#5BA75F', //改变折线颜色
                            },
                        },
                    },
                },
            ]
            let xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            let legend=['Email','Email2']
            this.$refs.axis.getIint(chartData, xAxis,legend)
        },
        initWords4() {
            let chartData = [
                {
                    data: [1000,2500,2000,3000,5000,2000,2500],
                    name: 'Email',
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#DB8067', //改变折线点的颜色
                            lineStyle: {
                                color: '#DB8067', //改变折线颜色
                            },
                        },
                    },
                },
            ]
            let xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            let legend=['Email']
            this.$refs.axis.getIint(chartData, xAxis,legend)
        },
    },
};
</script>

<style scoped>

</style>