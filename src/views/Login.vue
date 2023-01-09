<template>
	<div class="index">
		<el-card class="index-card">
			<el-row class="index-title">海王协议系统</el-row>
			<div class="index-login">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
					<el-form-item label="账号：" prop="username">
						<el-input v-model="ruleForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码：" prop="password">
						<el-input v-model="ruleForm.password"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button size="medium" @click="btnCancel" style="margin-right: 35px">取消</el-button>
						<el-button size="medium" @click="btnLogin">登录</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'TtLogin',

		data() {
			return {
				ruleForm: {
					username: '',
					password: '',
				},
				rules: {},
			};
		},

		mounted() {},

		methods: {
			// 点击取消按钮
			btnCancel() {
				this.ruleForm = {
					username: '',
					password: '',
				};
			},

			// 点击确定按钮
			btnLogin() {
				if (!this.ruleForm.username) {
					return this.$message.error('账号不能为空');
				}
				if (!this.ruleForm.password) {
					return this.$message.error('密码不能为空');
				}
				this.$notify.success({
					title: '登录成功',
					message: `欢迎您，尊敬的admin`,
					position: 'top-left',
				});
				this.$router.push('/index');
			},
		},
	};
</script>

<style lang="scss" scoped>
	.index {
		display: flex;
		justify-content: center;
		// align-items: center;
		padding-top: 10%;
		height: 100%;
		background-color: #7896b8;
		.index-card {
			width: 480px;
			height: 350px;
			::v-deep .el-card__body {
				background-color: #7896b8;
			}
			.index-title {
				font-size: 48px;
				text-align: center;
				color: #fff;
			}
			.index-login {
				padding: 30px;
				::v-deep .el-form-item__label {
					font-size: 28px !important;
					color: #fff;
				}
				::v-deep .el-button {
					border-color: #7896b8 !important;
					color: #7896b8 !important;
				}
			}
		}
	}
</style>
