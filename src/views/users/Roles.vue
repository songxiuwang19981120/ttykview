<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div>
					<el-button type="primary" @click="addRole" class="btn">新增</el-button>
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
		<!-- 新增角色弹层 -->
		<addRole :showdialog.sync="showAddDialog" :ruleForm.sync="editData"></addRole>
    <!-- 权限配置弹层 -->
    <setRole :showdialog.sync="showSetDialog"></setRole>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	import addRole from './components/addRoleDialog.vue';
  import setRole from './components/setRoleDialog.vue';

	export default {
		name: 'Roles',

		components: {
			tableCustom,
			pagination,
			addRole,
      setRole
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
						prop: '',
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
									<el-button type="primary" size="mini" style="margin-right: 10px;" onClick={this.toSetRole.bind(this, row)}>
										权限配置
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该角色吗？"
										onConfirm={this.toDelRole.bind(this, row)}
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
				editData: {},
        showSetDialog: false, // 配置弹层
			};
		},

		created() {
			this.getRole(this.page);
		},

		methods: {
			// 获取角色列表
			async getRole(data) {
				try {
					this.loading = true;
					const res = await this.$api({
						type: 'getRole',
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

			// 点击新增按钮
			addRole() {
				this.showAddDialog = true;
			},

			// 数据条数/页码改变
			pageChange(obj) {
				(this.page.page = obj.page), (this.page.limit = obj.limit);
			},

			// 点击修改按钮
			toEditRole(obj) {
				this.showAddDialog = true;
				this.editData = JSON.parse(JSON.stringify(obj));
			},

			// 点击权限配置按钮
			toSetRole() {
        this.showSetDialog = true
      },

			// 点击删除按钮
			toDelRole() {},
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
			.btn {
				background-color: $button-back-color;
				border: $button-bord-color;
			}
		}
	}
	::v-deep .el-button--primary {
		background-color: $button-back-color;
		border: $button-bord-color;
	}
</style>
