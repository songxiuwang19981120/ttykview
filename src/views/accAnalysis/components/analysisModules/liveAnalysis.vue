<template>
    <div>
        <div>
            <div class="liveData">
                <div>
                    <div class="liveData-title">
                        <img src="../../../../assets/flag.png" alt="">
                        <span>直播数据汇总</span>
                    </div>
                    <div class="liveData-data">
                        <div class="liveData-data-type">
                            <div>45</div>
                            <div>直播场次</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>240H</div>
                            <div>累计直播时长</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>4h</div>
                            <div>场均直播时长</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>1545</div>
                            <div>累计观看人数</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>1000</div>
                            <div>在线人数峰值</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>1451</div>
                            <div>累计涨粉数量粉丝占比12%</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>500</div>
                            <div>场均涨粉数量</div>
                        </div>
                        <div class="liveData-data-type">
                            <div>80%</div>
                            <div>带货口碑</div>
                        </div>
                    </div>
                </div>
                <div style="margin-top:70px">
                    <div class="liveData-title">
                        <img src="../../../../assets/flag.png" alt="">
                        <span>直播动态</span>
                    </div>
                    <div class="liveData-data">
                        <div class="liveData-dynamic">
                            <happy-scroll class="scroll">
                            <div class="liveData-dynamic-cont">
                                <img src="http://192.168.4.30/uploads/file/7169873475791569925.png" alt="">
                                <div class="liveData-dynamic-cont-time">
                                    <div>大家好，想要什么年货进来聊聊</div>
                                    <div><i class="el-icon-time"></i><span>11-12 09:00--11-12 07:00</span></div>
                                </div>
                            </div>
                            <div class="liveData-dynamic-cont">
                                <img src="http://192.168.4.30/uploads/file/7169873475791569925.png" alt="">
                                <div class="liveData-dynamic-cont-time">
                                    <div>大家好，想要什么年货进来聊聊</div>
                                    <div><i class="el-icon-time"></i><span>11-12 09:00--11-12 07:00</span></div>
                                </div>
                            </div>
                            <div class="liveData-dynamic-cont">
                                <img src="http://192.168.4.30/uploads/file/7169873475791569925.png" alt="">
                                <div class="liveData-dynamic-cont-time">
                                    <div>大家好，想要什么年货进来聊聊</div>
                                    <div><i class="el-icon-time"></i><span>11-12 09:00--11-12 07:00</span></div>
                                </div>
                            </div>
                        </happy-scroll>
                        </div>
                        <div class="liveData-dynamic">
                        </div>
                    </div>
                </div>
            </div>
            <div></div>
        </div>
        <div>
            <button @click="initWords">修改1</button>
            <button @click="initWords2">修改2</button>

            <wordcloud ref="wordcloud" chartId="wordClound" height="392px" width="858px">
            </wordcloud>
            <button @click="initWords3">修改a</button>
            <button @click="initWords4">修改b</button>
            <axis ref="axis" chartId="axis" height="392px" width="858px"></axis>

            <button @click="initWords5">修改a1</button>
            <button @click="initWords6">修改b2</button>
            <pie ref="pie" chartId="pie" height="392px" width="858px"></pie>
        </div>
    </div>
</template>

<script>
import wordcloud from "@/components/myComponent/echarts/wordcloud.vue";
import axis from "@/components/myComponent/echarts/axis.vue";
import pie from "@/components/myComponent/echarts/pie.vue";

export default {
    name: 'TtprojectVideoAnalysis',
    components: {
        wordcloud,
        axis,
        pie,
    },
    data() {
        return {
        };
    },

    mounted() {
        this.initWords();
        this.initWords3()
        this.initWords5()
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
                    data: [1000, 2200, 3080, 4500, 2000, 2500, 3500],
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
                    data: [1200, 2400, 3600, 4700, 3000, 2100, 5000],
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
            let legend = ['Email', 'Email2']
            this.$refs.axis.getIint(chartData, xAxis, legend)
        },
        initWords4() {
            let chartData = [
                {
                    data: [1000, 2500, 2000, 3000, 5000, 2000, 2500],
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
            let legend = ['Email']
            this.$refs.axis.getIint(chartData, xAxis, legend)
        },
        initWords5() {
            let chartData = [
                {
                    name: "女性",
                    value: 30
                },
                {
                    name: "男性",
                    value: 15
                },
                {
                    name: "未知",
                    value: 10
                },
            ];
            this.$refs.pie.getIint(chartData)
        },
        initWords6() {
            let chartData = [
                {
                    name: "女性",
                    value: 100
                },
                {
                    name: "男性",
                    value: 150
                },
                {
                    name: "未知",
                    value: 20
                },
            ];
            this.$refs.pie.getIint(chartData)
        },
    },
};
</script>

<style  lang="stylus" scoped>
.liveData{
    width: 100%;
    border-radius: 10px;
    border: 1px solid #BBBBBB;
    padding:50px 80px;
}
.liveData-title{
    display: flex;
    align-content: center;
    img{
        width: 24px;
        height:24px;
        margin-right: 5px;
    }
    span{
        font-size: 20px;
    }
}
.liveData-data{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.liveData-data-type{
    width: 25%;
    margin-top: 50px
    text-align: center;
    div:nth-of-type(1)   {
        font-size:20px;
        color: #101010;
        font-weight:bold;
        margin-bottom: 10px;
    }
    div:nth-of-type(2)   {
        font-size:14px;
        color: #101010;
    }

}
.liveData-dynamic{
    width: 50%;
    padding: 30px 50px 0 0;
}
.liveData-dynamic-date{
    width: 50%;
    padding: 30px 50px 0 0;
}
.liveData-dynamic-cont{
    display: flex;
    align-items: center;
    padding:10px 4px;
    img{
        width: 60px;
        height: 60px;
        border-radius: 10px;
    }
}
.liveData-dynamic-cont:hover{
    background-color: #EFEFEF;
}
.liveData-dynamic-cont-time{
    margin-left: 10px;
    div:nth-of-type(1)   {
        font-size:14px;
        color: #6C6C6C;
        padding:2px 0;
    }
    div:nth-of-type(2)   {
        font-size:14px;
        color: #6C6C6C;
        padding:2px 0;
        line-height: 20px;
        i{
            font-size:16px
        }
        span{
            padding-left: 5px;
        }
    }
}
.scroll{
    height: 240px;
}
</style>