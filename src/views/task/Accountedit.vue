<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<el-button type="primary" size="mini" :loading="refloading" @click="refresh">{{
					refloading ? '刷新中...' : '刷新'
				}}</el-button>
				<el-button type="danger" size="mini" :loading="delloading" @click="delAccEdits">{{
					refloading ? '删除中...' : '批量删除'
				}}</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom
			height="700"
			:loading="loading"
			:tableData="tableData"
			:columns="columns"
			:mutiSelect="true"
			@handleSelectionChange="handleSelectionChange"
		></table-custom>
		<!-- 分页 -->
		<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
    <!-- 编辑账号编辑弹层 -->
		<EditAccEditDialog :showdialog.sync="showEditDialog" :ruleForm.sync="editData"></EditAccEditDialog>
  </div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
  import EditAccEditDialog from './components/EditAccEditDialog.vue';

	export default {
		name: 'Accountedit',

		data() {
			return {
				delloading: false,
				refloading: false,
				delloading: false,
				loading: false,
				tableData: [
					{
            task_type: '账号编辑',
						status: '已完成',
						task_name: '日本-1',
						updatetime: '2023-1-11 11:12:52',
						createtime: '2023-1-10 15:24:32',
						state: 'open',
					},
          {
            task_type: '发布视频',
						status: '执行中',
						task_name: '亚洲-1',
						updatetime: '2023-1-11 11:12:52',
						createtime: '2023-1-10 15:24:32',
						state: 'open',
					},
				],
				columns: [
          {
						prop: 'task_type',
						label: '素材类型',
						align: 'center',
					},
					{
						prop: 'status',
						label: '任务状态',
						align: 'center',
					},
					{
						prop: 'task_name',
						label: '任务名称',
						align: 'center',
					},
					{
						prop: 'updatetime',
						label: '更新时间',
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
									<el-button type="primary" size="mini" onClick={this.toUpTask.bind(this, row)}>
										更新
									</el-button>
									<el-button
										style="margin-right: 10px;"
										type="warning"
										size="mini"
										onClick={this.toStopTask.bind(this, row)}
									>
										{row.state == 'open' ? '暂停' : '开始'}
									</el-button>
									<el-popconfirm
										confirm-button-text="删除"
										cancel-button-text="取消"
										title="确认删除该任务吗？"
										onConfirm={this.toDelTask.bind(this, row)}
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
				delDataList: [],
				total: 0,
				page: 1,
				limit: 10,
				showEditDialog: false,
				editData: {},
			};
		},

		components: {
			tableCustom,
			pagination,
      EditAccEditDialog
		},

		mounted() {},

		methods: {
			// 批量删除
			delAccEdits() {
				if (this.delDataList.length > 0) {
					// let ids = this.delDataList
					// 	.map((item) => {
					// 		return item.id;
					// 	})
					// 	.join(',');
					this.delloading = true;
					this.loading = true;
					setTimeout(() => {
						this.delloading = false;
						this.loading = false;
						this.$children[2].$refs.tableCustom.clearSelection();
						this.$message.success('批量删除成功');
					}, 1000);
				} else {
					this.$message.warning('请选择需要删除的数据');
				}
			},

			// 刷新
			refresh() {
				this.refloading = true;
				this.loading = true;
				setTimeout(() => {
					this.refloading = false;
					this.loading = false;
				}, 1000);
			},

			// 更新
			toUpTask(obj) {
				this.editData = obj;
				this.showEditDialog = true;
			},

			// 暂停 / 开始
			async toStopTask(obj) {
				if (obj.state == 'open') {
					obj.state = 'pause';
				} else if (obj.state == 'pause') {
					obj.state = 'open';
				}
				this.$message.success('操作成功');
			},

			// 删除
			toDelTask() {
				this.$message.success('操作成功');
			},

			// 数据条数/页码改变
			pageChange(obj) {
				(this.page = obj.page), (this.limit = obj.limit);
			},

			// 勾选列表项
			handleSelectionChange(val) {
				this.delDataList = val;
			},
		},
	};
</script>

<style lang="stylus" scoped></style>
