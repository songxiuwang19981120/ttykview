<template>
	<div>
		<el-dialog :visible="showDialog" title="私信详情" @close="btnCancel" width="70%">
			<!-- 表格 -->
			<table-custom :mutiSelect="true" :loading="loading" :tableData="tableData" :columns="columns"
				:height="tableHeight"></table-custom>
			<!-- 分页 -->
			<pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
			<!-- 按钮 -->
			<span slot="footer">
				<el-button @click="btnCancel" size="medium">取 消</el-button>
			</span>
			<el-dialog width="55%" :visible="showJournal" :before-close="journalClose" title="评论点赞任务日志" append-to-body>
				<table-custom :loading="journalLoading" :tableData="journaltableData" :columns="journalColumns"
					:height="tableHeight"></table-custom>
					<pagination :total="journaltotal" :page="journalpage" :limit="journallimit" @pagination="journalpageChange"></pagination>
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
			tableHeight: String(window.innerHeight - 440),
			journalDetailList:{},
			journaltotal:0,
			journalpage:1,
			journallimit:10,
			showJournal: false,
			journalLoading: false,
			journaltableData: [],
			journalColumns: [
				{
					label: '目标uid',
					prop: 'uid',
					align: 'center',
				},
				// {
				// 	label: '私信类型',
				// 	prop: 'task_type',
				// 	align: 'center',
				// },
				// {
				// 	label: '私信内容',
				// 	prop: 'task_type',
				// 	align: 'center',
				// },
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
									onClick={this.journalClick.bind(this, row)}
									style="margin-right:10px"
								>
									日志
								</el-button>
								{/* <el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该任务吗？"
									onConfirm={this.deleteClick.bind(this, row.id)}
								>
									<el-button slot="reference" type="danger" size="mini">
										删除
									</el-button>
								</el-popconfirm> */}
							</div>
						);
					},
				},
			],
			logsDialog: false,
			page: 1,
			limit: 20,
			total: 0,
			resetloading: false
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
		// 日志翻页
		journalpageChange(obj) {
			this.journalpage = obj.page
			this.journallimit = obj.limit;
			this.taskListDetailIndex();
		},
		// 日志取消
		journalClose() {
			this.journaltableData = []
			this.journalDetailList = {}
			this.journallimit=10
		    this.journalpage=1
			this.journaltotal = 0
			this.showJournal = false;
		},
		// 日志
		journalClick(row) {
			this.showJournal = true
			this.journalDetailList = row
			this.taskListDetailIndex()
		},
		// 获取日志数据
		async taskListDetailIndex() {
			try {
				this.journalLoading = true
				const res = await this.$api({
					type: 'taskListDetailIndex',
					data: {
						uid: this.journalDetailList.uid,
						tasklist_id: this.journalDetailList.tasklist_id,
						limit: this.journallimit,
						page: this.journalpage
					},
				});
				this.journalLoading = false
				if (res.status == 200) {
					this.journaltableData = res.data.list;
					this.journaltotal = res.data.count;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
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
			(this.page = obj.page), (this.limit = obj.limit);
			this.viewFollowList();
		},
		// 关闭弹层
		btnCancel() {
			this.$emit('update:showDialog', false);
			this.page = 1;
			this.limit = 20;
			this.tableData=[];
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
