<template>
	<el-dialog :visible="showdialog" title="新增账户" @close="btnCancel">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<el-row type="flex">
				<el-form-item label="用户名：" prop="user">
					<el-input
						v-model="ruleForm.user"
						style="width: 145px"
						placeholder="请输入用户名"
					></el-input>
				</el-form-item>
				<el-form-item label="真实姓名：" prop="name">
					<el-input
						v-model="ruleForm.name"
						style="width: 145px"
						placeholder="请输入真实姓名"
					></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" prop="phone">
					<el-input
						v-model="ruleForm.phone"
						style="width: 145px"
						placeholder="请输入联系电话"
					></el-input>
				</el-form-item>
			</el-row>
			<el-form-item label="账户有效期：" prop="validity">
				<el-radio-group v-model="ruleForm.validity">
					<el-radio label="0">永久有效</el-radio>
					<el-radio label="1">指定日期后失效</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="角色选择：" prop="role_id">
				<el-select
					v-model="ruleForm.role_id"
					placeholder="请选择角色"
					@focus="getRole"
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
			<el-form-item label="备注说明：" prop="note">
				<el-input v-model="ruleForm.note" type="textarea" :rows="3"></el-input>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button type="primary" :loading="btnloading" @click="btnOK">{{
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
		},

		data() {
			return {
				btnloading: false,
				roleLoading: false,
				roleData: [],
				ruleForm: {
					user: '',
					name: '',
					phone: '',
					validity: '',
					role_id: '',
					note: '',
				},
				rules: {
					user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
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
					console.log(this.ruleForm);
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

<style scoped lang="scss"></style>
