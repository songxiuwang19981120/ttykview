<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<el-select v-model="searchTableData.equipment" placeholder="账号分组选择" style="margin-right: 20px"
						@change="searchEquipmentChange" clearable>
						<el-option v-for="item in searchEquipmentList" :key="item.grouping_id"
							:label="item.grouping_name" :value="item.grouping_id">
						</el-option>
					</el-select>
				</div>
				<div>
					<el-cascader :props="{ checkStrictly: true }" :options="searchTypecontrolList"
						v-model="searchTableData.typecontrol" placeholder="账号分类选择" style="margin-right: 20px"
						clearable></el-cascader>
				</div>
				<div>
					<!-- 查询 -->
					<el-button size="medium" type="primary" :loading="btnloading" @click="searchNickName">{{ btnloading ? '加载中...'
		: '搜索'
}}</el-button>
					<el-button size="medium" type="primary" @click="btnReset">重置</el-button>
					<el-button size="medium" type="primary" @click="uploadNickName">上传</el-button>
				</div>
			</div>
		</div>
		<table-custom height="600" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>

		<el-dialog title="编辑" :visible="contentVisibleUpdate" @close="exitCancel" width="50%" style="margin-top:20px">
			<el-form :model="ruleForm" ref="ruleForm" :rules="exitRules" label-width="120px">
				<el-form-item prop="UpdateText" label="主题内容">
					<el-input placeholder="请输入主题内容" v-model="ruleForm.UpdateText" style="width: 60%">
					</el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end" slot="footer">
				<el-button size="small" @click="exitCancel">取消</el-button>
				<el-button type="primary" :loading="exitLoading" @click="exitSubject">{{ exitLoading ? '修改中...' :'确定'}}</el-button>
			</el-row>
		</el-dialog>
		<!-- 表格 -->
		<el-dialog title="主题内容列表" :visible="contentVisible" @close="contentCancel" width="60%">
			<el-button @click="batchDelete" type="primary" :loading="deleteing">{{ deleteing ? '删除中 ...' :'批量删除'}}</el-button>
			<table-custom :mutiSelect="true" @handleSelectionChange="selectionChange" :loading="loadingList"
				:tableData="tableDataList" :columns="columnsList"></table-custom>
			<pagination :total="total" :page="current_page" :limit="current_limit" @pagination="handlePagination">
			</pagination>
		</el-dialog>
		<!-- 上传弹层 -->
		<NickNameUploadDialog :showDialog.sync="showUploadDialog" :upParameter="parameterData"></NickNameUploadDialog>
	</div>
</template>

<script>
import pagination from '@/components/myComponent/table/pagination.vue';
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import NickNameUploadDialog from './component/ThemeUploadDialog';
export default {
	name: 'TtTheme',
	components: {
		tableCustom,
		pagination,
		NickNameUploadDialog,
	},
	data() {
		return {
			exitLoading: false,
			tableSelsectList: [],
			deleteing: false,
			total: 0,
			current_limit: 10,
			current_page: 1,
			liadbutton: false,
			contentVisibleUpdate: false,
			ruleForm:{
				UpdateText: "",
			},
			subjectcontent_id: "",
			exitRules: {
				UpdateText: [{ required: true, message: '输入主题内容', trigger: 'blur' }],
			},
			columnsList: [
				{
					prop: 'content',
					label: '主题内容',
					align: 'center',
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									style="margin-right: 5px;"
									type="primary"
									size="mini"
									onClick={this.editBtnB.bind(this, row)}
								>
									修改
								</el-button>

								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该标签吗？"
									onConfirm={this.delete.bind(this, row.subjectcontent_id)}
								>
									<el-button slot="reference" type="danger" size="mini">
										删除
									</el-button>
								</el-popconfirm>

							</div>
						);
					},
				},
			],
			btnUpdateloading: false,
			classifytypecontrol_id: "",//获取的数据
			classifygrouping_id: "",
			loadingList: false,
			tableDataList: [],
			contentVisible: false,
			searchEquipmentList: [], // 分组数据
			searchTypecontrolList: [], // 账号分类数据
			btnloading: false,
			searchTableData: {
				equipment: '',
				typecontrol: '', // 表格搜索
			},
			loading: false, // 表格-分页组件相关
			tableData: [],
			columns: [
				{
					prop: 'type_title',
					label: '分类',
					align: 'center',
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									style="margin-right: 5px;"
									type="primary"
									size="mini"
									onClick={this.editBtn.bind(this, row)}
								>
									查看主题内容
								</el-button>
							</div>
						);
					},
				},
			],
			showDetailDialog: false,
			showUploadDialog: false,
			nickData: {}, // 传递给详情弹层的数据
			parameterData: {}
		};
	},

	mounted() {
		this.subjectcontentListtable()
		this.getaccGroup()
	},

	methods: {
		// 批量删除
		batchDelete() {
			if (this.tableSelsectList.length > 0) {
				let id = this.tableSelsectList.map((item) => {
					return item.subjectcontent_id;
				}).join(",");
				this.deleteing = true
				this.subjectcontentDelete(id)
			} else {
				this.$message.warning('请选择需要删除的数据');
			}
		},
		//选择框
		selectionChange(val) {
			this.tableSelsectList = val
		},
		/*
		   翻页回调
		*/
		handlePagination(val) {
			this.current_page = val.page;  //页数
			this.current_limit = val.limit;  //请求数据量
			this.getNickNameClassify();
		},
		// 监听搜索分组变化
		searchEquipmentChange() {
			this.getTypecontrol()
		},
		//取消按钮
		exitCancel() {
			this.ruleForm.UpdateText = ''
			this.contentVisibleUpdate = false
			this.$refs.ruleForm.resetFields();
		},
		//修改确认
		exitSubject() {
			this.$refs['ruleForm'].validate((valid) => {
				if (!valid) return false;
				this.exitLoading = true
				this.subjectcontentUpdate()
			})
		},

		contentCancel() {
			this.tableDataList = []
			this.contentVisible = false
		},
		editBtn(row) {
			this.contentVisible = true;
			this.classifytypecontrol_id = row.typecontrol_id;
			this.classifygrouping_id = row.classifygrouping_id;
			this.getNickNameClassify()
		},
		//修改按钮
		editBtnB(row) {
			this.contentVisibleUpdate = true;
			this.ruleForm.UpdateText = row.content;
			this.subjectcontent_id = row.subjectcontent_id;
		},
		//修改接口
		async subjectcontentUpdate() {
			try {
				const res = await this.$api({
					type: 'subjectcontentUpdate',
					data: {
						content: this.ruleForm.UpdateText,
						subjectcontent_id: this.subjectcontent_id,
					}
				});
				this.exitLoading = false
				if (res.status == 200) {
					this.getNickNameClassify();//获取当前index
					this.contentVisibleUpdate = false;
					this.$refs.ruleForm.resetFields();

					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				this.exitLoading = false
				console.error(error);
			}
		},
		//删除按钮
		delete(id) {
			this.subjectcontentDelete(id)
		},
		async subjectcontentDelete(id) {
			try {
				const res = await this.$api({
					type: 'subjectcontentDelete',
					data: {
						subjectcontent_ids: id
					}
				});
				this.deleteing = false
				if (res.status == 200) {
					this.getNickNameClassify()
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				this.deleteing = false
			}
		},
		// 获取账号分组数据
		async getaccGroup() {
			try {
				const res = await this.$api({
					type: 'getGrouping',
				});
				if (res.status == 200) {
					this.searchEquipmentList = res.data.list;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
			}
		},

		// 获取素材分类数据
		async getTypecontrol() {
			let data = {
				grouping_id: this.searchTableData.equipment
			}
			try {
				const res = await this.$api({
					type: 'getTypecontrol',
					data: data,
				});
				if (res.status == 200) {
					this.getTreeData(res.data);
					this.searchTypecontrolList = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
			}
		},
		// 获取素材分类数据
		async subjectcontentListtable(data) {
			try {
				this.loading = true
				const res = await this.$api({
					type: 'subjectcontentListtable',
					data
				});
				this.loading = false
				if (res.status == 200) {
					this.tableData = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false
			}

		},

		// 获取index分类数据
		async getNickNameClassify() {
			this.loadingList = true
			let data = {
				limit: this.current_limit,
				page: this.current_page,
				typecontrol_id: this.classifytypecontrol_id, //点击账号分组的grouping_id
				grouping: this.classifygrouping_id,//点击分类的typecontrol_id
			}
			try {
				const res = await this.$api({
					type: 'subjectcontentIndex',
					data: data
				});
				if (res.status == 200) {
					this.total = res.data.count
					this.tableDataList = res.data.list;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loadingList = false;
			}

		},
		// 点击查询按钮
		searchNickName() {
			this.btnloading = true;
			let data = this.searchTableData;
			this.subjectcontentListtable2(data);
			this.btnloading = false;
		},
		// 获取素材分类数据
		async subjectcontentListtable2(data) {
			try {
				this.loading = true
				const res = await this.$api({
					type: 'subjectcontentListtable',
					data: {
						typecontrol_id: data.typecontrol[data.typecontrol.length - 1] ?? "",
						grouping_id: data.equipment
					}
				});

				this.loading = false
				if (res.status == 200) {
					this.tableData = res.data;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false
			}


		},

		// 点击重置按钮
		btnReset() {
			this.searchTableData = {
				equipment: '',
				typecontrol: ''
			}
			this.subjectcontentListtable();
		},
		// 点击上传按钮
		uploadNickName() {
			this.showUploadDialog = true;
		},
		// 点击详情按钮
		toNickNameDetail(obj) {
			this.showDetailDialog = true;
			this.nickData = {
				typecontrol_id: obj.typecontrol_id,
				grouping_id: this.searchTableData.equipment,
			};
			this.$refs.detailDialog.getNickName({
				page: 1,
				limit: 20,
				typecontrol_id: obj.typecontrol_id,
				grouping_id: this.searchTableData.equipment,
			});
		},
		// 处理树型children问题
		getTreeData(arr) {
			arr.forEach((item) => {
				if (!item.children.length) {
					item.children = undefined;
				} else {
					this.getTreeData(item.children);
				}
			});
		},
	},
};
</script>

<style lang="stylus" scoped>
</style>
