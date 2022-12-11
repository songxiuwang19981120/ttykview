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
                        style="width:200px;margin-right:20px"></el-cascader>
                </div>
                <div>
                    <span class="search-title">素材类型:</span>
                    <el-select v-model="searchTableData.type" placeholder="素材类型" style="width:170px;margin-right:20px">
                        <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <span class="search-title">时间排序:</span>
                    <el-select v-model="searchTableData.sort" placeholder="时间排序" style="width:120px;margin-right:20px">
                        <el-option v-for="item in searchTimeSortList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </div>
                <el-button type="primary" :loading="submitting" @click="searchTable">{{ submitting ? '搜索中 ...' : '搜索'
                }}</el-button>
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
                <el-button type="primary" @click="videoUpLoad">上传</el-button>
            </div>
        </div>
        <el-dialog title="视频上传" :visible.sync="videoVisible" width="40%" :before-close="videoClose">
            <el-form ref="form" :rules="rules" :model="videoForm" label-width="140px" :hide-required-asterisk="true">
                <el-form-item label="视频:" prop="name">
                    <el-upload class="upload-demo" drag action="#" multiple accept=".mp4" :on-change="onFileListChange">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload> </el-form-item>
                <video src="url"></video>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="videoClose">取 消</el-button>
                <el-button type="primary" :loading="videoSubmitting" @click="submitForVideo">{{ videoSubmitting ?
                        '提交中...' : '提 交'
                }}</el-button>
            </span>
        </el-dialog>
        <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom>
        <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>
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
            loading: false, //表格加载loading
            tableData: [],  //表格数据
            columns: [
                {
                    prop: 'nickName',
                    label: '视频缩略图',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
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
                    width: 150,
                    align: 'center',
                    fixed: 'right',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button size="mini" type="success" onClick={this.removeHandler.bind(this, row)}>播放</el-button>
                                <el-button size="mini" type="danger" onClick={this.removeHandler.bind(this, row)}>删除</el-button>

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
                type: '',
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
                    value: '1',
                    label: '已用素材'
                },
                {
                    value: '2',
                    label: '可用素材'
                },
            ],  //素材类型
            videoVisible: false,  //视频上传弹框
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
        videoClose() {
            this.videoVisible = false
        },
        /*
           视频上传弹框
        */
        videoUpLoad() {
            this.videoVisible = true
        },
        removeHandler() {
            console.log('删除');
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

.search-title {
    font-size: 13px;
    padding-right: 10px;
}
</style>