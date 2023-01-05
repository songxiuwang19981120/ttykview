<template>
	<el-dialog width="70%" title="视频任务详情" :visible="showdialog" @close="btnCancel">
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"> </table-custom>
		<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
		<el-dialog width="42%" title="日志详情" :visible.sync="innerVisible" append-to-body>
			<table-custom :loading="logLoading" :tableData="logTableData" :columns="logColumns"> </table-custom>
			<div slot="footer">

				
				<el-button @click="btnInnerCancel" size="medium" style="margin-top: 10px;">取消</el-button>
			</div>
		</el-dialog>
		<div slot="footer">
			<el-button @click="btnCancel" size="medium">取消</el-button>
		</div>
	</el-dialog>
</template>

<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import pagination from '@/components/myComponent/table/pagination.vue';

export default {
	components: {
		tableCustom,
		pagination
	},
	props: {
		showdialog: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			innerVisible: false,
			page:1,
			limit:10,
			total:0,
			tableData: [
				{
					avatar: 'https://img0.baidu.com/it/u=2741147291,1509077935&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					userid: 12321432141,
					uname: '小李',
					task_type: '巴西/美女',
					task_num: 23,
					target_type: 40,
					suc_num: 22,
					fail_num: 18,
					update_time: '2023-1-3',
					status: 1,
					id: 0,
				},
				{
					avatar: 'https://img0.baidu.com/it/u=2741147291,1509077935&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
					userid: 12321432141,
					uname: '小王',
					task_type: '巴西/美女',
					task_num: 23,
					target_type: 40,
					suc_num: 22,
					fail_num: 18,
					update_time: '2023-1-3',
					status: 1,
					id: 1,
				},
			],
			loading: false,
			columns: [

			{
					prop: "avatar",
					label: "基础信息",
					align: "left",
					width: "260",
					fixed: true,
					render: (h, { row }) => {
						return (
							<div style="display: flex;max-width: 260px">
								<el-image
									class="table-avatar mr-15"
									src={row.avatar}
									style="width: 60px; height: 60px; border-radius: 50%;margin-right: 16px"
								></el-image>
								<div>
									<p style="font-size: 14px;">{row.uname}</p>
									<p style="font-size: 12px;">ID ：{row.userid}</p>
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
				},
				{
					label: '任务批次',
					prop: 'task_num',
					align: 'center',
				},
				{
					label: '目标数量',
					prop: 'target_type',
					align: 'center',
				},
				{
					label: '已执行数量',
					prop: 'suc_num',
					align: 'center',
					minWidth: '100'
				},

				{
					label: '失败次数',
					prop: 'fail_num',
					align: 'center',
				},
				{
					label: '更新时间',
					prop: 'update_time',
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
						}
						return <div>{state}</div>;
					},
				},
				{
					label: '操作',
					prop: 'status',
					align: 'center',
					width: '150',
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div>
								<el-button
									size="mini"
									onClick={this.showLog.bind(this, row)}
								>
									日志
								</el-button>
								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该详情吗？"
									onConfirm={this.delete.bind(this, row.id)}
								>
									<el-button
										slot="reference"
										type="danger"
										size="mini"
										style="margin-left: 10px;"
									>
										删除
									</el-button>
								</el-popconfirm>
							</div>
						);
					},
				},
			],
			logTableData: [
				{
					video_id: 1222,
					update_time: '2023-1-3',
					state: 0,
					use_time: '23s',
					reason: ''
				},
				{
					video_id: 1222,
					update_time: '2023-1-3',
					state: 2,
					use_time: '23s',
					reason: ''
				},
				{
					video_id: 1222,
					update_time: '2023-1-3',
					state: 3,
					use_time: '23s',
					reason: ''
				},
				{
					video_id: 1222,
					update_time: '2023-1-3',
					state: 1,
					use_time: '23s',
					reason: '网络超时，上传失败'
				},
			],
			logLoading: false,
			logColumns: [
				{
					label: '视频编号',
					prop: 'video_id',
					align: 'center',
				},
				{
					label: '更新时间',
					prop: 'update_time',
					align: 'center',
				},

				{
					label: '状态',
					prop: 'state',
					align: 'center',
					render: (h, { row }) => {
						let res
						if (row.state == 0) {
							res = '完成'
						} else if (row.state == 1) {
							res = '执行失败'
						} else if (row.state == 2) {
							res = '执行中'
						} else if (row.state == 3) {
							res = '等待执行'
						}
						return <div>{res}</div>
					}
				},
				{
					label: '耗时',
					prop: 'use_time',
					align: 'center',
				},
				{
					label: '失败原因',
					prop: 'reason',
					align: 'center',
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						let isShow = row.state == 1
						return (
							<div>
								<el-button
									v-show={isShow}
									type="primary"
									size="mini"
									onClick={this.tryAgain.bind(this, row)}
									style="margin-right: 10px;"
								>
									重试
								</el-button>
							</div>
						);
					},
				},
			]
		};
	},
	methods: {
		// 点击取消按钮
		btnCancel() {
			this.$emit('update:showdialog', false);
		},
		// 点击日志
		showLog() {
			this.innerVisible = true;
		},
		// 点击删除按钮
		delete(id) {
			this.tableData.splice(id, 1);
			this.$message.success('删除成功');
		},
		// 点击内层删除按钮
		btnInnerCancel() {
			this.innerVisible = false;
		},
		// 点击重试
		tryAgain() {
			this.$message.success('操作成功')
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.page = obj.page
			this.limit = obj.limit;
		},
	},
};
</script>
