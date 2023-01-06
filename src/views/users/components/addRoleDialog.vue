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
					check-strictly
				>
				</el-tree>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button @click="btnCancel" size="medium">取消</el-button>
					<el-button type="primary" size="medium" :loading="btnloading" @click="btnOK">{{
						btnloading ? '上传中...' : '确定'
					}}</el-button>
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
				data: [],
				defaultProps: {
					label: 'title',
				},
			};
		},

		methods: {
			// 获取树形
			async getRouteTree() {
				try {
					const res = await this.$api({
						type: 'getRouteTree'
					});
					console.log(res, '树形');
					if (res.status == 200) {
						this.data = res.data
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
				}
			},

			// 新增角色
			async addApiusergroup(data) {
				try {
					this.btnloading = true
					const res = await this.$api({
						type: 'addApiusergroup',
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
					this.ruleForm.rules = this.getCheckedKeys().join(',');
					this.btnloading = true;
					await this.addApiusergroup(this.ruleForm);
					this.$parent.getApiusergroup({
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
				return this.$refs.tree.getCheckedKeys()
			},
		},
	};
</script>

<style lang="scss" scoped></style>
