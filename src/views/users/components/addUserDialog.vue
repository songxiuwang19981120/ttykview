<template>
	<el-dialog :visible="showdialog" title="新增账户" @close="btnCancel" width="40%">
		<el-form label-width="120px" :model="ruleForm" :rules="rules" ref="ruleForm">
			<!-- <el-row type="flex"> -->
			<el-form-item label="用户名：" prop="username">
				<el-input
					v-model="ruleForm.username"
					style="width: 60%"
					placeholder="请输入用户名"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="密码：" prop="password">
				<el-input
					v-model="ruleForm.password"
					style="width: 60%"
					placeholder="请输入密码"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="真实姓名：" prop="nickname">
				<el-input
					v-model="ruleForm.nickname"
					style="width: 60%"
					placeholder="请输入真实姓名"
					size="medium"
				></el-input>
			</el-form-item>
			<el-form-item label="联系电话：" prop="mobile">
				<el-input
					v-model="ruleForm.mobile"
					style="width: 60%"
					placeholder="请输入联系电话"
					size="medium"
				></el-input>
			</el-form-item>
			<!-- </el-row> -->
			<el-form-item label="账户有效期：" prop="expire_date">
				<el-row>
					<el-radio-group v-model="chooseDate" size="medium">
						<el-radio label="0">永久有效</el-radio>
						<el-radio label="1">指定日期后失效</el-radio>
					</el-radio-group>
				</el-row>
				<el-row>
					<el-date-picker
						v-if="chooseDate == 1"
						v-model="ruleForm.expire_date"
						type="date"
						placeholder="请选择日期"
						format="yyyy - MM - dd"
						value-format="yyyy-MM-dd"
						:picker-options="pickerOptions"
					>
					</el-date-picker>
				</el-row>
			</el-form-item>
			<el-form-item label="角色选择：" prop="group_id">
				<el-select
					style="width: 60%"
					v-model="ruleForm.group_id"
					placeholder="请选择角色"
					:loading="roleLoading"
					loading-text="数据加载中..."
					size="medium"
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
			<el-form-item label="备注说明：" prop="remark">
				<el-input
					style="width: 60%"
					v-model="ruleForm.remark"
					size="medium"
					type="textarea"
					:rows="3"
				></el-input>
			</el-form-item>
			<el-row type="flex" justify="end">
				<el-form-item>
					<el-button @click="btnCancel" size="medium">取消</el-button>
					<el-button type="primary" size="medium" :loading="btnloading" @click="btnOK">{{
						btnloading ? '添加中...' : '确定'
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
				btnloading: false,
				roleLoading: false,
				roleData: [],
				ruleForm: {
					username: '',
					password: '',
					nickname: '',
					mobile: '',
					expire_date: '',
					group_id: '',
					remark: '',
				},
				rules: {
					username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{
							pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
							message: '密码格式 6-21位数字字母组合',
							trigger: 'blur',
						},
					],
					group_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
				},
				chooseDate: '0',
				pickerOptions: {
					disabledDate(v) {
						return v.getTime() < new Date().getTime() - 86400000; //  - 86400000是否包括当天
					},
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

			// 新增角色
			async addApiuser(data) {
				try {
					this.btnloading = true
					const res = await this.$api({
						type: 'addApiuser',
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
					this.btnloading = false
				}
			},

			// 点击确定按钮
			async btnOK() {
				try {
					await this.$refs.ruleForm.validate();
					if (this.chooseDate == 0) {
						this.ruleForm.expire_date = '';
					}
					await this.addApiuser(this.ruleForm);
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
				this.ruleForm = {
					username: '',
					password: '',
					nickname: '',
					mobile: '',
					expire_date: '',
					group_id: '',
					remark: '',
				};
				this.$emit('update:showdialog', false);
			},
		},
	};
</script>

<style scoped lang="scss"></style>
