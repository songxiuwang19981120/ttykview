<template>
	<el-dialog :visible="showdialog" title="新增角色" @close="btnCancel" width="40%">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="角色名称：" prop="name">
				<el-input
					v-model="ruleForm.name"
					placeholder="请输入角色名称"
					style="width: 80%"
				></el-input>
			</el-form-item>
			<el-form-item label="角色描述：" prop="description">
				<el-input
					v-model="ruleForm.description"
					placeholder="请输入角色描述"
					style="width: 80%"
				></el-input>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button type="primary" :loading="btnloading" class="btn" @click="btnOK">{{
						btnloading ? '上传中...' : '确定'
					}}</el-button>
					<el-button @click="btnCancel">取消</el-button>
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
			ruleForm: {
				type: Object,
				default: {
					name: '',
					description: '',
				},
			},
		},

		data() {
			return {
				// ruleForm: {
				// 	name: '',
				// 	description: '',
				// },
				rules: {
					name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				},
				btnloading: false,
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

			// 编辑角色
			async updateRole(data) {
				try {
					const res = await this.$api({
						type: 'updateRole',
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
					if (this.ruleForm.role_id) {
						await this.updateRole(this.ruleForm);
					} else {
						this.btnloading = true;
						await this.addRole(this.ruleForm);
					}
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
				this.$emit('update:ruleForm', {
					name: '',
					description: '',
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
  @import '@/assets/base/_color_variables.scss';
	.btn {
		background-color: $button-back-color;
		border: $button-bord-color;
	}
</style>
