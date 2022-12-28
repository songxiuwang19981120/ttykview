<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div class="contain">
					<span>用户名：</span>
					<el-input
						v-model="searchTableData.user"
						placeholder="请填写用户名"
						style="width: 130px"
					></el-input>
				</div>
				<div class="contain">
					<span>真实姓名：</span>
					<el-input
						v-model="searchTableData.name"
						placeholder="请填写真实姓名"
						style="width: 130px"
					></el-input>
				</div>
				<div class="contain">
					<span>联系电话：</span>
					<el-input
						v-model="searchTableData.phone"
						placeholder="请填写联系电话"
						style="width: 150px"
					></el-input>
				</div>
				<div class="contain">
					<span>角色选择：</span>
					<el-select
						v-model="searchTableData.role_id"
						@focus="getRole"
						:loading="roleLoading"
						loading-text="数据加载中..."
						placeholder="请选择角色"
						style="width: 140px"
					>
						<el-option
							v-for="(item, index) in roleData"
							:key="index"
							:label="item.name"
							:value="item.role_id"
						>
						</el-option>
					</el-select>
				</div>
				<div class="contain">
					<span>在职状态选择：</span>
					<el-select
						v-model="searchTableData.status"
						placeholder="请选择在职状态"
						style="width: 150px"
					>
						<el-option
							v-for="(item, index) in statusData"
							:key="index"
							:label="item.status"
							:value="item.status"
						>
						</el-option>
					</el-select>
				</div>
				<div>
					<!-- 查询 -->
					<el-button
						type="primary"
						:loading="btnloading"
						@click="searchUser"
						style="margin-right: 20px"
						class="btn"
						>{{ btnloading ? '加载中...' : '查询' }}</el-button
					>
				</div>
				<div>
					<el-button type="primary" @click="btnReset" class="btn">重置</el-button>
				</div>
			</div>
			<div class="tt-accsituation--operation">
				<div>
					<el-button type="primary" @click="addUser" class="btn">新增</el-button>
				</div>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 分页 -->
		<pagination
			:total="total"
			:page="page.page"
			:limit="page.limit"
			@pagination="pageChange"
		></pagination>
		<!-- 新增用户弹层 -->
		<addUser :showdialog.sync="showAddDialog"></addUser>
		<!-- 编辑用户弹层 -->
		<editUser :showdialog.sync="showEditDialog"></editUser>
		<!-- 重置密码弹层 -->
		<editPwd :showdialog.sync="showPwdDialog"></editPwd>
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
				statusData: [{ status: '在职' }, { status: '离职' }],
				searchTableData: {
					user: '',
					name: '',
					phone: '',
					role_id: '',
				},
				btnloading: false,
				loading: false,
				tableData: [
					{
						user: 'name01',
						name: 'zs',
						phone: '13178877887',
						firstpwd: '123456',
						role_id: '人事经理',
						create_time: '2022-12-27',
					},
					{
						user: 'name01',
						name: 'zs',
						phone: '13178877887',
						firstpwd: '123456',
						role_id: '人事经理',
						create_time: '2022-12-27',
					},
					{
						user: 'name01',
						name: 'zs',
						phone: '13178877887',
						firstpwd: '123456',
						role_id: '人事经理',
						create_time: '2022-12-27',
					},
				],
				columns: [
					{
						prop: 'user',
						label: '用户名',
						align: 'center',
					},
					{
						prop: 'name',
						label: '真实姓名',
						align: 'center',
					},
					{
						prop: 'phone',
						label: '联系电话',
						align: 'center',
					},
					{
						prop: 'firstpwd',
						label: '初始密码',
						align: 'center',
					},
					{
						prop: 'role_id',
						label: '角色',
						align: 'center',
					},
					{
						prop: 'create_time',
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
										修改
									</el-button>
									<el-button type="primary" size="mini" onClick={this.toEditPwd.bind(this, row)}>
										重置密码
									</el-button>
									<el-button type="primary" size="mini" onClick={this.toForbUser.bind(this, row)}>
										禁用
									</el-button>
								</div>
							);
						},
					},
				],
				page: {
					page: 1,
					limit: 10,
				},
				total: 0,
				showAddDialog: false, // 新增账户弹层
				showEditDialog: false, // 编辑账户弹层
				showPwdDialog: false, // 重置密码弹层
				roleLoading: false,
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

			// 点击查询按钮
			searchUser() {},

			// 点击重置按钮
			btnReset() {
				this.searchTableData = {
					username: '',
					realname: '',
					phone: '',
					department: '',
					role: '',
				};
			},
			// 点击新增按钮
			addUser() {
				this.showAddDialog = true;
			},

			// 数据条数/页码改变
			pageChange(obj) {
				(this.page.page = obj.page), (this.page.limit = obj.limit);
			},

			// 点击修改按钮
			toEditUser() {
				this.showEditDialog = true;
			},

			// 点击重置密码按钮
			toEditPwd() {
				this.showPwdDialog = true;
			},

			// 点击禁用按钮
			toForbUser() {},
		},
	};
</script>

<style lang="scss" scoped>
	@import '@/assets/base/_color_variables.scss';
	.tt-accsituation {
		background-color: #fff;
		margin-bottom: 20px;
		border-radius: 4px;
		padding: 0 12px;
		.tt-accsituation--operation {
			display: flex;
			flex-wrap: wrap;
			min-height: 70px;
			line-height: 70px;
			.contain {
				margin-right: 20px;
			}
		}
	}
	::v-deep .el-button--primary {
		background-color: $button-back-color;
		border: $button-bord-color;
	}
</style>
