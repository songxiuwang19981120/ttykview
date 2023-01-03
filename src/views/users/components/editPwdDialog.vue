<template>
	<el-dialog :visible="showdialog" title="重置密码" width="40%" @close="btnCancel">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="新密码：" prop="pwd">
				<el-input v-model="ruleForm.pwd" placeholder="请输入新密码" style="width: 60%" size="medium"></el-input>
			</el-form-item>
			<el-form-item label="确认密码：" prop="repwd">
				<el-input
					v-model="ruleForm.repwd"
					placeholder="请再次输入新密码"
					style="width: 60%"
					size="medium"
				></el-input>
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="end">
			<el-button type="primary" size="medium" @click="btnOK">确定</el-button>
			<el-button @click="btnCancel" size="medium">取消</el-button>
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
		},

		data() {
			return {
				ruleForm: {
					pwd: '',
					repwd: '',
				},
				rules: {
					pwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
					repwd: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }],
				},
			};
		},

		methods: {
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					if (this.ruleForm.pwd !== this.ruleForm.repwd) {
						return this.$message.error('两次密码输入不一致');
					}
					this.$emit('update:showdialog', false);
				} catch (error) {}
			},

			// 点击取消按钮
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.ruleForm = {
					pwd: '',
					repwd: '',
				};
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
