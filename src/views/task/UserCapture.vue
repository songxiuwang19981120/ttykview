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
        </div>
        <div class="tt-accsituation">
            <div class="tt-accsituation--operation">
                <div  style="margin-right: 10px">
                    <el-select v-model="search.status" placeholder="请选择任务状态" size="medium"  style="margin-right: 10px">
                        <el-option v-for="item in searchStateList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker value-format="yyyy-MM-dd" size="medium" class="date-picker" v-model="search.date"
                        type="daterange" align="right" unlink-panels range-separator="——" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
                <el-button type="primary" size="medium" class="seachbut" :loading="btnloading" @click="searchTasks">{{
                    btnloading? "加载中...": "搜索"
                }}</el-button>
                <el-button type="primary" size="medium" class="seachbut" @click="btnReset">重置</el-button>
                <!-- <i class="el-icon-refresh-left"></i> -->
            </div>
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
            <table-custom :height="tableHeight" :loading="loading" :tableData="tableData"
                :columns="columns"></table-custom>
            <pagination :total="total" :page="page" :limit="limit" @pagination="handlePagination">
            </pagination>
        </div>

        <el-dialog title="用户采集任务详情" :visible.sync="userDetailVisible" width="80%" :before-close="userDetailClose">
            <table-custom :height="tableDataDetail" :loading="detailLoading" :tableData="detailTableData" :columns="detailColumns" @handleSelectionChange="detailSelectionChange"></table-custom>
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
            search: {
                status: '',
                date: '',
            },
            tableHeight: String(window.innerHeight - 300),
            tableDataDetail:String(window.innerHeight - 400),
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
                    width: "250",
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
            tableData: [],  //表格数据
            pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
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
					prop: 'status',
					label: '任务状态',
					align: 'center',
					render: (h, { row }) => {
						return <div>{row.status == 0 ? '已完成' : '未完成'}</div>;
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
									v-show={row.status == 1}
									type='warning'
									size="mini"
									onClick={this.suspend.bind(this, row.tasklist_id)}
								>
									暂停
								</el-button>
								<el-button
									v-show={row.status == 2}
									type='info'
									size="mini"
									onClick={this.continue.bind(this, row.tasklist_id)}
								>
									继续
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
            // 下拉选择数据
            searchStateList: [
                {
                    value: "0",
                    label: "已完成",
                },
                {
                    value: "1",
                    label: "未完成",
                },
            ],
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
            total: 0,  //数据总量
            page: 1,
            limit: 10,
            tasklist_id: '',
            btnloading:false, //搜索
        };
    },

    mounted() {
        this.getVideoTasks();
    },

    methods: {
        btnReset(){
            this.page = 1;
            this.getVideoTasks();
            this.search.date=''
            this.search.status=''

        },
        searchTasks() {
            this.page = 1;
            this.btnloading = true
            this.getVideoTasks();
        },
        // 获取采集任务列表
        async getVideoTasks() {
            let data = {
                page: this.page,
                limit: this.limit,
                status: this.search.status,
                // date: this.search.date,
                task_type: 'CollectionUser',
            };
            try {
                this.loading = true;
                const res = await this.$api({
                    type: 'getTasklist',
                    data,
                });
                if (res.status == 200) {
                    this.tableData = res.data.list;
                    this.total = res.data.count;
                } else {
                    this.$message.error(res.msg);
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.loading = false;
                this.btnloading = false;
            }
        },
        // 删除
		async delete(id) {
			let data = {
				tasklist_ids: id
			}
			try {
				const res = await this.$api({
					type: "deleteTask",
					data,
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
        // 暂停
        async suspend(id) {
            try {
				const res = await this.$api({
					type: 'pauseTask',
					data: {
						tasklist_id:id,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
        },
        // 继续
		async continue(id) {
			try {
				const res = await this.$api({
					type: 'continueTask',
					data: {
						tasklist_id:id,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
        // 查看详情
        toDetail(id) {
            this.userDetailVisible = true
            this.tasklist_id = id
            this.externalmemberIndex()
        },
        // 查询表格
        // 获取表格数据
        async externalmemberIndex() {
            let data = {
                limit: this.detailCurrent_limit,
                page: this.detailCurrent_page,
                tasklist_id: this.tasklist_id,
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
                    this.$message.success({ message: '采集任务新增成功' })
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
                    this.getVideoTasks()
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
        userDetailClose() {
            this.userDetailVisible = false;
            this.detailTableData = [];
            this.tasklist_id = ''
            this.detailTotal = 0
            this.detailCurrent_page = 1
            this.detailCurrent_limit = 10
        },
        handlePagination(val) {
            this.page = val.page;  //页数
            this.page = val.limit  //条数
            this.getVideoTasks()
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