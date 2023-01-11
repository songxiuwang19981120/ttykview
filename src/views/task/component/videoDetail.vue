<template>
	<el-dialog width="70%" title="视频任务详情" :visible="showdialog" @close="btnCancel">
		<table-custom :loading="loading" :tableData="tableData" :columns="columns" :height="tableHeight"
			@handleSelectionChange="handleSelectionChange">
		</table-custom>
		<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
		<el-dialog width="60%" title="日志详情" :visible.sync="innerVisible" append-to-body @close="btnInnerCancel">
			<table-custom :loading="logLoading" :tableData="logTableData" :columns="logColumns"
				:height="tableHeight"></table-custom>
			<pagination :total="logtotal" :page="logpage" :limit="loglimit" @pagination="logpageChange"></pagination>
			<div slot="footer">
				<el-button @click="btnInnerCancel" size="medium" style="margin-top: 10px">取消</el-button>
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
		pagination,
	},
	props: {
		showdialog: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			logtotal: 0,
			logpage: 1,
			loglimit: 20,
			innerVisible: false,
			page: 1,
			limit: 20,
			total: 0,
			tableData: [],
			loading: false,
			columns: [
				{
					prop: 'avatar',
					label: '基础信息',
					align: 'left',
					width: '260',
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
					label: '已执行数量',
					prop: 'success_num',
					align: 'center',
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
							state = '未开始';
						} else if (status == 1) {
							state = '执行中';
						} else {
							state = '完成';
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
								<el-button size="mini" onClick={this.showLog.bind(this, row)}>
									日志
								</el-button>
								{/* <el-popconfirm
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
								</el-popconfirm> */}
							</div>
						);
					},
				},
			],
			logTableData: [],
			logLoading: false,
			logColumns: [
				{
					label: '视频描述',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>{row.parameter.text}</div>
						);
					}
				},
				{
					label: '更新时间',
					align: 'center',
					render: (h, { row }) => {
						let time = ''
						if (row.receive_times != '') {
							time = row.receive_times
						} else if (row.complete_times != '') {
							time = row.complete_times
						} else {
							time = row.create_times
						}
						return (
							<div>{time}</div>
						);
					}
				},
				{
					label: '状态',
					prop: 'status',
					align: 'center',
					render: (h, { row }) => {
						let res;
						if (row.status == 0) {
							res = '完成';
						} else if (row.status == 1) {
							res = '未开始';
						} else if (row.status == 2) {
							res = '失败';
						} else if (row.status == 3) {
							res = '领取中';
						}
						return <div>{res}</div>;
					},
				},
				{
					label: '耗时',
					// prop: 'complete_times',
					align: 'center',
					render: (h, { row }) => {
						let time = '';
						if (row.receive_times != '' && row.complete_times != '') {
							time = this.calculateDiffTime(row.receive_time, row.complete_time)
						} else if (row.complete_times != '' && row.create_times != '') {
							time = this.calculateDiffTime(row.complete_time, row.create_time)
						}
						return <div>{time}</div>;
					},
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
						return (
							<div>
								<el-button
									v-show={row.status == 2}
									type="primary"
									size="mini"
									onClick={this.tryAgain.bind(this, row.tasklistdetail_id)}
									style="margin-right: 10px;"
								>
									重试
								</el-button>
							</div>
						);
					},
				},
			],
			delDataList: [],
			tableHeight: String(window.innerHeight - 440),
			task_id: '',
			logDetailList: {},
		};
	},
	methods: {
		// JS 计算两个时间戳相差年月日时分秒
		calculateDiffTime(endTime, startTime, type) {
			var runTime = parseInt(endTime - startTime)
			var year = Math.floor(runTime / 86400 / 365)
			runTime = runTime % (86400 * 365)
			var month = Math.floor(runTime / 86400 / 30)
			runTime = runTime % (86400 * 30)
			var day = Math.floor(runTime / 86400)
			runTime = runTime % 86400
			var hour = Math.floor(runTime / 3600)
			runTime = runTime % 3600
			var minute = Math.floor(runTime / 60)
			runTime = runTime % 60
			var second = runTime
			if (type === 1) { // 返回相差年数
				return year + '年'
			} else if (type === 2) { // 返回相差年数月数
				return year + '年' + month + '月'
			} else if (type === 3) { // 返回相差年数月数天数
				return year + '年' + month + '月' + day + '日'
			} else { // 返回相差年数月数天数时分秒
				if (year == 0 && month == 0 && day == 0 && hour == 0 && minute == 0 && second == 0) {
					return 0
				} else if (year == 0 && month == 0 && day == 0 && hour == 0 && minute == 0) {
					return second + '秒'
				} else if (year == 0 && month == 0 && day == 0 && hour == 0) {
					return minute + '分' + second + '秒'
				} else if (year == 0 && month == 0 && day == 0) {
					return hour + '时' + minute + '分' + second + '秒'
				} else if (year == 0 && month == 0) {
					return day + '日' + hour + '时' + minute + '分' + second + '秒'
				} else if (year == 0) {
					return month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒'
				} else {
					return year + '年' + month + '月' + day + '日' + hour + '时' + minute + '分' + second + '秒'
				}
			}
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
				this.loading = true
				let result = await this.$api({ type: "taskListTaskUids", data });
				this.loading = false
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
		// 删除任务详情
		async delTaskListDetail(tasklistdetail_ids) {
			try {
				const res = await this.$api({
					type: 'delTaskListDetail',
					data: {
						tasklistdetail_ids,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
			}
		},
		// 点击取消按钮
		btnCancel() {
			this.$children[0].$children[1].$refs.tableCustom.clearSelection();
			this.$emit('update:showdialog', false);
		},
		// 点击日志
		showLog(row) {
			this.innerVisible = true;
			this.logDetailList = row
			this.taskListDetailIndex()
		},
		// 获取日志数据
		async taskListDetailIndex() {
			try {
				this.logLoading = true
				const res = await this.$api({
					type: 'taskListDetailIndex',
					data: {
						uid: this.logDetailList.uid,
						tasklist_id: this.logDetailList.tasklist_id,
						limit: this.loglimit,
						page: this.logpage
					},
				});
				this.logLoading = false
				if (res.status == 200) {
					this.logTableData = res.data.list;
					this.logtotal = res.data.count;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
			}
		},
		// 日志切换分页
		logpageChange(obj) {
			this.logpage = obj.page;
			this.loglimit = obj.limit;
			this.taskListDetailIndex()
		},
		// 点击删除按钮
		delete(id) {
			this.tableData.splice(id, 1);
			this.$message.success('删除成功');
		},
		// 点击内层删除按钮
		btnInnerCancel() {
			this.logDetailList = {}
			this.loglimit = 20
			this.logpage = 1
			this.innerVisible = false;
		},
		// 点击重试
		async tryAgain(id) {
			try {
				const res = await this.$api({
					type: 'taskListDetailRetry',
					data: {
						tasklistdetail_id: id,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.taskListDetailIndex()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
			}


			this.$message.success('操作成功');
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			this.page = obj.page;
			this.limit = obj.limit;
			this.viewFollowList()
		},
		// 勾选列表项
		handleSelectionChange(val) {
			this.delDataList = val;
		},
	},
};
</script>
