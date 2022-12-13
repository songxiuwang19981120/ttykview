<template>
	<el-dialog :visible="showDialog" @close="btnCancel">
		<!-- 添加签名 -->
		<el-form :model="ruleForm" ref="ruleForm" :rules="rules">
			<el-form-item prop="nickname">
				<span>添加签名：</span>
				<el-input
					type="textarea"
					placeholder="请输入昵称(一行仅限一个)"
					rows="6"
					v-model="ruleForm.nickname"
					style="width: 60%"
					class="nicknameIpt"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<!-- 上传 -->

		<!-- 按钮 -->
		<el-row type="flex" justify="end" slot="footer">
			<el-button size="small" @click="btnCancel">取消</el-button>
			<el-button size="small" type="primary" @click="btnOK">确定</el-button>
		</el-row>
	</el-dialog>
</template>

<script>
	import { BASE_URL } from '@/config/base.config';
	export default {
		props: {
			showDialog: {
				type: Boolean,
				default: false,
			},
			upParameter: {
				type: Object,
			},
		},
		data() {
			return {
				ruleForm: {
					nickname: '',
					typecontrol_id: '',
					status: 1,
					grouping_id: null,
				},
				rules: {
					nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
				},
				baseUrl: BASE_URL, // 基地址
			};
		},
		methods: {
			// 新增昵称
			async addNickName(data) {
				try {
					const res = await this.$api({
						type: 'addNickName',
						data,
					});
					console.log(res, '新增昵称');
					if (res.status == 200) {
						this.$message.success(res.msg);
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				}
			},
			// 点击取消按钮
			btnCancel() {
				this.$emit('update:showDialog', false);
				this.$refs.ruleForm.resetFields();
			},
			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					console.log(this.ruleForm.nickname, '文本域数据');
					let nickNameArr = [];
					// 处理文本域数据
					this.ruleForm.nickname.split('\n').forEach((item) => {
						console.log(item.replace(/\s/gi, ''));
						if (item.replace(/\s/gi, '')) {
							nickNameArr.push(item.replace(/\s/gi, ''));
						}
					});
					this.ruleForm.nickname = nickNameArr.join('\n');
					const { equipment, typecontrol } = this.upParameter;
					this.ruleForm.typecontrol_id = typecontrol[typecontrol.length - 1];
					this.ruleForm.grouping_id = equipment;
					// 调用新增昵称接口
					this.addNickName(this.ruleForm);
					this.$emit('update:showDialog', false);
				} catch (error) {
					console.log(error);
				}
			},
		},
	};
</script>

<style lang="stylus" scoped>
	.nicknameIpt{
		width 60%
		vertical-align middle
	}
</style>
<style scoped>
	::v-deep .el-form-item__content {
		text-align: center !important;
	}
	::v-deep .el-form-item__error {
		width: 100%;
		/* text-align: center !important; */
		margin-left: 30%;
	}
</style>
