<template>

    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-input  v-model="numberValidateForm.age" placeholder="请输入完整素材链接https://www.tiktok.com/@..." style="width:40%" clearable>
                    <el-button slot="append" @click="searchLink">获取TT视频</el-button>
                </el-input>
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
                <el-button type="primary" @click="videocaptureIndex">搜 索</el-button>
                <el-button type="primary" @click="videocaptureIndexs">重 置</el-button>
            </div>
            <div class="tt-accsituation--operation">
                <el-button  type="primary"
                @click="transition()">导出下载地址</el-button>
            </div>
        </div>
       
        <table-custom style="width:100%; " :mutiSelect="true" :loading="loading" :tableData="tableData"
            :columns="columns" @handleSelectionChange="selectionChange"></table-custom>
        <pagination style="" :total="total" :page="current_page" :limit="10" :size="current_limit"
            @pagination="handlePagination"></pagination>
        <el-dialog :visible.sync="dialogVisible" width="40%">
            <div v-for="(item, index) of content" :key="index">
                <div>{{ item }}</div>
            </div>
            <pagination :total="total2" :page="current_page2" :size="current_limit2" :limit="10"
                @pagination="handlePagination"></pagination>
        </el-dialog>
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
            current_page: 1, //当前页
            current_limit: 10, //每页条数
            total2: 0,  //数据总量2
            current_page2: 1, //当前页2
            current_limit2: 10, //每页条数2
            tateKey: "",//已下载未下载
            dialogVisible: false,//评论弹框
            inputhttp: "",//搜索输入
            loading: false,
            content: "",
            gridData: [],
            tableData: [],
            columns: [
                {

                    prop: 'country',
                    label: '国家',
                    fiexd: true,
                    align: 'center',
                },
                {

                    prop: 'video_url',
                    label: '视频',
     
                    fiexd: true,
                    align: 'center',
                    render(h, { row }) {
                        return (
                            <div>
                                <video width="100" height="50" src={row.video_url} class="videosize"></video>
                            </div>
                        )
                    }
                },
                {
                    prop: 'video_desc',
                    label: '视频描述',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'uid',
                    label: '用户ID',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'aweme_id',
                    label: '视频ID',
                    fiexd: true,
                    align: 'center',

                },
                {
                    prop: 'play_count',
                    label: '播放量',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'comment_count',
                    label: '评论量',
                    fiexd: true,
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
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'addtime',
                    label: '抓取时间',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'ifvideo',
                    label: '状态',
                    fiexd: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                            <span  v-show={row.ifvideo=='1'}>未下载</span>
                            <span  v-show={row.ifvideo=='0'}>已下载</span>
                            </div>
                            
                        );
                    },
                },

            ],
        };
    },

    mounted() {
this.videocaptureIndex()
    },

    methods: {
        videocaptureIndexs(){
            this.searchTableData.equipment="";
            this.videocaptureIndex()
        } ,
        async videocaptureIndex() {
           let data={
            limit:this.current_limit,
            page:this.current_page,
            ifvideo:this.searchTableData.equipment,
           }
           this.loading = true
            let result = await this.$api({ type: "videocaptureIndex", data: data });
            this.loading = false
            this.tableData=result.data.list
            this.total=result.data.count
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
                let result = await this.$api({ type: "testGetRestByKeys", data: data });
                if (result.status == '200') {
                    let list = result.data[0]
                    let list1 = []
                    let list2 = {
                        uid: list.uid,
                        sec_uid: list.sec_uid,
                        unique_id: list.unique_id
                    }
                    list1.push(list2)
                    this.pushs(list1)
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                console.error(error);
            }
        },
        async pushs(list1) {
            let list = {
                data: list1
            }
            let result = await this.$api({ type: "collertionVideo", data: list });
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
            console.log(this.gridData.video_capture_id)
            this.gridData.forEach(item => {
                console.log(item.video_capture_id)
               
            })
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
        },
        /**
           * 翻页回调2
           */
        handlePagination(val) {
            this.current_page2 = val.page;  //页数
            this.current_limit2 = val.limit  //条数
        },


        //评论弹窗
        messageBox(content) {
            let _self = this;
            _self.dialogVisible = true;
            _self.content = content
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
        // //导出下载地址弹窗
        // open() {
        //     this.$prompt('请输入下载地址', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         inputErrorMessage: '邮箱格式不正确'
        //     }).then(({ value }) => {
        //         this.$message({
        //             type: 'success',
        //             message: '你的下载地址为 ' + value,

        //         });
        //     }).catch(() => {
        //         this.$message({
        //             type: 'info',
        //             message: '取消导出'
        //         });
        //     });
        // }
    },
};
</script>

<style scoped>
.tt-accsituation {
    background-color: #fff;
    min-height: 70px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.tt-accsituation--operation {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
}
.videosize {
    width: 100px;
    height: 30px;
}

</style>