<template>
	<el-dialog title="详情" :visible="outerVisible" @close="btnCancel" width="60%">
		<!-- 详情页面内容 -->
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 分页 -->
		<pagination
			:total="total"
			:page="nickNameData.page"
			:limit="nickNameData.limit"
			@pagination="pageChange"
		></pagination>
		<!-- 编辑弹层 -->
		<el-dialog
			width="30%"
			title="编辑"
			:visible.sync="innerVisible"
			append-to-body
			@close="btnCancel2"
		>
			<el-form label-width="70px" :model="ruleForm" :rules="rules" ref="ruleForm">
				<el-form-item label="标签：" prop="label">
					<el-input v-model="ruleForm.label" style="width: 90%"></el-input>
				</el-form-item>
			</el-form>
			<!-- 按钮 -->
			<el-row type="flex" justify="end">
				<el-button size="small" @click="btnCancel2">取消</el-button>
				<el-button size="small" type="primary" @click="btnOK2">确定</el-button>
			</el-row>
		</el-dialog>
		<div slot="footer" class="dialog-footer">
			<el-button @click="btnCancel" size="small">取 消</el-button>
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
			}
		},
		components: {
			tableCustom,
			pagination,
		},
		data() {
			const validateNickname = (rule, value, callback) => {
				if (value === this.curNickName) {
					return callback(new Error('与编辑前昵称一致，请重新编辑'));
				} else {
					callback();
				}
			};
			return {
				innerVisible: false,
				loading: false, // 表格-分页组件相关
				tableData: [],
				columns: [
					{
						prop: 'label',
						label: '标签',
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
										title="确认删除该标签吗？"
										onConfirm={this.delBtn.bind(this, row.label_id)}
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
					label: '',
				},
				rules: {
					label: [
						{ required: true, message: '请输入昵称', trigger: 'blur' },
						{ validator: validateNickname, trigger: 'blur' },
					],
				},
				curNickName: '', // 点击当前编辑按钮的id
			};
		},
		methods: {
			// 获取标签
			async getLabel(data) {
				this.loading = true;
				try {
					const res = await this.$api({
						type: 'getLabel',
						data,
					});
					console.log(res, '标签数据列表');
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
			async editLabel(data) {
				try {
					const res = await this.$api({
						type: 'updateLabel',
						data,
					});
					console.log(res, '编辑标签');
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				}
			},
			// 删除标签
			async delLabel(id) {
				try {
					const res = await this.$api({
						type: 'deleteLabel',
						data: {
							label_ids: id,
						},
					});
					console.log(res, '删除标签');
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				}
			},
			// 点击编辑按钮
			editBtn(obj) {
				console.log(obj, '++++++++++++++');
				this.innerVisible = true;
				this.curNickName = obj.label;
				// this.ruleForm = obj;
				this.ruleForm = JSON.parse(JSON.stringify(obj))
			},
			// 点击删除按钮
			async delBtn(id) {
				await this.delLabel(id);
				if(this.tableData.length == 1 && this.nickNameData.page > 1){
					this.nickNameData.page = this.nickNameData.page - 1
				}
				await this.getLabel({
					page: this.nickNameData.page,
					limit: this.nickNameData.limit,
					typecontrol_id: this.upParameter.typecontrol_id,
					grouping_id: this.upParameter.grouping_id,
				});
			},
			// 当前页数据条数/页码改变
			pageChange(obj) {
				this.nickNameData.page = obj.page;
				this.nickNameData.limit = obj.limit;
				this.getLabel({
					page: this.nickNameData.page,
					limit: this.nickNameData.limit,
					typecontrol_id: this.upParameter.typecontrol_id,
					grouping_id: this.upParameter.grouping_id,
				});
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
					await this.editLabel(this.ruleForm);
					this.innerVisible = false;
					this.getLabel({
						page: this.nickNameData.page,
						limit: this.nickNameData.limit,
						typecontrol_id: this.upParameter.typecontrol_id,
						grouping_id: this.upParameter.grouping_id,
					});
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>

<style></style>
