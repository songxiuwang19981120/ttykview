<template>
	<el-dialog title="签名列表" :visible="outerVisible" @close="btnCancel" width="60%">
		<!-- 详情页面内容 -->
		<!-- 表格 -->
		<div style="margin-bottom:20px">
			<el-select class="mr-36 video-select" style="width: 150px;margin-right: 10px;" v-model="searchForm.usage_count" placeholder="使用次数"	clearable>
				<el-option v-for="item in fansOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select class="mr-36 video-select" style="width: 150px;margin-right: 10px;" v-model="searchForm.sort" placeholder="次数排序"	clearable>
				<el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-button type="primary" size="medium" :loading="submitting" @click="searchTable">{{submitting? "搜索中 ...": "查看"}}</el-button>
			<el-button type="primary" size="medium" @click="resetTable">重置</el-button>
			<el-button @click="batchDelete" type="primary" size="medium" :loading="deleteing">{{ deleteing ? '删除中 ...': '批量删除'}}</el-button>		
		</div>
		<table-custom  height="500" :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
			@handleSelectionChange="selectionChange"></table-custom>
		<!-- 分页 -->
		<pagination :total="total" :page="nickNameData.page" :limit="nickNameData.limit" @pagination="pageChange">
		</pagination>
		<!-- 编辑弹层 -->
		<el-dialog width="30%" title="签名编辑" :visible.sync="innerVisible" append-to-body @close="btnCancel2">
			<el-form label-width="70px" :model="ruleForm" :rules="rules" ref="ruleForm">
				<el-form-item label="签名：" prop="autograph">
					<el-input size="medium" v-model="ruleForm.autograph" style="width: 90%"></el-input>
				</el-form-item>
			</el-form>
			<!-- 按钮 -->
			<el-row type="flex" justify="end">
				<el-button size="medium"  @click="btnCancel2">取消</el-button>
				<el-button size="medium" type="primary" @click="btnOK2">确定</el-button>
			</el-row>
		</el-dialog>
		<div slot="footer" class="dialog-footer">
			<el-button @click="btnCancel" size="medium">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
	props: {
		outerVisible: {
			type: Boolean,
			default: false,
		},
		upParameter: {
			type: Object,
		},
	},
	components: {
		tableCustom,
		pagination,
	},
	data() {
		const validateNickname = (rule, value, callback) => {
			if (value === this.curNickName) {
				return callback(new Error('与编辑前签名一致，请重新编辑'));
			} else {
				callback();
			}
		};
		return {
			submitting: false,
			searchForm: {
				sort: '',  //排序
				usage_count: '',  //次数
			},
			sortOptions: [
				{ label: "升序", value: 'desc' },
				{ label: "降序", value: 'asc' },
			],
			fansOptions: [
				{ label: "0", value: 0 },
				{ label: "1", value: 1 },
				{ label: "2", value: 2 },
				{ label: "3", value: 3 },
				{ label: "4", value: 4 },
				{ label: "5", value: 5 },
				{ label: ">5", value: '>5' },
				{ label: "全部", value: '100' },
			],
			innerVisible: false,
			loading: false, // 表格-分页组件相关
			tableData: [],
			columns: [
				{
					prop: 'autograph',
					label: '签名',
					align: 'center',
				},
				{
					prop: 'usage_count',
					label: '使用次数',
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
									编辑
								</el-button>
								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该签名吗？"
									onConfirm={this.delBtn.bind(this, row.autograph_id)}
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
			nickNameData: {
				page: 1,
				limit: 20,
			},
			total: 0,
			ruleForm: {
				// 编辑表单表单相关
				autograph: '',
			},
			rules: {
				autograph: [
					{ required: true, message: '请输入昵称', trigger: 'blur' },
					{ validator: validateNickname, trigger: 'blur' },
				],
			},
			curNickName: '', // 点击当前编辑按钮的id
			tableSelsectList: [],
			deleteing: false,
		};
	},
	methods: {
		searchTable() {
			let usage_count = ''
			if(this.searchForm.usage_count=='100'){
				usage_count=''
			}else{
				usage_count=this.searchForm.usage_count
			}
			this.getAutograph({
				page: 1,
				limit: this.nickNameData.limit,
				typecontrol_id: this.upParameter.typecontrol_id,
				grouping_id: this.upParameter.grouping_id,
				sort: this.searchForm.sort,
				usage_count: usage_count,
				order:'usage_count',
			})
		},
		resetTable(){
			this.searchForm= {
				sort: '',  //排序
				usage_count: '',  //次数
			}
			this.nickNameData.page=1
			this.updatePageData()
		},
		// 批量删除
		batchDelete() {
			if (this.tableSelsectList.length > 0) {
				let id = this.tableSelsectList.map((item) => {
					return item.autograph_id;
				}).join(",");
				this.deleteing = true
				this.delBtn(id)
			} else {
				this.$message.warning('请选择需要删除的数据');
			}
		},
		//选择框
		selectionChange(val) {
			this.tableSelsectList = val
		},
		// 获取昵称
		async getAutograph(data) {
			try {
				this.loading = true;
				const res = await this.$api({
					type: 'getAutograph',
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
			}
		},
		// 编辑昵称
		async editAutograph(data) {
			try {
				const res = await this.$api({
					type: 'updateAutograph',
					data,
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 删除昵称
		async delAutograph(id) {
			try {
				const res = await this.$api({
					type: 'deleteAutograph',
					data: {
						autograph_ids: id,
					},
				});
				this.deleteing = false
				if (res.status == 200) {
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				this.deleteing = false
				console.error(error);
			}
		},
		// 更新页面
		updatePageData() {
			this.getAutograph({
				page: this.nickNameData.page,
				limit: this.nickNameData.limit,
				typecontrol_id: this.upParameter.typecontrol_id,
				grouping_id: this.upParameter.grouping_id,
			});
		},
		// 点击编辑按钮
		editBtn(obj) {
			this.innerVisible = true;
			this.curNickName = obj.autograph;
			// this.ruleForm = obj;
			this.ruleForm = JSON.parse(JSON.stringify(obj))
		},
		// 点击删除按钮
		async delBtn(id) {
			await this.delAutograph(id);
			if (this.tableData.length == 1 && this.nickNameData.page > 1) {
				this.nickNameData.page = this.nickNameData.page - 1
			}
			this.updatePageData()
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.nickNameData.page = obj.page;
			this.nickNameData.limit = obj.limit;
			this.updatePageData()
		},
		// 点击取消按钮
		btnCancel() {
			this.$emit('update:outerVisible', false);
			this.$parent.searchNickName()
		},
		// 点击编辑页面取消按钮
		btnCancel2() {
			this.innerVisible = false;
			this.$refs.ruleForm.resetFields();
		},
		// 点击编辑页面确定按钮
		async btnOK2() {
			try {
				await this.$refs.ruleForm.validate();
				await this.editAutograph(this.ruleForm);
				this.innerVisible = false;
				this.updatePageData()
			} catch (error) {
				// console.error(error);
			}
		},
	},
};
</script>

<style>

</style>
