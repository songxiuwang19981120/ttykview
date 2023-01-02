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
                            <div class="liveData-scroll">
                                <div class="liveData-dynamic-cont">
                                    <img src="http://192.168.4.30/uploads/file/7169873475791569925.png" alt="">
                                    <div class="liveData-dynamic-cont-time">
                                        <div>大家好，想要什么年货进什么年货进什么年货进什进什么年货进什么年货进么年货进什么年货进来聊聊</div>
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
                            </div>
                        </div>
                        <div class="liveData-dynamic">
                            <el-calendar v-model="calendarData"></el-calendar>
                        </div>
                    </div>
                </div>
            </div>
            <div class="analysis">
                <div class="analysis-tit">
                    <div class="analysis-dynamic-cont">
                        <img src="http://192.168.4.30/uploads/file/7169873475791569925.png" alt="">
                        <div class="analysis-dynamic-cont-time">
                            <div>大家好，想要什么年货进什么年货进</div>
                            <div><i class="el-icon-time"></i><span>11-12 09:00--11-12 07:00</span></div>
                        </div>
                    </div>
                    <div class="analysis-tit-type">
                        <div>人气数据</div>
                        <div>直播趋势</div>
                        <div>观众画像</div>
                    </div>
                </div>
                <div class="popularity">
                    <div class="popularity-title">
                        <img src="../../../../assets/flag.png" alt="">
                        <span>人气数据</span>
                    </div>
                    <div class="popularity-data">
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">45</div>
                            <div class="popularity-data-name">直播场次</div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">240H</div>
                            <div class="popularity-data-name">累计直播时长</div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">4h</div>
                            <div class="popularity-data-name">场均直播时长</div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">1545</div>
                            <div class="popularity-data-name">在线人数峰值</div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">1000</div>
                            <div class="popularity-data-name">
                                <div>累计涨粉数量</div>
                                <div>粉丝占比12</div>
                            </div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">1451</div>
                            <div class="popularity-data-name">场均涨粉数量%</div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">500</div>
                            <div class="popularity-data-name">
                                <div>弹幕总数</div>
                                <div>分钟弹幕数</div>
                            </div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">80%</div>
                            <div class="popularity-data-name">
                                <div>弹幕人数</div>
                                <div>分钟弹幕数2.45</div>
                            </div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">500</div>
                            <div class="popularity-data-name">
                                <div>点赞总数</div>
                                <div>分钟弹幕数2.0W</div>
                            </div>
                        </div>
                        <div class="popularity-data-type">
                            <div class="popularity-data-num">80%</div>
                            <div class="popularity-data-name">
                                <div>互动率</div>
                                <div>首次发言观众占比45%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="trend">
                    <div class="popularity-title">
                        <img src="../../../../assets/flag.png" alt="">
                        <span>直播趋势</span>
                    </div>
                    <div></div>
                    <div class="trend-data">
                        <axis ref="trend" chartId="trend" height="340px" width="100%"></axis>
                    </div>
                </div>
                <div class="trend">
                    <div class="popularity-title">
                        <img src="../../../../assets/flag.png" alt="">
                        <span>观众画像</span>
                    </div>
                    <div class="portrait-cont">
                        <div class="portrait-echrts">
                            <pie ref="gender" chartId="gender" height="392px" width="80%"></pie>
                        </div>
                        <div class="portrait-echrts">
                            <wordcloud ref="wordcloud" chartId="wordClound" height="392px" width="80%"></wordcloud>
                        </div>
                    </div>
                    <div class="portrait-cont">
                        <div class="portrait-echrts">
                            <pie ref="pie" chartId="pie" height="392px" width="80%"></pie>
                        </div>
                        <div class="portrait-echrts">
                            <axis ref="axis" chartId="axis" height="340px" width="80%"></axis>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <!-- <button @click="initWords">修改1</button>
            <button @click="initWords2">修改2</button>

            <wordcloud ref="wordcloud" chartId="wordClound" height="392px" width="858px">
            </wordcloud> -->
            <!-- <button @click="initWords3">修改a</button>
            <button @click="initWords4">修改b</button>
            <axis ref="axis" chartId="axis" height="392px" width="858px"></axis> -->

            <!-- <button @click="initWords5">修改a1</button>
            <button @click="initWords6">修改b2</button>
            <pie ref="pie" chartId="pie" height="392px" width="858px"></pie>

            <button @click="initWords7">修改aa</button>
            <button @click="initWords8">修改bb</button>
            <category ref="category" chartId="category" height="392px" width="858px"></category> -->
        </div>
    </div>
</template>

<script>
import category from "@/components/myComponent/echarts/category.vue";
import wordcloud from "@/components/myComponent/echarts/wordcloud.vue";
import axis from "@/components/myComponent/echarts/axis.vue";
import pie from "@/components/myComponent/echarts/pie.vue";

export default {
    name: 'TtprojectVideoAnalysis',
    components: {
        wordcloud,
        axis,
        pie,
        category,
    },
    data() {
        return {
            calendarData: new Date(),
        };
    },

    mounted() {
        this.initWords();
        this.initWords3()
        this.initWords5()
        this.initWords7()
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
            this.$refs.trend.getIint(chartData, xAxis, legend)
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
            this.$refs.gender.getIint(chartData)

        },
        initWords7() {
            let chartData = [120, 200, 150, 80, 70, 110, 130];
            let xAxis = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            this.$refs.category.getIint(chartData, xAxis)
        },
    },
};
</script>

<style  lang="stylus" scoped>
.liveData{
    width: 100%;
    border-radius: 18px;
    padding:50px 80px;
    box-shadow: 0 2px 8px 0 #ccc;
    margin-bottom: 20px
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
    margin-top:30px;
}
.liveData-scroll{
    width: 80%
    max-height: 240px;
    overflow-y: scroll;
}
.liveData-dynamic-cont{
    width: 100%;
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
    width: 80%;
    div:nth-of-type(1)   {
        font-size:14px;
        color: #6C6C6C;
        padding:2px 0;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
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


.analysis{
    width: 100%;
    border-radius: 18px;
    padding:10px 14px;
    box-shadow: 0 2px 8px 0 #ccc;
}
.analysis-tit{
    width: 100%;
    padding: 2px 10px;
    height: 90px;
    border-radius: 22px;
    border: 1px solid rgba(187, 187, 187, 1);
    background-color: rgba(239, 239, 239, 1);
    display: flex;
    margin-bottom: 20px;
}
.analysis-dynamic-cont{
    display: flex;
    align-items: center;
    width: 30%;
    img{
        width: 60px;
        height: 60px;
        border-radius: 10px;
        margin-right: 10px;
    }
}
.analysis-dynamic-cont-time{
    width:calc(100% - 100px);
    div:nth-of-type(1)   {
        font-size:14px;
        color: #6C6C6C;
        padding:2px 0;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
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
.analysis-tit-type{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 40%;
    font-size: 20px;
    div{
        font-weight: bold;
    }
}

.popularity-title{
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
.popularity-data{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.popularity-data-type{
    width: 20%;
    margin-top: 30px
    text-align: center;
    .popularity-data-num   {
        font-size:20px;
        color: #101010;
        font-weight:bold;
        margin-bottom: 10px;
    }
    .popularity-data-name   {
        font-size:14px;
        color: #101010;
    }
}

.trend{
    margin-top: 40px;
}
.trend-data{
    width: 85%;
    margin: 0 auto;
}

.portrait-cont{
    width:100%;
    display: flex;
}
.portrait-echrts{
    width: 50%;
    margin:0 auto;
}


::-webkit-scrollbar { // 滚动条样式
  width: 5px;    
  height: 5px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(51, 51, 51, 0.2);
}
::-webkit-scrollbar-track {
  border-radius: 0;
  background: #E6E6E6;
}
</style>