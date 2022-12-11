<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <div>
                    <span class="search-title">设备分组:</span>
                    <el-select v-model="searchTableData.equipment" placeholder="请选择设备分组"
                        style="width:150px;margin-right:20px">
                        <el-option v-for="item in searchEquipmentList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <span class="search-title">素材库:</span>
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryList"
                        v-model="searchTableData.library" placeholder="素材库选择"
                        style="width:180px;margin-right:20px"></el-cascader>
                </div>
                <div>
                    <span class="search-title">素材类型:</span>
                    <el-select v-model="searchTableData.status" placeholder="素材类型" style="width:160px;margin-right:20px">
                        <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <span class="search-title">时间排序:</span>
                    <el-select v-model="searchTableData.sort" placeholder="时间排序" style="width:110px;margin-right:20px">
                        <el-option v-for="item in searchTimeSortList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button type="primary" :loading="submitting" @click="searchTable">{{ submitting ? '搜索中 ...' :
                        '搜索'
                }}</el-button>
                <el-button type="primary" @click="resetTable">重置</el-button>
            </div>
            <!-- <div>
                <table border="1" cellspacing="0" cellpading="0">
                    <tr align="center">
                        <th>序号</th>
                        <th>名字</th>
                        <th>性别</th>
                        <th>年龄</th>
                    </tr>
                    <tr align="center">
                        <td>1</td>
                        <td>张三</td>
                        <td>男</td>
                        <td>18</td>
                    </tr>
                </table>
            </div> -->
            <div class="tt-accsituation--operation">
                <el-button type="primary" @click="videoUpLoad">上传视频</el-button>
                <el-button type="primary" @click="videoUpLoad">批量删除</el-button>

            </div>
        </div>
        <el-dialog title="视频上传" :visible.sync="videoUploadVisible" width="40%" :before-close="videoUploadClose">
            <el-form ref="form" :rules="rules" :model="videoForm" label-width="140px" :hide-required-asterisk="true">
                <el-form-item label="视频:" prop="name">
                    <el-upload class="upload-demo" drag action="#" multiple accept=".mp4" :on-change="onFileListChange">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload> </el-form-item>
                <video src="url"></video>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="videoUploadClose">取 消</el-button>
                <el-button type="primary" :loading="videoSubmitting" @click="submitForVideo">{{ videoSubmitting ?
                        '提交中...' : '提 交'
                }}</el-button>
            </span>
        </el-dialog>
        <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom>
        <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
        </pagination>
        <el-dialog :visible.sync="videoPlayDialog" width="50%" :before-close="videoPlayClose">
            <div style="text-align: center;width:100%">
                <video autoplay controls loop :src='videoUrl' width="40%"></video>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'TtVideo',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            videoUrl: '',  //播放视频路径
            videoPlayDialog: false,  //播放视频弹框
            loading: false, //表格加载loading
            tableData: [],  //表格数据
            columns: [
                {
                    prop: 'video_url',
                    label: '视频缩略图',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
                    render: (h, { row }) => {
                        // this.getVideoBase64(row.video_url)
                        return (
                            <div>
                                <video class="videosize" width="100" height="50" src={row.video_url}></video>
                            </div>
                        );
                    },
                },
                {
                    prop: 'video_num',
                    label: '视频编号',
                    minWidth: 160,
                    fixed: true,
                    align: 'center',
                },
                {
                    prop: 'add_time',
                    label: '上传时间',
                    minWidth: 160,
                    align: 'center',
                },
                {
                    prop: 'operation',
                    label: '操作',
                    width: 160,
                    align: 'center',
                    fixed: 'right',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button style="margin-right:10px" size="mini" type="success" onClick={this.videoPlay.bind(this, row.video_url)}>播放</el-button>
                                {/* <el-button size="mini" type="danger" onClick={this.removeHandler.bind(this, row)}>删除</el-button> */}
                                <el-popconfirm
                                    confirm-button-text='删除'
                                    cancel-button-text='取消'
                                    title="确认删除此视频？"
                                    onConfirm={this.removeHandler.bind(this, row)}
                                >
                                    <el-button slot="reference" type="danger" size="mini">删除</el-button>
                                </el-popconfirm>

                            </div>
                        );
                    },
                },
            ],  //表格
            total: 0,  //数据总量
            current_page: 1, //当前页
            current_limit: 10, //每页条数
            submitting: false,  //提交确定
            searchEquipmentList: [
                {
                    value: '1',
                    label: '供应商A'
                },
                {
                    value: '2',
                    label: '供应商B'
                },
                {
                    value: '3',
                    label: '选项三'
                },
            ],  //设备分组
            libraryList: [],  //素材库
            searchTableData: {
                equipment: '',
                library: '',
                status: '',
                sort: '',
            },  //搜索条件
            searchTimeSortList: [
                {
                    value: 'desc',
                    label: '正序'
                },
                {
                    value: 'asc',
                    label: '倒序'
                },
            ],  //时间排序
            searchTypeList: [
                {
                    value: '0',
                    label: '已用素材'
                },
                {
                    value: '1',
                    label: '可用素材'
                },
            ],  //素材类型
            videoUploadVisible: false,  //视频上传弹框
            videoSubmitting: false,  //视频上传加载状态
            videoForm: {
                videoList: [],
            },  //视频数据
            rules: {},  //视频上传弹框校验
        };
    },

    mounted() {
        this.getMaterialList();
    },

    methods: {
        // 关闭视频播放
        videoPlayClose() {
            this.videoUrl = ''
            this.videoPlayDialog = false
        },
        // 打开视频播放
        videoPlay(url) {
            this.videoUrl = url
            this.videoPlayDialog = true
        },
        /**
         * 获取视频第一帧并转化为图片
         */
        getVideoBase64() {
            let url = 'http://192.168.4.30/uploads/api/202212/6389eb3cc4ca2.mp4'
            const video = document.createElement("video"); // 获取视频对象
            // const video = document.createElement("video") // 也可以自己创建video
            video.src = url; // url地址 url跟 视频流是一样的
            var canvas = document.createElement("canvas"); // 获取 canvas 对象
            const ctx = canvas.getContext("2d"); // 绘制2d
            // video.crossOrigin = "anonymous"; // 解决跨域问题，也就是提示污染资源无法转换视频
            video.currentTime = 1; // 第一帧
            video.oncanplay = () => {
                canvas.width = video.clientWidth; // 获取视频宽度
                canvas.height = video.clientHeight; //获取视频高度
                // 利用canvas对象方法绘图
                ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
                // 转换成base64形式
                let img = canvas.toDataURL("image/png"); // 截取后的视频封面
                let i = 1
                console.log(i++, img);
            };
        },
        /**
         * 文件改变回调
         */
        onFileListChange(file, fileList) {
            // console.log(file, fileList);
            let { name } = file || {};
            name = name.toLowerCase();
            if (!name.endsWith('.mp4')) {
                this.$message.warning('仅支持mp4格式');
                // this.handleRemove();
                return false;
            }
            const url = URL.createObjectURL(file.raw);
            console.log(url);
            let data = {
                file: file,
                url: url
            }
            this.videoForm.videoList.push(data);
            console.log(this.videoForm.videoList);
            // this.getMediaDetail(file);
            // return false;
        },
        // 视频上传提交
        submitForVideo() {
            this.videoSubmitting = true
        },
        // 取消视频上传弹框
        videoUploadClose() {
            this.videoUploadVisible = false
        },
        /*
           视频上传弹框
        */
        videoUpLoad() {
            this.videoUploadVisible = true
        },
        async removeHandler(val) {
            console.log('删除');
            let data = {
                material_ids: val.material_id,
            }
            try {
                let result = await this.$api({ type: "deleteMaterial", data: data });
                console.log(result);
                this.$notify({ title: '删除成功', type: 'success'});
                this.getMaterialList()
            } catch (error) {
                console.error(error);
            }
        },
        /*
           翻页回调
        */
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit;  //请求数据量
            this.getMaterialList();
        },
        /*
          获取表格已选择的数据
       */
        selectionChange(val) {
            console.log(val);
        },
        searchTable() {
            this.submitting = true
            this.getMaterialList()
            console.log('搜索数据', this.searchTableData);
        },
        /*
            获取视频
        */
        async getMaterialList() {
            var order = ''
            if (this.searchTableData.sort != '') {
                order = 'add_time_start'
            }
            let data = {
                limit: this.current_limit,
                page: this.current_page,
                video_num: '',
                add_time_start: '',
                add_time_end: '',
                typecontrol_id: '',
                order: order,
                sort: this.searchTableData.sort,
                grouping_id: this.searchTableData.equipment,
                status:this.searchTableData.status,
            }
            try {
                this.loading = true;
                let result = await this.$api({ type: "getMaterialList", data: data });
                console.log(result);
                this.tableData = result.list;
                this.total = result.count
                this.loading = false;
                this.submitting = false

            } catch (error) {
                this.loading = false;
                this.submitting = false
                console.error(error);
            }
        },
        /*
            搜索重置
        */
        resetTable(){
            this.searchTableData={
                equipment: '',
                library: '',
                status: '',
                sort: '',
            }
            this.getMaterialList()
        },

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
    flex-flow: wrap;
    align-items: center;
    padding: 10px;
}

.search-title {
    font-size: 13px;
    padding-right: 10px;
}

.videosize {
    width: 100px;
    height: 30px;
}
</style>