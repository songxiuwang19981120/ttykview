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
			<el-table border style="width: 100%; margin-top: 20px">
				<el-table-column label="创建时间"> </el-table-column>
				<el-table-column label="任务名称"> </el-table-column>
				<el-table-column label="任务状态"> </el-table-column>
				<el-table-column label="任务进度"> </el-table-column>
				<el-table-column label="操作">
					<template>
						<!-- <el-button type="primary" size="small" @click="toVideoReleaseDialog">查看详情</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-button type="primary" size="small" @click="toCommentLike">查看详情</el-button>
			<!-- 弹层 -->
            <CommentLikeDialog :CommentLikeDialog.sync="showDialog"></CommentLikeDialog>
		</el-card>
	</div>
</template>

<script>
	import CommentLikeDialog from './components/CommentLikeDialog.vue';
	export default {
		name: 'TtCommentLike',
		components: {
			CommentLikeDialog,
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
                showDialog: false
			};
		},

		mounted() {},

		methods: {
			toCommentLike() {
                this.showDialog = true
            },
		},
	};
</script>

<style lang="stylus" scoped></style>
