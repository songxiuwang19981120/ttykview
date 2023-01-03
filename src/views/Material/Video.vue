<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <div>
                    <el-select v-model="searchTableData.equipment" placeholder="请选择账号分组" size="medium"
                        style="width:150px;margin-right:10px" @change="searchEquipmentChange" clearable>
                        <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
                            :key="item.grouping_id"></el-option>
                    </el-select>
                </div>
                <div>
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryList" size="medium"
                        v-model="searchTableData.library" placeholder="账号分类选择"
                        style="width:180px;margin-right:10px"></el-cascader>
                </div>
                <div>
                    <el-select v-model="searchTableData.status" placeholder="素材类型" size="medium"
                        style="width:160px;margin-right:10px">
                        <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="searchTableData.sort" placeholder="时间排序" style="width:110px;margin-right:20px" size="medium">
                        <el-option v-for="item in searchTimeSortList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button type="primary" :loading="submitting" size="medium" @click="searchTable">{{ submitting ? '搜索中 ...'
        : '搜索'
}}</el-button>
                <el-button type="primary" size="medium" @click="resetTable">重置</el-button>
                <el-button type="primary" size="medium" @click="videoUpLoad">上传视频</el-button>
                <el-button type="primary" size="medium" @click="batchDelete">批量删除</el-button>


            </div>
        </div>
        <el-dialog title="视频上传" :visible.sync="videoUploadVisible" width="40%" :before-close="videoUploadClose">
            <el-form ref="videoForm" :rules="rulesUpload" :model="videoForm" label-width="140px">
                <el-form-item label="分组:" prop="group">
                    <el-select v-model="videoForm.group" placeholder="请选择分组" @change="equipmentChange">
                        <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
                            :key="item.grouping_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类:" prop="library">
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryAddList"
                        v-model="videoForm.library" placeholder="分类选择"></el-cascader>
                </el-form-item>
                <el-form-item label="视频:" prop="video">
                    <el-upload ref="videoUnload" class="upload-demo" :file-list="fileList" drag :action="baseUrl + 'Base/upload'" multiple
                        accept=".mp4" :on-success="handleSucess" :on-error="handleError" :on-remove="handleRemove"
                        :before-upload="videoBefore">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="videoUploadClose">取 消</el-button>
                <el-button type="primary" size="medium" :loading="videoSubmitting" @click="submitForVideo">{{ videoSubmitting
        ? '提交中...' : '提 交'
}}</el-button>
            </span>
        </el-dialog>
        <div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选 <span
                    style="color:#FF411F;font-size: 12px;padding-left: 20px;"> 已选中 {{ checkedCities.length}}个视频</span></el-checkbox>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <div class="video">
                    <div v-for="(item, index) in tableData" :key="index" class="videoData">
                    <video controls loop :src="item.video_url" class="videosize"></video>
                    <el-checkbox :label="item.material_id" :key="item.material_id"
                        class="videoNum">视频编号:{{ item.video_num }}</el-checkbox>
                    <div class="videoNum">上传时间:{{ item.add_time }}</div>
                </div>
                </div>
            </el-checkbox-group>
        </div>
        <!-- <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom> -->
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
            checkAll: false,  //全选
            checkedCities: [], //已选数据
            isIndeterminate: true,  //复选框全选属性
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
                        return (
                            <div>
                                <video controls loop width="100" height="50" src={row.video_url}></video>
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
                                    onConfirm={this.removeHandler.bind(this, row, '1')}
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
            current_limit: 50, //每页条数
            submitting: false,  //提交确定
            groupList: [],  //账号分组
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
            libraryAddList: [],
        };
    },

    mounted() {
        this.getGroupList();
        this.getMaterialList();
    },

    methods: {
        // 批量删除
        batchDelete() {
            if (this.checkedCities.length == 0) {
                this.$message.warning('请选择需要删除的视频');
            } else {
                this.removeHandler(this.checkedCities, '2')
            }
        },
        // 监听全选
        handleCheckAllChange(val) {
            if (val) {
                this.tableData.forEach((item) => {
                    if (this.checkedCities.indexOf(item.material_id) === -1) {
                        this.checkedCities.push(item.material_id)
                    }
                })
            } else {
                this.checkedCities = []
            }
            this.isIndeterminate = false;
        },
        // 单个选择
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.tableData.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
        },
        // 校验视频大小
        videoBefore(file) {
            let { size } = file || {};
            if (size > 6 * 1024 * 1024) {
                this.$message.error('视频大小请不要超过6M');
                return false
            }
        },
        // 监听搜索分组变化
        searchEquipmentChange() {
            this.getTypeControlList()
        },
        // 监听分组变化
        equipmentChange() {
            this.getAddTypeControlList()
        },
        // 视频删除
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        // 视频上传成功回调
        handleSucess(response,file, fileList) {
            if (response.status != '200') {
                this.$message.warning(response.msg);
                this.fileList.splice(this.fileList.indexOf(file), 1)
            } 
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
            let data = {
                grouping_id: this.searchTableData.equipment
            }
            try {
                let result = await this.$api({ type: "getTypecontrol", data: data });
                if (result.status == '200') {
                    this.getTreeData(result.data);
                    this.libraryList = result.data;
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
        /* 
            获取素材
        */
        async getAddTypeControlList() {
            let data = {
                grouping_id: this.videoForm.group
            }
            try {
                let result = await this.$api({ type: "getTypecontrol", data: data });
                if (result.status == '200') {
                    this.getTreeData(result.data);
                    this.libraryAddList = result.data;
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) { }
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
                    this.$refs.videoUnload.clearFiles()
                    this.getMaterialList()
                    this.$message.success({ message: result.msg })
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
            }
        },
        // 取消视频上传弹框
        videoUploadClose() {
            this.$refs.videoUnload.clearFiles()
            this.fileList = [];
            this.videoSubmitting=false;
            this.videoForm = {
                group: '',  //分组
                library: '',  //库
            };
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
        async removeHandler(val, type) {
            let data = {
                material_ids: '',
            }
            if (type == 2) {  //批量删除
                data.material_ids = val.join(',')
            } else {
                data.material_ids = val.material_id
            }
            try {
                let result = await this.$api({ type: "deleteMaterial", data: data });
                if (result.status == '200') {
                    if (type == 2) {
                        this.checkedCities = []
                    }
                    this.$message.success({ message: '视频删除成功' });
                    this.getMaterialList()
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
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
        },
        searchTable() {
            this.submitting = true
            this.getMaterialList()
        },
        /*
            获取视频
        */
        async getMaterialList() {
            let order = ''
            let status = ''
            if (this.searchTableData.sort != '') {
                order = 'add_time'
            }
            if (this.searchTableData.status == '2') {
                status = ''
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
                status: status,
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
            this.libraryList = []
            this.getMaterialList()
        },

    },
};
</script>

<style scoped>
.video {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: 700px;
    overflow-y: scroll;
}

.videoData {
    width: 170px;
    margin: 10px 15px;
}

.videosize {
    width: 100%;
    height: 266px;
}

.videoNum {
    color: rgba(16, 16, 16, 1);
    font-size: 12px;
    text-align: left;
    padding-top: 5px;
}

.videoCheckbox {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
}
</style> 