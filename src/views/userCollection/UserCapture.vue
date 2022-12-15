<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-input class="blogger" type="textarea" :rows="3" v-model="bloggerLink"
                    placeholder="请输入博主主页链接（一行一个）,每条链接请求时间大概为20秒，请耐心等待"></el-input>
                <el-button type="primary" :loading="collectioning" @click="configureParameter">{{ collectioning ?
                        '采集参数中...' : '配置采集参数'
                }}</el-button>
            </div>
        </div>
        <el-dialog title="采集配置" :visible.sync="configureVisible" width="40%" :before-close="configureClose">
            <el-form ref="form" :rules="rules" :model="configureForm" label-width="140px"
                :hide-required-asterisk="true">
                <el-form-item label="任务名:" prop="task_name">
                    <el-input v-model="configureForm.task_name" placeholder="请输入任务名" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="采集的数据标签:" prop="label">
                    <el-input v-model="configureForm.label" placeholder="请输入活动名称" style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="采集内容:" prop="type_list">
                    <el-checkbox-group v-model="configureForm.type_list">
                        <el-checkbox v-for="(item, index) in collectionContentlist" :label="item.value" :key="index">{{
                                item.label
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="单博主采集上限:" prop="upper_limit">
                    <el-input-number v-model="configureForm.upper_limit" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="黑名单:">
                    <el-checkbox-group v-model="configureForm.black_list">
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
                <div>
                    <span style="padding-right:10px;font-size:13px">昵称:</span>
                    <el-input v-model="searchData.nickname" placeholder="请输入昵称"
                        style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <div>
                    <span style="padding-right:10px;font-size:13px">uid:</span>
                    <el-input v-model="searchData.uid" placeholder="请输入uid"
                        style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <div>
                    <span style="padding-right:10px;font-size:13px">数据来源:</span>
                    <el-select v-model="searchData.sources" placeholder="请选择数据来源"  style="width:140px;margin-right: 20px;">
                        <el-option v-for="item in collectionContentlist" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>

                </div>
                <div>
                    <span style="padding-right:10px;font-size:13px">数据标签:</span>
                    <el-input v-model="searchData.label" placeholder="请输入数据标签"
                        style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <el-button type="primary" :loading="searching" @click="searchTable">{{ searching ? '查询中 ...' : '查 询'
                }}</el-button>
                <el-button type="primary" :loading="searching" @click="resetClick">重 置</el-button>
            </div>
        </div>
        <div>
            <table-custom :loading="loading" :tableData="tableData" :columns="columns" :mutiSelect="true" @handleSelectionChange="selectionChange"></table-custom>
            <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination"></pagination>
        </div>
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
            searchData: {
                nickname: '',
                uid: '',
                sources: '',
                label: '',
            },
            searching: false,
            collectioning: false,
            loading: false, //表格加载loading
            tableData: [],  //表格数据
            columns: [
                {
                    prop: 'country',
                    label: '国家',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
                },
                {
                    prop: 'uid',
                    label: 'uid',
                    minWidth: 200,
                    fixed: true,
                    align: 'center',
                },
                {
                    prop: 'nickname',
                    label: '昵称',
                    minWidth: 160,
                    align: 'center',
                },
                {
                    prop: 'avatar_thumb',
                    label: '头像',
                    minWidth: 150,
                    align: 'center',
                    render: (h, { row }) => {
                        let imgList = []
                        imgList[0] = row.avatar_thumb
                        return (
                            <div>
                                <el-image style="width: 50px; height: 50px" src={row.avatar_thumb} preview-src-list={imgList}></el-image>
                            </div>
                        );
                    },
                },
                {
                    prop: 'signature',
                    label: '签名',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'sources',
                    label: '数据来源',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'label',
                    label: '数据标签',
                    minWidth: 180,
                    align: 'center',
                },
                {
                    prop: 'following_count',
                    label: '关注/粉丝/获赞',
                    minWidth: 160,
                    align: 'center',
                    render: (h, { row }) => {
                        return (
                            <div>
                                <div>{row.following_count}/{row.follower_status}/{row.total_favorited}</div>
                            </div>
                        );
                    },
                },
                {
                    prop: 'aweme_count',
                    label: '作品数量',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'updata_time',
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
                task_name: '',
                label: '',
                type_list: [],
                upper_limit: '',
                black_list: [],
            },//配置采集参数弹框数据
            rules: {
                task_name: [{ required: true, message: '请输入任务名', trigger: 'blur' }],
                label: [{ required: true, message: '请输入采集的数据标签', trigger: 'blur' }],
                type_list: [{ required: true, message: '请选择采集内容', trigger: 'blur' }],
                upper_limit: [{ required: true, message: '请输入单博主采集上限', trigger: 'blur' }],

            },  //必填校验
            collectionContentlist: [
                {
                    label: '粉丝列表',
                    value: 'CollectionFans',
                },
                {
                    label: '关注列表',
                    value: 'CollectionFollow ',
                },
            ],//采集内容
            collectionBlacklistlist: [
                {
                    label: '无头像',
                    value: 'no_avatar',
                },
                {
                    label: '无作品',
                    value: 'no_aweme',
                },
                {
                    label: '历史已操作用户',
                    value: 'historical_users',
                },
                {
                    label: '无昵称',
                    value: 'no_nickname',
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
            allSearchList: [],
            userList: '',  //暂存搜索到的数据
        };
    },

    mounted() {
        this.externalmemberIndex()

    },

    methods: {
        // 查询表格
        searchTable() {
            this.current_page = 1;  //页数
            this.searching = true
            this.externalmemberIndex()
        },
        // 获取表格数据
        async externalmemberIndex() {
            let data = {
                limit: this.current_limit,
                page: this.current_page,
                uid: this.searchData.uid,
                nickname: this.searchData.nickname,   //昵称
                status: '',  //状态1-正常-封禁2-登出
                sources: this.searchData.sources,  //数据来源·
                label: this.searchData.label,  //数据标签·
                if_collection: '', //1=未用，@=以用
            }
            try {
                this.loading = true
                let result = await this.$api({ type: "externalmemberIndex", data: data });
                this.searching = false
                this.loading = false
                if (result.status == '200') {
                    this.tableData = result.data.list
                    this.total  = result.data.count
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                this.loading = false
                this.searching = false
                console.error(error);
            }

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
                this.collectionUser()
            })
        },
        // 向后台传参（搜索的用户信息）
        async collectionUser() {
            let data = this.configureForm
            data.uid_list = this.userList
            try {
                let result = await this.$api({ type: "collectionUser", data: data });
                if (result.status == '200') {
                    this.$message.success({ message: '数据采集中,请稍后刷新页面查看' })
                    this.configureVisible = false
                    this.userList = []
                    this.bloggerLink = ''
                    this.configureForm = {
                        task_name: '',
                        label: '',
                        type_list: [],
                        upper_limit: '',
                        black_list: [],
                    }//配置采集参数弹框数据
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                console.error(error);
            }
        },
        /*
           配置采集参数
        */
        configureParameter() {
            if (this.bloggerLink == '') {
                this.$message({ message: '请输入博主主页链接', type: 'warning' });
            } else {
                let listLink = []
                this.bloggerLink.split('\n').forEach((item) => {
                    if (item.replace(/\s/gi, '')) {
                        listLink.push(item.replace(/\s/gi, ''));
                    }
                });
                this.$nextTick(() => {
                    let type = 1
                    listLink.forEach((item) => {
                        if (item.indexOf('https://www.tiktok.com/@') == -1) {
                            type = 2
                            this.$message({ message: '请检查链接是否全部正确，以https://www.tiktok.com/@开头', type: 'warning' });
                        }
                    })
                    this.$nextTick(() => {
                        if (type == 1) {
                            // this.getRestByKeys(listLink)
                            this.allSearchList = []
                            this.getRestByKeys(listLink)
                        }
                    });
                });
            }
        },
        // 处理用户信息
        async getRestByKeys(listLink) {
            this.collectioning = true
            listLink.forEach((item) => {
                let data = {
                    keyword: item.replace('https://www.tiktok.com/@', ''),
                };
                this.allSearchList.push(this.testGetRestByKeys(data))
            })
            this.userList = await Promise.all(this.allSearchList)
            this.collectioning = false
            this.configureVisible = true

        },
        // 搜索链接,获取tk信息
        async testGetRestByKeys(data) {
            try {
                let result = await this.$api({ type: "testGetRestByKeys", data: data });
                if (result.status == '200') {
                    let list = result.data[0]
                    let listType = {
                        uid: list.uid,
                        sec_uid: list.sec_uid,
                        unique_id: list.unique_id,
                    }
                    return listType
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                console.error(error);
            }
        },
        /*
           关闭配置采集参数弹框
        */
        configureClose() {
            this.configureVisible = false
            this.userList = []
            this.bloggerLink = ''
            this.configureForm = {
                task_name: '',
                label: '',
                type_list: [],
                upper_limit: '',
                black_list: [],
            }//配置采集参数弹框数据
        },
        /*
           翻页回调
        */
        handlePagination(val) {
            console.log(val);
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
            this.externalmemberIndex()
        },
        // 重置表格
        resetClick() {
            this.searchData = {
                nickname: '',
                uid: '',
                sources: '',
                label: '',
            }
            this.current_page = 1  //当前页
            this.current_limit = 10 //每页条数
            this.externalmemberIndex()
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
    flex-wrap: wrap;
    padding: 10px;
}

.blogger {
    width: 400px;
    margin-right: 20px;
}
</style>