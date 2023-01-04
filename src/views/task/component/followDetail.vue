<template>
	<div>
		<el-dialog :visible="showDialog" title="关注任务详情" @close="btnCancel" width="60%">
			<!-- 表格 -->
			<table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
				height="700"></table-custom>
			<!-- 分页 -->
			<pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
			<!-- 按钮 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="btnCancel" size="medium">取 消</el-button>
			</span>
			<el-dialog width="55%" :visible="showfollow" :before-close="followClose" title="关注任务日志" append-to-body>
				<table-custom :loading="followLoading" :tableData="followtableData" :columns="followColumns"
					height="700"></table-custom>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';

export default {
	components: {
		tableCustom,
		pagination,
	},
	props: {
		showDialog: {
			type: Boolean,
			default: false,
		},
		curId: {
			type: String,
		},
	},
	data() {
		return {
			showfollow: false,
			followLoading: false,
			followtableData: [],
			followColumns: [
				{
					label: '目标uid',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '数据来源',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '更新时间',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '状态',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '耗时',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '失败原因',
					prop: 'task_type',
					align: 'center',
				},
			],
			// 下拉选择数据
			searchStateList: [
				{
					value: '0',
					label: '成功',
				},
				{
					value: '2',
					label: '失败',
				},
				{
					value: '1',
					label: '未开始',
				},
				{
					value: '3',
					label: '领取中',
				},
			],
			loading: false,
			btnloading: false,
			tableData: [],
			columns: [
				{
					label: '头像',
					prop: 'task_type',
					align: 'center',
					fixed: true,
					width: '100',
					render(h, { row }) {
						return (
							<div>
								<el-image style="width:50px;height:50px" src={row.img}></el-image>
							</div>
						);
					},
				},
				{
					label: '账号分类',
					prop: 'task_type',
					align: 'center',
					width: '150',
				},
				{
					label: '任务批次',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},
				{
					label: '目标数量',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},
				{
					label: '已关注数量',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},

				{
					label: '失败次数',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},
				{
					label: '回关数量',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},
				{
					label: '回关率',
					prop: 'task_type',
					align: 'center',
					width: '100',
				},
				{
					label: '更新时间',
					prop: 'create_time',
					align: 'center',
					width: '150',
				},
				{
					label: '状态',
					prop: 'status',
					align: 'center',
					width: '100',
					render(h, { row }) {
						const { status } = row;
						let state;
						if (status == 0) {
							state = '成功';
						} else if (status == 1) {
							state = '未开始';
						} else if (status == 2) {
							state = '失败';
						}
						return <div>{state}</div>;
					},
				},
				{
					label: "操作",
					align: "center",
					width: '150',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									type="success"
									size="mini"
									onClick={this.followClick.bind(this, row.id)}
									style="margin-right:10px"
								>
									日志
								</el-button>
								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该任务吗？"
									onConfirm={this.deleteClick.bind(this, row.id)}
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
			logsDialog: false,
			page: 1,
			limit: 10,
			total: 0,
			resetloading: false
		};
	},
	methods: {
		// 日志取消
		followClose() {
			this.followtableData = []
			this.showfollow = false;
		},
		// 日志
		followClick(id) {
			this.showfollow = true
			this.followtableData = [
				{
					task_type: 1
				}
			]
		},
		// 删除
		deleteClick(id) {
			this.$message.success('删除成功');
		},
		// 获取关注详情
		getTaskListDetail(id) {
			this.tableData = [
				{
					id: 1,
					status: 0,
					img: 'http://192.168.4.30/uploads/uploadfiles/202212/63abccf6d52b5.jpg',
					task_type: '1',
					create_time: '2023 01-03 01:00:00'
				}
			]
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.page = obj.page
			this.limit = obj.limit;
			this.getTaskListDetail();
		},
		// 关闭弹层
		btnCancel() {
			this.$emit('update:showDialog', false);
			this.page = 1
			this.limit =10;
		},
	},
};
</script>

<style scoped lang="stylus">
	.tt-accsituation{
		background-color #fff
		margin-bottom  20px
		border-radius 4px
		padding 0 12px
		.tt-accsituation--operation{
			display flex
			height 70px
			line-height 70px
		}
	}
</style>
