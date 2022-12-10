<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-input class="blogger" type="textarea" :rows="2" v-model="bloggerLink"
                    placeholder="请输入博主主页链接（一行一个）"></el-input>
                <el-button type="primary" @click="configureParameter">配置采集参数</el-button>
            </div>
        </div>
        <el-dialog title="采集配置" :visible.sync="configureVisible" width="40%" :before-close="configureClose">
            <el-form ref="form" :rules="rules" :model="configureForm" label-width="140px"
                :hide-required-asterisk="true">
                <el-form-item label="任务名:" prop="name">
                    <el-input v-model="configureForm.name" placeholder="请输入任务名" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="采集的数据标签:" prop="label">
                    <el-input v-model="configureForm.label" placeholder="请输入活动名称" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="采集内容:" prop="content">
                    <el-checkbox-group v-model="configureForm.content">
                        <el-checkbox v-for="(item, index) in collectionContentlist" :label="item.value" :key="index">{{
                                item.label
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="单博主采集上限:" prop="limit">
                    <el-input-number v-model="configureForm.limit" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="黑名单:">
                    <el-checkbox-group v-model="configureForm.blacklist">
                        <el-checkbox v-for="(item, index) in collectionBlacklistlist" :label="item.value"
                            :key="index">{{
                                    item.label
                            }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="configureClose">取 消</el-button>
                <el-button type="primary" :loading="submitting" @click="submitForm">{{ submitting ? '提交中 ...' : '确 定'
                }}</el-button>
            </span>
        </el-dialog>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-select v-model="searchCountry" placeholder="请选择国家" style="width:200px;margin-right:20px">
                    <el-option v-for="item in countryList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <!-- <el-select v-model="searchDataSource" placeholder="请选择数据来源">
                <el-option v-for="item in dataSourceList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-select v-model="searchDataLabel" placeholder="请选择数据标签">
                <el-option v-for="item in dataLabelList" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select> -->
                <el-button type="primary" :loading="submitting" @click="searchTable">{{ submitting ? '查询中 ...' : '查询'
                }}</el-button>
            </div>
        </div>

        <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true"
            @handleSelectionChange="selectionChange"></table-custom>
        <pagination :total="total" :page="current_page" :size="current_limit" @pagination="handlePagination"></pagination>
    </div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
    name: 'TtUserCapture',
    components: {
        tableCustom,
        pagination,
    },
    data() {
        return {
            loading: false, //表格加载loading
            tableData: [
                {
                    nickName: '中国',
                    id: '1',
                }
            ],  //表格数据
            columns: [
                {
                    prop: 'nickName',
                    label: '国家',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: 'uid',
                    minWidth: 160,
                    fixed: true,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '昵称',
                    minWidth: 160,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '头像',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '签名',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '数据来源',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '数据标签',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '关注/粉丝/获赞',
                    minWidth: 160,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '作品数量',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '采集时间',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'nickName',
                    label: '上次使用时间',
                    minWidth: 180,
                    align: 'center',
                },
                // {
                //     prop: 'status',
                //     label: '操作',
                //     width: 150,
                //     fixed: 'right',
                //     render: (h, { row }) => {
                //         return (
                //             <div>
                //                 <a onClick={this.removeHandler.bind(this, row.id)}>编辑</a>
                //             </div>
                //         );
                //     },
                // },
            ],  //表格
            total: 100,  //数据总量
            current_page: 1, //当前页
            current_limit: 10, //每页条数
            bloggerLink: '', //博主主页链接
            configureVisible: false,  //配置采集参数弹框
            configureForm: {
                name: '',
                label: '',
                content: [],
                blacklist: [],
                limit: '',
            },//配置采集参数弹框数据
            rules: {
                name: [{ required: true, message: '请输入任务名', trigger: 'blur' }],
                label: [{ required: true, message: '请输入采集的数据标签', trigger: 'blur' }],
                content: [{ required: true, message: '请选择采集内容', trigger: 'blur' }],
                limit: [{ required: true, message: '请输入单博主采集上限', trigger: 'blur' }],

            },  //必填校验
            collectionContentlist: [
                {
                    label: '粉丝列表',
                    value: 1,
                },
                {
                    label: '关注列表',
                    value: 2,
                },
                {
                    label: '评论列表',
                    value: 3,
                },
            ],//采集内容
            collectionBlacklistlist: [
                {
                    label: '无头像',
                    value: 1,
                },
                {
                    label: '无作品',
                    value: 2,
                },
                {
                    label: '历史已操作用户',
                    value: 3,
                },
                {
                    label: '无昵称',
                    value: 4,
                },
            ],//黑名单
            submitting: false,  //配置采集参数提交确定
            countryList: [
                {
                    value: '1',
                    label: '中国'
                },
                {
                    value: '2',
                    label: '美国'
                },
                {
                    value: '3',
                    label: '英国'
                },
            ],  //国家
            searchCountry: '',  //国家搜索
            dataSourceList: [
                {
                    value: '1',
                    label: '评论列表'
                },
                {
                    value: '2',
                    label: '关注列表'
                },
                {
                    value: '3',
                    label: '粉丝列表'
                },
            ],  //数据来源
            searchDataSource: '',  //数据来源搜索
            dataLabelList: [
                {
                    value: '1',
                    label: '巴西美女'
                },
                {
                    value: '2',
                    label: '日本宠物'
                },
                {
                    value: '3',
                    label: '英国网赚'
                },
            ],  //数据标签
            searchDataLabel: '',  //数据标签搜索
        };
    },

    mounted() {

    },

    methods: {
        // removeHandler(val){
        //     console.log(val);

        // },
        /*
            查询
        */
        searchTable() {
            this.handlerCurrentChange()
            // this.submitting=true
        },
        /*
        function: handlerCurrentChange
        params: val | default
        desc: 分页的回调，设置page为val，当val改变时发起请求，获取数据重新渲染页面
    */
        async handlerCurrentChange() {
            // try {
            //     console.log(val);
            //     this.page = val;
            //     let result = await this.$api({
            //         type: "getMember",
            //         data: { page: this.page },
            //     });
            //     this.memberList = result.list;
            // } catch (error) {
            //     console.error(error);
            // }
        },
        /*
           获取表格已选择的数据
        */
        selectionChange(val) {
            console.log(val);
        },
        /*
           配置采集参数提交
        */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (!valid) return false;
                this.submitting = true;
                console.log(this.configureForm);
                this.handlerCurrentChange()
                // const params = Object.assign({}, this.configureForm);
            })
        },
        /*
           配置采集参数
        */
        configureParameter() {
            if (this.bloggerLink == '') {
                this.$message({ message: '请输入博主主页链接', type: 'warning' });
            } else {
                this.configureVisible = true
            }
        },
        /*
           关闭配置采集参数弹框
        */
        configureClose() {
            this.configureVisible = false
        },
        /*
           翻页回调
        */
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
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

.blogger {
    width: 300px;
    margin-right: 20px;
}
</style>