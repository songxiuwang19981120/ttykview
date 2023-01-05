<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<el-input
					size="medium"
					v-model="searchTableData.username"
					placeholder="请填写用户名"
					style="width: 130px; margin-right: 20px"
				></el-input>
				<el-input
					size="medium"
					v-model="searchTableData.nickname"
					placeholder="请填写真实姓名"
					style="width: 130px; margin-right: 20px"
				></el-input>
				<el-input
					size="medium"
					v-model="searchTableData.mobile"
					placeholder="请填写联系电话"
					style="width: 150px; margin-right: 20px"
				></el-input>
				<el-select
					v-model="searchTableData.group_id"
					placeholder="请选择角色"
					style="width: 140px; margin-right: 20px"
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
				<el-select
					size="medium"
					v-model="searchTableData.status"
					placeholder="请选择用户状态"
					style="width: 150px; margin-right: 20px"
				>
					<el-option
						v-for="(item, index) in statusData"
						:key="index"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<!-- 查询 -->
				<el-button type="primary" size="medium" :loading="btnloading" @click="searchUser">{{
					btnloading ? '加载中...' : '查询'
				}}</el-button>
				<el-button type="primary" size="medium" @click="btnReset">重置</el-button>
				<el-button type="primary" size="medium" @click="addUser">新增</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom
			height="700"
			:loading="loading"
			:tableData="tableData"
			:columns="columns"
		></table-custom>
		<!-- 分页 -->
		<pagination
			:total="total"
			:page="searchTableData.page"
			:limit="searchTableData.limit"
			@pagination="pageChange"
		></pagination>
		<!-- 新增用户弹层 -->
		<addUser :showdialog.sync="showAddDialog" ref="adduser"></addUser>
		<!-- 编辑用户弹层 -->
		<editUser :showdialog.sync="showEditDialog" :ruleForm="editData" ref="edituser"></editUser>
		<!-- 重置密码弹层 -->
		<editPwd :curUserId="curUserId" :showdialog.sync="showPwdDialog"></editPwd>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	import addUser from './components/addUserDialog.vue';
	import editUser from './components/editUserDialog.vue';
	import editPwd from './components/editPwdDialog.vue';

	export default {
		name: 'Users',

		components: {
			tableCustom,
			pagination,
			addUser,
			editUser,
			editPwd,
		},

		data() {
			return {
				roleData: [{ role: '超级管理员' }, { role: '管理员' }, { role: '普通用户' }],
				statusData: [
					{ label: '已启用', value: 'normal' },
					{ label: '禁用', value: 'disable' },
				],
				searchTableData: {
					username: '',
					nickname: '',
					mobile: '',
					group_id: '',
					status: '',
					page: 1,
					limit: 10,
				},
				btnloading: false,
				loading: false,
				tableData: [],
				columns: [
					{
						prop: 'username',
						label: '用户名',
						align: 'center',
					},
					{
						prop: 'nickname',
						label: '真实姓名',
						align: 'center',
					},
					{
						prop: 'mobile',
						label: '联系电话',
						align: 'center',
					},
					{
						prop: 'group_text',
						label: '角色',
						align: 'center',
					},
					{
						prop: 'createtime',
						label: '创建时间',
						align: 'center',
					},
					{
						label: '操作',
						align: 'center',
						minWidth: '110',
						render: (h, { row }) => {
							return (
								<div>
									<el-button type="primary" size="mini" onClick={this.toEditUser.bind(this, row)}>
										修改资料
									</el-button>
									<el-button type="primary" size="mini" onClick={this.toEditPwd.bind(this, row)}>
										修改密码
									</el-button>
									<el-button
										style="margin-right: 10px;"
										type="primary"
										size="mini"
										onClick={this.toForbUser.bind(this, row)}
									>
										{row.status == 'normal' ? '禁用' : '启用'}
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该用户吗？"
										onConfirm={this.toDelRole.bind(this, row.id)}
									>
										<el-button
											style="margin-right: 10px;"
											slot="reference"
											type="danger"
											size="mini"
										>
											删除
										</el-button>
									</el-popconfirm>
								</div>
							);
						},
					},
				],
				total: 0,
				showAddDialog: false, // 新增账户弹层
				showEditDialog: false, // 编辑账户弹层
				editData: {},
				showPwdDialog: false, // 重置密码弹层
				curUserId: '',
			};
		},
		created() {
			this.getApiusergroup({
				page: 1,
				limit: 10000
			});
			this.getApiuser(this.searchTableData);
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

			// 获取用户列表
			async getApiuser(data) {
				try {
					this.loading = true
					const res = await this.$api({
						type: 'getApiuser',
						data,
					});
					if (res.status == 200) {
						this.tableData = res.data.list;
						this.total = res.data.count;
					} else {
						this.$message.error(res.msg);
					}
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false;
				}
			},

			// 删除用户
			async deleteApiuser(ids) {
				try {
					const res = await this.$api({
						type: 'deleteApiuser',
						data: {
							ids,
						},
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

			// 点击查询按钮
			searchUser() {
				this.getApiuser(this.searchTableData);
			},

			// 点击重置按钮
			btnReset() {
				this.searchTableData = {
					username: '',
					nickname: '',
					mobile: '',
					group_text: '',
					status: '',
					page: 1,
					limit: 10,
				};
				this.getApiuser(this.searchTableData);
			},
			// 点击新增按钮
			addUser() {
				this.$refs.adduser.getApiusergroup({
					page: 1,
					limit: 10000
				});
				this.showAddDialog = true;
			},

			// 数据条数/页码改变
			pageChange(obj) {
				(this.searchTableData.page = obj.page), (this.searchTableData.limit = obj.limit);
				this.getApiuser(this.searchTableData);
			},

			// 点击修改按钮
			toEditUser(obj) {
				this.editData = JSON.parse(JSON.stringify(obj));
				this.showEditDialog = true;
				this.$refs.edituser.getApiusergroup({
					page: 1,
					limit: 10000
				});
			},

			// 点击修改密码按钮
			toEditPwd(obj) {
				this.curUserId = obj.id;
				this.showPwdDialog = true;
			},

			// 点击删除按钮
			async toDelRole(id) {
				await this.deleteApiuser(id);
				this.getApiuser(this.searchTableData);
			},

			// 点击禁用按钮
			async toForbUser(obj) {
				if (obj.status == 'normal') {
					obj.status = 'disable';
				} else if (obj.status == 'disable') {
					obj.status = 'normal';
				}
				await this.updateApiuser(obj);
				this.getApiuser(this.searchTableData);
			},
		},
	};
</script>

<style lang="scss" scoped></style>
