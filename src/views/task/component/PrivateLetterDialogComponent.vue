<template>
	<div>
		<el-dialog :visible="showDialog" title="私信详情" @close="btnCancel" width="68%">
			<!-- 搜索 -->
			<div class="tt-accsituation">
				<div class="tt-accsituation--operation">
					<div>
						<span>任务状态：</span>
						<el-select v-model="page.status" placeholder="请选择任务状态" size="small" style="margin-right: 20px">
							<el-option
								v-for="item in searchStateList"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</div>
					<div>
						<span>私信类型：</span>
						<el-select
							v-model="page.task_type"
							placeholder="私信类型选择"
							style="margin-right: 20px"
							size="small"
						>
							<el-option
								v-for="item in searchTypeList"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</div>
					<div>
						<!-- 查询 -->
						<el-button
							type="primary"
							:loading="btnloading"
							@click="searchTasks"
							style="margin-right: 20px"
							size="small"
							>{{ btnloading ? '加载中...' : '搜索' }}</el-button
						>
					</div>
					<div>
						<el-button type="primary" :loading="resetloading" @click="btnReset" size="small">{{
							btnloading ? '加载中...' : '重置'
						}}</el-button>
					</div>
				</div>
			</div>
			<!-- 表格 -->
			<table-custom
				:mutiSelect="true"
				:loading="loading"
				:tableData="tableData"
				:columns="columns"
			></table-custom>
			<!-- 分页 -->
			<pagination
				:total="total"
				:page="page.page"
				:limit="page.limit"
				@pagination="pageChange"
			></pagination>
			<!-- 按钮 -->
			<el-row type="flex" justify="end">
				<el-button size="small" @click="btnCancel">取消</el-button>
				<!-- <el-button size="small" type="primary" @click="btnCancel">确定</el-button> -->
			</el-row>
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
				],
				searchTypeList: [
					{
						value: 'ChatText',
						label: '文本',
					},
					{
						value: 'ChatProfile',
						label: '好友名片',
					},
					{
						value: 'ChatAweme',
						label: '私信作品',
					},
					{
						value: 'ChatLink ',
						label: '短链接',
					},
				],
				btnloading: false,
				loading: false,
				tableData: [],
				columns: [
					{
						label: '任务类型',
						prop: 'task_type',
						align: 'center',
						render() {
							return <div>私信</div>;
						},
					},
					{
						label: '创建时间',
						prop: 'create_time',
						align: 'center',
					},
					{
						label: '领取时间',
						prop: 'receive_time',
						align: 'center',
					},
					{
						label: '完成时间',
						prop: 'complete_time',
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
						label: '失败原因',
						prop: 'reason',
						align: 'center',
						render(h, { row }) {
							if (
								row.reason &&
								JSON.parse(row.reason).detail &&
								JSON.parse(row.reason).detail.length
							) {
								return <div>{JSON.parse(row.reason).detail[0].msg}</div>;
							} else if (row.status == 2) {
								return <div>暂无失败原因</div>;
							} else {
								return <div style="color: grey; font-size: 12px;">(非失败状态)</div>;
							}
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
			// 获取私信任务详情
			async getTaskListDetail(data) {
				try {
					this.loading = true
					const res = await this.$api({
						type: 'getTaskListDetail',
						data,
					});
					console.log(res, '私信详情数据');
					this.tableData = res.data.list;
					this.total = res.data.count;
				} catch (error) {
					console.error(error);
				} finally {
					this.loading = false
					this.btnloading = false
				}
			},
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
