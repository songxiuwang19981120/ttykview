<template>
	<div>
		<el-dialog :visible="showDialog" title="私信详情" @close="btnCancel" width="70%">
			<!-- 表格 -->
			<table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
				height="700"></table-custom>
			<!-- 分页 -->
			<pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
			<!-- 按钮 -->
			<span slot="footer">
				<el-button @click="btnCancel" size="medium">取 消</el-button>
			</span>
			<el-dialog width="55%" :visible="showJournal" :before-close="journalClose" title="评论点赞任务日志" append-to-body>
				<table-custom :loading="journalLoading" :tableData="journaltableData" :columns="journalColumns"
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
			showJournal:false,
			journalLoading: false,
			journaltableData: [],
			journalColumns: [
				{
					label: '目标uid',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '私信类型',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '私信内容',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '更新时间',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '耗时',
					prop: 'task_type',
					align: 'center',
				},
				{
					label: '状态',
					prop: 'status',
					align: 'center',
					render(h, { row }) {
						const { status } = row;
						let state;
						if (status == 0) {
							state = '成功';
						} else if (status == 1) {
							state = '未开始';
						} else if (status == 2) {
							state = '失败';
						} else if (status == 3) {
							state = '领取中';
						}
						return <div>{state}</div>;
					},
				},
				{
					label: '失败原因',
					prop: 'reason',
					align: 'center',
					render(h, { row }) {
						if (
							row.reason &&
							row.reason !== 'null'
						) {
							return <div>{row.reason}</div>;
						} else if (row.status == 2) {
							return <div>暂无失败原因</div>;
						} else {
							return <div style="color: grey; font-size: 12px;">(非失败状态)</div>;
						}
					},
				},
			],
			btnloading: false,
			loading: false,
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
					fixed: 'right',
					width:'150',
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
			logsDialog: false,
			page: {
				page: 1,
				limit: 20,
				tasklist_id: '',
				status: '',
				task_type: '',
			},
			total: 0,
			resetloading: false
		};
	},
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
			this.tableData = [
				{
					id: 1,
					status: 0,
					img: 'http://192.168.4.30/uploads/uploadfiles/202212/63abccf6d52b5.jpg',
					task_type: '1',
					create_time: '2023 01-03 01:00:00',
					nickname: '啊啊啊啊',
					uid: '7171638067815220230'
				}
			]

		},
		// 获取私信任务详情
		// async getTaskListDetail(data) {
		// 	try {
		// 		this.loading = true
		// 		const res = await this.$api({
		// 			type: 'getTaskListDetail',
		// 			data,
		// 		});
		// 		this.tableData = res.data.list;
		// 		this.total = res.data.count;
		// 	} catch (error) {
		// 		console.error(error);
		// 	} finally {
		// 		this.loading = false
		// 		this.btnloading = false
		// 	}
		// },
		// 当前页数据条数/页码改变
		pageChange(obj) {
			(this.page.page = obj.page), (this.page.limit = obj.limit);
			this.page.tasklist_id = this.curId;
			this.getTaskListDetail(this.page);
		},
		// 关闭弹层
		btnCancel() {
			this.$emit('update:showDialog', false);
			this.page = {
				page: 1,
				limit: 20,
				tasklist_id: '',
				status: '',
				task_type: ''
			};
		},
		// 点击查询按钮
		searchTasks() {
			this.btnloading = true;
			this.page.page = 1;
			this.page.tasklist_id = this.curId;
			this.getTaskListDetail(this.page);
		},
		// 点击重置
		btnReset() {
			this.resetloading = true
			this.page = {
				page: 1,
				limit: 20,
				tasklist_id: this.curId,
				status: '',
				task_type: '',
			}
			this.getTaskListDetail(this.page)
		},
	},
};
</script>

<style lang="stylus" scoped>
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
