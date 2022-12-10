<template>

    <div class="VideoCapture">

        <!-- 搜索框 -->
        <div class="background">
            <div style="float:left">
                <div style=" margin-right: 20px; ">
                        <el-form :model="numberValidateForm" ref="numberValidateForm" class="demo-ruleForm">
                            <el-form-item label="主页链接:" label-width="100px" style="width:350px;" prop="age" :rules="[
                                { required: true, message: '请输入内容', trigger: 'blur' },
                            ]">
                                <el-input v-model.number="numberValidateForm.age" clearable autocomplete="off"
                                    placeholder="请输入博主主页链接">
                                </el-input>
                            </el-form-item>
                        </el-form>

                    </div>
            </div>
            <div style="float:left">
                <span>视频状态：</span>
                    <el-select v-model="searchTableData.equipment" placeholder="请选择状态"
                        style="width:150px; margin-right:20px">
                        <el-option v-for="item in searchEquipentList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
            </div>
            <div style="float:left">
                <el-button style="" type="primary" icon="el-icon-search"
                        @click="showBox('numberValidateForm')">获取TT视频</el-button>
            </div>
           <div style="clear:both">
            <el-button style="margin-left:10px;  margin-right: 10px;" type="primary" size="mini"
                        @click="dialogTableVisible = true" round>导出下载地址</el-button>
                    <!-- 下载地址弹出框 -->
                    <el-dialog title="导出下载地址" :visible.sync="dialogTableVisible">
                        <table-custom style="width:100%; " :tableData="gridData" :columns="columns"></table-custom>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogTableVisible = false">取 消</el-button>
                            <el-button type="primary" @click="transition()">确 定</el-button>
                        </div>
                    </el-dialog>
           </div>
            
        </div>
        <!-- v-show显隐 -->
        <div v-show="tableBox" style="margin-top: 10px;">
            <!-- 表格 -->
            <table-custom style="width:100%; " :mutiSelect="true" :loading="loading" :tableData="tableData"
                :columns="columns" @handleSelectionChange="selectionChange"></table-custom>
            <!-- 评论弹框 -->
            <el-dialog :visible.sync="dialogVisible" width="40%">
                <div v-for="(item, index) of content" :key="index">
                    <div>{{ item }}</div>
                </div>
                <pagination :total="total2" :page="current_page2" :size="current_limit2" :limit="10"
                    @pagination="handlePagination"></pagination>
            </el-dialog>
            <!-- 分页 -->
            <pagination style="" :total="total" :page="current_page" :limit="10" :size="current_limit"
                @pagination="handlePagination"></pagination>
        </div>
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
                { value: "1", label: "已下载" },
                { value: "2", label: "未下载" },
            ],//已下载状态
            numberValidateForm: {
                age: ''
            },//表单校验
            dialogTableVisible: false,//导出
            tableBox: false,//显隐
            total: 100,  //数据总量
            current_page: 1, //当前页
            current_limit: 10, //每页条数
            total2: 100,  //数据总量2
            current_page2: 1, //当前页2
            current_limit2: 10, //每页条数2
            tateKey: "",//已下载未下载
            dialogVisible: false,//评论弹框
            inputhttp: "",//搜索输入
            loading: true,
            content: "",
            gridData: [],
            tableData: [
                { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
                { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
                { content: ["123", "12", "1"], ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载", tateKey: true },
            ],
            columns: [
                {

                    prop: 'ch',
                    label: '国家',
                    fiexd: true,
                    align: 'center',

                },
                {

                    prop: 'video',
                    label: '视频',
                    minWidth: 50,
                    maxWidth: 50,
                    fiexd: true,
                    align: 'center',

                    render(h, { row }) {
                        return (
                            <div>
                                <img src={row.video} style="height=40px; width=40px"></img>
                            </div>
                        )
                    }
                },
                {
                    prop: 'labela',
                    label: '标签',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'userId',
                    label: '用户ID',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'videoId',
                    label: '视频ID',
                    fiexd: true,
                    align: 'center',

                },
                {
                    prop: 'play',
                    label: '播放量',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'comment',
                    label: '评论量',
                    fiexd: true,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button type="primary" size="mini" onClick={this.messageBox.bind(this, row.content)} >{row.comment}</el-button>
                            </div>
                        );
                    },
                },
                {
                    prop: 'like',
                    label: '点赞量',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'Time',
                    label: '抓取时间',
                    fiexd: true,
                    align: 'center',
                },
                {
                    prop: 'tate',
                    label: '状态',
                    fiexd: true,
                    align: 'center',
                },

            ],
        };
    },

    mounted() {

    },

    methods: {
        //导出TXT
        transition() {
            let _self = this;
            _self.dialogTableVisible = false;
            var title = '已导出下载地址'
            var str = ''
            this.gridData.forEach(item => {
                str += item.ch + '\r\n'
            })
            var allStr = title + '\r\n' + '\r\n' + str
            var export_blob = new Blob([allStr]);
            var save_link = document.createElement("a");
            save_link.href = window.URL.createObjectURL(export_blob);
            save_link.download = '下载地址' + '.txt';
            this.fakeClick(save_link);
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

        //定时器函数加载动画
        showBox2() {
            let _self = this;
            _self.loading = false;
        },
        //显隐切换
        showBox(formName) {
            //校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let _self = this;
                    _self.tableBox = true;
                    if (_self.loading == false) {
                        _self.loading = true
                    }
                    setTimeout(this.showBox2, 1000);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

            //下面写接口，inputhttp输入框输入的数据,然后重新渲染tabledata
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

<style lang="stylus" scoped>
.background{
    background-color: white;
    padding-bottom: 15px;
    padding-top:10px
}

</style>