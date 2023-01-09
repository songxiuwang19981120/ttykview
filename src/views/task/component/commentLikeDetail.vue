<template>
	<div>
		<el-dialog width="70%" :visible="showTaskDetail" :before-close="handlerClose" title="评论点赞任务详情">
			<table-custom :loading="loading" :tableData="tableData" :columns="columns" height="700"></table-custom>
			<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
			<span slot="footer">
				<el-button @click="handlerClose" size="medium">取 消</el-button>
			</span>
			<el-dialog width="55%" :visible="showJournal" :before-close="journalClose" title="评论点赞任务日志" append-to-body>
				<table-custom :loading="journalLoading" :tableData="journaltableData" :columns="journalColumns"
					height="700"></table-custom>
			</el-dialog>
		</el-dialog>
	</div>
</template>
  
<script>
import tableCustom from "@/components/myComponent/table/tableCustom.vue";
import pagination from "@/components/myComponent/table/pagination.vue";
export default {
	name: "TtprojectTaskDetail",
	props: {
		showTaskDetail: {
			type: Boolean
		}
	},
	components: {
		tableCustom,
		pagination,
	},
	data() {
		return {
			task_id: '',
			journalLoading: false,
			journaltableData: [],
			journalColumns: [
				{
					label: '目标uid',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '视频ID',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '评论内容',
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
			page: 1,
			limit: 10,
			total: 0,
			loading: false,
			showJournal: false,
			tableData: [],
			columns: [
				{
					prop: "avatar_thumb",
					label: "基础信息",
					align: "left",
					width: "260",
					fixed: true,
					render: (h, { row }) => {
						return (
							<div style="display: flex;max-width: 260px">
								<el-image
									class="table-avatar mr-15"
									src={row.img}
									style="width: 60px; height: 60px; border-radius: 50%;margin-right: 16px"
								></el-image>
								<div>
									<p style="font-size: 14px;">{row.nickname}</p>
									<p style="font-size: 12px;">ID ：{row.uid}</p>
									<el-tooltip content="Top center" placement="right-start">
										<div slot="content">
											账号归属：
											<br />
											设备分类：
											<br />
											设备编号：
											<br />
											备份名称：
											<br />
										</div>
										<span style="display: inline-block; background-color: #FFDDA5; font-size:12px; border-radius: 4px">
											设备信息
										</span>
									</el-tooltip>
								</div>
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
					label: '已执行数量',
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
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									type="success"
									size="mini"
									onClick={this.journalClick.bind(this, row.id)}
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
		};
	},

	mounted() { },

	methods: {
		// 日志取消
		journalClose() {
			this.journaltableData = []
			this.showJournal = false;
		},
		// 日志
		journalClick(id) {
			this.showJournal = true
			this.journaltableData = [
				{
					task_type: 1
				}
			]
		},
		// 删除
		deleteClick(id) {
			this.$message.success('删除成功');
		},
		// 获取数据
		getTaskListDetail(id) {
			console.log(id);
			this.task_id = id
			this.viewCommenList()
		},
		// 获取详情数据
		async viewCommenList() {
			let data = {
				tasklistdetail_id: this.task_id
			}
			try {
				let result = await this.$api({ type: "taskListDetailView", data });
				console.log(result);
			} catch (error) {
				console.error(error);
			}

		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.page = obj.page
			this.limit = obj.limit;
			this.getTaskListDetail();
		},
		showLogDialog() {

		},
		handleDel() {
			console.log('删除')
		},
		handlerClose() {
			this.tableData = []
			this.$emit('closeTaskDetail')
		}
	},
};
</script>
  
<style lang="stylus" scoped></style>