<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div  style="margin-right: 20px">
					<span>任务状态：</span>
					<el-select v-model="page.status" placeholder="请选择任务状态">
						<el-option v-for="item in searchStateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<el-button type="primary" class="seachbut" :loading="btnloading" @click="searchTasks">{{ btnloading ? '搜索中 ...' :'搜索'}}</el-button>
                <el-button type="primary" class="seachbut" @click="btnReset">重置</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
		<!-- 分页 -->
		<pagination :total="total" :page="page.page" :limit="page.limit" @pagination="pageChange"></pagination>
		<!-- 弹层 -->
		<VideoReleaseDialogComponent ref="dialog" :showDialog.sync="dialog" :curId="curId"></VideoReleaseDialogComponent>
	</div>
</template>
<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import VideoReleaseDialogComponent from './component/VideoReleaseDialogComponent.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
export default {
	name: 'TtVideoRelease',
	components: {
		tableCustom,
		VideoReleaseDialogComponent,
		pagination,
	},
	data() {
		return {
			// 下拉选择数据
			searchStateList: [
				{
					value: '0',
					label: '已完成',
				},
				{
					value: '1',
					label: '未完成',
				},
			],
			loading: false,
			btnloading: false,
			tableData: [],
			columns: [
				{
					prop: 'create_time',
					label: '创建时间',
					align: 'center',
				},
				{
					prop: 'task_name',
					label: '任务名称',
					align: 'center',
				},
				{
					prop: 'status',
					label: '任务状态',
					align: 'center',
					render: (h, { row }) => {
						return <div>{row.status == 0 ? '已完成' : '未完成'}</div>;
					},
				},
				{
					label: '任务进度',
					align: 'center',
					render(h, { row }) {
						const { complete_num, fail_num } = row;
						let percent;
						if (Number(complete_num) + Number(fail_num) == 0) {
							percent = '0.00%';
						} else {
							percent = ((Number(complete_num) / (Number(complete_num) + Number(fail_num))) * 100).toFixed(2) + '%';
						}
						return <div>{percent}</div>;
					},
				},
				{
					label: '操作',
					align: 'center',
					render: (h, { row }) => {
						return (
							<div>
								<el-button type="primary" size="mini" onClick={this.toDetail.bind(this, row.tasklist_id)}>查看详情</el-button>
							</div>
						);
					},
				},
			],
			dialog: false, // 弹层
			page: {
				page: 1,
				limit: 10,
				task_type: 'PushVideo',
				status: '',
			},
			total: 0,
			curId: null,
		};
	},

	created() {
		// 获取视频任务列表
		this.getVideoTasks(this.page);
	},

	mounted() { },

	methods: {
		// 获取视频任务列表
		async getVideoTasks(data) {
			try {
				this.loading = true
				const res = await this.$api({
					type: 'getTasklist',
					data,
				});
				console.log(res, '视频列表数据');
				if (res.status == 200) {
					this.tableData = res.data.list;
					this.total = res.data.count;
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			} finally {
				this.loading = false;
				this.btnloading = false
			}
		},
		// 查看详情
		toDetail(id) {
			this.dialog = true;
			this.curId = id;
			this.$refs.dialog.getTaskListDetail({
				page: 1,
				limit: 10,
				tasklist_id: id,
			});
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			(this.page.page = obj.page), (this.page.limit = obj.limit);
			this.getVideoTasks(this.page);
		},
		// 点击查询按钮
		searchTasks() {
			this.btnloading = true
			this.page.page = 1;
			this.getVideoTasks(this.page);
		},
		// 点击重置按钮
		btnReset() {
			this.page = {
				page: 1,
				limit: 10,
				task_type: 'PushVideo',
				status: '',
			};
			this.getVideoTasks(this.page)
		},
	},
};
</script>

<style  lang="scss" scoped>
@import '@/assets/base/base.scss';
.tt-accsituation {
	background-color: #fff;
	margin-bottom: 20px;
	border-radius: 4px;
	padding: 0 12px;
}

.tt-accsituation--operation {
	display: flex;
	// height: 70px;
	// line-height: 70px;
	padding: 10px;
}
.seachbut {
	background-color: $button-back-color;
    border-color: $button-bord-color;
}

</style>
