<template>
    <div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <el-input class="blogger" size="medium" type="textarea" :rows="3" v-model="bloggerLink"
                    placeholder="请输入博主UID或主页链接（一行一个）,每条链接请求时间大概为20秒，请耐心等待"></el-input>
                <el-button type="primary" size="medium" :loading="collectioning" @click="configureParameter">{{
                    collectioning?'采集参数中...': '配置采集参数'
                }}</el-button>
            </div>
            <!-- <div class="tt-accsituation--operation">
                <div>
                    <el-input size="medium" v-model="searchData.nickname" placeholder="请输入昵称" style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <div>
                    <el-input size="medium" v-model="searchData.uid" placeholder="请输入uid" style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <div>
                    <el-select size="medium" v-model="searchData.sources" placeholder="请选择数据来源"
                        style="width:140px;margin-right: 20px;">
                        <el-option v-for="item in collectionContentlist" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div>
                    <el-input size="medium" v-model="searchData.label" placeholder="请输入数据标签" style="width:140px;margin-right: 20px;"></el-input>
                </div>
                <el-button type="primary" size="medium" :loading="searching" @click="searchTable">{{searching? '查询中...' : '查 询'}}</el-button>
                <el-button type="primary" size="medium" :loading="searching" @click="resetClick">重 置</el-button>
            </div> -->
        </div>
        <el-dialog title="采集配置" :visible.sync="configureVisible" width="40%" :before-close="configureClose">
            <el-form ref="form" :rules="rules" :model="configureForm" label-width="140px">
                <el-form-item label="任务名:" prop="task_name">
                    <el-input size="medium" v-model="configureForm.task_name" placeholder="请输入任务名"
                        style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="采集的数据标签:" prop="label">
                    <el-input size="medium" v-model="configureForm.label" placeholder="请输入活动名称"
                        style="width:60%"></el-input>
                </el-form-item>
                <el-form-item label="采集内容:" prop="type_list">
                    <el-checkbox-group v-model="configureForm.type_list" size="medium">
                        <el-checkbox v-for="(item, index) in collectionContentlist" :label="item.value" :key="index">{{
                            item.label
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="单博主采集上限:" prop="upper_limit">
                    <el-input type="number" size="medium" placeholder="请输入采集上限" v-model="configureForm.upper_limit"
                        min="0">
                    </el-input>
                </el-form-item>
                <el-form-item label="黑名单:">
                    <el-checkbox-group v-model="configureForm.black_list" size="medium">
                        <el-checkbox v-for="(item, index) in collectionBlacklistlist" :label="item.value"
                            :key="index">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="configureClose" size="medium">取 消</el-button>
                <el-button type="primary" size="medium" :loading="submitting" @click="submitForm">{{
                    submitting? '提交中...'
                        : '确 定'
                }}</el-button>
            </span>
        </el-dialog>
        <div>
            <table-custom height="700" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
            <pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
            </pagination>
        </div>

        <el-dialog title="用户采集任务详情" :visible.sync="userDetailVisible" width="70%" :before-close="userDetailClose">
            <table-custom height="700" :loading="detailLoading" :tableData="detailTableData" :columns="detailColumns"
                :mutiSelect="true" @handleSelectionChange="detailSelectionChange"></table-custom>
            <pagination :total="detailTotal" :page="detailCurrent_page" :limit="detailCurrent_limit"
                @pagination="detailHandlePagination"></pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userDetailClose" size="medium">取 消</el-button>
            </span>
        </el-dialog>
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
            userDetailVisible: false,
            detailLoading: false,
            detailTableData: [],
            detailTotal: 0,
            detailCurrent_page: 1,
            detailCurrent_limit: 10,
            detailColumns: [
                {
                    prop: 'country',
                    label: '国家',
                    minWidth: 100,
                    fixed: true,
                    align: 'center',
                },
                {
					prop: "avatar_thumb",
					label: "头像",
					align: "left",
					width: "200",
					render: (h, { row }) => {
						return (
							<div style="display: flex;max-width: 260px">
								<el-image
									class="table-avatar mr-15"
									src={row.avatar_thumb}
									style="width: 50px; height: 50px; border-radius: 50%;margin-right: 16px"
								></el-image>
								<div>
									<p style="font-size: 14px;">{row.nickname}</p>
									<p style="font-size: 12px;">ID ：{row.uid}</p>
								</div>
							</div>
						);
					},
				},
               
                {
                    prop: 'signature',
                    label: '签名',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'sources',
                    label: '数据来源',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'label',
                    label: '数据标签',
                    minWidth: 150,
                    align: 'center',
                },
                {
                    prop: 'following_count',
                    label: '关注/粉丝/获赞',
                    minWidth: 150,
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
                    prop: 'addtime',
                    label: '采集时间',
                    minWidth: 150,
                    align: 'center',
                },
            ],  //详情表格
            searchData: {
                nickname: '',
                uid: '',
                sources: '',
                label: '',
            },
            searching: false,
            collectioning: false,
            loading: false, //表格加载loading
            tableData: [
                {
                    create_time: '2023-01-05 12:00'
                }
            ],  //表格数据
            columns: [
                {
                    prop: "create_time",
                    label: "创建时间",
                    align: "center",
                },
                {
                    prop: "task_name",
                    label: "任务名称",
                    align: "center",
                },
                {
                    prop: "status",
                    label: "任务状态",
                    align: "center",
                    render: (h, { row }) => {
                        return <div>{row.status == 0 ? "已完成" : "未完成"}</div>;
                    },
                },
                {
                    label: "任务进度",
                    align: "center",
                    render(h, { row }) {
                        const { complete_num, fail_num } = row;
                        let percent;
                        if (Number(complete_num) + Number(fail_num) == 0) {
                            percent = "0.00%";
                        } else {
                            percent =
                                (
                                    (Number(complete_num) /
                                        (Number(complete_num) + Number(fail_num))) *
                                    100
                                ).toFixed(2) + "%";
                        }
                        return <div>{percent}</div>;
                    },
                },
                {
                    label: "操作",
                    align: "center",
                    render: (h, { row }) => {
                        return (
                            <div>
                                <el-button
                                    type="success"
                                    size="mini"
                                    onClick={this.toDetail.bind(this, row.tasklist_id)}
                                >
                                    查看详情
                                </el-button>
                                <el-button
                                    type="warning"
                                    size="mini"
                                    onClick={this.suspend.bind(this, row.tasklist_id)}
                                >
                                    暂停
                                </el-button>
                                <el-popconfirm
                                    confirm-button-text="删除"
                                    cancel-button-text="取消"
                                    title="确认删除该任务吗？"
                                    onConfirm={this.delete.bind(this, row.tasklist_id)}
                                >
                                    <el-button
                                        slot="reference"
                                        type="danger"
                                        size="mini"
                                        style="margin-left: 10px;"
                                    >
                                        删除
                                    </el-button>
                                </el-popconfirm>
                            </div>
                        );
                    },
                },
            ],
            total: 0,  //数据总量
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
                upper_limit: [
                    { required: true, message: '请输入单博主采集上限', trigger: 'blur' },
                    { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
                ],

            },  //必填校验
            collectionContentlist: [
                {
                    label: '粉丝列表',
                    value: 'CollectionFans',
                },
                {
                    label: '关注列表',
                    value: 'CollectionFollow',
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
            allSearchList: [],
            userList: '',  //暂存搜索到的数据
        };
    },

    mounted() {
        // this.externalmemberIndex()

    },

    methods: {
        // 删除
        delete() {
            this.$message.success({ message: '删除成功' })
        },
        // 暂停/开始
        suspend() {
            this.$message.success({ message: '操作成功' })
        },
        // 查看详情
        toDetail() {
            this.userDetailVisible = true
            this.externalmemberIndex()
        },
        // 查询表格
        searchTable() {
            this.detailCurrent_page = 1;  //页数
            this.searching = true
            this.externalmemberIndex()
        },
        // 获取表格数据
        async externalmemberIndex() {
            let data = {
                limit: this.detailCurrent_limit,
                page: this.detailCurrent_page,
                uid: this.searchData.uid,
                nickname: this.searchData.nickname,   //昵称
                status: '',  //状态1-正常-封禁2-登出
                sources: this.searchData.sources,  //数据来源·
                label: this.searchData.label,  //数据标签·
                if_collection: '', //1=未用，@=以用
            }
            try {
                this.detailLoading = true
                let result = await this.$api({ type: "externalmemberIndex", data: data });
                this.searching = false
                this.detailLoading = false
                if (result.status == '200') {
                    this.detailTableData = result.data.list
                    this.detailTotal = result.data.count
                } else {
                    this.$message.error({ message: result.msg })
                }
            } catch (error) {
                this.detailLoading = false
                this.searching = false
                console.error(error);
            }

        },
        /*
           获取表格已选择的数据
        */
        detailSelectionChange(val) {
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
                this.submitting = false
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
                    if (item != '') {
                        listLink.push(item.replace(/(^\s*)|(\s*$)/g, ""))
                    }
                });
                this.$nextTick(() => {
                    this.allSearchList = []
                    this.getRestByKeys(listLink)
                    // let type = 1
                    // listLink.forEach((item) => {
                    //     if (item.indexOf('https://www.tiktok.com/@') == -1) {
                    //         type = 2
                    //         this.$message({ message: '请检查链接是否全部正确，以https://www.tiktok.com/@开头', type: 'warning' });
                    //     }
                    // })
                    // this.$nextTick(() => {
                    //     if (type == 1) {
                    //         this.getRestByKeys(listLink)
                    //         this.allSearchList = []
                    //         this.getRestByKeys(listLink)
                    //     }
                    // });
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
            this.$nextTick(() => {
                console.log('', this.userList);
                // if(this.userList.indexOf(undefined)==-1){
                this.configureVisible = true
                // }
                this.collectioning = false
            })
        },
        // 搜索链接,获取tk信息
        async testGetRestByKeys(data) {
            try {
                let result = await this.$api({ type: "testGetRestByKeys", data: data });
                if (result.status == '200') {
                    if (result.data.length >= 0) {
                        let list = result.data[0]
                        let listType = {
                            uid: list.uid,
                            sec_uid: list.sec_uid,
                            unique_id: list.unique_id,
                        }
                        return listType
                    }
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
        detailHandlePagination(val) {
            this.detailCurrent_page = val.page;  //页数
            this.detailCurrent_limit = val.limit  //条数
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
            this.detailCurrent_page = 1  //当前页
            this.detailCurrent_limit = 10 //每页条数
            this.externalmemberIndex()
        },
        userDetailClose() {
            this.userDetailVisible = false;
            this.detailTableData = [];
            this.detailTotal = 0
            this.detailCurrent_page = 1
            this.detailCurrent_limit = 10
        },
        handlePagination(val) {
            this.current_page = val.page;  //页数
            this.current_limit = val.limit  //条数
            // this.externalmemberIndex()
        },
    },
};
</script>

<style scoped>
.blogger {
    width: 400px;
    margin-right: 20px;
}
</style>