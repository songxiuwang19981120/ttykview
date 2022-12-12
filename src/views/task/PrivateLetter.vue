<template>
	<div>
		<el-card style="margin-bottom: 20px">
			<el-row>
				<el-select v-model="searchTableData.state" placeholder="请选择任务状态" size="small">
					<el-option
						v-for="item in searchStateList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-button class="btn" type="primary" size="small" @click="searchTasks">查询</el-button>
			</el-row>
		</el-card>
		<el-card>
			<!-- 表格 -->
			<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
			<!-- 分页 -->
			<el-row type="flex" justify="end">
				<pagination
					:total="total"
					:page="page.page"
					:limit="page.limit"
					@pagination="pageChange"
				></pagination>
			</el-row>
			<!-- 弹层 -->
			<PrivateLetterDialogComponent
				ref="dialog"
				:showDialog.sync="dialog"
			></PrivateLetterDialogComponent>
		</el-card>
	</div>
</template>
<script>
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	import PrivateLetterDialogComponent from './component/PrivateLetterDialogComponent.vue';
	import pagination from '@/components/myComponent/table/pagination.vue';
	export default {
		name: 'TtPrivateLetter',
		components: {
			tableCustom,
			PrivateLetterDialogComponent,
			pagination,
		},
		data() {
			return {
				// 下拉选择数据
				searchStateList: [
					{
						value: '全部',
						label: '全部',
					},
					{
						value: '已完成',
						label: '已完成',
					},
					{
						value: '执行中',
						label: '执行中',
					},
					{
						value: '执行中断',
						label: '执行中断',
					},
				],
				searchTableData: {
					state: ''
				},
				loading: false,
				tableData: [],
				columns: [
					{
						prop: 'release_time',
						label: '创建时间',
						align: 'center',
					},
					{
						prop: 'task_name',
						label: '任务名称',
						align: 'center',
					},
					{
						prop: 'mode',
						label: '任务状态',
						align: 'center',
					},
					{
						label: '任务进度',
						align: 'center',
						render(h, { row }) {
							const percent = (row.su_total / row.total) * 100 + '%';
							return <div>{percent}</div>;
						},
					},
					{
						label: '操作',
						align: 'center',
						render: (h, { row }) => {
							return (
								<div>
									<el-button
										type="primary"
										size="mini"
										onClick={this.toDetail.bind(this, row.videotasks_id)}
									>
										查看详情
									</el-button>
								</div>
							);
						},
					},
				],
				dialog: false, // 弹层
				page: {
					page: 1,
					limit: 20,
				},
				total: 0,
			};
		},

		created() {
			// 获取视频任务列表
			this.getVideoTasks(this.page);
		},

		mounted() {},

		methods: {
			toVideoReleaseDialog() {
				this.dialog = true;
			},
			// 获取视频任务列表
			async getVideoTasks(data) {
				try {
					const res = await this.$api({
						type: 'getVideotasks',
						data,
					});
					console.log(res, '视频列表数据');
					this.tableData = res.list;
					this.total = res.count
				} catch (error) {
					console.error(error);
				}
			},
			// 查看详情
			toDetail(id) {
				this.dialog = true;
				this.$refs.dialog.getVideoTaskDetails({
					id,
				});
			},
			// 当前页数据条数/页码改变
			pageChange(obj) {
				(this.page.page = obj.page), (this.page.limit = obj.limit);
				this.getVideoTasks(this.page);
			},
			// 点击查询按钮
			searchTasks() {
				this.page.curpage = 1
				alert('查询')
			},
		},
	};
</script>

<style lang="stylus" scoped>
	.el-select{
		margin-bottom: 20px
	}
	.btn.el-button{
		margin-left: 15px
	}
</style>
