<template>
	<el-dialog :visible="showdialog" title="账户信息修改" width="40%" @close="btnCancel">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="用户名：" prop="username">
				<el-input
					v-model="ruleForm.username"
					size="medium"
					placeholder="请输入用户名"
					style="width: 60%"
				></el-input>
			</el-form-item>
			<el-form-item label="真实姓名：" prop="nickname">
				<el-input
					v-model="ruleForm.nickname"
					placeholder="请输入真实姓名"
					style="width: 60%"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="联系电话：" prop="mobile">
				<el-input
					v-model="ruleForm.mobile"
					placeholder="请输入联系电话"
					style="width: 60%"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="角色选择：" prop="group_id">
				<el-select
					v-model="ruleForm.group_id"
					placeholder="请选择角色"
					:loading="roleLoading"
					loading-text="数据加载中..."
					size="medium"
					style="width: 60%"
				>
					<el-option
						v-for="(item, index) in roleData"
						:key="index"
						:label="item.name"
						:value="item.id"
					>
					</el-option>
				</el-select>
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
			ruleForm: {
				type: Object,
				default: {
					username: '',
					nickname: '',
					mobile: '',
					group_id: ''
				},
			},
		},

		data() {
			return {
				roleLoading: false,
				roleData: [],
				rules: {
					username: [{ required: true, message: '请填写用户名称', trigger: 'blur' }],
				},
			};
		},

		methods: {
			// 获取角色列表
			async getApiusergroup(data) {
				try {
					const res = await this.$api({
						type: 'getApiusergroup',
						data,
					});
					if (res.status == 200) {
						this.roleData = res.data.list;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false;
				}
			},

			// 编辑用户
			async updateApiuser(data) {
				try {
					const res = await this.$api({
						type: 'updateApiuser',
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
					await this.updateApiuser(this.ruleForm);
					this.$parent.getApiuser({
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
			},
		},
	};
</script>

<style lang="scss" scoped></style>
