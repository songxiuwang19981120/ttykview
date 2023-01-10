<template>
	<div>
		<el-dialog :visible="showDialog" title="关注任务详情" @close="btnCancel" width="70%">
			<!-- 表格 -->
			<table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
				height="700"></table-custom>
			<!-- 分页 -->
			<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
			<!-- 按钮 -->
			<span slot="footer">
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
			loading: false,
			btnloading: false,
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
									src={row.member.avatar_thumb}
									style="width: 60px; height: 60px; border-radius: 50%;margin-right: 16px"
								></el-image>
								<div>
									<p style="font-size: 14px;margin-bottom:8px">{row.nickname}</p>
									<p style="font-size: 12px;">ID ：{row.uid}</p>
									<el-tooltip content="Top center" placement="right-start">
										<div slot="content">
											{/* 账号归属：
											<br /> */}
											设备分类：{row.member.type_parent_names_text}
											<br />
											设备编号：{row.member.phone_number}
											<br />
											备份名称：{row.member.backups_name}
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
					prop: 'type_parent_names_text',
					align: 'center',
				},
				{
					label: '任务批次',
					prop: 'pici_num',
					align: 'center',
				},
				{
					label: '目标数量',
					prop: 'num',
					align: 'center',
				},
				{
					label: '已关注数量',
					prop: 'success_num',
					align: 'center',
				},

				{
					label: '失败次数',
					prop: 'fail_num',
					align: 'center',
				},
				// {
				// 	label: '回关数量',
				// 	prop: 'task_type',
				// 	align: 'center',
				// 	width: '100',
				// },
				// {
				// 	label: '回关率',
				// 	prop: 'task_type',
				// 	align: 'center',
				// 	width: '100',
				// },
				{
					label: '更新时间',
					prop: 'create_time',
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
							state = '未开始';
						} else if (status == 1){
							state = '执行中';
						}else{
							state = '完成';
						}
						return <div>{state}</div>;
					},
				},
				{
					label: "操作",
					align: "center",
					fixed: 'right',
					width: "150",
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
			resetloading: false,
			task_id:'',
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
		// 获取数据
		getTaskListDetail(id) {
			this.task_id = id
			this.viewFollowList()
		},
		// 获取详情数据
		async viewFollowList() {
			let data = {
				tasklist_id: this.task_id,
				page: this.page,
				limit: this.limit,
			}
			try {
				let result = await this.$api({ type: "taskListTaskUids", data });
				if (result.status == 200) {
					this.tableData = result.data.list;
					this.total = result.data.count;
				} else {
					this.$message.error(result.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.page = obj.page
			this.limit = obj.limit;
			this.viewFollowList();
		},
		// 关闭弹层
		btnCancel() {
			this.$emit('update:showDialog', false);
			this.page = 1
			this.limit = 10;
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
