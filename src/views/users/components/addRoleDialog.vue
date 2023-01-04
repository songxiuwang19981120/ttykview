<template>
	<el-dialog :visible="showdialog" title="新增角色" @close="btnCancel" width="40%">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="角色名称：" prop="name">
				<el-input
					size="medium"
					v-model="ruleForm.name"
					placeholder="请输入角色名称"
					style="width: 60%"
				></el-input>
			</el-form-item>
			<el-form-item label="权限选择：" prop="rules">
				<el-tree
					:data="data"
					show-checkbox
					default-expand-all
					node-key="id"
					ref="tree"
					highlight-current
					:props="defaultProps"
				>
				</el-tree>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button type="primary" size="medium" :loading="btnloading" @click="btnOK">{{
						btnloading ? '上传中...' : '确定'
					}}</el-button>
					<el-button @click="btnCancel" size="medium">取消</el-button>
				</el-form-item>
			</el-row>
		</el-form>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showdialog: {
				type: Boolean,
				default: false,
			},
		},

		data() {
			return {
				ruleForm: {
					name: '',
					rules: '',
				},
				rules: {
					name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				},
				btnloading: false,
				data: [
					{
						id: 1,
						label: '一级 1',
						children: [
							{
								id: 4,
								label: '二级 1-1',
								children: [
									{
										id: 9,
										label: '三级 1-1-1',
									},
									{
										id: 10,
										label: '三级 1-1-2',
									},
								],
							},
						],
					},
					{
						id: 2,
						label: '一级 2',
						children: [
							{
								id: 5,
								label: '二级 2-1',
							},
							{
								id: 6,
								label: '二级 2-2',
							},
						],
					},
					{
						id: 3,
						label: '一级 3',
						children: [
							{
								id: 7,
								label: '二级 3-1',
							},
							{
								id: 8,
								label: '二级 3-2',
							},
						],
					},
				],
				defaultProps: {
					// label: 'title',
				},
			};
		},

		methods: {
			// 新增角色
			async addRole(data) {
				try {
					const res = await this.$api({
						type: 'addRole',
						data,
					});
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.btnloading = false;
				}
			},

			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					this.ruleForm.rules = this.getCheckedKeys();
					this.btnloading = true;
					await this.addRole(this.ruleForm);
					this.$parent.getRole({
						page: 1,
						limit: 10,
					});
					this.$emit('update:showdialog', false);
				} catch (error) {}
			},

			// 点击取消按钮
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.$emit('update:showdialog', false);
				this.ruleForm = {
					name: '',
					rules: '',
				};
			},

			// 获取选中的权限id
			getCheckedKeys() {
				console.log(this.$refs.tree.getCheckedKeys());
			},
		},
	};
</script>

<style lang="scss" scoped></style>
