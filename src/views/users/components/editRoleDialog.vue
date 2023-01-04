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
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button type="primary" size="medium" @click="btnOK">确定</el-button>
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
			ruleForm: {
				type: Object,
				default: {
					name: '',
				},
			},
		},

		data() {
			return {
				rules: {
					name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
				},
			};
		},

		methods: {
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
					await this.updateRole(this.ruleForm);
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
					rules: '',
				});
			},
		},
	};
</script>

<style lang="scss" scoped></style>
