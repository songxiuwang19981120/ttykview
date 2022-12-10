<template>
   
    <div class="VideoCapture">
 <!-- 搜索框 -->
    <div class="background">
        <el-row type="flex">
            <el-col :span="8">
                <div style=" margin-left: 10px; ">
                    <el-input placeholder="请输入博主主页链接" v-model="inputhttp" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="showBox">获取TT视频</el-button>
                    </el-input>
                </div>
            </el-col>
            <el-col :span="8"></el-col>
            <el-col :span="8"></el-col>
        </el-row>
        <el-row type="flex">

            <el-col :span="8"> <el-button style="margin-left:10px; margin-top: 10px; margin-right: 10px;" type="primary"
                    size="mini" @click="dialogTableVisible = true" round>导出下载地址</el-button>
                    <!-- 下载地址弹出框 -->
                    <el-dialog title="导出下载地址" :visible.sync="dialogTableVisible">
                        <table-custom style="width:100%; "  :tableData="gridData" :columns="columns"></table-custom>
                        <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogTableVisible = false">取 消</el-button>
                        <el-button type="primary" @click="transition()">确 定</el-button>
                    </div>
                    </el-dialog>
                    <el-dropdown @command="handleCommand">
                    <el-button type="primary" size="mini">
                        视频状态<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="true">已下载</el-dropdown-item>
                        <el-dropdown-item command="false">未下载</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown></el-col>
            <el-col :span="8"></el-col>
            <el-col :span="8"></el-col>
        </el-row>
    </div>
        <!-- v-show显隐 -->
        <div v-show="tableBox" style="margin-top: 10px;">
            <!-- 表格 -->
            <table-custom style="width:100%; " :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns" @handleSelectionChange="selectionChange"></table-custom>
            <!-- 评论弹框 -->
            <el-dialog
                :visible.sync="dialogVisible"
                width="30%"
                >
            <span>{{content}}</span>
                <span slot="footer" class="dialog-footer">
                
                </span>
            </el-dialog>
            <!-- 分页 -->
            <pagination style="" :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination"></pagination>
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
            dialogTableVisible: false,//导出
            tableBox:false,//显隐
            total: 100,  //数据总量
            current_page: 1, //当前页
            current_limit:10, //每页条数
            tateKey:"",//已下载未下载
            dialogVisible: false,//评论弹框
            inputhttp: "",//搜索输入
            loading: true,
            content:"",
            gridData:[],
            tableData: [
                { content:"123",ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载",tateKey:true },
                { content:"1234",ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "未下载",tateKey:false },
                { content:"1235",ch: "中国", video: "https://avatars.githubusercontent.com/u/115990494?s=48&v=4", labela: "标签", userId: "用户ID", videoId: "视频ID", play: "播放量", comment: "评论量", like: "点赞量", Time: "抓取时间", tate: "已下载" ,tateKey:true},
            ],
            columns: [
                {
                    
                    prop: 'ch',
                    label: '国家',
                    fiexd:true,
                    align:'center',

                },
                {
               
                    prop: 'video',
                    label: '视频',
                    minWidth:50,
                    maxWidth:50,
                    fiexd:true,
                    align:'center',

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
                    fiexd:true,
                    align:'center',
                },
                {
                    prop: 'userId',
                    label: '用户ID',
                    fiexd:true,
                    align:'center',
                },
                {
                    prop: 'videoId',
                    label: '视频ID',
                    fiexd:true,
                    align:'center',

                },
                {
                    prop: 'play',
                    label: '播放量',
                    fiexd:true,
                    align:'center',
                },
                {
                    prop: 'comment',
                    label: '评论量',
                    fiexd:true,
                    align:'center',
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
                    fiexd:true,
                    align:'center',
                },
                {
                    prop: 'Time',
                    label: '抓取时间',
                    fiexd:true,
                    align:'center',
                },
                {
                    prop: 'tate',
                    label: '状态',
                    fiexd:true,
                    align:'center',
                },

            ],
        };
    },

    mounted() {

    },

    methods: {
        //导出TXT
        transition(){
            let _self = this;
            _self.dialogTableVisible=false;
            var title = '已导出下载地址'
            var str=''
            this.gridData.forEach(item=>{
                str+=item.ch+'\r\n'
            })
            var allStr = title+'\r\n'+'\r\n'+str
            var export_blob = new Blob([allStr]);
            var save_link = document.createElement("a");
            save_link.href = window.URL.createObjectURL(export_blob);
            save_link.download = '下载地址'+'.txt';
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
        selectionChange(val){
            console.log(val);//val选中数据
            let _self = this;
            _self.gridData=val
        },
       
        //定时器函数加载动画
        showBox2(){
            let _self = this;
            _self.loading = false;
        },
        //显隐切换
        showBox(){
            let _self = this;
            _self.tableBox=true;
            if(_self.loading==false){
                _self.loading=true
            }
            setTimeout(this.showBox2, 1000);
            
            //下面写接口，inputhttp输入框输入的数据,然后重新渲染tabledata
        },
          /**
             * 翻页回调
             */
             handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
        },
        //选择状态,重新从后台获取数据放入tableData中
      handleCommand(command) {
        let _self = this;
        _self.takeKey=command;
        console.log(_self.takeKey)
        if(_self.takeKey==true){
         
        }
      },

        //评论弹窗
        messageBox(content) {
        let _self=this;
        _self.dialogVisible=true;
        _self.content=content
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