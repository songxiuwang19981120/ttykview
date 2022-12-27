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
                <el-button type="primary"  class="seachbut" :loading="submitting" @click="searchTable">{{ submitting ? '搜索中 ...' :
                        '搜索'
                }}</el-button>
                <el-button type="primary"  class="seachbut" @click="resetTable">重置</el-button>
                <el-button type="primary" class="seachbut" @click="imgUpLoad">上传图片</el-button>

            </div>
            <!-- <el-table :data="statisticsData" border style="width:490px;margin: 10px; ">
                <el-table-column prop="name" label="分类名称" width="120" align="center"></el-table-column>
                <el-table-column prop="unloadNumber" label="已上传图片数量" width="120" align="center"></el-table-column>
                <el-table-column prop="use" label="已用图片数量" width="120" align="center"></el-table-column>
                <el-table-column prop="used" label="当前可用素材" align="center"></el-table-column>
            </el-table>
            <div style="height:10px"></div> -->
        </div>
        <el-dialog title="图片上传" :visible.sync="imgUploadVisible" width="40%" :before-close="imgUploadClose">
            <el-form ref="imgForm" :rules="rulesUpload" :model="imgForm" label-width="140px">
                <el-form-item label="分组:">
                    <el-select v-model="imgForm.group" placeholder="请选择分组">
                        <el-option v-for="item in groupList" :value="item.grouping_id" :label="item.grouping_name"
                            :key="item.grouping_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库:" prop="library">
                    <el-cascader clearable :props="{ checkStrictly: true }" :options="libraryList"
                        v-model="imgForm.library" placeholder="库选择"></el-cascader>
                </el-form-item>
                <el-form-item label="图片:" prop="img">
                    <el-upload ref="imgUnload" class="upload-demo" drag :action="baseUrl + 'Base/upload'" multiple
                        accept=".png,.jpg,.jpeg" :on-success="handleSucess" :on-remove="handleRemove" :before-upload="imgBefore">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="imgUploadClose">取 消</el-button>
                <el-button type="primary" :loading="imgSubmitting" @click="submitForimg">{{ imgSubmitting ?
                        '提交中...' : '提 交'
                }}</el-button>
            </span>
        </el-dialog>
        <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom>
        <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
        </pagination>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
import base from '@/config/base.config'
const { BASE_URL } = base

export default {
    name: 'TtAvatar',
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
            imgUrl: '',  //播放图片路径
            loading: false, //表格加载loading
            tableData: [],  //表格数据
            columns: [
                {
                    prop: 'image',
                    label: '头像',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
                    render: (h, { row }) => {
                        let imgList = []
                        imgList[0] = row.image
                        return (
                            <div>
                                <el-image style="width: 50px; height: 50px" src={row.image} preview-src-list={imgList}></el-image>
                            </div>
                        );
                    },
                },
                // {
                //     prop: 'headimage_id',
                //     label: '图片编号',
                //     minWidth: 160,
                //     fixed: true,
                //     align: 'center',
                // },
                // {
                //     prop: 'usage_time',
                //     label: '上传时间',
                //     minWidth: 160,
                //     align: 'center',
                // },
                {
                    prop: 'operation',
                    label: '操作',
                    width: 160,
                    align: 'center',
                    fixed: 'right',
                    render: (h, { row }) => {
                        return (
                            <div>
                                {/* <el-button size="mini" type="danger" onClick={this.removeHandler.bind(this, row)}>删除</el-button> */}
                                <el-popconfirm
                                    confirm-button-text='删除'
                                    cancel-button-text='取消'
                                    title="确认删除此图片？"
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
            imgUploadVisible: false,  //图片上传弹框
            imgSubmitting: false,  //图片上传加载状态
            imgForm: {
                group: '',  //分组
                library: '',  //库
            },  //图片数据
            rulesUpload: {
                // group: [{ required: true, message: '请选择分组', trigger: 'blur' }],
                library: [{ required: true, message: '请选择库', trigger: 'blur' }],
            },  //图片上传弹框校验
            fileList: [],  //已选择需要上传的图片
        };
    },

    mounted() {
        this.getGroupList();
        this.getTypeControlList();
        this.getHeadimageList();
    },

    methods: {
        imgBefore(file) {
            let { size } = file || {};
            if (size >  200 * 1024) {
                 this.$message.error('图片大小请不要超过200kb');
                 return false
            }
        },
        // 图片删除
        handleRemove(file, fileList) {
            console.log('图片删除', file, fileList);
            this.fileList = fileList
        },
        // 图片上传成功返回
        handleSucess(response, file, fileList) {
            console.log('图片上传', response, file, fileList);
            // if(response.status!='200'){
            //     this.$message.warning(response.msg);
            //     fileList.pop()
            // }
            this.fileList = fileList
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
            } catch (error) {
                console.error(error);
            }
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
        // 图片上传提交
        submitForimg() {
            if (this.fileList.length == 0) {
                return this.$message.warning({ message: '请选择需要上传的图片' });
            }
            this.$refs['imgForm'].validate((valid) => {
                if (!valid) return false;
                this.imgSubmitting = true;
                let fileList = this.fileList.map((item) => {
                    return item.response.data;
                }).join(",");
                console.log(fileList);
                let typecontrolId = this.imgForm.library[this.imgForm.library.length - 1] ?? ''
                let data = {
                    typecontrol_id: typecontrolId,
                    image: fileList,
                    grouping_id: this.imgForm.group,
                }
                this.addHeadimage(data)
            })
        },
        // 图片上传接口调用
        async addHeadimage(data) {
            try {
                let result = await this.$api({ type: "addHeadimage", data: data });
                if (result.status == '200') {
                    this.imgSubmitting = false;
                    this.fileList = [];
                    this.imgUploadVisible = false;
                    this.imgForm = {
                        group: '',  //分组
                        library: '',  //库
                    };
                    this.$refs.imgUnload.clearFiles()
                    this.getHeadimageList()
                    this.$message.success({ message: result.msg })
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                console.error(error);
            }
        },
        // 取消图片上传弹框
        imgUploadClose() {
            this.fileList = [];
            this.imgForm = {
                group: '',  //分组
                library: '',  //库
            };
            this.$refs.imgUnload.clearFiles()
            this.imgUploadVisible = false
        },
        /*
           图片上传弹框
        */
        imgUpLoad() {
            this.fileList = [];
            this.imgForm = {
                group: '',  //分组
                library: '',  //库
            };
            this.imgUploadVisible = true
        },
        /*
           删除图片
        */
        async removeHandler(val) {
            let data = {
                headimage_ids: val.headimage_id,
            }
            try {
                let result = await this.$api({ type: "deleteHeadimage", data: data });
                if (result.status == '200') {
                    this.$message.success({ message: '图片删除成功' });
                    this.getHeadimageList()
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
            this.getHeadimageList();
        },
        /*
          获取表格已选择的数据
       */
        selectionChange(val) {
            console.log(val);
        },
        // 搜索数据
        searchTable() {
            this.submitting = true
            this.getHeadimageList()
            console.log('搜索数据', this.searchTableData);
        },
        /*
            获取图片
        */
        async getHeadimageList() {
            let order = ''
            if (this.searchTableData.sort != '') {
                order = 'usage_time'
            }
            let typecontrolId = this.searchTableData.library[this.searchTableData.library.length - 1] ?? ''
            let data = {
                limit: this.current_limit,
                page: this.current_page,
                img_num: '',
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
                let result = await this.$api({ type: "getHeadimageList", data: data });
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
            this.getHeadimageList()
        },

    },
};
</script>

<style scoped>
::v-deep .el-image-viewer__canvas {
    width: 40%;
}

.search-title {
    font-size: 13px;
    padding-right: 10px;
}

.imgsize {
    width: 100px;
    height: 30px;
}
</style>