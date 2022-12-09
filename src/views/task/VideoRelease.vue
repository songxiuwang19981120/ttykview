<template>
	<div>
		<el-card>
			<!-- 选择 -->
			<el-select v-model="value" placeholder="请选择状态">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<!-- 表格 -->
			<table-custom :loading="loading" :tableData="tableData" :columns="columns"></table-custom>
			<!-- 弹层 -->
			<VideoReleaseDialog :VideoDialog.sync="showDialog"></VideoReleaseDialog>
		</el-card>
	</div>
</template>
<script>
	import VideoReleaseDialog from './components/VideoReleaseDialog.vue';
	import tableCustom from '@/components/myComponent/table/tableCustom.vue';
	export default {
		name: 'TtVideoRelease',
		components: {
			VideoReleaseDialog,
			tableCustom
		},
		data() {
			return {
				options: [
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
				value: '',
				loading: false,
				tableData: [],
				columns: [
					{
						prop: 'release_time',
						label: '创建时间'
					},
					{
						prop: 'task_name',
						label: '任务名称',
					},
					{
						prop: 'mode',
						label: '任务状态',
					},
					{
						prop: 'total',
						label: '任务进度',
					},
					{
						label: '操作',
					}
				],
				showDialog: false
			};
		},

		created() {
			this.getVideoTasks();
		},

		mounted() {},

		methods: {
			toVideoReleaseDialog() {
				this.showDialog = true;
			},
			// 获取视频任务列表
			async getVideoTasks() {
				try {
					const res = await this.$api({
						type: 'getVideotasks',
						data: {}
					})
					console.log(res,'视频列表数据')
					this.tableData = res.list
				} catch (error) {
					console.error(error)
				}
			},
		},
		watch: {
			value(newVal) {
				console.log(newVal);
			},
		},
	};
</script>

<style lang="stylus" scoped>
.el-select{
	margin-bottom: 20px
}
</style>
