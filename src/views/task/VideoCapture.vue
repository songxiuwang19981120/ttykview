<template>

    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-input v-model="numberValidateForm.age" placeholder="请输入完整素材链接https://www.tiktok.com/@..."
                    style="width:30%;margin-right: 20px;" clearable></el-input>
                <el-button size="medium" type="primary" @click="searchLink" :loading="searching">{{ searching ? '获取中 ...' :
        '获取TT视频'
}}</el-button>

            </div>
        </div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-select v-model="searchTableData.equipment" placeholder="请选择状态"
                    style="width:150px; margin-right:20px">
                    <el-option v-for="item in searchEquipentList" :key="item.value" :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="videocaptureIndex" size="medium">搜 索</el-button>
                <el-button type="primary" @click="videocaptureIndexs" size="medium">重 置</el-button>
                <el-button type="primary" :disabled="disableda" @click="transition()" size="medium">导出下载地址</el-button>
            </div>
        </div>

        <table-custom height="600" :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
            @handleSelectionChange="selectionChange"></table-custom>
        <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
        </pagination>
        <el-dialog :visible.sync="dialogVisible" width="40%">

            <div v-for="(item, index) of CommentLists.list" :key="index">
                <div style="margin:0 0 40px 0;height:100%;">
                    <img :src="item.avatar_medium" style="width:50px; border-radius:25px;float: left;" alt="">
                    <div style="margin-left: 10px;float: left;width:80%">
                        <div style="font-size:24px;color: #999;height: 25px;line-height: 25px;">{{ item.nickname }}:</div>
                        <div style=" float: right;margin-top: 5px;"><i
                                class="el-icon-success"></i>获赞数:{{ item.digg_count }}</div>
                        <div style="font-size:16px;margin-top: 5px;padding-right: 30%;">{{ item.text }}</div>

                        <div style="font-size:12px;color:#9999;margin-top: 5px;margin-bottom: 10px;">
                            评论时间:{{ item.create_time }}</div>
                        <el-collapse v-model="activeNames" @change="showCommentLists(item)" accordion>
                            <el-collapse-item :title='"展开" + item.reply_comment_total + "条回复"' :name="item.uid">

                                <div style="" v-for="(item1, index1) of  getCommentListstoo.list" :key="index1">
                                    <el-collapse v-model="activeName2" accordion>

                                        <img :src="item1.avatar_medium"
                                            style="width:20px; margin-top: 20px; border-radius:10px;float: left;"
                                            alt="">
                                        <div style="margin:20px 0 10px 10px;float: left;width:80%">
                                            <div style="font-size:12px;color: #999;height: 10px;line-height: 10px;">
                                                {{ item1.nickname }}:</div>
                                            <div style=" font-size: 8px; position: absolute;right: 15%;"><i
                                                    class="el-icon-success"></i>获赞数:{{ item1.digg_count }}</div>
                                            <div
                                                style="font-size:8px;margin-top: 5px;margin-left:5px;padding-right: 30%;">
                                                {{ item1.text }}</div>
                                            <div style="font-size:8px;margin-left:5px;color:#9999;">
                                                回复时间:{{ item1.create_time }}</div>
                                            <div style="clear:both"></div>

                                        </div>
                                    </el-collapse>
                                    <div style="clear:both"></div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>

                        <!-- 回复 -->

                    </div>
                </div>
                <div style="clear:both"></div>
                <div>

                </div>
            </div>
        </el-dialog>
        <!-- <el-dialog :visible.sync="videoPlayDialog" width="50%" :before-close="videoPlayClose">
            <div style="text-align: center;width:100%">
                <video autoplay controls loop :src='videoUrl' width="40%"></video>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'TtVideoCapture',
    components: {
        tableCustom,
        pagination
    },

    data() {
        return {
            searching: false, //获取TT视频ing
            videoUrl: '',  //播放视频路径
            // videoPlayDialog: false,  //播放视频弹框

            getCommentListstoo: {},
            activeNames: [],
            activeName2: [],

            icon: true,
            icon2: false,
            aweme_id: "",
            CommentLists: [],
            addtime: "",
            disableda: false,
            video_capture_ids: "",
            searchTableData: {
                equipment: "",//搜索框绑定数据
            },
            searchEquipentList: [
                { value: "0", label: "已下载" },
                { value: "1", label: "未下载" },
            ],//已下载状态
            numberValidateForm: {
                age: ''
            },//表单校验
            dialogTableVisible: false,//导出
            tableBox: false,//显隐
            total: 0,  //数据总量
            current_page: 0, //当前页
            current_limit: 10, //每页条数
            total2: 0,  //数据总量2
            current_page2: 1, //当前页2
            current_limit2: 10, //每页条数2
            tateKey: "",//已下载未下载
            dialogVisible: false,//评论弹框
            inputhttp: "",//搜索输入
            loading: false,
            gridData: [],
            tableData: [],
            columns: [
                {
                    prop: 'country',
                    label: '国家',
                    fiexd: true,
                    minWidth: 100,
                    align: 'center',
                },
                {
                    prop: 'video_url',
                    label: '视频',
                    minWidth: 120,
                    align: 'center',
                    render(h, { row }) {
                        return (
                            <div>
                                <video controls loop src={row.video_url} style="width:134px;height:191px"></video>
                            </div>
                        )
                    }
                },
                {
                    prop: 'video_desc',
                    label: '视频描述',
                    minWidth: 250,
                    align: 'center',
                },
                {
                    prop: 'uid',
                    label: '用户ID',
                    minWidth: 140,
                    align: 'center',
                },
                {
                    prop: 'aweme_id',
                    label: '视频ID',
                    minWidth: 140,
                    align: 'center',

                },
                {
                    prop: 'play_count',
                    label: '播放量',
                    minWidth: 80,
                    align: 'center',
                },
                {
                    prop: 'comment_count',
                    label: '评论量',
                    minWidth: 80,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button type="primary" size="mini" onClick={this.messageBox.bind(this, row)} >{row.comment_count}</el-button>
                            </div>
                        );
                    },
                },
                {
                    prop: 'digg_count',
                    label: '点赞量',
                    align: 'center',
                    minWidth: 80,
                },
                {
                    prop: 'addtime',
                    label: '抓取时间',
                    minWidth: 120,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                {row.addtime}
                            </div>
                        );
                    },
                },
                {
                    prop: 'ifvideo',
                    label: '状态',
                    minWidth: 80,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <span v-show={row.ifvideo == '1'}>未下载</span>
                                <span v-show={row.ifvideo == '0'}>已下载</span>
                            </div>

                        );
                    },
                },
                // {
                //     prop: 'ifvideo',
                //     label: '操作',
                //     width: 80,
                //     align: 'center',
                //     fiexd: true,
                //     fixed: 'right',
                //     render: (h, { row }) => {
                //         return (
                //             <div>
                //                 <el-button style="margin-right:10px" size="mini" type="success" onClick={this.videoPlay.bind(this, row)}>播放</el-button>
                //             </div>
                //         );
                //     },
                // },

            ],
        };
    },

    mounted() {
        this.videocaptureIndex()
    },

    methods: {
        //展开评论
        showCommentLists(item) {
            console.log(item);//当前点击的对象
            this.icon = !this.icon
            this.icon2 = !this.icon2
            this.getCommentListstoo = item
            this.getCommentListstooFn()
        },
        //评论回复接口
        async getCommentListstooFn() {
            try {
                let result = await this.$api({
                    type: "getCommentList", data:
                    {
                        reply_id: this.getCommentListstoo.cid
                    }
                });
                if (result.status == '200') {
                    this.getCommentListstoo = result.data
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        // 关闭视频播放
        videoPlayClose() {
            this.videoUrl = ''
            this.videoPlayDialog = false
        },
        // 打开视频播放
        videoPlay(row) {
            this.videoUrl = row.video_url
            this.videoPlayDialog = true
        },
        videocaptureIndexs() {
            this.searchTableData.equipment = "";
            this.videocaptureIndex()
        },
        async videocaptureIndex() {
            let data = {
                limit: this.current_limit,
                page: this.current_page,
                ifvideo: this.searchTableData.equipment,
            }
            this.loading = true
            let result = await this.$api({ type: "videocaptureIndex", data: data });
            this.loading = false
            this.tableData = result.data.list
            this.total = result.data.count;
            //日期格式
            // this.tableData.forEach(item => {
            //     let time1= item.addtime;
            //     var time2 = new Date(time1);
            //     console.log(item.addtime)
            //     var   year=time2.getFullYear();   
            //     var   month=time2.getMonth()+1;  
            //     var   date=time2.getDate();  
            //     var   hour=time2.getHours();   
            //     var   minute=time2.getMinutes();    
            //     var   second=time2.getSeconds();   
            //     item.addtime=year+"年"+month+"月"+date+"日   "+hour+":"+minute+":"+second;
            //     console.log(item.addtime)
            //     return year+"年"+month+"月"+date+"日   "+hour+":"+minute+":"+second
            // })

        },
        // 搜索链接
        searchLink() {
            if (this.numberValidateForm.age == '') {
                this.$message.warning({ message: '请输入查询链接' })
            } else {
                this.testGetRestByKeys()
            }
        },
        // 搜索链接,获取tk信息
        async testGetRestByKeys() {
            let data = {
                keyword: this.numberValidateForm.age.replace('https://www.tiktok.com/@', ''),
            };
            try {
                this.searching = true
                let result = await this.$api({ type: "testGetRestByKeys", data: data });
                this.searching = false
                if (result.status == '200') {
                    let list = result.data[0]
                    let data = []
                    let dataAss = {
                        uid: list.uid,
                        sec_uid: list.sec_uid,
                        unique_id: list.unique_id
                    }
                    data.push(dataAss)
                    this.collertionVideo(data)
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        async collertionVideo(data) {
            let list = {
                data: data
            }
            try {
                let result = await this.$api({ type: "collertionVideo", data: list });
                if (result.status == '200') {
                    this.videocaptureIndex()
                    this.$message.success({ message: result.msg })
                }else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {

            }

        },
        //导出TXT
        transition() {
            let _self = this;
            _self.dialogTableVisible = false;
            var title = '已导出下载地址'
            var str = ''
            this.gridData.forEach(item => {
                str += item.video_url + '\r\n'
            })
            var allStr = title + '\r\n' + '\r\n' + str
            var export_blob = new Blob([allStr]);
            var save_link = document.createElement("a");
            save_link.href = window.URL.createObjectURL(export_blob);
            save_link.download = '下载地址' + '.txt';
            this.fakeClick(save_link);

            //获取已下载视频地址的video_capture_ids
            this.gridData.forEach(item => {
                this.video_capture_ids = this.video_capture_ids + item.video_capture_id + ",";
            })
            //这里不加定时器的话页面不刷新已下载
            this.videocaptureDownload()
            this.disableda = true
            setTimeout(() => {
                this.videocaptureIndexs();
                this.disableda = false
            }, 1000);

        },
        //是否下载
        async videocaptureDownload() {
            let result = await this.$api({
                type: "videocaptureDownload",
                data: {
                    video_capture_id: this.video_capture_ids
                }
            });
        },
        //导出后格式
        fakeClick(obj) {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent(
                "click",
                true,
                false,
                window,
                0,
                0,
                0,
                0,
                0,
                false,
                false,
                false,
                false,
                0,
                null
            );
            obj.dispatchEvent(ev);
        },
        //选择框
        selectionChange(val) {
            console.log(val);//val选中数据
            let _self = this;
            _self.gridData = val
        },
        /**
           * 翻页回调
           */
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
            this.videocaptureIndexs()
        },



        //评论弹窗
        messageBox(row) {
            let _self = this;
            _self.dialogVisible = true;

            _self.aweme_id = row.aweme_id
            console.log(_self.aweme_id);
            _self.CommentLists = [];
            _self.getCommentLists();

        },
        //获取评论详情
        async getCommentLists() {
            try {
                let result = await this.$api({
                    type: "getCommentList", data:
                    {
                        aweme_id: this.aweme_id
                    }
                });
                if (result.status == '200') {
                    this.CommentLists = result.data
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

    },
};
</script>

<style scoped>
</style>