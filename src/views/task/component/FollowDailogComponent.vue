<template>
	<div>
		<el-dialog :visible="showDialog" @close="btnCancel" width="60%">
			<!-- 表格 -->
			<table-custom
				:mutiSelect="true"
				:loading="loading"
				:tableData="tableData"
				:columns="columns"
			></table-custom>
			<!-- 分页 -->
			<el-row type="flex" justify="end">
				<pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
			</el-row>
			<!-- 按钮 -->
			<el-row type="flex" justify="center">
				<el-button size="small" @click="btnCancel">取消</el-button>
				<el-button size="small" type="primary" @click="btnCancel">确定</el-button>
			</el-row>
		</el-dialog>
		<!-- 日志详情弹层 -->
		<FollowLogs :showLogsDialog.sync="logsDialog"></FollowLogs>
	</div>
</template>

<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	import FollowLogs from './FollowLogs.vue'

	export default {
		components: {
			tableCustom,
			pagination,
			FollowLogs
		},
		props: {
			showDialog: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				loading: false,
				tableData: [
					{
						info: '供应商a',
						type: '法国/行和/美女/jk',
						avatar:
							'https://img2.baidu.com/it/u=2015865969,3401990894&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=546',
						id: '1212313',
						op: '1213',
						cur: '213',
						fail: '988',
						uptime: '2022-12-09',
						cretime: '2022-10-09',
						status: 'fail',
					},
					{
						info: '供应商a',
						type: '法国/行和/美女/jk',
						avatar:
							'https://img2.baidu.com/it/u=2015865969,3401990894&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=546',
						id: '1212312313',
						op: '1213',
						cur: '213',
						fail: '988',
						uptime: '2022-12-09',
						cretime: '2022-10-09',
						status: 'fail',
					}
				],
				columns: [
					{
						label: '设备信息',
						minWidth: 120,
						align: 'center',
						render: (h, { row }) => {
							return (
								<div>
									<el-popover placement="top-start" width="200" trigger="hover">
										<el-row>设备分组：</el-row>
										<el-row>设备编号：</el-row>
										<el-row>设备名称：</el-row>
										<el-button slot="reference" size="small">
											设备信息
										</el-button>
									</el-popover>
								</div>
							);
						},
					},
					{
						label: '账号分类',
						prop: 'type',
						minWidth: 150,
						align: 'center',
						render: (h, { row }) => {
							return <div onClick={this.toAccount.bind(this)}>法国/行和/美女/jk</div>;
						},
					},
					{
						label: '头像',
						prop: 'avatar',
						minWidth: 120,
						align: 'center',
						render: (h, { row }) => {
							return (
								<div>
									<img src={row.avatar} style="width: 100px; height: 100px" />
								</div>
							);
						},
					},
					{
						label: 'uid',
						prop: 'id',
						minWidth: 120,
						align: 'center',
						render: (h, { row }) => {
							return <div onClick={this.toPersonInfo.bind(this)}>43244324</div>;
						},
					},
					{
						label: '发布数量',
						prop: 'op',
						minWidth: 80,
						align: 'center',
					},
					{
						label: '当前发布量',
						width: 120,
						prop: 'cur',
						minWidth: 80,
						align: 'center',
					},
					{
						label: '失败次数',
						prop: 'fail',
						minWidth: 80,
						align: 'center',
					},
					{
						label: '更新时间',
						prop: 'uptime',
						minWidth: 120,
						align: 'center',
					},
					{
						label: '创建时间',
						prop: 'cretime',
						minWidth: 120,
						align: 'center',
					},
					{
						label: '状态',
						prop: 'status',
						minWidth: 120,
						align: 'center',
					},
					{
						label: '操作',
						minWidth: 200,
						align: 'center',
						render: () => {
							return (
								<div>
									<el-button
										type="danger"
										icon="el-icon-delete"
										size="mini"
										onClick={this.delVideoTaskDetails.bind(this)}
									></el-button>
									<el-button type="primary" size="mini" onClick={this.toVideoTaskDetails.bind(this)}>
										日志详情
									</el-button>
								</div>
							);
						},
					},
				],
				logsDialog: false,
				page: {
					curpage: 1,
					curlimit: 20,
				},
				total: 1000
			};
		},
		methods: {
			// 获取视频任务详情
			async getVideoTaskDetails(data) {
				try {
					const res = await this.$api({
						type: 'getVideotaskdetails',
						data,
					});
					console.log(res, '视频列表详情数据');
					this.tableDataDialog = res.list;
				} catch (error) {
					console.error(error);
				}
			},
			// 点击账号分类
			toAccount() {
				alert('跳转账号管理页面');
			},
			// 点击uid
			toPersonInfo() {
				alert('跳转个人信息页面');
			},
			// 点击删除按钮
			async delVideoTaskDetails() {
				try {
					await this.$confirm('确定删除吗？')
					alert('调用删除接口')
				} catch (error) {
					this.$message('您已取消该操作');
				}
			},
			// 显示视频日志详情弹层
			toVideoTaskDetails() {
				this.logsDialog = true
			},
			// 当前页数据条数/页码改变
			pageChange(obj) {
				(this.page.curpage = obj.page), (this.page.curlimit = obj.limit);
			},
			// 关闭弹层
			btnCancel() {
				this.$emit('update:showDialog', false);
			},
		},
	};
</script>

<style></style>
