<template>
	<div>
		<div class="tt-accsituation">
			<div class="tt-accsituation--operation">
				<div style="margin-right: 20px">
					<el-select v-model="searchData.status" placeholder="请选择任务状态" size="medium">
						<el-option v-for="item in searchStateList" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</div>
				<el-date-picker class="date-picker" v-model="searchData.date" type="daterange" align="right"
					unlink-panels range-separator="——" start-placeholder="开始日期" end-placeholder="结束日期"
					:picker-options="pickerOptions" size="medium">
				</el-date-picker>
				<el-button size="medium" type="primary" class="seachbut" :loading="btnloading" @click="searchTasks">{{
					btnloading? '搜索中 ...': '搜索'
				}}</el-button>
				<el-button type="primary" class="seachbut" @click="btnReset" size="medium">重置</el-button>

				<el-button type="primary" class="seachbut" @click="showVideoTask" size="medium">发布视频</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<table-custom :loading="loading" :tableData="tableData" :columns="columns" :height="tableHeight"></table-custom>
		<!-- 分页 -->
		<pagination :total="total" :page="page" :limit="limit" @pagination="pageChange"></pagination>
		<!-- 弹层 -->
		<!-- <VideoReleaseDialogComponent ref="dialog" :showDialog.sync="dialog">
		</VideoReleaseDialogComponent> -->
		<videoDetail ref="detailDialog" :showdialog.sync="showDetailDialog"></videoDetail>
		<VideoTaskDialog :showVideoDialog="showVideoDialog" @closeVideoTask="closeVideoTask" />
	</div>
</template>
<script>
import tableCustom from '@/components/myComponent/table/tableCustom.vue';
import VideoReleaseDialogComponent from './component/VideoReleaseDialogComponent.vue';
import pagination from '@/components/myComponent/table/pagination.vue';
import VideoTaskDialog from './component/videoDialog.vue';
import videoDetail from './component/videoDetail.vue';
export default {
	name: 'TtVideoRelease',
	components: {
		tableCustom,
		VideoReleaseDialogComponent,
		pagination,
		VideoTaskDialog,
		videoDetail,
	},
	data() {
		return {
			showVideoDialog: false, //控制dialog显示
			showDetailDialog: false,
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
			searchData: {
				status: '',
				date: '',
			},
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
							percent =
								(
									(Number(complete_num) / (Number(complete_num) + Number(fail_num))) *
									100
								).toFixed(2) + '%';
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
								<el-button
									type="success"
									size="mini"
									onClick={this.toDetail.bind(this, row.tasklist_id)}
								>
									查看详情
								</el-button>
								<el-button
									v-show={row.status == 1}
									type='warning'
									size="mini"
									onClick={this.suspend.bind(this, row.tasklist_id)}
								>
									暂停
								</el-button>
								<el-button
									v-show={row.status == 2}
									type='info'
									size="mini"
									onClick={this.continue.bind(this, row.tasklist_id)}
								>
									继续
								</el-button>
								<el-popconfirm
									confirm-button-text="删除"
									cancel-button-text="取消"
									title="确认删除该任务吗？"
									onConfirm={this.delete.bind(this, row.tasklist_id)}
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
			dialog: false, // 弹层
			page: 1,
			limit: 10,
			total: 0,
			pickerOptions: {
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
			tableHeight: String(window.innerHeight - 240)
		};
	},

	created() {
		// 获取视频任务列表
		this.getVideoTasks();
	},

	mounted() { },

	methods: {
		// 删除
		async delete(id) {
			let data = {
				tasklist_ids: id
			}
			try {
				const res = await this.$api({
					type: "deleteTask",
					data,
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},

		// 暂停
		async suspend(id) {
			try {
				const res = await this.$api({
					type: 'pauseTask',
					data: {
						tasklist_id:id,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		// 继续
		async continue(id) {
			try {
				const res = await this.$api({
					type: 'continueTask',
					data: {
						tasklist_id:id,
					},
				});
				if (res.status == 200) {
					this.$message.success(res.msg);
					this.getVideoTasks()
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error(error);
			}
		},
		/* 
function: closeVideoTask
params: null
desc: 关闭视频任务配置
*/
		closeVideoTask() {
			this.showVideoDialog = false;
		},

		/* 
function: showVideoTask
params: null
desc: 显示视频任务配置
*/
		showVideoTask() {
			this.showVideoDialog = true;
		},
		// 获取视频任务列表
		async getVideoTasks() {
			let data = {
				page: this.page,
				limit: this.limit,
				status: this.searchData.status,
				// date: this.searchData.date,
				task_type: 'PushVideo',
			};
			try {
				this.loading = true;
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
				this.btnloading = false;
			}
		},

		// 查看详情
		toDetail(id) {
			this.showDetailDialog = true;
			this.$refs.detailDialog.getTaskListDetail(id);
		},
		// 当前页数据条数/页码改变
		pageChange(obj) {
			(this.page = obj.page), (this.limit = obj.limit);
			this.getVideoTasks();
		},
		// 点击查询按钮
		searchTasks() {
			this.btnloading = true;
			this.page = 1;
			this.getVideoTasks();
		},
		// 点击重置按钮
		btnReset() {
			this.page = 1;
			this.limit = 10;
			this.searchData.date = '';
			this.searchData.status = '';
			this.getVideoTasks();
		},
	},
};
</script>

<style lang="scss" scoped>
@import '@/assets/base/_color_variables.scss';

.date-picker {
	margin-right: 12px;
}

.el-icon-refresh-left {
	margin: 5px 0 0 50px;
	font-size: 30px;
	color: $button-back-color;
	cursor: pointer;
}
</style>
