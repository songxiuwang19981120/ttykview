<template>
	<el-dialog :visible="showdialog" title="重置密码" width="40%" @close="btnCancel">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="新密码：" prop="password">
				<el-input
					v-model="ruleForm.password"
					placeholder="请输入新密码"
					style="width: 60%"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="确认密码：" prop="repassword">
				<el-input
					v-model="ruleForm.repassword"
					placeholder="请再次输入新密码"
					style="width: 60%"
					size="medium"
				></el-input>
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="end">
			<el-button @click="btnCancel" size="medium">取消</el-button>
			<el-button type="primary" size="medium" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		props: {
			showdialog: {
				type: Boolean,
				default: false,
			},
			curUserId: {
				type: String,
			},
		},

		data() {
			return {
				ruleForm: {
					password: '',
					repassword: '',
				},
				rules: {
					password: [
						{ required: true, message: '请输入新密码', trigger: 'blur' },
						{
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
							message: '密码格式 6-21位数字字母组合',
							trigger: 'blur',
						},
					],
					repassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
				},
			};
		},

		methods: {
			// 更改密码
			async updatePwd(data) {
				try {
					const res = await this.$api({
						type: 'updatePwd',
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

			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					if (this.ruleForm.password !== this.ruleForm.repassword) {
						return this.$message.error('两次密码输入不一致');
					}
					this.updatePwd({
						id: this.curUserId,
						password: this.ruleForm.password,
						repassword: this.ruleForm.repassword,
					});
					this.$emit('update:showdialog', false);
				} catch (error) {}
			},

			// 点击取消按钮
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
