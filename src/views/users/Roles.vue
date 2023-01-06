<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<el-button type="primary" size="medium" @click="addRole">新增</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom height="700" :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 分页 -->
		<pagination
			:total="total"
			:page="page.page"
			:limit="page.limit"
			@pagination="pageChange"
		></pagination>
		<!-- 新增角色弹层 -->
		<addRole :showdialog.sync="showAddDialog" ref="addrole"></addRole>
		<!-- 更改名称弹层 -->
		<editRole :showdialog.sync="showEditDialog" :ruleForm.sync="editData"></editRole>
		<!-- 权限配置弹层 -->
		<setRole :showdialog.sync="showSetDialog" :setRoleData.sync="setData" :defaultCheck="defaultCheck" ref="setrole"></setRole>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	import addRole from './components/addRoleDialog.vue';
	import setRole from './components/setRoleDialog.vue';
	import editRole from './components/editRoleDialog.vue'

	export default {
		name: 'Roles',

		components: {
			tableCustom,
			pagination,
			addRole,
			setRole,
			editRole
		},

		data() {
			return {
				loading: false,
				tableData: [],
				columns: [
					{
						prop: 'name',
						label: '角色名称',
						align: 'center',
					},
					{
						prop: 'use_num',
						label: '人数',
						align: 'center',
					},
					{
						label: '操作',
						align: 'center',
						render: (h, { row }) => {
							return (
								<div>
									<el-button type="primary" size="mini" onClick={this.toEditRole.bind(this, row)}>
										修改名称
									</el-button>
									<el-button
										type="primary"
										size="mini"
										style="margin-right: 10px;"
										onClick={this.toSetRole.bind(this, row)}
									>
										权限配置
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该角色吗？"
										onConfirm={this.toDelRole.bind(this, row.id)}
									>
										<el-button slot="reference" type="danger" size="mini">
											删除
										</el-button>
									</el-popconfirm>
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
				showAddDialog: false, // 新增弹层
				showEditDialog: false, // 编辑弹层
				editData: {},
				showSetDialog: false, // 配置弹层
				setData: {},
				defaultCheck: []
			};
		},

		created() {
			this.getApiusergroup(this.page);
		},

		methods: {
			// 获取角色列表
			async getApiusergroup(data) {
				try {
					this.loading = true;
					const res = await this.$api({
						type: 'getApiusergroup',
						data,
					});
					console.log(res, '角色列表');
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

			// 删除角色
			async deleteApiusergroup(ids) {
				try {
					this.btnloading = true
					const res = await this.$api({
						type: 'deleteApiusergroup',
						data: {
							ids
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

			// 点击新增按钮
			addRole() {
				this.showAddDialog = true;
				this.$refs.addrole.getRouteTree()
			},

			// 数据条数/页码改变
			pageChange(obj) {
				(this.page.page = obj.page), (this.page.limit = obj.limit);
			},

			// 点击修改按钮
			toEditRole(obj) {
				this.showEditDialog = true;
				this.editData = JSON.parse(JSON.stringify(obj));
			},

			// 点击权限配置按钮
			toSetRole(obj) {
				this.showSetDialog = true;
				this.setData = obj
				this.defaultCheck = obj.rules.split('')
				this.$refs.setrole.getRouteTree()
			},

			// 点击删除按钮
			async toDelRole(id) {
				await this.deleteApiusergroup(id)
				this.getApiusergroup(this.page)
			},
		},
	};
</script>

<style lang="scss" scoped></style>
