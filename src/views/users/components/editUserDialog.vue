<template>
	<el-dialog :visible="showdialog" title="账户信息修改" width="40%" @close="btnCancel">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-form-item label="用户名：" prop="user">
				<el-input v-model="ruleForm.user" placeholder="请输入用户名" style="width: 90%"></el-input>
			</el-form-item>
			<el-form-item label="真实姓名：" prop="name">
				<el-input
					v-model="ruleForm.name"
					placeholder="请输入真实姓名"
					style="width: 90%"
				></el-input>
			</el-form-item>
			<el-form-item label="联系电话：" prop="phone">
				<el-input
					v-model="ruleForm.phone"
					placeholder="请输入联系电话"
					style="width: 90%"
				></el-input>
			</el-form-item>
			<el-form-item label="角色选择：" prop="role_id">
				<el-select
					v-model="ruleForm.role_id"
					placeholder="请选择角色"
					:loading="roleLoading"
					loading-text="数据加载中..."
				>
					<el-option
						v-for="(item, index) in roleData"
						:key="index"
						:label="item.name"
						:value="item.role_id"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="end">
			<el-button type="primary" @click="btnOK">确定</el-button>
			<el-button @click="btnCancel">取消</el-button>
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
				roleLoading: false,
				roleData: [],
				ruleForm: {
					user: '',
					name: '',
					phone: '',
					role_id: '',
				},
				rules: {
					user: [{ required: true, message: '请填写用户名称', trigger: 'blur' }],
				},
			};
		},

		methods: {
			// 获取角色列表
			async getRole(data) {
				try {
					this.roleLoading = true;
					const res = await this.$api({
						type: 'getRole',
						data,
					});
					console.log(res, '角色列表');
					if (res.status == 200) {
						this.roleData = res.data.list;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.roleLoading = false;
				}
			},

			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					this.$emit('update:showdialog', false);
				} catch (error) {}
			},

			// 点击取消按钮
			btnCancel() {
				this.$refs.ruleForm.resetFields();
				this.ruleForm = {
					user: '',
					name: '',
					phone: '',
					role_id: '',
				};
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
