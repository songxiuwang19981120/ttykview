<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <div>
                    <span class="search-title">设备分组:</span>
                    <el-select v-model="searchTableData.equipment" placeholder="请选择设备分组"
                        style="width:150px;margin-right:20px">
                        <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
                            :key="item.grouping_id"></el-option>
                    </el-select>
                </div>
                <div>
                    <span class="search-title">账号分类:</span>
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryList"
                        v-model="searchTableData.library" placeholder="账号分类选择"
                        style="width:180px;margin-right:20px"></el-cascader>
                </div>
                <div>
                    <span class="search-title">素材类型:</span>
                    <el-select v-model="searchTableData.status" placeholder="素材类型"
                        style="width:160px;margin-right:20px">
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
            <div class="tt-accsituation--operation">
                <el-button type="primary" @click="videoUpLoad">上传视频</el-button>
                <!-- <el-button type="primary" @click="videoUpLoad">批量删除</el-button> -->
            </div>
            <el-table :data="statisticsData" border style="width:490px;margin: 10px; ">
                <el-table-column prop="name" label="分类名称" width="120" align="center"></el-table-column>
                <el-table-column prop="unloadNumber" label="已上传视频数量" width="120" align="center"></el-table-column>
                <el-table-column prop="use" label="已用视频数量" width="120" align="center"></el-table-column>
                <el-table-column prop="used" label="当前可用素材" align="center"></el-table-column>
            </el-table>
            <div style="height:10px"></div>
        </div>
        <el-dialog title="视频上传" :visible.sync="videoUploadVisible" width="40%" :before-close="videoUploadClose">
            <el-form ref="videoForm" :rules="rulesUpload" :model="videoForm" label-width="140px">
                <el-form-item label="分组:" prop="group">
                    <el-select v-model="videoForm.group" placeholder="请选择分组">
                        <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
                            :key="item.grouping_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库:" prop="library">
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryList"
                        v-model="videoForm.library" placeholder="库选择"></el-cascader>
                </el-form-item>
                <el-form-item label="视频:" prop="video">
                    <el-upload class="upload-demo" drag :action="baseUrl + 'Base/upload'" multiple accept=".mp4"
                        :on-success="handleSucess" :on-error="handleError" :on-remove="handleRemove">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
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
import base from '@/config/base.config'
const { BASE_URL } = base

export default {
    name: 'TtVideo',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            baseUrl: BASE_URL,
            statisticsData: [
                {
                    name: '全部',
                    unloadNumber: '',
                    use: '1',
                    used: '1',

                }

            ],
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
            groupList: [],  //设备分组
            libraryList: [],  //账号分类
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
                    value: '',
                    label: '全部素材'
                },
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
                group: '',  //分组
                library: '',  //库
            },  //视频数据
            rulesUpload: {
                group: [{ required: true, message: '请选择分组', trigger: 'blur' }],
                library: [{ required: true, message: '请选择库', trigger: 'blur' }],
            },  //视频上传弹框校验
            fileList: [],  //已选择需要上传的视频
        };
    },

    mounted() {
        this.getGroupList();
        this.getTypeControlList();
        this.getMaterialList();
    },

    methods: {
        // 视频删除
        handleRemove(file, fileList) {
            console.log('视频删除', file, fileList);
            this.fileList = fileList
        },
        // 视频上传成功回调
        handleSucess(response, file, fileList) {
            // if(response.status!='200'){
            //     this.$message.warning(response.msg);
            //     fileList.pop()
            // }
            this.fileList = fileList
        },
        // 视频上传失败回调
        handleError(err, file, fileList) {
            this.$message.error(err.msg);
        },
        /*
            function: getTreeData
            params: data | 需要进行递归处理的数组
            desc: 递归函数，对数组进行处理，设置dhilren长度为0的字段为undefined
            return: 处理后的数据
        */
        getTreeData(arr) {
            arr.forEach(item => {
                if (!item.children.length) {
                    item.children = undefined
                } else {
                    this.getTreeData(item.children)
                }
            })
        },
        /*
            获取素材
        */
        async getTypeControlList() {
            try {
                let result = await this.$api({ type: "getTypecontrol" });
                if (result.status == '200') {
                    this.libraryList = result.data;
                    this.getTreeData(result.data)
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) { }
        },
        /* 
            获取分组
        */
        async getGroupList() {
            let result = await this.$api({ type: 'getGrouping' })
            if (result.status == '200') {
                this.groupList = result.data.list
            } else {
                this.$message.error({ message: result.msg })
            }
        },
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
        // 视频上传提交
        submitForVideo() {
            if (this.fileList.length == 0) {
                return this.$message.warning({ message: '请选择需要上传的视频' });
            }
            this.$refs['videoForm'].validate((valid) => {
                if (!valid) return false;
                this.videoSubmitting = true;
                let fileList = this.fileList.map((item) => {
                    return item.response.data;
                }).join(",");
                console.log(fileList);
                let typecontrolId = this.videoForm.library[this.videoForm.library.length - 1] ?? ''
                let data = {
                    typecontrol_id: typecontrolId,
                    video_url: fileList,
                    grouping_id: this.videoForm.group,
                }
                this.addMaterial(data)
            })
        },
        // 视频上传提交
        async addMaterial(data) {
            try {
                let result = await this.$api({ type: "addMaterial", data: data });
                if (result.status == '200') {
                    this.videoSubmitting = false;
                    this.fileList = [];
                    this.videoUploadVisible = false;
                    this.videoForm = {
                        group: '',  //分组
                        library: '',  //库
                    };
                    this.getMaterialList()
                    this.$message.success({ message: result.msg })
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                console.error(error);
            }
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
        /*
           删除视频
        */
        async removeHandler(val) {
            let data = {
                material_ids: val.material_id,
            }
            try {
                let result = await this.$api({ type: "deleteMaterial", data: data });
                if (result.status == '200') {
                    this.$message.success({ message: '视频删除成功' });
                    this.getMaterialList()
                } else {
                    this.$message.error({ message: result.msg })
                }
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
            let order = ''
            if (this.searchTableData.sort != '') {
                order = 'add_time'
            }
            let typecontrolId = this.searchTableData.library[this.searchTableData.library.length - 1] ?? ''
            let data = {
                limit: this.current_limit,
                page: this.current_page,
                video_num: '',
                add_time_start: '',
                add_time_end: '',
                typecontrol_id: typecontrolId,
                order: order,
                sort: this.searchTableData.sort,
                grouping_id: this.searchTableData.equipment,
                status: this.searchTableData.status,
            }
            try {
                this.loading = true;
                let result = await this.$api({ type: "getMaterialList", data: data });
                if (result.status == '200') {
                    this.tableData = result.data.list;
                    this.total = result.data.count
                    this.statisticsData[0].unloadNumber = result.data.count
                    this.statisticsData[0].name = (result.data.type_title == '' ? '全部' : result.data.type_title)
                    this.statisticsData[0].use = result.data.yy
                    this.statisticsData[0].used = result.data.count - result.data.yy
                } else {
                    this.$message.error({ message: result.msg })
                }
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
        resetTable() {
            this.searchTableData = {
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